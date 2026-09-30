import { Question } from '../types/question';
import { QUESTIONS_BATCH_1 } from './questionsBatch1';
import { QUESTIONS_BATCH_2 } from './questionsBatch2';
import { QUESTIONS_BATCH_3 } from './questionsBatch3';
import { QUESTIONS_BATCH_4 } from './questionsBatch4';
import { QUESTIONS_BATCH_5 } from './questionsBatch5';
import { QUESTIONS_BATCH_6 } from './questionsBatch6';
import { QUESTIONS_BATCH_7 } from './questionsBatch7';
import { QUESTIONS_BATCH_8 } from './questionsBatch8';
import { QUESTIONS_BATCH_9 } from './questionsBatch9';
import { QUESTIONS_BATCH_10 } from './questionsBatch10';
import { QUESTIONS_BATCH_11 } from './questionsBatch11';
import { QUESTIONS_BATCH_12 } from './questionsBatch12';
import { QUESTIONS_BATCH_13 } from './questionsBatch13';
import { QUESTIONS_BATCH_14 } from './questionsBatch14';
import { QUESTIONS_BATCH_15 } from './questionsBatch15';
import { QUESTIONS_BATCH_16 } from './questionsBatch16';
import { QUESTIONS_BATCH_17 } from './questionsBatch17';
import { QUESTIONS_BATCH_18 } from './questionsBatch18';
import { CURRENT_AFFAIRS_QUESTIONS } from './currentAffairsQuestions';
import { ASIAN_GAMES_QUESTIONS } from './asianGamesQuestions';
import { DIRAC_MEDAL_QUESTIONS } from './diracMedalQuestions';
import { NEPAL_FLOOD_QUESTIONS } from './nepalFloodQuestions';
import { CENSUS_QUESTIONS } from './censusQuestions';
import { SOUTH_CHINA_SEA_QUESTIONS } from './southChinaSeaQuestions';
import { POLYMER_CURRENCY_QUESTIONS } from './polymerCurrencyQuestions';
import { ASTRONAUTS_GALLANTRY_QUESTIONS } from './astronautsGallantryQuestions';

// Raw 690 Question Bank questions (from mocks already encountered)
const RAW_MOCK_QUESTIONS: Question[] = [
  ...QUESTIONS_BATCH_1,
  ...QUESTIONS_BATCH_2,
  ...QUESTIONS_BATCH_3,
  ...QUESTIONS_BATCH_4,
  ...QUESTIONS_BATCH_5,
  ...QUESTIONS_BATCH_6,
  ...QUESTIONS_BATCH_7,
  ...QUESTIONS_BATCH_8,
  ...QUESTIONS_BATCH_9,
  ...QUESTIONS_BATCH_10,
  ...QUESTIONS_BATCH_11,
  ...QUESTIONS_BATCH_12,
  ...QUESTIONS_BATCH_13,
  ...QUESTIONS_BATCH_14,
  ...QUESTIONS_BATCH_15,
  ...QUESTIONS_BATCH_16,
  ...QUESTIONS_BATCH_17,
  ...QUESTIONS_BATCH_18,
];

// Ensure all Question Bank questions explicitly have section: 'question_bank'
export const INITIAL_QUESTION_BANK: Question[] = RAW_MOCK_QUESTIONS.map(q => ({
  ...q,
  section: 'question_bank' as const
}));

// Export the Current Affairs questions (FIFA 2026, Asian Games, Dirac Medal/Deepak Dhar, Nepal Floods 2024, Census 2027, South China Sea, Polymer Notes, Astronauts & Gallantry)
export const INITIAL_CURRENT_AFFAIRS: Question[] = [
  ...CURRENT_AFFAIRS_QUESTIONS,
  ...ASIAN_GAMES_QUESTIONS,
  ...DIRAC_MEDAL_QUESTIONS,
  ...NEPAL_FLOOD_QUESTIONS,
  ...CENSUS_QUESTIONS,
  ...SOUTH_CHINA_SEA_QUESTIONS,
  ...POLYMER_CURRENCY_QUESTIONS,
  ...ASTRONAUTS_GALLANTRY_QUESTIONS
];

// Combined questions for global searches and legacy fallback
export const INITIAL_QUESTIONS: Question[] = [
  ...INITIAL_QUESTION_BANK,
  ...INITIAL_CURRENT_AFFAIRS
];

// Helper to get subtopics for a category
export function getSubtopicsByCategory(category: string, questions: Question[] = INITIAL_QUESTIONS): string[] {
  const set = new Set<string>();
  questions.forEach(q => {
    if (q.category === category && q.subtopic) {
      set.add(q.subtopic);
    }
  });
  return Array.from(set).sort();
}
