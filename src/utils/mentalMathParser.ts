import { MathLevel, MathSet, MathQuestion, ParseIngestResult, NormalizedMathQuestionRecord } from '../types/mentalMath';

/**
 * Compiles parsed questions across all sets into a normalized array of JSON objects
 * matching the database schema (columns: question, answer, flow_text, mermaid_syntax, level, set).
 */
export function compileNormalizedQuestions(sets: MathSet[]): NormalizedMathQuestionRecord[] {
  const normalized: NormalizedMathQuestionRecord[] = [];
  for (const s of sets) {
    s.questions.forEach((q, idx) => {
      normalized.push({
        id: q.id || `lvl${s.levelNumber}_s${s.setNumber}_q${idx + 1}`,
        level: s.levelNumber,
        set: s.setNumber,
        level_number: s.levelNumber,
        set_number: s.setNumber,
        question_number: idx + 1,
        question: q.question || q.expression,
        answer: q.answer,
        flow_text: q.flow_text || '',
        mermaid_syntax: q.mermaid_syntax || '',
        created_at: new Date().toISOString(),
      });
    });
  }
  return normalized;
}

/**
 * 5. THE DETERMINISTIC REGEX INGESTION ENGINE
 * Bulletproof regex pipeline for MentalMath2V1.md and strict delimiter format:
 * Step 1: Level & Set Splitting (split by ##LEVEL: then by ===SET: )
 *         CRITICAL: Explicitly strip out or ignore the ===END_SET=== strings.
 * Step 2: Question & Answer Extraction:
 *         Question: /(?<=Q:\s)(.*?)(?=\nA:)/s
 *         Answer:   /(?<=A:\s)(.*?)(?=\nFLOW:)/s
 * Step 3: FLOW & Mermaid Isolation:
 *         Flow text: /(?<=FLOW:\n)(.*?)(?=```mermaid)/s
 *         Mermaid:   /```mermaid\n(.*?)\n```/s
 * Step 4: Database Structure mapping (columns: question, answer, flow_text, mermaid_syntax, level, set)
 */
export function parseDeterministicMathData(rawText: string): ParseIngestResult {
  const errors: string[] = [];
  const levelMap = new Map<number, MathLevel>();
  const sets: MathSet[] = [];
  let totalQuestions = 0;

  if (!rawText || !rawText.trim()) {
    return { levels: [], sets: [], normalizedQuestions: [], totalQuestions: 0, errors: ['Input text is empty.'] };
  }

  // Normalize line endings to standard Unix newline
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // =========================================================================
  // STEP 1: LEVEL & SET SPLITTING
  // Split the raw text by `##LEVEL: ` first, then map through and split by `===SET: `
  // =========================================================================
  const rawLevelChunks = text.split(/(?:^|\n)##LEVEL:\s*/i);

  interface PreparedLevelChunk {
    levelNumber: number;
    title: string;
    levelBody: string;
  }

  const preparedLevelChunks: PreparedLevelChunk[] = [];

  for (let idx = 0; idx < rawLevelChunks.length; idx++) {
    const chunk = rawLevelChunks[idx].trim();
    if (!chunk) continue;

    const firstLineEnd = chunk.indexOf('\n');
    const firstLine = firstLineEnd === -1 ? chunk : chunk.substring(0, firstLineEnd).trim();
    const body = firstLineEnd === -1 ? '' : chunk.substring(firstLineEnd + 1).trim();

    const lvlMatch = firstLine.match(/^(\d+)(?:\s+(.*))?$/);
    if (lvlMatch) {
      const levelNumber = parseInt(lvlMatch[1], 10);
      const title = lvlMatch[2]?.trim() || getLevelMetadata(levelNumber).title;
      preparedLevelChunks.push({ levelNumber, title, levelBody: body });
    } else if (idx === 0 && chunk.includes('===SET:')) {
      // Default to Level 1 if ##LEVEL: prefix was omitted at document root
      preparedLevelChunks.push({
        levelNumber: 1,
        title: 'Level 1: Mental Math Foundations',
        levelBody: chunk,
      });
    }
  }

  if (preparedLevelChunks.length === 0 && text.includes('Q:')) {
    preparedLevelChunks.push({
      levelNumber: 1,
      title: 'Level 1: Mental Math Foundations',
      levelBody: text,
    });
  }

  for (const lvlChunk of preparedLevelChunks) {
    const { levelNumber, title, levelBody } = lvlChunk;

    if (!levelMap.has(levelNumber)) {
      const meta = getLevelMetadata(levelNumber);
      levelMap.set(levelNumber, {
        levelNumber,
        title: title || meta.title,
        category: meta.category,
        description: meta.description,
        requiredSetsToPass: 2, // Win condition: 2 sets to advance
        totalSets: 0,
      });
    }

    // Split by `===SET: ` to isolate individual sets
    const rawSetChunks = levelBody.split(/(?:^|\n)===SET:\s*/i);

    for (let sIdx = 0; sIdx < rawSetChunks.length; sIdx++) {
      const setChunk = rawSetChunks[sIdx].trim();
      if (!setChunk) continue;

      const firstSetLineEnd = setChunk.indexOf('\n');
      const firstSetLine = firstSetLineEnd === -1 ? setChunk : setChunk.substring(0, firstSetLineEnd).trim();
      const setNumMatch = firstSetLine.match(/^(\d+)/);
      const setNumber = setNumMatch ? parseInt(setNumMatch[1], 10) : (sIdx || 1);

      let setBody = firstSetLineEnd === -1 ? '' : setChunk.substring(firstSetLineEnd + 1).trim();
      // CRITICAL: Explicitly strip out or ignore all ===END_SET=== strings so they do not pollute entries
      setBody = setBody.replace(/===END_SET===/gi, '').trim();

      if (!setBody && setChunk.includes('Q:')) {
        setBody = setChunk.replace(/===END_SET===/gi, '').trim();
      }

      // =====================================================================
      // STEP 2: QUESTION & ANSWER EXTRACTION
      // Split questions within the set by `Q:\s*`
      // Grab question: /(?<=Q:\s)(.*?)(?=\nA:)/s
      // Grab answer:   /(?<=A:\s)(.*?)(?=\nFLOW:)/s
      // =====================================================================
      const questionBlocks = setBody
        .split(/(?:^|\n)(?=Q:\s*)/i)
        .map((b) => b.trim())
        .filter((b) => b.length > 0 && /Q:\s*/i.test(b));

      const questions: MathQuestion[] = [];
      let qIndex = 1;

      for (const qBlock of questionBlocks) {
        let question = '';
        let answer = '';
        let flowText = '';
        let mermaidSyntax = '';

        // Extract Question: /(?<=Q:\s)(.*?)(?=\nA:)/s with cross-line regex
        const qMatchExact = qBlock.match(/(?<=Q:\s)([\s\S]*?)(?=\nA:)/);
        if (qMatchExact) {
          question = qMatchExact[1].trim();
        } else {
          const qFallback = qBlock.match(/(?:^|\n)\s*Q:\s*([\s\S]*?)(?=(?:\n\s*A:|$))/i);
          if (qFallback) question = qFallback[1].trim();
        }

        // Extract Answer: /(?<=A:\s)(.*?)(?=\nFLOW:)/s
        const aMatchExact = qBlock.match(/(?<=A:\s)([\s\S]*?)(?=\nFLOW:)/);
        if (aMatchExact) {
          answer = aMatchExact[1].trim();
        } else {
          const aFallback = qBlock.match(/(?:^|\n)\s*A:\s*([\s\S]*?)(?=(?:\n\s*FLOW:|$))/i);
          if (aFallback) answer = aFallback[1].trim();
        }

        if (!question || !answer) {
          continue;
        }

        // ===================================================================
        // STEP 3: FLOW & MERMAID ISOLATION
        // Extract text (Strategy, Shortcut, Inner Voice): /(?<=FLOW:\n)(.*?)(?=```mermaid)/s
        // Extract Mermaid syntax cleanly: /```mermaid\n(.*?)\n```/s
        // ===================================================================
        const flowTextMatchExact = qBlock.match(/(?<=FLOW:\n)([\s\S]*?)(?=```mermaid)/);
        if (flowTextMatchExact) {
          flowText = flowTextMatchExact[1].trim();
        } else {
          const flowMatch = qBlock.match(/(?:^|\n)\s*FLOW:\s*([\s\S]*)$/i);
          if (flowMatch) {
            flowText = flowMatch[1].replace(/```mermaid[\s\S]*?```/i, '').trim();
          }
        }

        const mermaidMatchExact = qBlock.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatchExact) {
          mermaidSyntax = mermaidMatchExact[1].trim();
        } else {
          const mermaidFallback = qBlock.match(/```mermaid\s*\n?([\s\S]*?)```/i);
          if (mermaidFallback) {
            mermaidSyntax = mermaidFallback[1].trim();
          }
        }

        // Standard combined thoughtProcess for backward compatibility
        const thoughtProcess = mermaidSyntax
          ? `\`\`\`mermaid\n${mermaidSyntax}\n\`\`\`\n\n${flowText}`
          : flowText;

        // ===================================================================
        // STEP 4: DATABASE STRUCTURE MAPPING
        // Columns: question, answer, flow_text, mermaid_syntax, level, set
        // ===================================================================
        questions.push({
          id: `lvl${levelNumber}_s${setNumber}_q${qIndex}`,
          expression: question,
          question,
          answer,
          flow_text: flowText,
          mermaid_syntax: mermaidSyntax,
          thoughtProcess,
          timeLimitSec: 10,
        });

        qIndex++;
        totalQuestions++;
      }

      if (questions.length === 0) {
        errors.push(`Level ${levelNumber}, Set ${setNumber}: No valid Q/A/FLOW blocks found.`);
      } else {
        sets.push({
          id: `lvl_${levelNumber}_set_${setNumber}`,
          levelNumber,
          setNumber,
          timeLimitSeconds: questions.length * 8, // 8s per question baseline
          questions,
        });
      }
    }
  }

  // Update totalSets count for each level
  const levels = Array.from(levelMap.values()).map((lvl) => {
    const levelSets = sets.filter((s) => s.levelNumber === lvl.levelNumber);
    return {
      ...lvl,
      totalSets: Math.max(levelSets.length, 8),
      sets: levelSets,
    };
  });

  const normalizedQuestions = compileNormalizedQuestions(sets);

  return {
    levels,
    sets,
    normalizedQuestions,
    totalQuestions,
    errors,
  };
}

/**
 * Metadata definitions for the 100 levels
 */
export function getLevelMetadata(level: number): {
  title: string;
  category: string;
  description: string;
} {
  if (level <= 10) {
    return {
      title: `Level ${level}: Rapid Addition & Subtraction Foundations`,
      category: 'Speed Arithmetic',
      description: 'Left-to-Right additions, complementary numbers (pairs to 100), and rapid decomposition.',
    };
  } else if (level <= 20) {
    return {
      title: `Level ${level}: Multiplications (5, 9, 11, 15, 25)`,
      category: 'Multiplication Shortcuts',
      description: 'Double & halve methods, Vedic 11-trick, multiplying by 5 (×10/2) and 25 (×100/4).',
    };
  } else if (level <= 30) {
    return {
      title: `Level ${level}: Fast Division & Modulo Operations`,
      category: 'Division & Reduction',
      description: 'Fractional splitting, divisibility benchmarks, and rapid decimal equivalents.',
    };
  } else if (level <= 40) {
    return {
      title: `Level ${level}: Percentages, Fractions & Benchmark Equivalents`,
      category: 'Percentage Fluency',
      description: '1/7 (14.28%), 1/8 (12.5%), 1/12 (8.33%), 1/16 (6.25%) benchmark conversions for CLAT QT.',
    };
  } else if (level <= 50) {
    return {
      title: `Level ${level}: Mental Squares (Base 50, Base 100 & Ends-in-5)`,
      category: 'Powers & Roots',
      description: 'Duplex squaring, near-50 adjustments $(50 \pm x)^2 = 25 \pm x \mid x^2$, and $x5^2 = x(x+1)25$.',
    };
  } else if (level <= 60) {
    return {
      title: `Level ${level}: Approximating Square Roots & Cube Roots`,
      category: 'Approximations',
      description: 'Bounded estimation, differential approximations $\sqrt{A \pm B} \approx \sqrt{A} \pm \frac{B}{2\sqrt{A}}$.',
    };
  } else if (level <= 70) {
    return {
      title: `Level ${level}: Ratios, Proportions & Cross-Multiplications`,
      category: 'Ratios & Caselet Prep',
      description: 'Unitary reductions, mental ratio balancing, and cross-difference verification.',
    };
  } else if (level <= 80) {
    return {
      title: `Level ${level}: Average & Mental Alligation Balancing`,
      category: 'Averages & Alligations',
      description: 'Assumed mean deviation method, rapid weighted averages without large column additions.',
    };
  } else if (level <= 90) {
    return {
      title: `Level ${level}: Successive Growth & Compound Percentages`,
      category: 'Commercial Mathematics',
      description: 'Successive percentage changes $a + b + \\frac{ab}{100}$, profit/loss margin conversions.',
    };
  } else {
    return {
      title: `Level ${level}: Master QT Caselet Speed Integration`,
      category: 'Master Arena',
      description: 'High-speed combined arithmetic for Quantitative Techniques data interpretation caselets.',
    };
  }
}
