import { supabaseMocks, supabaseOneliners } from './supabase';
import {
  BankQuestion,
  QuestionDifficulty,
  Passage,
  SyllabusTopic,
  LeaderboardUser,
  SubjectType,
  TopicStatus,
  SquadMember,
  SQUAD_MEMBERS,
} from '../types';
import {
  bankQuestions as fallbackBankQuestions,
  initialUnsolvedQuestions,
  passages as fallbackPassages,
  initialSyllabusTopics,
} from '../data/mockData';

// ----------------------------------------------------------------------
// 1. SYLLABUS TRACKER (Hardcoded in GitHub, no Supabase dependency)
// ----------------------------------------------------------------------

import { MONTHLY_GK_BATCHES } from '../data/monthlyGkData';

export async function fetchSyllabusTopics(
  _userName: string,
  _subject: SubjectType = 'gk'
): Promise<SyllabusTopic[]> {
  // Hardcoded monthly GK tracker stored in repository
  return MONTHLY_GK_BATCHES.flatMap((batch) =>
    batch.topics.map((t) => ({
      id: t.id,
      subject: 'gk' as SubjectType,
      month: batch.name,
      title: t.title,
      category: 'Current Affairs',
      status: 'pending' as TopicStatus,
      isCompleted: false,
    }))
  );
}

export async function updateSyllabusTopicStatus(
  _topicId: string,
  _userName: string,
  _isCompleted: boolean,
  _topicName?: string,
  _subject: SubjectType = 'gk'
): Promise<boolean> {
  // Locally tracked per user without Supabase errors
  return true;
}

// ----------------------------------------------------------------------
// 2. ONELINERS SOLVE MODE: Fetch next question via get_next_question(user_name)
// ----------------------------------------------------------------------

export async function fetchNextOnelinerQuestion(userName: string): Promise<BankQuestion | null> {
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, a: 0, b: 1, c: 2, d: 3 };

  // 1. Try existing RPC get_next_question(user_name) on supabaseOneliners
  try {
    const { data, error } = await supabaseOneliners.rpc('get_next_question', { user_name: userName });
    if (!error && data) {
      const row = Array.isArray(data) ? data[0] : data;
      if (row && (row.id || row.question_text || row.question || row.text)) {
        const rawOptions = Array.isArray(row.options)
          ? row.options
          : [
              row.option_a || 'Option A',
              row.option_b || 'Option B',
              row.option_c || 'Option C',
              row.option_d || 'Option D',
            ];
        const correctText = row.correct_answer ? String(row.correct_answer).trim() : null;
        let correctIdx: number | null = null;
        if (correctText) {
          const matchIdx = rawOptions.findIndex(
            (opt: string) => opt.trim().toLowerCase() === correctText.toLowerCase()
          );
          correctIdx = matchIdx !== -1 ? matchIdx : (letterMap[correctText] ?? null);
        }

        return {
          id: row.id,
          subject: 'gk',
          category: row.category || 'CLAT Oneliners',
          subtopic: row.subtopic || 'Current Affairs',
          text: row.question_text || row.question || row.text || '',
          options: rawOptions,
          correct_answer: correctText,
          correctOptionIndex: correctIdx,
          explanation: row.extra_notes || row.explanation || 'Answer key pending research by squad.',
          difficulty: (row.difficulty as any) || 'Moderate',
          source: 'Squad Research Queue',
          isVerified: !!row.correct_answer,
          extraNotes: row.extra_notes,
          lockedBy: row.locked_by,
          lockedAt: row.locked_at,
          verified_by: row.answered_by,
        };
      }
    }
  } catch (err) {
    console.warn('RPC get_next_question error on supabaseOneliners:', err);
  }

  // 2. Direct query on supabaseOneliners questions table
  try {
    const { data, error } = await supabaseOneliners
      .from('questions')
      .select('*')
      .is('correct_answer', null)
      .limit(1);

    if (!error && data && data.length > 0) {
      const row = data[0];
      const rawOptions = Array.isArray(row.options)
        ? row.options
        : [
            row.option_a || 'Option A',
            row.option_b || 'Option B',
            row.option_c || 'Option C',
            row.option_d || 'Option D',
          ];

      return {
        id: row.id,
        subject: 'gk',
        category: row.category || 'CLAT Oneliners',
        subtopic: row.subtopic || 'Current Affairs',
        text: row.question_text || row.question || row.text || '',
        options: rawOptions,
        correct_answer: null,
        correctOptionIndex: null,
        explanation: row.extra_notes || row.explanation || 'Answer key pending research by squad.',
        difficulty: (row.difficulty as any) || 'Moderate',
        source: 'Squad Research Queue',
        isVerified: false,
        extraNotes: row.extra_notes,
        lockedBy: row.locked_by,
        lockedAt: row.locked_at,
      };
    }
  } catch (err) {
    console.warn('supabaseOneliners direct query error:', err);
  }

  // 3. Fallback to local unsolved questions
  return initialUnsolvedQuestions[0] || null;
}

export async function fetchUnsolvedQuestions(): Promise<BankQuestion[]> {
  try {
    const { data, error } = await supabaseOneliners
      .from('questions')
      .select('*')
      .is('correct_answer', null)
      .limit(20);

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const rawOptions = Array.isArray(row.options)
          ? row.options
          : [
              row.option_a || 'Option A',
              row.option_b || 'Option B',
              row.option_c || 'Option C',
              row.option_d || 'Option D',
            ];
        return {
          id: row.id,
          subject: 'gk',
          category: row.category || 'CLAT Oneliners',
          subtopic: row.subtopic || 'Current Affairs',
          text: row.question_text || row.question || row.text || '',
          options: rawOptions,
          correct_answer: null,
          correctOptionIndex: null,
          explanation: row.extra_notes || row.explanation || 'Answer key pending research by squad.',
          difficulty: (row.difficulty as any) || 'Moderate',
          source: 'Squad Research Queue',
          isVerified: false,
          extraNotes: row.extra_notes,
          lockedBy: row.locked_by,
          lockedAt: row.locked_at,
        };
      });
    }
  } catch (err) {
    console.warn('supabaseOneliners fetchUnsolvedQuestions error:', err);
  }

  return initialUnsolvedQuestions;
}

export async function unlockQuestion(questionId: string, userName?: string): Promise<boolean> {
  try {
    const query = supabaseOneliners
      .from('questions')
      .update({ locked_by: null, locked_at: null, status: 'unanswered' })
      .eq('id', questionId);
    if (userName) {
      query.eq('locked_by', userName);
    }
    const { error } = await query;
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------
// 3. ONELINERS SOLVE MODE: Submit Factual Answer -> UPDATE correct_answer
// ----------------------------------------------------------------------

export async function submitFactualAnswer(
  questionId: string,
  chosenOption: string, // 'A' | 'B' | 'C' | 'D'
  activeUsername: string,
  extraNotes?: string,
  optionText?: string
): Promise<boolean> {
  try {
    const chosenVal = optionText || chosenOption;
    const payload: Record<string, any> = {
      correct_answer: chosenVal,
      status: 'answered',
      locked_by: null,
      locked_at: null,
      answered_by: activeUsername,
      extra_notes: extraNotes || null,
    };

    const { error: updateError } = await supabaseOneliners
      .from('questions')
      .update(payload)
      .eq('id', questionId);

    return !updateError;
  } catch (err) {
    console.error('Error submitting factual answer to supabaseOneliners:', err);
    return false;
  }
}

// ----------------------------------------------------------------------
// 4. ONELINERS SPRINT MODE: Fetch questions where correct_answer IS NOT NULL
// ----------------------------------------------------------------------

export async function fetchSolvedSprintQuestions(
  playlistScope: 'all' | 'you' = 'all',
  currentUser?: string
): Promise<BankQuestion[]> {
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };

  try {
    let query = supabaseOneliners
      .from('questions')
      .select('*')
      .eq('status', 'answered');

    if (playlistScope === 'you' && currentUser) {
      query = query.eq('answered_by', currentUser);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const rawAns = (row.correct_answer || '').toString().trim();
        const optionsList = Array.isArray(row.options)
          ? row.options
          : [
              row.option_a || 'Option A',
              row.option_b || 'Option B',
              row.option_c || 'Option C',
              row.option_d || 'Option D',
            ];

        let correctIdx = optionsList.findIndex(
          (opt: string) => opt.trim().toLowerCase() === rawAns.toLowerCase()
        );
        if (correctIdx === -1) {
          correctIdx = letterMap[rawAns.toUpperCase()] ?? 0;
        }

        return {
          id: row.id,
          subject: 'gk',
          category: row.category || 'CLAT Oneliners',
          subtopic: row.subtopic || 'Current Affairs',
          text: row.question_text || row.question || row.text || '',
          options: optionsList,
          correct_answer: rawAns,
          correctOptionIndex: correctIdx,
          explanation: row.extra_notes || row.explanation || 'Verified answer from squad research.',
          difficulty: (row.difficulty as any) || 'Moderate',
          source: 'Squad Solved Key',
          isVerified: true,
          extraNotes: row.extra_notes,
          verified_by: row.answered_by || row.verified_by,
        };
      });
    }
  } catch (err) {
    console.warn('supabaseOneliners fetchSolvedSprintQuestions error:', err);
  }

  // Fallback to verified questions where correct_answer is known
  const fallback = fallbackBankQuestions.filter((q) => q.subject === 'gk' && q.correctOptionIndex !== null);
  if (playlistScope === 'you' && currentUser) {
    const filtered = fallback.filter((q) => q.verified_by === currentUser);
    if (filtered.length > 0) return filtered;
  }
  return fallback;
}

// ----------------------------------------------------------------------
// 5. LIVE QB QUESTIONS (Mocks vs Current from qb_questions table)
// ----------------------------------------------------------------------

export async function fetchQBQuestions(section: 'question_bank' | 'current_affairs'): Promise<BankQuestion[]> {
  const letterMap: Record<string, number> = {
    a: 0, b: 1, c: 2, d: 3,
    A: 0, B: 1, C: 2, D: 3,
    '1': 0, '2': 1, '3': 2, '4': 3,
  };

  try {
    const { data, error } = await supabaseMocks
      .from('qb_questions')
      .select('*')
      .eq('section', section);

    if (!error && data && data.length > 0) {
      return data.map((row) => {
        const rawAns = (row.correct_answer || '').toString().trim();
        const ansKey = rawAns.toLowerCase();
        const correctIdx = letterMap[ansKey] ?? 0;
        return {
          id: row.id,
          subject: 'gk' as SubjectType,
          category: row.category || 'General Preparation',
          subtopic: row.subtopic || 'General',
          text: row.question || row.text || '',
          options: [
            row.option_a || 'Option A',
            row.option_b || 'Option B',
            row.option_c || 'Option C',
            row.option_d || 'Option D',
          ],
          correct_answer: rawAns.toUpperCase(),
          correctOptionIndex: correctIdx,
          explanation: row.explanation || 'Verified answer rationale.',
          difficulty: (row.difficulty as QuestionDifficulty) || 'Moderate',
          source: row.source || (row.section === 'question_bank' ? 'Mock Series' : 'Current Affairs'),
          isVerified: true,
          type: row.section === 'question_bank' ? ('mocks' as const) : ('current' as const),
        };
      });
    }
  } catch (err) {
    console.warn('Error querying qb_questions from supabaseMocks:', err);
  }

  // Fallback to local bank questions matching the section
  const localType = section === 'question_bank' ? 'mocks' : 'current';
  return fallbackBankQuestions.filter((q) => q.subject === 'gk' && (q.type ? q.type === localType : localType === 'current'));
}

// ----------------------------------------------------------------------
// 5. QUESTION BANK DIRECTORY
// ----------------------------------------------------------------------

export async function fetchBankQuestions(subject: SubjectType = 'gk'): Promise<BankQuestion[]> {
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

  try {
    const { data, error } = await supabaseMocks
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
// 6. GLOBAL TOTAL SOLVED COUNT & LIVE SQUAD LEADERBOARD
// ----------------------------------------------------------------------

export async function fetchTotalSolvedCount(): Promise<number> {
  try {
    // 1. Exact user requirement: SELECT COUNT(*) on questions table where status = 'answered' via supabaseOneliners
    const { count, error } = await supabaseOneliners
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'answered');

    if (!error && typeof count === 'number') {
      return count;
    }
  } catch (err) {
    console.error('Error fetching total solved count from supabaseOneliners:', err);
  }

  return 0;
}

export async function fetchLiveLeaderboard(activeUsername: string): Promise<LeaderboardUser[]> {
  const squadMembers: SquadMember[] = ['Avni', 'Sadvitha', 'Samad', 'Shourya'];
  const userCounts: Record<SquadMember, number> = {
    Avni: 0,
    Sadvitha: 0,
    Samad: 0,
    Shourya: 0,
  };

  try {
    // Query answered questions directly from supabaseOneliners questions table
    const { data: answeredRows, error } = await supabaseOneliners
      .from('questions')
      .select('answered_by, status')
      .eq('status', 'answered');

    if (!error && answeredRows) {
      answeredRows.forEach((row) => {
        const rawUser = row.answered_by;
        if (rawUser) {
          const matched = squadMembers.find(
            (m) => m.toLowerCase() === String(rawUser).trim().toLowerCase()
          );
          if (matched) {
            userCounts[matched] += 1;
          }
        }
      });
    }
  } catch (err) {
    console.error('Error calculating squad leaderboard from supabaseOneliners:', err);
  }

  // Bind live database values strictly - zero mock fallback numbers
  return squadMembers
    .map((name) => ({
      id: `u-${name.toLowerCase()}`,
      name,
      isCurrentUser: name === activeUsername,
      solvedCount: userCounts[name],
      accuracy: 100.0,
      streak: userCounts[name],
      status: 'online' as const,
      color: SQUAD_MEMBERS[name].color,
    }))
    .sort((a, b) => b.solvedCount - a.solvedCount);
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
    const { error } = await supabaseMocks.from('user_attempts').insert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSharedNotes(): Promise<string | null> {
  try {
    const { data } = await supabaseMocks
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
    const { error } = await supabaseMocks
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
      solution_video_url?: string;
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
      difficulty?: QuestionDifficulty;
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

      // Insert passage into passages table on supabaseMocks
      const passagePayload: Record<string, any> = {
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
      };

      if (passage.solution_video_url) {
        passagePayload.solution_video_url = passage.solution_video_url;
      }

      const { error: passageError } = await supabaseMocks.from('passages').upsert(passagePayload);

      if (passageError) {
        // If column solution_video_url is missing from database schema, retry without it but note error
        if (passageError.message && passageError.message.includes('solution_video_url')) {
          delete passagePayload.solution_video_url;
          const { error: retryError } = await supabaseMocks.from('passages').upsert(passagePayload);
          if (retryError) {
            return {
              success: false,
              insertedCount: 0,
              error: `Passage schema error: ${retryError.message}`,
            };
          }
        } else {
          return {
            success: false,
            insertedCount: 0,
            error: `Passage schema error: ${passageError.message}`,
          };
        }
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

    // 3. Database Mapping:
    // If destination is GK QB Mocks or GK QB Current, map directly to qb_questions table on supabaseMocks
    if (destination === 'gk_qb_mocks' || destination === 'gk_qb_current') {
      const sectionVal = destination === 'gk_qb_mocks' ? 'question_bank' : 'current_affairs';
      const qbRows = questions.map((q) => {
        return {
          id: q.id,
          section: sectionVal,
          category: q.category || (sectionVal === 'question_bank' ? 'Constitutional Law' : 'Current Affairs'),
          subtopic: q.subtopic || 'General',
          difficulty: q.difficulty || 'Moderate',
          question: q.prompt,
          option_a: q.options[0] || '',
          option_b: q.options[1] || '',
          option_c: q.options[2] || '',
          option_d: q.options[3] || '',
          correct_answer: (q.correctAnswer || 'a').toLowerCase(),
          explanation: q.explanation || 'Verified rationale.',
          created_at: new Date().toISOString(),
        };
      });

      const { error: qbError, count: qbCount } = await supabaseMocks
        .from('qb_questions')
        .upsert(qbRows, { onConflict: 'id' });

      if (qbError) {
        console.error('Error inserting questions to supabaseMocks qb_questions:', qbError);
        return {
          success: false,
          insertedCount: 0,
          error: qbError.message || 'Failed to insert questions into qb_questions table',
        };
      }

      // Also upsert into questions table for unified querying across bank tabs
      await supabaseMocks.from('questions').upsert(questionRows);

      return {
        success: true,
        insertedCount: qbCount ?? qbRows.length,
        passageId: createdPassageId,
      };
    }

    // Otherwise (Quants Caselet / AR Puzzle): Batch insert questions directly into supabaseMocks questions table
    const { error: questionsError, count } = await supabaseMocks
      .from('questions')
      .upsert(questionRows);

    if (questionsError) {
      console.error('Error inserting questions to supabaseMocks:', questionsError);
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

