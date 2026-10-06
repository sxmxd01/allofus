export type QuestionDifficulty = 'Easy' | 'Moderate' | 'Hard';

export interface QuestionOptions {
  a: string;
  b: string;
  c: string;
  d: string;
  [key: string]: string;
}

export interface Question {
  id: string;
  qNumber?: number;
  section?: 'question_bank' | 'current_affairs' | string;
  difficulty?: QuestionDifficulty | string;
  category: string;
  categoryName?: string;
  categoryId?: string;
  subtopic: string;
  question: string;
  options: QuestionOptions;
  answer: string;
  explanation: string;
  source?: string;
  context?: string;
  [key: string]: any;
}

export interface CategoryMeta {
  id: string;
  name: string;
  code: string;
  description: string;
  section: 'question_bank' | 'current_affairs' | string;
}
