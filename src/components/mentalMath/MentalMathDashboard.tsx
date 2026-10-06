import React, { useState, useEffect, useRef } from 'react';
import { MathLevel, UserMentalMathStats, ParseIngestResult } from '../../types/mentalMath';
import {
  getUserMentalMathStats,
  fetchMathLevels,
  upsertMathContentBatches,
  onContentCacheInvalidated,
} from '../../lib/dualSupabase';
import {
  parseDeterministicMathData,
  getLevelMetadata,
} from '../../utils/mentalMathParser';
import { getParsedMentalMath } from '../../utils/parseMentalMath';
import { sounds } from '../../utils/sound';
import {
  Zap,
  Award,
  Upload,
  BrainCircuit,
  Lock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';

interface MentalMathDashboardProps {
  activeUsername: string;
  onStartZenMode: (levelNumber: number, setNumber?: number) => void;
}

export const MentalMathDashboard: React.FC<MentalMathDashboardProps> = ({
  activeUsername,
  onStartZenMode,
}) => {
  const [stats, setStats] = useState<UserMentalMathStats>(() =>
    getUserMentalMathStats(activeUsername)
  );
  const [levels, setLevels] = useState<MathLevel[]>([]);
  const [tierFilter, setTierFilter] = useState<number>(1); // 1: 1-20, 2: 21-40, etc.

  // Modals State
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingestText, setIngestText] = useState('');
  const [parseResult, setParseResult] = useState<ParseIngestResult | null>(null);
  const [isUpserting, setIsUpserting] = useState(false);
  const [ingestToast, setIngestToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load levels directly from database
  const loadLevelsData = async () => {
    const fetched = await fetchMathLevels();
    setLevels(fetched);
  };

  useEffect(() => {
    loadLevelsData();
  }, []);

  // Sync latest stats & listen for live content cache invalidations
  useEffect(() => {
    const s = getUserMentalMathStats(activeUsername);
    setStats(s);

    const unsubscribe = onContentCacheInvalidated(() => {
      loadLevelsData();
      const updated = getUserMentalMathStats(activeUsername);
      setStats(updated);
    });

    return () => unsubscribe();
  }, [activeUsername]);

  // Determine user's active progression and exact next set
  const activeLevel = stats.unlockedLevel || 1;
  const activeProgress = stats.levelProgress[activeLevel] || {
    passedSets: [],
    isUnlocked: true,
    isCompleted: false,
  };
  const passedSets = activeProgress.passedSets || [];

  let nextSet = 1;
  while (passedSets.includes(nextSet)) {
    nextSet++;
  }
  if (nextSet > 8 && passedSets.length < 8) {
    for (let s = 1; s <= 8; s++) {
      if (!passedSets.includes(s)) {
        nextSet = s;
        break;
      }
    }
  }

  // Direct Database Insertion on file upload: Writes directly to Supabase math_questions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      setIngestText(text);
      const res = parseDeterministicMathData(text);
      setParseResult(res);
      setIngestToast(null);

      if (res.sets.length > 0) {
        setIsUpserting(true);
        try {
          // Direct Database Insertion to Supabase Client B in batches of 50
          const upsertRes = await upsertMathContentBatches(res.levels, res.sets);
          if (upsertRes.success) {
            sounds.playCorrect();
            setIngestToast({ type: 'success', message: upsertRes.message });
            await loadLevelsData();
          } else {
            sounds.playIncorrect();
            setIngestToast({ type: 'error', message: upsertRes.message });
          }
        } catch (err: any) {
          sounds.playIncorrect();
          setIngestToast({
            type: 'error',
            message: err?.message || 'Direct Supabase insertion failed.',
          });
        } finally {
          setIsUpserting(false);
        }
      }
    };
    reader.readAsText(file);
  };

  // Test regex parser
  const handleParseText = () => {
    const res = parseDeterministicMathData(ingestText);
    setParseResult(res);
  };

  // Direct database insertion to Client B in 50-item batches
  const handleUpsertBatches = async () => {
    if (!parseResult && ingestText) {
      const parsed = parseDeterministicMathData(ingestText);
      setParseResult(parsed);
      if (parsed.sets.length === 0) return;
    }

    const currentResult = parseResult || parseDeterministicMathData(ingestText);
    if (!currentResult || currentResult.sets.length === 0) return;

    sounds.playClick();
    setIsUpserting(true);
    setIngestToast(null);

    try {
      const res = await upsertMathContentBatches(currentResult.levels, currentResult.sets);
      if (res.success) {
        sounds.playCorrect();
        setIngestToast({ type: 'success', message: res.message });
        await loadLevelsData();
      } else {
        sounds.playIncorrect();
        setIngestToast({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      sounds.playIncorrect();
      setIngestToast({ type: 'error', message: e?.message || 'Failed to upsert to Client B.' });
    } finally {
      setIsUpserting(false);
    }
  };

  // Filter levels for curriculum modal
  const tierMin = (tierFilter - 1) * 20 + 1;
  const tierMax = tierFilter * 20;
  const displayedLevels = levels.filter(
    (l) => l.levelNumber >= tierMin && l.levelNumber <= tierMax
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 font-sans select-none text-main space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP HEADER: BRAND + DISCRETE ADMIN TOOLS              */}
      {/* Clean, minimalist terminal Zen style without junk fields */}
      {/* ======================================================== */}
      <div className="bg-panel border border-border rounded-xl p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-accent/15 text-accent border border-accent/40 font-mono text-[10px] uppercase font-bold tracking-wider">
                QT
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-main tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-accent" />
                <span>Mental Math Arena</span>
              </h1>
            </div>
            <p className="text-xs text-muted max-w-xl leading-relaxed">
              Rapid mental arithmetic. Type exact values directly.
            </p>
          </div>

          {/* Discrete Admin Tools in top right: Upload file + Zen Mode shortcut */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setShowIngestModal(true);
              }}
              className="px-3.5 py-2 text-xs font-mono text-muted hover:text-main bg-background border border-border hover:bg-hover rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Upload question file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload file</span>
            </button>

            <button
              onClick={() => {
                sounds.playCorrect();
                onStartZenMode(activeLevel, nextSet);
              }}
              style={{
                backgroundColor: 'var(--accent)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'var(--accent-text, #050505)',
              }}
              className="px-4 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
              title="Launch Zen Mode Directly"
            >
              <Zap className="w-3.5 h-3.5" style={{ fill: 'currentColor' }} />
              <span>Zen Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE UI STRIP-DOWN: ONE MASSIVE CENTRAL BUTTON         */}
      {/* If questions loaded: Enter Arena (Level X, Set Y)        */}
      {/* If error: Fatal error displayed (no auto-gen fallback)   */}
      {/* ======================================================== */}
      <div className="bg-panel border border-border rounded-2xl p-10 sm:p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-sm transition-colors">
        {getParsedMentalMath().fatalError ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center max-w-lg w-full p-6 border border-rose-800/80 bg-rose-950/20 rounded-xl">
            <span className="text-rose-500 font-mono font-bold text-xs tracking-wider uppercase">
              // FATAL DATA ERROR
            </span>
            <h2 className="text-xl font-mono font-bold text-white">Curriculum Files Not Found</h2>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              {getParsedMentalMath().fatalError}
            </p>
          </div>
        ) : levels.length > 0 ? (
          <>
            <button
              onClick={() => {
                sounds.playCorrect();
                onStartZenMode(activeLevel, nextSet);
              }}
              style={{
                backgroundColor: 'var(--accent)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'var(--accent-text, #050505)',
              }}
              className="group relative w-full max-w-xl py-7 sm:py-9 px-6 sm:px-12 rounded-2xl font-mono font-black text-xl sm:text-2xl md:text-3xl tracking-tight shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3.5 border border-border"
            >
              <span>Enter Arena (Level {activeLevel}, Set {nextSet})</span>
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3] group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>

            <div className="pt-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowCurriculumModal(true);
                }}
                className="text-xs sm:text-sm font-mono text-muted hover:text-accent underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View Curriculum</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md w-full">
            <button
              onClick={() => {
                sounds.playClick();
                setShowIngestModal(true);
              }}
              style={{
                backgroundColor: 'var(--accent)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'var(--accent-text, #050505)',
              }}
              className="group relative w-full py-7 sm:py-9 px-6 sm:px-12 rounded-2xl font-mono font-black text-xl sm:text-2xl md:text-3xl tracking-tight shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3.5 border border-border"
            >
              <Upload className="w-6 h-6 stroke-[3]" />
              <span>Waiting for upload</span>
            </button>

            <p className="text-xs text-muted font-mono leading-relaxed">
              No questions found. Click above to upload a Markdown (.md) questions file.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. MODAL OVERLAY: 100-LEVEL PROGRESSION CURRICULUM       */}
      {/* Kept out of sight, out of mind until link is clicked     */}
      {/* ======================================================== */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans select-none animate-in fade-in duration-150">
          <div className="w-full max-w-5xl bg-panel border border-border text-main rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <div>
                  <h2 className="text-base font-semibold text-main tracking-tight">
                    100-Level Mental Math Curriculum
                  </h2>
                  <p className="text-[11px] text-muted">
                    Browse roadmap milestones or jump directly into any unlocked level.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCurriculumModal(false)}
                className="text-muted hover:text-main text-xs p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tier Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 shrink-0">
              {[
                { tier: 1, label: 'Levels 1–20' },
                { tier: 2, label: 'Levels 21–40' },
                { tier: 3, label: 'Levels 41–60' },
                { tier: 4, label: 'Levels 61–80' },
                { tier: 5, label: 'Levels 81–100' },
              ].map((t) => (
                <button
                  key={t.tier}
                  onClick={() => {
                    sounds.playClick();
                    setTierFilter(t.tier);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                    tierFilter === t.tier
                      ? 'bg-hover text-main font-semibold border border-border'
                      : 'text-muted hover:text-main'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Grid of Levels */}
            {displayedLevels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto pr-1">
                {displayedLevels.map((lvl) => {
                  const isUnlocked = lvl.levelNumber <= (stats.unlockedLevel || 1);
                  const progress = stats.levelProgress[lvl.levelNumber];
                  const isCompleted = progress?.isCompleted || (progress?.passedSets?.length || 0) >= 2;

                  return (
                    <button
                      key={lvl.levelNumber}
                      onClick={() => {
                        if (isUnlocked) {
                          sounds.playClick();
                          setShowCurriculumModal(false);
                          onStartZenMode(lvl.levelNumber, 1);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                        isUnlocked
                          ? 'bg-background hover:bg-hover border-border hover:border-accent cursor-pointer'
                          : 'bg-background/40 border-border/40 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            backgroundColor: isCompleted ? 'var(--accent)' : undefined,
                            color: isCompleted ? 'var(--accent-text, #050505)' : undefined,
                          }}
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isCompleted
                              ? ''
                              : isUnlocked
                              ? 'bg-panel border border-border text-main'
                              : 'bg-panel/40 text-muted'
                          }`}
                        >
                          LVL {lvl.levelNumber}
                        </span>

                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        ) : !isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-muted" />
                        ) : (
                          <span className="text-[10px] font-mono text-accent">
                            {progress?.passedSets?.length || 0}/2 Wins
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold text-main line-clamp-1">{lvl.title}</h3>
                        <span className="text-[10px] text-muted font-mono block mt-0.5">{lvl.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center text-muted font-mono text-xs space-y-2">
                <p className="text-sm font-semibold text-main">Waiting for upload</p>
                <p>No questions or levels have been uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. UPLOAD QUESTIONS MODAL                                */}
      {/* Simple, clear, uncomplicated interface                    */}
      {/* ======================================================== */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans select-none animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-panel border border-border text-main rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent" />
                <div>
                  <h2 className="text-base font-semibold text-main tracking-tight">
                    Upload Questions
                  </h2>
                  <p className="text-[11px] text-muted">
                    Upload a Markdown (.md) or text file with your mental math questions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIngestModal(false)}
                className="text-muted hover:text-main text-xs p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delimiter Spec Box */}
            <div className="p-3 bg-background border border-border rounded-lg text-xs font-mono space-y-1 text-muted">
              <span className="text-accent font-semibold block">Format:</span>
              <div>##LEVEL: 1</div>
              <div>===SET: 1===</div>
              <div>Q: 47 + 89</div>
              <div>A: 136</div>
              <div>FLOW: Add 90 then subtract 1</div>
              <div>===END_SET===</div>
            </div>

            {/* Input Textarea & File Upload Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Questions:</span>
                <label className="text-accent hover:underline cursor-pointer flex items-center gap-1 font-mono">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload file</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={ingestText}
                onChange={(e) => setIngestText(e.target.value)}
                rows={8}
                placeholder="Paste your questions here or click 'Upload file' above..."
                className="w-full p-3 bg-background border border-border rounded-lg text-xs font-mono text-main placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Actions & Live Parse Counter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleParseText}
                className="px-3.5 py-2 rounded-lg bg-background hover:bg-hover border border-border text-xs font-mono text-main cursor-pointer"
              >
                Test Format
              </button>

              <button
                type="button"
                onClick={handleUpsertBatches}
                disabled={isUpserting || (!parseResult && !ingestText)}
                style={{
                  backgroundColor: 'var(--accent)',
                  backgroundImage: 'var(--accent-gradient)',
                  color: 'var(--accent-text, #050505)',
                }}
                className="px-5 py-2 text-xs font-mono font-bold rounded-lg transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-1.5"
              >
                {isUpserting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving questions...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Save Questions</span>
                  </>
                )}
              </button>
            </div>

            {/* Parse Feedback Banner */}
            {parseResult && (
              <div className="p-3 bg-background border border-border rounded-lg text-xs font-mono space-y-1">
                <div className="text-accent font-semibold">
                  Parsed: {parseResult.levels.length} Level(s), {parseResult.sets.length} Set(s),{' '}
                  {parseResult.totalQuestions} Question(s).
                </div>
                {parseResult.errors.length > 0 && (
                  <div className="text-rose-400">
                    Warnings: {parseResult.errors.join('; ')}
                  </div>
                )}
              </div>
            )}

            {/* Ingest Toast */}
            {ingestToast && (
              <div
                className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  ingestToast.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/40 border border-rose-500 text-rose-300'
                }`}
              >
                {ingestToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{ingestToast.message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalMathDashboard;
