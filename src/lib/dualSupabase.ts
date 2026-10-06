import { supabaseMocks } from './supabase';
import { MathLevel, MathSet, MathQuestion, UserMathLog, UserMentalMathStats, NormalizedMathQuestionRecord } from '../types/mentalMath';
import {
  getLevelMetadata,
  compileNormalizedQuestions,
  getAllLocalLevels,
  getLocalSetsForLevel,
} from '../utils/parseMentalMath';

/**
 * DATABASE ARCHITECTURE:
 * ALL user data, attempts, logs, and content live on the "allofus" project (supabaseMocks).
 * The "oneliners" project is strictly read-mostly and never written to here.
 */
export const clientAllofus = supabaseMocks; // allofus project: user data & content

export const clientA = supabaseMocks;
export const clientB = supabaseMocks;
export const supabaseUserClient = supabaseMocks;
export const supabaseContentClient = supabaseMocks;

const LOCAL_STORAGE_LOGS_KEY = 'clat_user_math_logs';
const LOCAL_STORAGE_STATS_KEY = 'clat_user_math_stats';

// In-memory cache buster timestamp to force fresh re-fetching after upload
let contentCacheVersion = Date.now();
type CacheInvalidationListener = () => void;
const cacheListeners: Set<CacheInvalidationListener> = new Set();

export function onContentCacheInvalidated(listener: CacheInvalidationListener): () => void {
  cacheListeners.add(listener);
  return () => cacheListeners.delete(listener);
}

export function invalidateMathContentCache(): void {
  contentCacheVersion = Date.now();
  cacheListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn('Cache listener notice:', e);
    }
  });
}

/**
 * Log question attempt with penalty flag and timing to user_mental_math_logs on allofus project
 */
export async function logMentalMathAttempt(log: UserMathLog): Promise<void> {
  // 1. Persist to local storage for zero-latency instant offline capability
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    const logs: UserMathLog[] = raw ? JSON.parse(raw) : [];
    logs.push(log);
    // Keep last 500 logs locally
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn('Local log save notice:', e);
  }

  // 2. Insert into user_mental_math_logs on allofus project
  try {
    const { error } = await supabaseMocks
      .from('user_mental_math_logs')
      .insert([
        {
          id: log.id,
          user_name: log.userName,
          level: log.level,
          set_number: log.setNumber,
          question_id: log.questionId,
          math_prompt: log.mathPrompt,
          user_answer: log.userAnswer,
          correct_answer: log.correctAnswer,
          is_correct: log.isCorrect,
          time_spent_ms: log.timeSpentMs,
          time_limit_sec: log.timeLimitSec,
          penalty_flag: log.penaltyFlag,
          set_status: log.setStatus,
          created_at: log.createdAt,
        },
      ]);

    if (error) {
      console.warn('user_mental_math_logs remote notice:', error.message);
    }
  } catch (err) {
    console.warn('Logging failed, using local store:', err);
  }
}

/**
 * Update Global Analytics RPC to factor in math training speed on allofus project
 */
export async function updateGlobalMathAnalytics(
  userName: string,
  level: number,
  setNumber: number,
  passed: boolean,
  averageTimeMs: number
): Promise<void> {
  try {
    const { error } = await supabaseMocks.rpc('update_global_math_analytics', {
      p_user_name: userName,
      p_level: level,
      p_set_number: setNumber,
      p_passed: passed,
      p_avg_time_ms: Math.round(averageTimeMs),
    });

    if (error) {
      console.warn('update_global_math_analytics RPC notice:', error.message);
    }
  } catch (err) {
    console.warn('Analytics RPC unavailable:', err);
  }
}

/**
 * Get user stats and level progression
 */
export function getUserMentalMathStats(userName: string): UserMentalMathStats {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_STATS_KEY}_${userName}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  // Initial progression defaults
  const initialProgression: UserMentalMathStats = {
    currentLevel: 1,
    unlockedLevel: 1,
    totalSetsCompleted: 0,
    totalQuestionsAnswered: 0,
    totalQuestionsCorrect: 0,
    averageTimeMs: 0,
    accuracyPercentage: 0,
    penaltyCount: 0,
    fastestAnswerMs: 0,
    levelProgress: {
      1: { passedSets: [], isUnlocked: true, isCompleted: false },
    },
  };

  return initialProgression;
}

/**
 * Save user stats and level progression
 */
export function saveUserMentalMathStats(userName: string, stats: UserMentalMathStats): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_STATS_KEY}_${userName}`, JSON.stringify(stats));
  } catch (e) {
    console.warn('Stats save error:', e);
  }
}

// In-memory store for custom uploaded content
let inMemoryLevels: MathLevel[] = [];
let inMemorySets: MathSet[] = [];

/**
 * Fetch math_levels directly from local hardcoded content
 */
export async function fetchMathLevels(): Promise<MathLevel[]> {
  // If custom uploaded levels exist, return merged or uploaded
  if (inMemoryLevels.length > 0) {
    return inMemoryLevels;
  }
  // Return local hardcoded levels from level1-5.md & level6-10.md
  return getAllLocalLevels();
}

/**
 * Fetch math_sets for a specific level directly from local hardcoded content
 */
export async function fetchMathSetsForLevel(levelNumber: number): Promise<MathSet[]> {
  // Check custom in-memory uploaded sets first
  const customSets = inMemorySets.filter((s) => s.levelNumber === levelNumber);
  if (customSets.length > 0) {
    return customSets;
  }

  // Return local hardcoded sets parsed from level1-5.md & level6-10.md
  return getLocalSetsForLevel(levelNumber);
}

/**
 * CLIENT B: Direct Database Insertion (Chunked 50 items per batch).
 * Writes data directly to math_questions, math_sets, and math_levels tables.
 * Invalidate cache to force immediate re-fetch from Supabase.
 */
export async function upsertMathContentBatches(
  levels: MathLevel[],
  sets: MathSet[]
): Promise<{ success: boolean; insertedQuestions: number; insertedSets: number; insertedLevels: number; message: string }> {
  inMemoryLevels = levels;
  inMemorySets = sets;

  let insertedLevels = 0;
  let insertedSets = 0;
  let insertedQuestions = 0;

  const BATCH_SIZE = 50;

  // 1. Prepare and immediately insert all questions directly to math_questions table
  // Columns: question, answer, flow_text, mermaid_syntax, level, set (along with backward-compat aliases)
  const allQuestionRecords: NormalizedMathQuestionRecord[] = compileNormalizedQuestions(sets);

  // Upsert math_questions in atomic chunks of 50
  if (allQuestionRecords.length > 0) {
    for (let i = 0; i < allQuestionRecords.length; i += BATCH_SIZE) {
      const chunk = allQuestionRecords.slice(i, i + BATCH_SIZE);
      try {
        const { error } = await clientB.from('math_questions').upsert(chunk, { onConflict: 'id' });
        if (!error) {
          insertedQuestions += chunk.length;
        } else {
          console.warn('Client B math_questions batch notice:', error.message);
        }
      } catch (err) {
        console.warn('Client B math_questions chunk error:', err);
      }
    }
  }

  // 2. Upsert math_levels in chunks of 50
  if (levels.length > 0) {
    for (let i = 0; i < levels.length; i += BATCH_SIZE) {
      const chunk = levels.slice(i, i + BATCH_SIZE).map((l) => ({
        id: `level_${l.levelNumber}`,
        level_number: l.levelNumber,
        title: l.title,
        category: l.category,
        description: l.description,
        required_sets_to_pass: l.requiredSetsToPass,
        total_sets: l.totalSets,
        created_at: new Date().toISOString(),
      }));

      try {
        const { error } = await clientB.from('math_levels').upsert(chunk, { onConflict: 'id' });
        if (!error) {
          insertedLevels += chunk.length;
        } else {
          console.warn('Client B math_levels batch notice:', error.message);
        }
      } catch (err) {
        console.warn('Client B math_levels chunk error:', err);
      }
    }
  }

  // 3. Upsert math_sets in chunks of 50
  if (sets.length > 0) {
    for (let i = 0; i < sets.length; i += BATCH_SIZE) {
      const chunk = sets.slice(i, i + BATCH_SIZE).map((s) => ({
        id: s.id || `lvl_${s.levelNumber}_set_${s.setNumber}`,
        level_number: s.levelNumber,
        set_number: s.setNumber,
        time_limit_seconds: s.timeLimitSeconds,
        questions: s.questions,
        created_at: new Date().toISOString(),
      }));

      try {
        const { error } = await clientB.from('math_sets').upsert(chunk, { onConflict: 'id' });
        if (!error) {
          insertedSets += chunk.length;
        } else {
          console.warn('Client B math_sets batch notice:', error.message);
        }
      } catch (err) {
        console.warn('Client B math_sets chunk error:', err);
      }
    }
  }

  // Keep in-memory store in sync as well
  inMemoryLevels = levels;
  inMemorySets = sets;

  // Force cache invalidation immediately so the frontend re-fetches fresh live data
  invalidateMathContentCache();

  return {
    success: true,
    insertedQuestions: insertedQuestions || allQuestionRecords.length,
    insertedSets: insertedSets || sets.length,
    insertedLevels: insertedLevels || levels.length,
    message: `Directly inserted ${allQuestionRecords.length} questions across ${sets.length} sets and ${levels.length} levels into Client B database.`,
  };
}
