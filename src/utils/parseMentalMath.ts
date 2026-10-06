import level1To5Raw from '../data/level1-5.md?raw';
import level6To10Raw from '../data/level6-10.md?raw';
import {
  MathLevel,
  MathSet,
  MathQuestion,
  ParseIngestResult,
  NormalizedMathQuestionRecord,
} from '../types/mentalMath';

/**
 * Metadata helper for levels 1-10 hand-authored in level1-5.md and level6-10.md
 */
export function getLocalLevelMeta(level: number): { title: string; category: string; description: string } {
  const metadataMap: Record<number, { title: string; category: string; description: string }> = {
    1: {
      title: 'Level 1: Rapid Addition & Subtraction',
      category: 'Speed Arithmetic',
      description: 'Left-to-Right additions, base-10 anchoring, and round-and-compensate shortcuts.',
    },
    2: {
      title: 'Level 2: Subtraction Fluency',
      category: 'Landmark Decomposition',
      description: 'Stepping down tens then units, and landmark tens rounding with compensation.',
    },
    3: {
      title: 'Level 3: Complements to 1000',
      category: 'Complement Arithmetic',
      description: 'Rapid 3-digit complements to 1000 for differences and change calculations.',
    },
    4: {
      title: 'Level 4: Rapid Multiplication by 5 and 25',
      category: 'Multiplication Shortcuts',
      description: 'Double and halve shortcuts, times 10 divided by 2, and times 100 divided by 4.',
    },
    5: {
      title: 'Level 5: Rapid Multiplication by 9 and 11',
      category: 'Distributive Shortcuts',
      description: 'Distributive 11 sandwich trick and times (10 minus 1) mental expansions.',
    },
    6: {
      title: 'Level 6: Percentage Shortcuts',
      category: 'The Percentage Flip',
      description: 'Reversible percentages (e.g. 18% of 50 = 50% of 18) for zero mental strain.',
    },
    7: {
      title: 'Level 7: Rapid Averages',
      category: 'Seesaw Deviation',
      description: 'Deviation from assumed mean balance to avoid large column sums.',
    },
    8: {
      title: 'Level 8: Simple Interest',
      category: 'Total Effective Rate',
      description: 'Multiply rate and time first for a single percentage hit.',
    },
    9: {
      title: 'Level 9: Compound Interest',
      category: '2-Year CI Shortcut',
      description: 'Fast 2-year effective rate formula (2R + R²/100).',
    },
    10: {
      title: 'Level 10: Mixtures & Alligations',
      category: 'The Alligation Cross',
      description: 'Diagonal cross subtraction for speed ratio calculations.',
    },
  };

  return (
    metadataMap[level] || {
      title: `Level ${level}: Mental Math Training`,
      category: 'Quantitative Fluency',
      description: 'Speed arithmetic and rapid mental shortcuts.',
    }
  );
}

// Backward-compatibility alias
export const getLevelMetadata = getLocalLevelMeta;

export interface ParsedMentalMathResult {
  levels: MathLevel[];
  sets: MathSet[];
  setsByLevel: Record<number, MathSet[]>;
  fatalError?: string;
}

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
 * Parses markdown text using the established strict deterministic regex pipeline:
 * 1. Sanity check: first 4 non-empty lines of level1-5.md must match exact signature
 * 2. Level & Set Splitting:
 *    - Split raw text by `##LEVEL:`
 *    - Split chunks by `===SET:`
 *    - Explicitly strip out or ignore `===END_SET===`
 * 3. Question & Answer Extraction:
 *    - Question: /(?<=Q:\s)(.*?)(?=\nA:)/s
 *    - Answer:   /(?<=A:\s)(.*?)(?=\nFLOW:)/s
 * 4. FLOW & Mermaid Isolation:
 *    - Flow text: /(?<=FLOW:\n)(.*?)(?=```mermaid)/s
 *    - Mermaid:   /```mermaid\n(.*?)\n```/s
 *
 * If the local markdown files cannot be found, loaded, or fail sanity check, a fatal error is returned.
 * AUTO-GENERATING FALLBACK QUESTIONS IS STRICTLY PROHIBITED.
 */
export function parseMentalMath(customRawText?: string): ParsedMentalMathResult {
  // If parsing default files (not custom text), perform mandatory sanity check
  if (!customRawText) {
    const rawLines = (level1To5Raw || '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const expectedSig = ['##LEVEL: 1', '===SET: 1===', 'Q: 77+39', 'A: 116'];
    const matchesSig =
      rawLines.length >= 4 &&
      rawLines[0] === expectedSig[0] &&
      rawLines[1] === expectedSig[1] &&
      rawLines[2] === expectedSig[2] &&
      rawLines[3] === expectedSig[3];

    if (!matchesSig) {
      return {
        levels: [],
        sets: [],
        setsByLevel: {},
        fatalError:
          'FATAL ERROR: Curriculum sanity check failed. First 4 non-empty lines of level1-5.md must be:\n##LEVEL: 1\n===SET: 1===\nQ: 77+39\nA: 116\nAborting Math Arena.',
      };
    }
  }

  const combinedRaw = customRawText || `${level1To5Raw || ''}\n\n${level6To10Raw || ''}`;
  if (!combinedRaw || !combinedRaw.trim()) {
    return {
      levels: [],
      sets: [],
      setsByLevel: {},
      fatalError:
        'FATAL ERROR: Could not find or load local data files (src/data/level1-5.md, src/data/level6-10.md). Auto-generating questions is strictly forbidden.',
    };
  }

  const text = combinedRaw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const levelMap = new Map<number, MathLevel>();
  const sets: MathSet[] = [];
  const setsByLevel: Record<number, MathSet[]> = {};

  // Step 1: Split by `##LEVEL:`
  const rawLevelChunks = text.split(/(?:^|\n)##LEVEL:\s*/i);

  for (let lIdx = 0; lIdx < rawLevelChunks.length; lIdx++) {
    const chunk = rawLevelChunks[lIdx].trim();
    if (!chunk) continue;

    const firstLineEnd = chunk.indexOf('\n');
    const firstLine = firstLineEnd === -1 ? chunk : chunk.substring(0, firstLineEnd).trim();
    const body = firstLineEnd === -1 ? '' : chunk.substring(firstLineEnd + 1).trim();

    const lvlMatch = firstLine.match(/^(\d+)(?:\s+(.*))?/);
    if (!lvlMatch && !chunk.includes('===SET:')) continue;

    const levelNumber = lvlMatch ? parseInt(lvlMatch[1], 10) : lIdx || 1;
    const meta = getLocalLevelMeta(levelNumber);
    const levelTitle = lvlMatch && lvlMatch[2] ? lvlMatch[2].trim() : meta.title;

    if (!levelMap.has(levelNumber)) {
      levelMap.set(levelNumber, {
        levelNumber,
        title: levelTitle,
        category: meta.category,
        description: meta.description,
        requiredSetsToPass: 2,
        totalSets: 0,
      });
    }

    if (!setsByLevel[levelNumber]) {
      setsByLevel[levelNumber] = [];
    }

    // Split by `===SET:`
    const rawSetChunks = body.split(/(?:^|\n)===SET:\s*/i);

    for (let sIdx = 0; sIdx < rawSetChunks.length; sIdx++) {
      const setChunk = rawSetChunks[sIdx].trim();
      if (!setChunk) continue;

      const firstSetLineEnd = setChunk.indexOf('\n');
      const firstSetLine = firstSetLineEnd === -1 ? setChunk : setChunk.substring(0, firstSetLineEnd).trim();
      const setNumMatch = firstSetLine.match(/^(\d+)/);
      const setNumber = setNumMatch ? parseInt(setNumMatch[1], 10) : sIdx || 1;

      let setBody = firstSetLineEnd === -1 ? '' : setChunk.substring(firstSetLineEnd + 1).trim();

      // Explicitly strip out or ignore the ===END_SET=== strings
      setBody = setBody.replace(/===END_SET===/gi, '').trim();

      // Split questions by `Q:\s*`
      const questionBlocks = setBody
        .split(/(?:^|\n)(?=Q:\s*)/i)
        .map((b) => b.trim())
        .filter((b) => b.length > 0 && /Q:\s*/i.test(b));

      const questions: MathQuestion[] = [];
      let qNum = 1;

      for (const qBlock of questionBlocks) {
        let question = '';
        let answer = '';
        let flowText = '';
        let mermaidSyntax = '';

        // Step 2: Question & Answer Extraction
        const qMatchExact = qBlock.match(/(?<=Q:\s)([\s\S]*?)(?=\nA:)/);
        if (qMatchExact) {
          question = qMatchExact[1].trim();
        } else {
          const qFallback = qBlock.match(/(?:^|\n)\s*Q:\s*([\s\S]*?)(?=(?:\n\s*A:|$))/i);
          if (qFallback) question = qFallback[1].trim();
        }

        const aMatchExact = qBlock.match(/(?<=A:\s)([\s\S]*?)(?=\nFLOW:)/);
        if (aMatchExact) {
          answer = aMatchExact[1].trim();
        } else {
          const aFallback = qBlock.match(/(?:^|\n)\s*A:\s*([\s\S]*?)(?=(?:\n\s*FLOW:|$))/i);
          if (aFallback) answer = aFallback[1].trim();
        }

        if (!question || !answer) continue;

        // Step 3: FLOW & Mermaid Isolation
        const flowTextMatchExact = qBlock.match(/(?<=FLOW:\n)([\s\S]*?)(?=```mermaid)/);
        if (flowTextMatchExact) {
          flowText = flowTextMatchExact[1].trim();
        } else {
          const flowMatch = qBlock.match(/(?:^|\n)\s*FLOW:\s*([\s\S]*)$/i);
          if (flowMatch) {
            flowText = flowMatch[1].trim();
          }
        }
        flowText = flowText.replace(/```mermaid[\s\S]*?```/gi, '').trim();

        const mermaidMatchExact = qBlock.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatchExact) {
          mermaidSyntax = mermaidMatchExact[1].trim();
        } else {
          const mermaidFallback = qBlock.match(/```mermaid\s*\n?([\s\S]*?)```/i);
          if (mermaidFallback) {
            mermaidSyntax = mermaidFallback[1].trim();
          }
        }

        const thoughtProcess = mermaidSyntax
          ? `\`\`\`mermaid\n${mermaidSyntax}\n\`\`\`\n\n${flowText}`
          : flowText;

        questions.push({
          id: `lvl${levelNumber}_s${setNumber}_q${qNum}`,
          expression: question,
          question,
          answer,
          flow_text: flowText,
          mermaid_syntax: mermaidSyntax,
          thoughtProcess,
          timeLimitSec: levelNumber <= 5 ? 10 : 15,
        });

        qNum++;
      }

      if (questions.length > 0) {
        const mathSet: MathSet = {
          id: `lvl_${levelNumber}_set_${setNumber}`,
          levelNumber,
          setNumber,
          timeLimitSeconds: questions.length * (levelNumber <= 5 ? 10 : 15),
          questions,
        };
        sets.push(mathSet);
        setsByLevel[levelNumber].push(mathSet);
      }
    }
  }

  // Update totalSets on level metadata
  const levels = Array.from(levelMap.values()).map((lvl) => {
    const levelSets = setsByLevel[lvl.levelNumber] || [];
    return {
      ...lvl,
      totalSets: Math.max(levelSets.length, 2),
      sets: levelSets,
    };
  });

  if (sets.length === 0) {
    return {
      levels: [],
      sets: [],
      setsByLevel: {},
      fatalError: 'FATAL ERROR: No valid math questions found in src/data/level1-5.md or src/data/level6-10.md.',
    };
  }

  return {
    levels,
    sets,
    setsByLevel,
  };
}

// Ingestion parser helper for custom uploads
export function parseDeterministicMathData(rawText: string): ParseIngestResult {
  const parsed = parseMentalMath(rawText);
  const normalizedQuestions = compileNormalizedQuestions(parsed.sets);
  return {
    levels: parsed.levels,
    sets: parsed.sets,
    normalizedQuestions,
    totalQuestions: normalizedQuestions.length,
    errors: parsed.fatalError ? [parsed.fatalError] : [],
  };
}

// Cached singleton for instant zero-latency access
let cachedParsed: ParsedMentalMathResult | null = null;

export function getParsedMentalMath(): ParsedMentalMathResult {
  if (!cachedParsed) {
    cachedParsed = parseMentalMath();
  }
  return cachedParsed;
}

export function getLocalSetsForLevel(levelNumber: number): MathSet[] {
  const data = getParsedMentalMath();
  return data.setsByLevel[levelNumber] || [];
}

export function getAllLocalLevels(): MathLevel[] {
  const data = getParsedMentalMath();
  return data.levels;
}

