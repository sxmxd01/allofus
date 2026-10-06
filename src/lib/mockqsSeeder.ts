import { INITIAL_QUESTIONS } from '../data/legacy/questionBank';
import { supabaseMocks } from './supabase';

export interface SeedProgressState {
  current: number;
  total: number;
  percent: number;
  batchNum: number;
  totalBatches: number;
  isSeeding: boolean;
  isDone: boolean;
  error: string | null;
}

export async function seedLegacyMockqsToSupabase(
  onProgress?: (state: SeedProgressState) => void
): Promise<{ success: boolean; total: number; error?: string }> {
  const questions = INITIAL_QUESTIONS;
  const total = questions.length;
  const batchSize = 100;
  const totalBatches = Math.ceil(total / batchSize);

  // Transform and map each question to match our new qb_questions table:
  // - id: question.id
  // - section: question.section ('current_affairs' or 'question_bank')
  // - category: question.category || question.categoryId
  // - subtopic: question.subtopic
  // - difficulty: question.difficulty
  // - question: question.question
  // - option_a: question.options.a
  // - option_b: question.options.b
  // - option_c: question.options.c
  // - option_d: question.options.d
  // - correct_answer: question.answer.toLowerCase()
  // - explanation: question.explanation || ''
  const mappedQuestions = questions.map((q) => {
    const rawOptions = q.options as any;
    const optA = rawOptions?.a ?? (Array.isArray(rawOptions) ? rawOptions[0] : '') ?? '';
    const optB = rawOptions?.b ?? (Array.isArray(rawOptions) ? rawOptions[1] : '') ?? '';
    const optC = rawOptions?.c ?? (Array.isArray(rawOptions) ? rawOptions[2] : '') ?? '';
    const optD = rawOptions?.d ?? (Array.isArray(rawOptions) ? rawOptions[3] : '') ?? '';

    const sectionVal = q.section === 'current_affairs' ? 'current_affairs' : 'question_bank';
    const catVal = q.category || q.categoryId || 'General Preparation';
    const ansVal = (q.answer || 'a').toString().toLowerCase();

    return {
      id: q.id,
      section: sectionVal,
      category: catVal,
      subtopic: q.subtopic || 'General',
      difficulty: q.difficulty || 'Moderate',
      question: q.question,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_answer: ansVal,
      explanation: q.explanation || '',
    };
  });

  let processed = 0;

  // Execute upload in batches of 100 using supabase.from('qb_questions').upsert(batch, { onConflict: 'id' })
  for (let i = 0; i < total; i += batchSize) {
    const batch = mappedQuestions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    onProgress?.({
      current: processed,
      total,
      percent: Math.round((processed / total) * 100),
      batchNum,
      totalBatches,
      isSeeding: true,
      isDone: false,
      error: null,
    });

    const { error } = await supabaseMocks
      .from('qb_questions')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Batch ${batchNum} upsert failed:`, error);
      onProgress?.({
        current: processed,
        total,
        percent: Math.round((processed / total) * 100),
        batchNum,
        totalBatches,
        isSeeding: false,
        isDone: false,
        error: error.message || 'Failed to upsert batch to qb_questions table',
      });
      return { success: false, total: processed, error: error.message };
    }

    processed += batch.length;
    const percent = Math.min(100, Math.round((processed / total) * 100));

    onProgress?.({
      current: processed,
      total,
      percent,
      batchNum,
      totalBatches,
      isSeeding: processed < total,
      isDone: processed >= total,
      error: null,
    });
  }

  return { success: true, total: processed };
}
