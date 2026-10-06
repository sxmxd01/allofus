export type ImportDestination =
  | 'gk_qb_mocks'
  | 'gk_qb_current'
  | 'quants_caselet'
  | 'ar_puzzle'
  | 'mental_math';

export const QT_TOPICS = [
  'Ratios & Percentages',
  'Profit Loss Discount',
  'Interest',
  'Time Speed Distance',
  'Time and Work',
  'Mensuration',
  'Mixtures',
  'Probability',
  'Misc',
] as const;

export type QTTopic = typeof QT_TOPICS[number];

export const AR_TOPICS = [
  'Linear Arrangements',
  'Circular Arrangements',
  'Blood Relations',
  'Coding-Decoding',
  'Distance and Direction',
  'Misc',
] as const;

export type ARTopic = typeof AR_TOPICS[number];

export type QuestionDifficultyLevel = 'Very Easy' | 'Easy' | 'Moderate' | 'Hard';

export interface ParsedQuestionItem {
  id: string;
  questionNumber: number;
  prompt: string;
  options: string[]; // exactly 4 options: [A, B, C, D]
  correctAnswer: 'A' | 'B' | 'C' | 'D' | null;
  explanation: string;
  category?: string;
  subtopic?: string;
  difficulty?: QuestionDifficultyLevel;
  source?: string;
  isValid: boolean;
  errors: string[];
}

export interface ParsedPassageItem {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  readTimeMinutes: number;
  source: string;
  solution_video_url?: string;
  isValid: boolean;
  errors: string[];
}

export interface ParseResult {
  destination: ImportDestination;
  passage?: ParsedPassageItem;
  questions: ParsedQuestionItem[];
  totalParsed: number;
  validCount: number;
  errorCount: number;
  generalErrors: string[];
}

/**
 * Deterministic, resilient regex parser for CLAT question banks and caselets.
 * Upgraded to seamlessly handle AI-generated text files with multi-line statements,
 * missing separators, option markers like (a), and metadata tags.
 */
export function parseImportData(
  rawText: string,
  destination: ImportDestination,
  selectedTopic?: string
): ParseResult {
  const result: ParseResult = {
    destination,
    questions: [],
    totalParsed: 0,
    validCount: 0,
    errorCount: 0,
    generalErrors: [],
  };

  const text = rawText.trim();
  if (!text) {
    result.generalErrors.push('Input text is empty.');
    return result;
  }

  // Look for an optional line at the bottom formatted as Video Link: [URL]
  const videoLinkMatch = text.match(/(?:^|\n)\s*Video Link:\s*(https?:\/\/[^\s\n\r]+)/i);
  const solutionVideoUrl = videoLinkMatch ? videoLinkMatch[1].trim() : undefined;

  const isPassageBased = destination === 'quants_caselet' || destination === 'ar_puzzle';
  let questionsText = text.replace(/(?:^|\n)\s*Video Link:\s*https?:\/\/[^\s\n\r]+/gi, '').trim();

  // 1. If target is 'Quants' or 'AR': Extract passage strictly between delimiters
  if (isPassageBased) {
    const passageStartRegex = /###\s*PASSAGE\s*START/i;
    const passageEndRegex = /###\s*PASSAGE\s*END/i;

    const startMatch = text.match(passageStartRegex);
    const endMatch = text.match(passageEndRegex);

    if (!startMatch || !endMatch) {
      result.generalErrors.push(
        'Missing required delimiters: Passage must be wrapped strictly between "### PASSAGE START" and "### PASSAGE END".'
      );
    } else {
      const startIndex = startMatch.index! + startMatch[0].length;
      const endIndex = endMatch.index!;

      if (endIndex <= startIndex) {
        result.generalErrors.push(
          'Delimiter order error: "### PASSAGE END" appears before "### PASSAGE START".'
        );
      } else {
        const passageContent = text.substring(startIndex, endIndex).trim();

        // Extract title if present
        const beforePassage = text.substring(0, startMatch.index!).trim();
        let extractedTitle = '';
        const titleMatch = beforePassage.match(/Title:\s*(.+)/i);
        if (titleMatch) {
          extractedTitle = titleMatch[1].trim();
        } else if (beforePassage.length > 0 && beforePassage.length < 120) {
          extractedTitle = beforePassage.split('\n')[0].replace(/^#+\s*/, '').trim();
        }

        if (!extractedTitle) {
          if (selectedTopic) {
            extractedTitle = `${selectedTopic} Passage`;
          } else {
            extractedTitle =
              destination === 'quants_caselet'
                ? 'Quantitative Caselet'
                : 'Analytical Deductive Puzzle';
          }
        }

        // Extract source if present
        let extractedSource = 'CLAT Imported Exam Set';
        const sourceMatch = text.match(/Source:\s*(.+)/i);
        if (sourceMatch) {
          extractedSource = sourceMatch[1].trim();
        }

        const words = passageContent.split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

        const passageErrors: string[] = [];
        if (!passageContent || wordCount < 5) {
          passageErrors.push('Passage text between delimiters is empty or too short.');
        }

        result.passage = {
          id: `pas-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: extractedTitle,
          text: passageContent,
          wordCount,
          readTimeMinutes,
          source: extractedSource,
          solution_video_url: solutionVideoUrl,
          isValid: passageErrors.length === 0,
          errors: passageErrors,
        };
      }

      // Remaining text after PASSAGE END contains the questions
      questionsText = text
        .substring(endIndex + endMatch[0].length)
        .replace(/(?:^|\n)\s*Video Link:\s*https?:\/\/[^\s\n\r]+/gi, '')
        .trim();
    }
  }

  // 2. Block Splitting (Tolerating missing separators):
  // Standardize text by finding every instance of a question number at the start of a line (e.g., Q1., Q42.)
  let rawBlocks: string[] = [];
  if (/(?:^|\n)\s*Q\d+\./i.test(questionsText)) {
    // Regex split strategy: const blocks = rawText.split(/(?:^|\n)(?=Q\d+\.)/i);
    rawBlocks = questionsText.split(/(?:^|\n)(?=Q\d+\.)/i);
  } else if (/\n\s*---\s*\n|\n\s*---+\s*$/m.test(questionsText)) {
    rawBlocks = questionsText.split(/\n\s*---\s*\n|\n\s*---+\s*$/m);
  } else {
    // Fallback: split by line starting with number like 1. or Question 1:
    rawBlocks = questionsText.split(/(?:^|\n)(?=(?:Q\d+[:.]?|Question\s*\d+[:.]?|\d+[\).]\s+[A-Z]))/i);
    if (rawBlocks.length <= 1) {
      rawBlocks = [questionsText];
    }
  }

  // Filter out any block that does not contain an option marker (e.g., (a)).
  // This automatically strips out rogue document headers, introductory text, or batch titles.
  const validBlocks = rawBlocks
    .map((b) => b.trim())
    .filter((b) => b.length > 0 && /(?:\([a-dA-D]\)|^[ \t]*[a-dA-D]\s*[\).])/im.test(b));

  validBlocks.forEach((chunk, index) => {
    const item = parseSingleQuestion(chunk, index + 1);
    if (selectedTopic) {
      item.category = selectedTopic;
      item.subtopic = selectedTopic;
    }
    result.questions.push(item);
  });

  result.totalParsed = result.questions.length;
  result.validCount = result.questions.filter((q) => q.isValid).length;
  result.errorCount = result.questions.filter((q) => !q.isValid).length;

  if (result.passage && !result.passage.isValid) {
    result.errorCount += 1;
  }
  if (result.generalErrors.length > 0) {
    result.errorCount += result.generalErrors.length;
  }

  return result;
}

/**
 * Deterministically parses a single question block via resilient regex rules.
 */
function parseSingleQuestion(
  chunk: string,
  questionNumber: number
): ParsedQuestionItem {
  const errors: string[] = [];

  // Extraneous Metadata: Ignore any lines containing Archetype: or Fact ID Used:
  const cleanChunk = chunk
    .split('\n')
    .filter((line) => !/^\s*(?:Archetype:|Fact ID Used:)/i.test(line))
    .join('\n');

  // 1. Question Prompt: Extract everything from the start of the block (stripping the Q1. prefix) up to the first option (a).
  // This ensures multi-line statements (1., 2., 3.) are kept as part of the question prompt.
  const optAMatch = cleanChunk.match(/^\s*(?:\([aA]\)|[aA]\s*[\).])/m);
  let prompt = '';
  if (optAMatch && optAMatch.index !== undefined) {
    prompt = cleanChunk.substring(0, optAMatch.index).trim();
  } else {
    errors.push('Missing Option (a) marker (e.g. "(a) ...")');
    prompt = cleanChunk.split('\n')[0] || 'Unknown Prompt';
  }

  // Strip leading question numbering like "Q1." or "Q42." or "Question 1:" or "1."
  prompt = prompt
    .replace(/^(?:Q\d+[:.]?|Question\s*\d+[:.]?|\d+[\).])\s*/i, '')
    .trim();

  if (!prompt) {
    errors.push('Prompt statement is empty');
  }

  // 2. Options A-D: Extract using a regex that tolerates leading spaces/indentation:
  // /^\s*\([aA]\)\s+(.+)/m, /^\s*\([bB]\)\s+(.+)/m, etc.
  const extractOption = (letter: 'a' | 'b' | 'c' | 'd'): string => {
    // Primary regex: tolerating leading spaces/indentation with parentheses
    const parenRegex = new RegExp(`^\\s*\\([${letter}${letter.toUpperCase()}]\\)\\s+(.+)`, 'm');
    const parenMatch = cleanChunk.match(parenRegex);
    if (parenMatch && parenMatch[1].trim()) {
      return parenMatch[1].trim();
    }

    // Resilient fallback: A) or A. or A:
    const altRegex = new RegExp(`^\\s*[${letter}${letter.toUpperCase()}]\\s*[\\).:]\\s*(.+)`, 'm');
    const altMatch = cleanChunk.match(altRegex);
    if (altMatch && altMatch[1].trim()) {
      return altMatch[1].trim();
    }

    return '';
  };

  const optionA = extractOption('a');
  const optionB = extractOption('b');
  const optionC = extractOption('c');
  const optionD = extractOption('d');

  if (!optionA) errors.push('Missing Option (a)');
  if (!optionB) errors.push('Missing Option (b)');
  if (!optionC) errors.push('Missing Option (c)');
  if (!optionD) errors.push('Missing Option (d)');

  const options: string[] = [optionA, optionB, optionC, optionD];

  // 3. Answer Key: Extract using a regex that tolerates indentation and parentheses:
  // /^\s*Answer:\s*\(([a-dA-D])\)/im
  let correctAnswer: 'A' | 'B' | 'C' | 'D' | null = null;
  const parenAnswerMatch = cleanChunk.match(/^\s*Answer:\s*\(([a-dA-D])\)/im);
  if (parenAnswerMatch) {
    correctAnswer = parenAnswerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
  } else {
    // Tolerant fallback for Answer: A or Answer: (A)
    const plainAnswerMatch = cleanChunk.match(/^\s*Answer\s*[:=\-]\s*(?:\(([a-dA-D])\)|([a-dA-D]))/im);
    if (plainAnswerMatch) {
      const letter = plainAnswerMatch[1] || plainAnswerMatch[2];
      correctAnswer = letter.toUpperCase() as 'A' | 'B' | 'C' | 'D';
    } else {
      errors.push('Missing Answer (e.g. "Answer: (a)")');
    }
  }

  // 4. Explanation: Extract using /^\s*Explanation:\s*(.+)/im
  let explanation = '';
  const multilineExpMatch = cleanChunk.match(
    /^\s*Explanation:\s*([\s\S]*?)(?=(?:^\s*(?:Difficulty|Category|Subtopic|Source)\s*[:=]|$))/im
  );
  if (multilineExpMatch && multilineExpMatch[1].trim()) {
    explanation = multilineExpMatch[1].trim();
  } else {
    const singleExpMatch = cleanChunk.match(/^\s*Explanation:\s*(.+)/im);
    if (singleExpMatch) {
      explanation = singleExpMatch[1].trim();
    }
  }

  // 5. Difficulty: Extract using /^\s*Difficulty:\s*(Very Easy|Easy|Moderate|Hard)/im. If not found, default to 'Moderate'
  let difficulty: QuestionDifficultyLevel = 'Moderate';
  const diffMatch = cleanChunk.match(/^\s*Difficulty:\s*(Very Easy|Easy|Moderate|Hard)/im);
  if (diffMatch) {
    difficulty = diffMatch[1] as QuestionDifficultyLevel;
  }

  // Optional Category, Subtopic, Source
  let category: string | undefined;
  const catMatch = cleanChunk.match(/^\s*Category\s*[:=\-]\s*(.+)$/im);
  if (catMatch) category = catMatch[1].trim();

  let subtopic: string | undefined;
  const subMatch = cleanChunk.match(/^\s*Subtopic\s*[:=\-]\s*(.+)$/im);
  if (subMatch) subtopic = subMatch[1].trim();

  let source: string | undefined;
  const srcMatch = cleanChunk.match(/^\s*Source\s*[:=\-]\s*(.+)$/im);
  if (srcMatch) source = srcMatch[1].trim();

  return {
    id: `q-imp-${Date.now()}-${questionNumber}-${Math.random().toString(36).substring(2, 6)}`,
    questionNumber,
    prompt,
    options,
    correctAnswer,
    explanation: explanation || 'Imported factual rationale.',
    category,
    subtopic,
    difficulty,
    source: source || 'Import Batch',
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clean reference templates for the destinations.
 */
export function getSampleTemplate(destination: ImportDestination): string {
  switch (destination) {
    case 'gk_qb_mocks':
      return `Q1. Which Article of the Constitution of India guarantees the right against self-incrimination in criminal proceedings?
(a) Article 20(1)
(b) Article 20(2)
(c) Article 20(3)
(d) Article 21
Answer: (c)
Explanation: Article 20(3) provides that no person accused of any offence shall be compelled to be a witness against himself.
Category: Constitutional Law
Subtopic: Fundamental Rights
Difficulty: Moderate
Archetype: Direct Article
Fact ID Used: CONST-ART-20

Q2. Consider the following statements regarding the Bharatiya Nyaya Sanhita (BNS), 2023:
1. It replaces the Indian Penal Code, 1860.
2. The offence of sedition has been replaced primarily under Section 152.
Which of the statements given above is/are correct?
(a) 1 only
(b) 2 only
(c) Both 1 and 2
(d) Neither 1 nor 2
Answer: (c)
Explanation: Section 152 of the BNS penalizes acts endangering the sovereignty, unity, and integrity of India.
Category: Criminal Law
Subtopic: BNS 2023
Difficulty: Hard
Archetype: Multi-Statement
Fact ID Used: BNS-SEC-152`;

    case 'gk_qb_current':
      return `Q1. Who was sworn in as the 51st Chief Justice of India in November 2024?
(a) Justice Sanjiv Khanna
(b) Justice B.R. Gavai
(c) Justice Surya Kant
(d) Justice Hima Kohli
Answer: (a)
Explanation: Justice Sanjiv Khanna succeeded Justice D.Y. Chandrachud as the 51st Chief Justice of India.
Category: Judiciary & Appointments
Subtopic: Supreme Court
Difficulty: Easy
Archetype: Appointment
Fact ID Used: CJI-51

Q2. Consider the following statements regarding the India-UAE Bilateral Investment Treaty:
1. It was formally operationalized in 2024.
2. It includes institutional commercial dispute settlement mechanisms.
Which of the statements given above is/are correct?
(a) 1 only
(b) 2 only
(c) Both 1 and 2
(d) Neither 1 nor 2
Answer: (c)
Explanation: India and the UAE operationalized their Bilateral Investment Treaty with provisions for dispute resolution.
Category: International Relations
Subtopic: Bilateral Treaties
Difficulty: Moderate`;

    case 'quants_caselet':
      return `Title: Fast-Track Special Courts Budget Allocation
Source: Department of Justice Review 2025

### PASSAGE START
The Ministry of Law and Justice approved financial outlay for 1,023 Fast Track Special Courts (FTSCs) across 28 States and Union Territories. Out of the total sanctioned courts, 410 courts are exclusively designated for POCSO Act cases, while the remaining courts handle heinous offence trials.

In the northern region comprising 4 states, 240 FTSCs are operational. The ratio of POCSO courts to regular FTSCs in the northern region is 3:2. The average monthly operational cost per court is Rs. 6.25 Lakhs, with the Central Government contributing 60% and State Governments funding the remaining 40%.
### PASSAGE END

Q1. What is the total number of regular (non-exclusive POCSO) FTSCs sanctioned across the country?
(a) 580
(b) 613
(c) 640
(d) 672
Answer: (b)
Explanation: Total courts = 1,023. Exclusive POCSO = 410. Regular courts = 1,023 - 410 = 613 courts.
Difficulty: Moderate

Q2. In the northern region, how many exclusive POCSO courts are operational?
(a) 96
(b) 120
(c) 144
(d) 160
Answer: (c)
Explanation: Northern total = 240. Ratio = 3:2. Total parts = 5. POCSO courts = (3/5) * 240 = 144 courts.
Difficulty: Easy

Q3. What is the Central Government's monthly financial contribution towards running all 240 courts in the northern region?
(a) Rs. 7.50 Crores
(b) Rs. 9.00 Crores
(c) Rs. 10.25 Crores
(d) Rs. 12.00 Crores
Answer: (b)
Explanation: Total cost per court = Rs. 6.25 Lakhs. Central share = 60% of 6.25 = Rs. 3.75 Lakhs. For 240 courts = 240 * 3.75 Lakhs = Rs. 9.00 Crores.
Difficulty: Moderate

Video Link: https://www.youtube.com/watch?v=clat_quants_solution`;

    case 'ar_puzzle':
      return `Title: Supreme Court Constitution Bench Seating Protocol
Source: Supreme Court Protocol Manual

### PASSAGE START
Five Supreme Court judges—Justice A, Justice B, Justice C, Justice D, and Justice E—are seated in a single row on the bench from Dais 1 (far left) to Dais 5 (far right) facing the courtroom.

1. The Chief Justice (Justice C) always occupies the center dais (Dais 3).
2. The senior-most puisne judge (Justice A) sits at Dais 4.
3. Justice B and Justice E do not sit adjacent to each other.
4. Justice D is seated at one of the extreme ends of the bench.
5. Justice E is seated at Dais 1.
### PASSAGE END

Q1. Which judge is seated at Dais 5 (extreme right)?
(a) Justice A
(b) Justice B
(c) Justice D
(d) Justice E
Answer: (c)
Explanation: Dais 1 = E, Dais 3 = C, Dais 4 = A. Justice D must be at an extreme end, so Dais 5 = D. Dais 2 = B. Thus Dais 5 is Justice D.
Difficulty: Moderate

Q2. Who is seated immediately to the left of the Chief Justice (Dais 2)?
(a) Justice A
(b) Justice B
(c) Justice D
(d) Justice E
Answer: (b)
Explanation: Since Dais 1 = E, Dais 3 = C, Dais 4 = A, and Dais 5 = D, Dais 2 is occupied by Justice B.
Difficulty: Moderate

Q3. Which two judges occupy the extreme dais positions (Dais 1 and Dais 5)?
(a) Justice E and Justice D
(b) Justice A and Justice E
(c) Justice B and Justice D
(d) Justice C and Justice E
Answer: (a)
Explanation: Justice E is at Dais 1 and Justice D is at Dais 5.
Difficulty: Easy

Video Link: https://www.youtube.com/watch?v=clat_ar_solution`;

    case 'mental_math':
      return `##LEVEL: 1 Rapid Addition & Subtraction Foundations
===SET: 1===
Q: 47 + 89
A: 136
FLOW: \`\`\`mermaid
graph LR
    A[47 + 89] --> B[47 + 90 = 137]
    B --> C[137 - 1 = 136]
\`\`\`
**Optimal Path:** Round 89 to 90, then subtract 1 overshoot. 47 + 90 = 137; 137 - 1 = **136**.
Q: 64 + 28
A: 92
FLOW: \`\`\`mermaid
graph LR
    A[64 + 28] --> B[64 + 30 = 94]
    B --> C[94 - 2 = 92]
\`\`\`
**Optimal Path:** 64 + 30 = 94; 94 - 2 = **92**.
Q: 83 - 39
A: 44
FLOW: \`\`\`mermaid
graph LR
    A[83 - 39] --> B[83 - 40 = 43]
    B --> C[43 + 1 = 44]
\`\`\`
**Optimal Path:** 83 - 40 = 43; 43 + 1 = **44**.
===END_SET===`;
  }
}
