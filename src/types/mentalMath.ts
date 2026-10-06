export type PenaltyFlag = 'none' | 'reduced' | 'zero';

export interface MathQuestion {
  id: string;
  expression: string; // Math prompt, e.g. "47 + 89"
  question?: string;   // Database column alias
  answer: string;     // Exact value, e.g. "136"
  flow_text?: string; // Normal markdown text (Strategy, Shortcut, Inner Voice)
  mermaid_syntax?: string; // Isolated Mermaid flowchart syntax
  thoughtProcess: string; // Markdown + Mermaid flowchart combined
  timeLimitSec?: number; // Optional question-level time limit (default 10s)
}

export interface MathSet {
  id: string;
  levelNumber: number;
  setNumber: number;
  timeLimitSeconds: number; // e.g. 45s for the set or rapid fire
  questions: MathQuestion[];
}

export interface MathLevel {
  levelNumber: number;
  title: string;
  category: string;
  description: string;
  requiredSetsToPass: number; // Win condition: must complete 2 sets to advance
  totalSets: number; // 6-10 sets
  sets?: MathSet[];
}

export interface UserMathLog {
  id: string;
  userName: string;
  level: number;
  setNumber: number;
  questionId: string;
  mathPrompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentMs: number;
  timeLimitSec: number;
  penaltyFlag: PenaltyFlag; // 'none' | 'reduced' (t: +5s) | 'zero' (Shift+T: +10s)
  setStatus: 'passed' | 'failed';
  createdAt: string;
}

export interface UserMentalMathStats {
  currentLevel: number;
  unlockedLevel: number;
  totalSetsCompleted: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  averageTimeMs: number;
  accuracyPercentage: number;
  penaltyCount: number;
  fastestAnswerMs: number;
  levelProgress: Record<number, {
    passedSets: number[]; // Set numbers that were passed
    isUnlocked: boolean;
    isCompleted: boolean;
  }>;
}

export interface NormalizedMathQuestionRecord {
  id: string;
  level: number;
  set: number;
  level_number: number;
  set_number: number;
  question_number: number;
  question: string;
  answer: string;
  flow_text: string;
  mermaid_syntax: string;
  created_at: string;
}

export interface ParseIngestResult {
  levels: MathLevel[];
  sets: MathSet[];
  normalizedQuestions?: NormalizedMathQuestionRecord[];
  totalQuestions: number;
  errors: string[];
}
