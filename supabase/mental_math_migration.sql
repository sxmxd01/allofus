-- ============================================================================
-- MENTAL MATH TRAINING MODULE: DUAL-CLIENT ARCHITECTURE MIGRATION
-- ============================================================================

-- ============================================================================
-- 1. CLIENT A: USER CLIENT (User / Auth State, Logs & Analytics)
-- Database Project: Client A (e.g. Supabase User/Auth Project)
-- ============================================================================

-- User Mental Math Logs: tracks completion times, penalty flags (+5s/+10s), and set outcomes
CREATE TABLE IF NOT EXISTS public.user_mental_math_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    level INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    math_prompt TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    time_spent_ms INTEGER NOT NULL,
    time_limit_sec INTEGER NOT NULL DEFAULT 10,
    penalty_flag TEXT NOT NULL DEFAULT 'none' CHECK (penalty_flag IN ('none', 'reduced', 'zero')),
    set_status TEXT NOT NULL DEFAULT 'passed' CHECK (set_status IN ('passed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast user aggregation and leaderboard queries
CREATE INDEX IF NOT EXISTS idx_user_math_logs_user ON public.user_mental_math_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_user_math_logs_level ON public.user_mental_math_logs(level, set_number);
CREATE INDEX IF NOT EXISTS idx_user_math_logs_created ON public.user_mental_math_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_mental_math_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon users to insert their training logs
CREATE POLICY "Allow public inserts into user_mental_math_logs"
    ON public.user_mental_math_logs
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow reading logs
CREATE POLICY "Allow public select on user_mental_math_logs"
    ON public.user_mental_math_logs
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Global Analytics RPC: Factor in math training speed & accuracy
CREATE OR REPLACE FUNCTION public.update_global_math_analytics(
    p_user_name TEXT,
    p_level INTEGER,
    p_set_number INTEGER,
    p_passed BOOLEAN,
    p_avg_time_ms INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_sets_cleared INTEGER;
    v_avg_speed_ms INTEGER;
    v_accuracy NUMERIC;
    v_result JSONB;
BEGIN
    -- Aggregate stats for this user across all sets
    SELECT 
        COUNT(DISTINCT level || '_' || set_number) FILTER (WHERE set_status = 'passed'),
        COALESCE(AVG(time_spent_ms) FILTER (WHERE is_correct = true), 0)::INTEGER,
        ROUND((COUNT(*) FILTER (WHERE is_correct = true)::NUMERIC / GREATEST(COUNT(*), 1)::NUMERIC) * 100, 1)
    INTO 
        v_total_sets_cleared,
        v_avg_speed_ms,
        v_accuracy
    FROM public.user_mental_math_logs
    WHERE user_name = p_user_name;

    v_result := jsonb_build_object(
        'user_name', p_user_name,
        'current_level', p_level,
        'total_sets_cleared', v_total_sets_cleared,
        'avg_speed_ms', v_avg_speed_ms,
        'accuracy_pct', v_accuracy,
        'updated_at', NOW()
    );

    RETURN v_result;
END;
$$;


-- ============================================================================
-- 2. CLIENT B: CONTENT CLIENT (Admin Data, Curated Levels & Sets)
-- Database Project: Client B (e.g. Supabase Content/Mocks Project)
-- ============================================================================

-- Math Levels: 100 levels with curriculum metadata and win criteria
CREATE TABLE IF NOT EXISTS public.math_levels (
    id TEXT PRIMARY KEY, -- e.g. 'level_1', 'level_2'
    level_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Speed Arithmetic',
    description TEXT,
    required_sets_to_pass INTEGER NOT NULL DEFAULT 2,
    total_sets INTEGER NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_math_levels_num ON public.math_levels(level_number);

-- Math Sets: 6-10 rapid-fire sets per level containing questions and Mermaid thought processes
CREATE TABLE IF NOT EXISTS public.math_sets (
    id TEXT PRIMARY KEY, -- e.g. 'lvl_1_set_1'
    level_number INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    time_limit_seconds INTEGER NOT NULL DEFAULT 60,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_level_set UNIQUE (level_number, set_number)
);

CREATE INDEX IF NOT EXISTS idx_math_sets_level ON public.math_sets(level_number, set_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.math_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.math_sets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content
CREATE POLICY "Allow public select on math_levels"
    ON public.math_levels FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public select on math_sets"
    ON public.math_sets FOR SELECT TO anon, authenticated USING (true);

-- Allow upserting math content from deterministic ingestion pipeline
CREATE POLICY "Allow public upsert on math_levels"
    ON public.math_levels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public upsert on math_sets"
    ON public.math_sets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Math Questions: Question-level atomic records with isolated Mermaid syntax & markdown flow text
-- Columns: question, answer, flow_text, mermaid_syntax, level, set (along with level_number, set_number)
CREATE TABLE IF NOT EXISTS public.math_questions (
    id TEXT PRIMARY KEY, -- e.g. 'lvl1_s1_q1'
    level INTEGER,
    set INTEGER,
    level_number INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    question_number INTEGER NOT NULL DEFAULT 1,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    flow_text TEXT NOT NULL DEFAULT '',
    mermaid_syntax TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_math_questions_level_set ON public.math_questions(level_number, set_number);
CREATE INDEX IF NOT EXISTS idx_math_questions_level ON public.math_questions(level_number);
CREATE INDEX IF NOT EXISTS idx_math_questions_lvl_st ON public.math_questions(level, set);

ALTER TABLE public.math_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on math_questions"
    ON public.math_questions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public upsert on math_questions"
    ON public.math_questions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
