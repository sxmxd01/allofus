import { supabase } from './supabase';
import {
  BankQuestion,
  Passage,
  SyllabusTopic,
  LeaderboardUser,
  SubjectType,
  TopicStatus,
  SquadMember,
  SQUAD_MEMBERS,
} from '../types';
import {
  initialLeaderboard,
  bankQuestions as fallbackBankQuestions,
  initialUnsolvedQuestions,
  passages as fallbackPassages,
  initialSyllabusTopics,
} from '../data/mockData';

// ----------------------------------------------------------------------
// 1. SYLLABUS TRACKER
// ----------------------------------------------------------------------

export async function fetchSyllabusTopics(
  userName: string,
  subject: SubjectType = 'gk'
): Promise<SyllabusTopic[]> {
  try {
    const { data, error } = await supabase
      .from('syllabus_tracker')
      .select('*')
      .eq('user_name', userName)
      .eq('subject', subject);

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        subject: row.subject as SubjectType,
        month: row.month || 'September 2026',
        title: row.topic_name || row.title || 'CLAT Topic',
        category: row.category || 'General Preparation',
        status: (row.is_completed ? 'mastered' : 'pending') as TopicStatus,
        isCompleted: !!row.is_completed,
      }));
    }
  } catch (err) {
    console.error('Error fetching syllabus topics from Supabase:', err);
  }

  return initialSyllabusTopics.filter((t) => t.subject === subject);
}

export async function updateSyllabusTopicStatus(
  topicId: string,
  userName: string,
  isCompleted: boolean,
  topicName?: string,
  subject: SubjectType = 'gk'
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const { error, count } = await supabase
      .from('syllabus_tracker')
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? now : null,
      })
      .eq('id', topicId)
      .eq('user_name', userName);

    if (!error && count && count > 0) {
      return true;
    }

    if (topicName && subject) {
      const { error: insertErr } = await supabase.from('syllabus_tracker').upsert({
        id: topicId,
        user_name: userName,
        subject: subject,
        topic_name: topicName,
        is_completed: isCompleted,
        completed_at: isCompleted ? now : null,
      });
      if (!insertErr) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------
// 2. ONELINERS SOLVE MODE: Fetch questions where correct_answer IS NULL
// ----------------------------------------------------------------------

export async function fetchUnsolvedQuestions(): Promise<BankQuestion[]> {
  try {
    // Exact specification: Query logic: Fetch ONLY questions where correct_answer IS NULL
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .is('correct_answer', null)
      .eq('subject', 'gk');

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        subject: 'gk',
        category: row.category || 'Collaborative Research',
        subtopic: row.subtopic || 'General Knowledge',
        text: row.question || row.text || '',
        options: [
          row.option_a || 'Option A',
          row.option_b || 'Option B',
          row.option_c || 'Option C',
          row.option_d || 'Option D',
        ],
        correct_answer: null,
        correctOptionIndex: null,
        explanation: row.explanation || 'Answer key pending research by squad.',
        difficulty: (row.difficulty as any) || 'Moderate',
        source: row.source || 'Squad Research Queue',
        isVerified: false,
        extraNotes: row.extra_notes,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchUnsolvedQuestions error:', err);
  }

  return initialUnsolvedQuestions;
}

// ----------------------------------------------------------------------
// 3. ONELINERS SOLVE MODE: Submit Factual Answer -> UPDATE correct_answer
// ----------------------------------------------------------------------

export async function submitFactualAnswer(
  questionId: string,
  chosenOption: string, // 'A' | 'B' | 'C' | 'D'
  activeUsername: string,
  extraNotes?: string
): Promise<boolean> {
  try {
    const payload: Record<string, any> = {
      correct_answer: chosenOption,
      verified_by: activeUsername,
      verification_status: 'verified',
    };
    if (extraNotes) payload.extra_notes = extraNotes;

    // 1. UPDATE question in Supabase
    const { error: updateError } = await supabase
      .from('questions')
      .update(payload)
      .eq('id', questionId);

    // 2. Log in user_attempts table
    await supabase.from('user_attempts').insert({
      user_name: activeUsername,
      question_id: questionId,
      selected_option: chosenOption,
      is_correct: true,
      attempted_at: new Date().toISOString(),
    });

    return !updateError;
  } catch (err) {
    console.error('Error submitting factual answer to Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------------------------
// 4. ONELINERS SPRINT MODE: Fetch questions where correct_answer IS NOT NULL
// ----------------------------------------------------------------------

export async function fetchSolvedSprintQuestions(): Promise<BankQuestion[]> {
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

  try {
    // Exact specification: Query logic: Fetch ONLY questions where correct_answer IS NOT NULL
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .not('correct_answer', 'is', null)
      .eq('subject', 'gk');

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const rawAns = (row.correct_answer || '').toString().trim().toUpperCase();
        return {
          id: row.id,
          subject: 'gk',
          category: row.category || 'CLAT Speed-Run',
          subtopic: row.subtopic || 'Current Affairs',
          text: row.question || row.text || '',
          options: [
            row.option_a || 'Option A',
            row.option_b || 'Option B',
            row.option_c || 'Option C',
            row.option_d || 'Option D',
          ],
          correct_answer: rawAns,
          correctOptionIndex: letterMap[rawAns] ?? 0,
          explanation: row.explanation || 'Verified answer from squad key.',
          difficulty: (row.difficulty as any) || 'Moderate',
          source: row.source || 'Squad Solved Key',
          isVerified: true,
          extraNotes: row.extra_notes,
          verified_by: row.verified_by,
        };
      });
    }
  } catch (err) {
    console.warn('Supabase fetchSolvedSprintQuestions error:', err);
  }

  // Fallback to verified questions where correct_answer is known
  return fallbackBankQuestions.filter((q) => q.subject === 'gk' && q.correctOptionIndex !== null);
}

// ----------------------------------------------------------------------
// 5. QUESTION BANK DIRECTORY
// ----------------------------------------------------------------------

export async function fetchBankQuestions(subject: SubjectType = 'gk'): Promise<BankQuestion[]> {
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', subject);

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const rawAns = (row.correct_answer || '').toString().trim().toUpperCase();
        return {
          id: row.id,
          subject: (row.subject as SubjectType) || subject,
          category: row.category || 'General Preparation',
          subtopic: row.subtopic || 'Current Affairs',
          text: row.question || row.text || '',
          options: [
            row.option_a || 'Option A',
            row.option_b || 'Option B',
            row.option_c || 'Option C',
            row.option_d || 'Option D',
          ],
          correct_answer: rawAns || null,
          correctOptionIndex: letterMap[rawAns] ?? 0,
          explanation: row.explanation || 'Verified answer rationale.',
          difficulty: (row.difficulty as any) || 'Moderate',
          source: row.source || 'National Digest',
          isVerified: !!row.correct_answer,
          type: (row.type as any) || 'current',
          extraNotes: row.extra_notes,
        };
      });
    }
  } catch {}

  return fallbackBankQuestions.filter((q) => q.subject === subject);
}

export const fetchSprintQuestions = fetchSolvedSprintQuestions;

// ----------------------------------------------------------------------
// 6. LIVE LEADERBOARD
// ----------------------------------------------------------------------

export async function fetchLiveLeaderboard(activeUsername: string): Promise<LeaderboardUser[]> {
  const squadMembers: SquadMember[] = ['Avni', 'Sadvitha', 'Samad', 'Shourya'];

  try {
    const { data, error } = await supabase
      .from('user_attempts')
      .select('user_name, is_correct');

    if (!error && data && data.length > 0) {
      const statsMap: Record<string, { total: number; correct: number }> = {};
      data.forEach((row) => {
        const u = row.user_name || 'Anonymous';
        if (!statsMap[u]) statsMap[u] = { total: 0, correct: 0 };
        statsMap[u].total += 1;
        if (row.is_correct) statsMap[u].correct += 1;
      });

      return squadMembers
        .map((name) => {
          const stats = statsMap[name];
          const benchmark = initialLeaderboard.find((u) => u.name === name);
          const solved = stats ? stats.total : benchmark ? benchmark.solvedCount : 0;
          const accuracy =
            stats && stats.total > 0
              ? Math.round((stats.correct / stats.total) * 1000) / 10
              : benchmark
              ? benchmark.accuracy
              : 92.0;

          return {
            id: `u-${name.toLowerCase()}`,
            name,
            isCurrentUser: name === activeUsername,
            solvedCount: solved,
            accuracy,
            streak: benchmark ? benchmark.streak : 5,
            status: 'online' as const,
            color: SQUAD_MEMBERS[name].color,
          };
        })
        .sort((a, b) => b.solvedCount - a.solvedCount);
    }
  } catch (err) {
    console.error('Error calculating leaderboard from Supabase:', err);
  }

  return initialLeaderboard.map((u) => ({
    ...u,
    isCurrentUser: u.name === activeUsername,
    color: SQUAD_MEMBERS[u.name as SquadMember]?.color || '#34d399',
  }));
}

// ----------------------------------------------------------------------
// 7. DRILL PASSAGES
// ----------------------------------------------------------------------

export async function fetchDrillPassages(selectedSubject: SubjectType): Promise<Passage[]> {
  const filtered = fallbackPassages.filter((p) => p.subjectType === selectedSubject);
  return filtered.length > 0 ? filtered : fallbackPassages;
}

export async function recordUserAttempt(
  userName: string,
  questionId: string,
  selectedOption: string,
  isCorrect: boolean,
  extraNotes?: string
): Promise<boolean> {
  try {
    const payload: Record<string, any> = {
      user_name: userName,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      attempted_at: new Date().toISOString(),
    };
    if (extraNotes) payload.extra_notes = extraNotes;
    const { error } = await supabase.from('user_attempts').insert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSharedNotes(): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('shared_notes')
      .select('content')
      .eq('id', 'global_dump')
      .maybeSingle();
    return data?.content ?? null;
  } catch {
    return null;
  }
}

export async function saveSharedNotes(content: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('shared_notes')
      .upsert({ id: 'global_dump', content, updated_at: now });
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------
// 8. DETERMINISTIC IMPORT BATCH COMMIT TO SUPABASE
// ----------------------------------------------------------------------

export interface CommitImportResult {
  success: boolean;
  insertedCount: number;
  passageId?: string;
  error?: string;
}

export async function commitImportBatch(
  importData: {
    destination: 'gk_qb_mocks' | 'gk_qb_current' | 'quants_caselet' | 'ar_puzzle' | string;
    passage?: {
      id: string;
      title: string;
      text: string;
      wordCount: number;
      readTimeMinutes: number;
      source: string;
    };
    questions: Array<{
      id: string;
      questionNumber: number;
      prompt: string;
      options: string[];
      correctAnswer: 'A' | 'B' | 'C' | 'D' | null;
      explanation: string;
      category?: string;
      subtopic?: string;
      difficulty?: 'Easy' | 'Moderate' | 'Hard';
      source?: string;
    }>;
  }
): Promise<CommitImportResult> {
  const { destination, passage, questions } = importData;

  try {
    const isPassageBased = destination === 'quants_caselet' || destination === 'ar_puzzle';
    let createdPassageId: string | undefined = undefined;

    // 1. If QT or AR, insert passage first
    if (isPassageBased && passage) {
      createdPassageId = passage.id;
      const subject = destination === 'quants_caselet' ? 'quants' : 'analytical';

      // Insert passage into passages table
      const { error: passageError } = await supabase.from('passages').upsert({
        id: passage.id,
        title: passage.title,
        text: passage.text,
        content: passage.text,
        subject: subject,
        subject_type: subject,
        word_count: passage.wordCount,
        read_time_minutes: passage.readTimeMinutes,
        source: passage.source,
        created_at: new Date().toISOString(),
      });

      if (passageError) {
        console.warn('Warning: Could not insert passage to passages table:', passageError);
      }
    }

    // 2. Prepare questions payload
    let subject: SubjectType = 'gk';
    if (destination === 'quants_caselet') subject = 'quants';
    else if (destination === 'ar_puzzle') subject = 'analytical';

    const typeMap: Record<string, string> = {
      gk_qb_mocks: 'mocks',
      gk_qb_current: 'current',
      quants_caselet: 'drill',
      ar_puzzle: 'drill',
    };

    const questionRows = questions.map((q) => {
      return {
        id: q.id,
        subject: subject,
        type: typeMap[destination] || 'current',
        question: q.prompt,
        text: q.prompt,
        option_a: q.options[0] || '',
        option_b: q.options[1] || '',
        option_c: q.options[2] || '',
        option_d: q.options[3] || '',
        correct_answer: q.correctAnswer || null,
        explanation: q.explanation || 'Verified rationale.',
        category: q.category || (subject === 'gk' ? 'General Knowledge' : subject === 'quants' ? 'Quantitative Techniques' : 'Analytical Reasoning'),
        subtopic: q.subtopic || 'Practice Drill',
        difficulty: q.difficulty || 'Moderate',
        source: q.source || (passage ? passage.source : 'Manual Import'),
        verification_status: 'verified',
        passage_id: createdPassageId || null,
        created_at: new Date().toISOString(),
      };
    });

    // 3. Batch insert questions directly into Supabase questions table
    const { error: questionsError, count } = await supabase
      .from('questions')
      .upsert(questionRows);

    if (questionsError) {
      console.error('Error inserting questions to Supabase:', questionsError);
      return {
        success: false,
        insertedCount: 0,
        error: questionsError.message || 'Failed to insert questions into Supabase',
      };
    }

    return {
      success: true,
      insertedCount: count ?? questionRows.length,
      passageId: createdPassageId,
    };
  } catch (err: any) {
    console.error('Unexpected exception during import commit:', err);
    return {
      success: false,
      insertedCount: 0,
      error: err?.message || 'Unexpected network or database failure',
    };
  }
}

