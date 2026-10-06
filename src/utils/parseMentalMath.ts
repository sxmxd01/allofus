import level1To5Raw from '../data/level1-5.md?raw';
import level6To10Raw from '../data/level6-10.md?raw';
import { MathLevel, MathSet, MathQuestion } from '../types/mentalMath';

/**
 * Metadata helper for levels
 */
export function getLocalLevelMeta(level: number): { title: string; category: string; description: string } {
  const metadataMap: Record<number, { title: string; category: string; description: string }> = {
    1: {
      title: 'Level 1: Rapid Addition & Subtraction',
      category: 'Speed Arithmetic',
      description: 'Left-to-Right additions, round & compensate, and landmark subtractions.',
    },
    2: {
      title: 'Level 2: Subtraction & Landmark Decomposition',
      category: 'Subtraction Fluency',
      description: 'Stepping down tens then units, and landmark tens rounding with compensation.',
    },
    3: {
      title: 'Level 3: Complements to 1000',
      category: 'Complement Arithmetic',
      description: 'Rapid 3-digit complements to 1000 for change and difference calculations.',
    },
    4: {
      title: 'Level 4: Rapid Multiplication by 5 and 25',
      category: 'Multiplication Shortcuts',
      description: 'Double & halve shortcuts, ×10/2 and ×100/4 methods.',
    },
    5: {
      title: 'Level 5: Rapid Multiplication by 9 and 11',
      category: 'Multiplication Shortcuts',
      description: 'Distributive 11 decomposition and ×(10-1) methods.',
    },
    6: {
      title: 'Level 6: Multiplication by 12 and 15',
      category: 'Compound Multiplications',
      description: 'Times 10 plus half (×15) and times 10 plus double (×12).',
    },
    7: {
      title: 'Level 7: Squaring Numbers Ending in 5',
      category: 'Mental Powers',
      description: 'Ends-in-5 Squaring Rule: n(n+1) | 25.',
    },
    8: {
      title: 'Level 8: Mental Division by 5 and 25',
      category: 'Rapid Division',
      description: 'Double and shift decimal (÷5) or quadruple and shift (÷25).',
    },
    9: {
      title: 'Level 9: Percentage Benchmarks',
      category: 'Percentage Fluency',
      description: '10%, 5%, 1%, 15%, 25%, and 35% rapid mental decompositions.',
    },
    10: {
      title: 'Level 10: Fractional Conversions & Caselet QT',
      category: 'Caselet Quant Fluency',
      description: '1/8 (12.5%), 3/8 (37.5%), 5/8 (62.5%), 1/6 (16.67%) benchmark conversions.',
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

export interface ParsedMentalMathResult {
  levels: MathLevel[];
  sets: MathSet[];
  setsByLevel: Record<number, MathSet[]>;
  fatalError?: string;
}

/**
 * Parses markdown text using the established strict regex pipeline:
 * 1. Level & Set Splitting:
 *    - Split raw text by `##LEVEL:`
 *    - Split chunks by `===SET:`
 *    - Explicitly strip out or ignore `===END_SET===`
 * 2. Question & Answer Extraction:
 *    - Question: /(?<=Q:\s)(.*?)(?=\nA:)/s
 *    - Answer:   /(?<=A:\s)(.*?)(?=\nFLOW:)/s
 * 3. FLOW & Mermaid Isolation:
 *    - Flow text: /(?<=FLOW:\n)(.*?)(?=```mermaid)/s
 *    - Mermaid:   /```mermaid\n(.*?)\n```/s
 *
 * If the local markdown files cannot be found or loaded, a fatal error is returned.
 * AUTO-GENERATING FALLBACK QUESTIONS IS STRICTLY PROHIBITED.
 */
export function parseMentalMath(customRawText?: string): ParsedMentalMathResult {
  const combinedRaw = customRawText || `${level1To5Raw || ''}\n\n${level6To10Raw || ''}`;
  if (!combinedRaw || !combinedRaw.trim()) {
    return {
      levels: [],
      sets: [],
      setsByLevel: {},
      fatalError: 'FATAL ERROR: Could not find or load local data files (src/data/level1-5.md, src/data/level6-10.md).',
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

      // CRITICAL: Explicitly strip out or ignore the ===END_SET=== strings
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
        // Question: /(?<=Q:\s)(.*?)(?=\nA:)/s
        const qMatchExact = qBlock.match(/(?<=Q:\s)([\s\S]*?)(?=\nA:)/);
        if (qMatchExact) {
          question = qMatchExact[1].trim();
        } else {
          const qFallback = qBlock.match(/(?:^|\n)\s*Q:\s*([\s\S]*?)(?=(?:\n\s*A:|$))/i);
          if (qFallback) question = qFallback[1].trim();
        }

        // Answer: /(?<=A:\s)(.*?)(?=\nFLOW:)/s
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
        // Explicitly strip any mermaid block from flowText
        flowText = flowText.replace(/```mermaid[\s\S]*?```/gi, '').trim();

        // Mermaid: /```mermaid\n(.*?)\n```/s
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
