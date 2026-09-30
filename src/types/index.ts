export type SubjectType = 'gk' | 'quants' | 'analytical';

export type GKSubTab = 'topics' | 'qb' | 'oneliners';

export type TabType = GKSubTab | string;

export type SquadMember = 'Avni' | 'Sadvitha' | 'Samad' | 'Shourya';

export interface SquadMemberInfo {
  name: SquadMember;
  color: string; // hex
  borderClass: string;
  bgClass: string;
  textClass: string;
  avatar: string;
}

export const SQUAD_MEMBERS: Record<SquadMember, SquadMemberInfo> = {
  Avni: {
    name: 'Avni',
    color: '#38bdf8', // Sky Blue
    borderClass: 'border-sky-400',
    bgClass: 'bg-sky-950/40',
    textClass: 'text-sky-400',
    avatar: 'A',
  },
  Sadvitha: {
    name: 'Sadvitha',
    color: '#c084fc', // Violet
    borderClass: 'border-violet-400',
    bgClass: 'bg-violet-950/40',
    textClass: 'text-violet-400',
    avatar: 'S',
  },
  Samad: {
    name: 'Samad',
    color: '#34d399', // Emerald
    borderClass: 'border-emerald-400',
    bgClass: 'bg-emerald-950/40',
    textClass: 'text-emerald-400',
    avatar: 'S',
  },
  Shourya: {
    name: 'Shourya',
    color: '#fbbf24', // Amber
    borderClass: 'border-amber-400',
    bgClass: 'bg-amber-950/40',
    textClass: 'text-amber-400',
    avatar: 'S',
  },
};

export interface LeaderboardUser {
  id: string;
  name: SquadMember | string;
  isCurrentUser: boolean;
  solvedCount: number;
  accuracy: number;
  streak: number;
  status: 'online' | 'idle';
  color?: string;
}

export type QuestionDifficulty = 'Easy' | 'Moderate' | 'Hard';

export interface BankQuestion {
  id: string;
  subject: SubjectType;
  category: string;
  subtopic: string;
  text: string;
  options: string[];
  correctOptionIndex?: number | null;
  correct_answer?: string | null;
  explanation: string;
  difficulty: QuestionDifficulty;
  source: string;
  passageId?: string;
  isVerified: boolean;
  type?: 'mocks' | 'current';
  extraNotes?: string;
  lastAttemptedAt?: string;
  lockedBy?: string | null;
  lockedAt?: string | null;
  verified_by?: string | null;
}

export type SprintQuestion = BankQuestion;

export interface PassageQuestion {
  id: string;
  questionNumber: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  isVerified: boolean;
}

export interface Passage {
  id: string;
  title: string;
  subjectType: SubjectType;
  subject: string;
  source: string;
  wordCount: number;
  readTimeMinutes: number;
  text: string;
  tableData?: { headers: string[]; rows: (string | number)[][] };
  questions: PassageQuestion[];
}

export type TopicStatus = 'pending' | 'in_progress' | 'mastered';

export interface SyllabusTopic {
  id: string;
  subject: SubjectType;
  month: string;
  title: string;
  category: string;
  status: TopicStatus;
  keyPoints?: string[];
  notes?: string;
  isCompleted?: boolean;
}

export interface UserAttempt {
  id?: string;
  userName: string;
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  attemptedAt?: string;
  extraNotes?: string;
}

