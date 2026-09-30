export type ImportDestination =
  | 'gk_qb_mocks'
  | 'gk_qb_current'
  | 'quants_caselet'
  | 'ar_puzzle';

export interface ParsedQuestionItem {
  id: string;
  questionNumber: number;
  prompt: string;
  options: string[]; // exactly 4 options: [A, B, C, D]
  correctAnswer: 'A' | 'B' | 'C' | 'D' | null;
  explanation: string;
  category?: string;
  subtopic?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Hard';
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
 * Deterministic, pure-regex parser for CLAT question banks and caselets.
 * Zero AI or LLM dependencies.
 */
export function parseImportData(
  rawText: string,
  destination: ImportDestination
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

  const isPassageBased = destination === 'quants_caselet' || destination === 'ar_puzzle';

  let questionsText = text;

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
          extractedTitle =
            destination === 'quants_caselet'
              ? 'Quantitative Caselet'
              : 'Analytical Deductive Puzzle';
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
          isValid: passageErrors.length === 0,
          errors: passageErrors,
        };
      }

      // Remaining text after PASSAGE END contains the questions
      questionsText = text.substring(endIndex + endMatch[0].length).trim();
    }
  }

  // 2. Split questions by '---' (triple dashes)
  const rawChunks = questionsText
    .split(/\n\s*---\s*\n|\n\s*---+\s*$/m)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  const chunksToParse = rawChunks.length > 0 ? rawChunks : [questionsText];

  chunksToParse.forEach((chunk, index) => {
    // If chunk does not look like a question block, skip only if very short non-question metadata
    if (!chunk.match(/[A-D]\s*[\).]/i) && chunk.length < 25) {
      return;
    }

    const item = parseSingleQuestion(chunk, index + 1);
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
 * Deterministically parses a single question block via strict regex.
 * STRICT VALIDATION: EVERY question must successfully parse 4 options and 1 valid Answer [A-D].
 */
function parseSingleQuestion(
  chunk: string,
  questionNumber: number
): ParsedQuestionItem {
  const errors: string[] = [];

  // 1. Extract prompt: Everything before Option A
  const optAIndex = chunk.search(/^[ \t]*[A]\s*[\).]/m);

  let prompt = '';
  if (optAIndex !== -1) {
    prompt = chunk.substring(0, optAIndex).trim();
  } else {
    errors.push('Missing Option A marker (e.g. "A) ...")');
    prompt = chunk.split('\n')[0] || 'Unknown Prompt';
  }

  // Strip leading question numbering like "Q1." or "1." or "Question 1:"
  prompt = prompt.replace(/^(?:Q\d+[:.]?|Question\s*\d+[:.]?|\d+[\).])\s*/i, '').trim();
  if (!prompt) {
    errors.push('Prompt statement is empty');
  }

  // 2. Extract Options: Match lines starting with A), B), C), D) (and A., B., C., D.)
  const optionRegex = /^[ \t]*([A-D])\s*[\).]\s*(.+)$/gim;
  const optionsMap: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = optionRegex.exec(chunk)) !== null) {
    const letter = match[1].toUpperCase();
    const content = match[2].trim();
    if (!optionsMap[letter]) {
      optionsMap[letter] = content;
    }
  }

  const options: string[] = [
    optionsMap['A'] || '',
    optionsMap['B'] || '',
    optionsMap['C'] || '',
    optionsMap['D'] || '',
  ];

  if (!optionsMap['A']) errors.push('Missing Option A');
  if (!optionsMap['B']) errors.push('Missing Option B');
  if (!optionsMap['C']) errors.push('Missing Option C');
  if (!optionsMap['D']) errors.push('Missing Option D');

  // 3. Extract Answer: Match `Answer: [A-D]`
  let correctAnswer: 'A' | 'B' | 'C' | 'D' | null = null;
  const answerMatch = chunk.match(/^[ \t]*Answer\s*[:=\-]\s*([A-D])/im);
  if (answerMatch) {
    correctAnswer = answerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
  } else {
    errors.push('Missing Answer (e.g. "Answer: A/B/C/D")');
  }

  // 4. Extract Explanation: Match `Explanation: [...]`
  let explanation = '';
  const explanationMatch = chunk.match(/^[ \t]*Explanation\s*[:=\-]\s*([\s\S]*?)(?=(?:^[ \t]*(?:Source|Category|Subtopic|Difficulty)|$))/im);
  if (explanationMatch) {
    explanation = explanationMatch[1].trim();
  }

  // Optional metadata tags
  let category: string | undefined;
  const catMatch = chunk.match(/^[ \t]*Category\s*[:=\-]\s*(.+)$/im);
  if (catMatch) category = catMatch[1].trim();

  let subtopic: string | undefined;
  const subMatch = chunk.match(/^[ \t]*Subtopic\s*[:=\-]\s*(.+)$/im);
  if (subMatch) subtopic = subMatch[1].trim();

  let difficulty: 'Easy' | 'Moderate' | 'Hard' | undefined;
  const diffMatch = chunk.match(/^[ \t]*Difficulty\s*[:=\-]\s*(Easy|Moderate|Hard)/im);
  if (diffMatch) difficulty = diffMatch[1] as 'Easy' | 'Moderate' | 'Hard';

  let source: string | undefined;
  const srcMatch = chunk.match(/^[ \t]*Source\s*[:=\-]\s*(.+)$/im);
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
    difficulty: difficulty || 'Moderate',
    source: source || 'Import Batch',
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clean reference templates for the 4 destinations.
 */
export function getSampleTemplate(destination: ImportDestination): string {
  switch (destination) {
    case 'gk_qb_mocks':
      return `Which Article of the Constitution of India guarantees the right against self-incrimination in criminal proceedings?
A) Article 20(1)
B) Article 20(2)
C) Article 20(3)
D) Article 21
Answer: C
Explanation: Article 20(3) provides that no person accused of any offence shall be compelled to be a witness against himself.
Category: Constitutional Law
Subtopic: Fundamental Rights
Difficulty: Moderate
Source: CLAT Mock Series

---

Under the Bharatiya Nyaya Sanhita (BNS), 2023, the offence of sedition has been replaced primarily under which section?
A) Section 124A
B) Section 152
C) Section 197
D) Section 112
Answer: B
Explanation: Section 152 of the BNS penalizes acts endangering the sovereignty, unity, and integrity of India.
Category: Criminal Law
Subtopic: BNS 2023
Difficulty: Hard
Source: Legal Digest`;

    case 'gk_qb_current':
      return `Who was sworn in as the 51st Chief Justice of India in November 2024?
A) Justice Sanjiv Khanna
B) Justice B.R. Gavai
C) Justice Surya Kant
D) Justice Hima Kohli
Answer: A
Explanation: Justice Sanjiv Khanna succeeded Justice D.Y. Chandrachud as the 51st Chief Justice of India.
Category: Judiciary & Appointments
Subtopic: Supreme Court
Difficulty: Easy
Source: National Gazette

---

India and the United Arab Emirates (UAE) formally operationalized which bilateral framework in 2024?
A) Bilateral Investment Treaty
B) Comprehensive Nuclear Accord
C) Trans-Pacific Maritime Pact
D) Dual Citizenship Protocol
Answer: A
Explanation: India and the UAE operationalized their Bilateral Investment Treaty with dedicated provisions for institutional commercial dispute settlement.
Category: International Relations
Subtopic: Bilateral Treaties
Difficulty: Moderate
Source: Ministry of External Affairs`;

    case 'quants_caselet':
      return `Title: Fast-Track Special Courts Budget Allocation
Source: Department of Justice Review 2025

### PASSAGE START
The Ministry of Law and Justice approved financial outlay for 1,023 Fast Track Special Courts (FTSCs) across 28 States and Union Territories. Out of the total sanctioned courts, 410 courts are exclusively designated for POCSO Act cases, while the remaining courts handle heinous offence trials.

In the northern region comprising 4 states, 240 FTSCs are operational. The ratio of POCSO courts to regular FTSCs in the northern region is 3:2. The average monthly operational cost per court is Rs. 6.25 Lakhs, with the Central Government contributing 60% and State Governments funding the remaining 40%.
### PASSAGE END

What is the total number of regular (non-exclusive POCSO) FTSCs sanctioned across the country?
A) 580
B) 613
C) 640
D) 672
Answer: B
Explanation: Total courts = 1,023. Exclusive POCSO = 410. Regular courts = 1,023 - 410 = 613 courts.

---

In the northern region, how many exclusive POCSO courts are operational?
A) 96
B) 120
C) 144
D) 160
Answer: C
Explanation: Northern total = 240. Ratio = 3:2. Total parts = 5. POCSO courts = (3/5) * 240 = 144 courts.

---

What is the Central Government's monthly financial contribution towards running all 240 courts in the northern region?
A) Rs. 7.50 Crores
B) Rs. 9.00 Crores
C) Rs. 10.25 Crores
D) Rs. 12.00 Crores
Answer: B
Explanation: Total cost per court = Rs. 6.25 Lakhs. Central share = 60% of 6.25 = Rs. 3.75 Lakhs. For 240 courts = 240 * 3.75 Lakhs = Rs. 9.00 Crores.`;

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

Which judge is seated at Dais 5 (extreme right)?
A) Justice A
B) Justice B
C) Justice D
D) Justice E
Answer: C
Explanation: Dais 1 = E, Dais 3 = C, Dais 4 = A. Justice D must be at an extreme end, so Dais 5 = D. Dais 2 = B. Thus Dais 5 is Justice D.

---

Who is seated immediately to the left of the Chief Justice (Dais 2)?
A) Justice A
B) Justice B
C) Justice D
D) Justice E
Answer: B
Explanation: Since Dais 1 = E, Dais 3 = C, Dais 4 = A, and Dais 5 = D, Dais 2 is occupied by Justice B.

---

Which two judges occupy the extreme dais positions (Dais 1 and Dais 5)?
A) Justice E and Justice D
B) Justice A and Justice E
C) Justice B and Justice D
D) Justice C and Justice E
Answer: A
Explanation: Justice E is at Dais 1 and Justice D is at Dais 5.`;
  }
}
