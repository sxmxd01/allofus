import React, { useState, useRef } from 'react';
import {
  ImportDestination,
  ParsedQuestionItem,
  ParseResult,
  parseImportData,
  getSampleTemplate,
  QT_TOPICS,
  AR_TOPICS,
} from '../utils/importParser';
import {
  parseDeterministicMathData,
} from '../utils/parseMentalMath';
import { upsertMathContentBatches } from '../lib/dualSupabase';
import { ParseIngestResult } from '../types/mentalMath';
import { commitImportBatch } from '../lib/clatService';
import { seedLegacyMockqsToSupabase, SeedProgressState } from '../lib/mockqsSeeder';
import { sounds } from '../utils/sound';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowRight,
  Database,
  RefreshCw,
  FileCode,
  ArrowLeft,
  Server,
  Zap,
  Tag,
  BrainCircuit,
} from 'lucide-react';

interface ImportPageProps {
  onBackToApp?: () => void;
}

const DESTINATIONS: { id: ImportDestination; label: string; subjectTag: string }[] = [
  { id: 'gk_qb_mocks', label: 'GK: QB Mocks', subjectTag: 'GK' },
  { id: 'gk_qb_current', label: 'GK: QB Current', subjectTag: 'GK' },
  { id: 'quants_caselet', label: 'Quants: Caselet + Questions', subjectTag: 'QT' },
  { id: 'ar_puzzle', label: 'AR: Logic Puzzle + Questions', subjectTag: 'AR' },
  { id: 'mental_math', label: 'QT: Mental Math Training (Deterministic Regex Engine)', subjectTag: 'QT' },
];

export const ImportPage: React.FC<ImportPageProps> = ({ onBackToApp }) => {
  const [destination, setDestination] = useState<ImportDestination>('gk_qb_mocks');
  const [selectedTopic, setSelectedTopic] = useState<string>('Ratios & Percentages');
  const [rawText, setRawText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [mathParseResult, setMathParseResult] = useState<ParseIngestResult | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // One-Click Mockqs Seeder State
  const [seedProgress, setSeedProgress] = useState<SeedProgressState | null>(null);
  const [isSeedingMockqs, setIsSeedingMockqs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSeedMockqs = async () => {
    if (isSeedingMockqs) return;
    sounds.playClick();
    setIsSeedingMockqs(true);
    setToast(null);

    const res = await seedLegacyMockqsToSupabase((progress) => {
      setSeedProgress({ ...progress });
    });

    setIsSeedingMockqs(false);

    if (res.success) {
      sounds.playCorrect();
      setToast({
        type: 'success',
        message: `Successfully seeded ${res.total.toLocaleString()} Legacy Mockqs to Supabase qb_questions table.`,
      });
    } else {
      sounds.playIncorrect();
      setToast({
        type: 'error',
        message: `Seeder encountered an error: ${res.error || 'Failed to complete upsert.'}`,
      });
    }
  };

  const handleDestinationChange = (newDest: ImportDestination) => {
    sounds.playClick();
    setDestination(newDest);
    if (newDest === 'quants_caselet') {
      setSelectedTopic('Ratios & Percentages');
    } else if (newDest === 'ar_puzzle') {
      setSelectedTopic('Linear Arrangements');
    }
    setParseResult(null);
    setMathParseResult(null);
    setToast(null);
  };

  const handleLoadSample = () => {
    sounds.playClick();
    if (destination === 'mental_math') {
      setRawText('');
    } else {
      const sample = getSampleTemplate(destination);
      setRawText(sample);
    }
    setParseResult(null);
    setMathParseResult(null);
    setToast(null);
  };

  const handleClear = () => {
    sounds.playClick();
    setRawText('');
    setParseResult(null);
    setMathParseResult(null);
    setToast(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setParseResult(null);
        setMathParseResult(null);
        setToast(null);
      }
    };
    reader.readAsText(file);
  };

  const handleParseAndPreview = () => {
    sounds.playClick();
    setToast(null);

    // DETERMINISTIC REGEX INGESTION ENGINE FOR MENTAL MATH (Bypasses MCQ parser)
    if (destination === 'mental_math') {
      const mathResult = parseDeterministicMathData(rawText);
      setMathParseResult(mathResult);
      setParseResult(null);

      if (mathResult.errors.length === 0 && mathResult.totalQuestions > 0) {
        sounds.playCorrect();
      } else {
        sounds.playIncorrect();
      }
      return;
    }

    const result = parseImportData(rawText, destination, selectedTopic);
    setParseResult(result);
    setMathParseResult(null);

    if (result.errorCount === 0 && result.totalParsed > 0) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleCommit = async () => {
    if (isCommitting) return;

    // DETERMINISTIC CHUNKED DB UPSERTS FOR MENTAL MATH (50 items per batch to Client B)
    if (destination === 'mental_math') {
      if (!mathParseResult || mathParseResult.sets.length === 0 || mathParseResult.errors.length > 0) {
        return;
      }

      sounds.playClick();
      setIsCommitting(true);
      setToast(null);

      try {
        const res = await upsertMathContentBatches(mathParseResult.levels, mathParseResult.sets);
        if (res.success) {
          sounds.playCorrect();
          setToast({
            type: 'success',
            message: res.message,
          });
          setRawText('');
          setMathParseResult(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          sounds.playIncorrect();
          setToast({
            type: 'error',
            message: res.message || 'Failed to sync with Client B.',
          });
        }
      } catch (err: any) {
        sounds.playIncorrect();
        setToast({
          type: 'error',
          message: `Database Schema Error: ${err?.message || 'Failed to execute upsert to Client B.'}`,
        });
      } finally {
        setIsCommitting(false);
      }
      return;
    }

    if (!parseResult || parseResult.errorCount > 0 || parseResult.totalParsed === 0) {
      return;
    }

    sounds.playClick();
    setIsCommitting(true);
    setToast(null);

    try {
      const res = await commitImportBatch({
        destination: parseResult.destination,
        passage: parseResult.passage,
        questions: parseResult.questions,
      });

      if (res.success) {
        sounds.playCorrect();
        setToast({
          type: 'success',
          message: `Committed ${res.insertedCount} items to Supabase database.`,
        });
        // Clear staging table and textarea
        setRawText('');
        setParseResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        sounds.playIncorrect();
        setToast({
          type: 'error',
          message: res.error || 'Failed to sync with Supabase database schema.',
        });
      }
    } catch (err: any) {
      sounds.playIncorrect();
      setToast({
        type: 'error',
        message: `Database Schema Error: ${err?.message || 'Failed to execute insert/upsert.'}`,
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const isPassageBased = destination === 'quants_caselet' || destination === 'ar_puzzle';
  const hasErrors = parseResult ? parseResult.errorCount > 0 || parseResult.generalErrors.length > 0 : false;
  const canCommit = parseResult && !hasErrors && parseResult.totalParsed > 0 && !isCommitting;

  return (
    <div className="min-h-screen bg-background text-main flex flex-col font-sans select-none transition-colors">
      {/* Top Bar */}
      <header className="border-b border-border bg-panel/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToApp) onBackToApp();
                else window.history.back();
              }}
              className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-main transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span>← Back to CLAT</span>
            </button>

            <span className="text-muted/40">|</span>

            <div className="flex items-center gap-2 font-mono text-xs text-main">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-bold text-main tracking-wide">CLAT /import</span>
              <span className="text-muted hidden sm:inline text-[11px]">
                Deterministic Regex Parser
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span>Target DB:</span>
            <span className="text-accent font-semibold">Supabase</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`p-3.5 border rounded-none text-xs font-mono flex items-center justify-between transition-all ${
              toast.type === 'success'
                ? 'bg-accent/10 border-accent text-accent'
                : 'bg-rose-950/30 border-rose-500 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-muted hover:text-main underline cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ONE-CLICK LEGACY MOCKQS SEEDER */}
        <div className="bg-panel border border-border p-4 sm:p-5 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-mono font-semibold text-main tracking-wider uppercase">
                  Legacy Question Bank Synchronization
                </h2>
              </div>
              <p className="text-xs text-muted font-sans leading-normal">
                Batch ingest and synchronize all 1,538 legacy mock questions and current affairs into Supabase <span className="font-mono text-main">qb_questions</span> table.
              </p>
            </div>

            <button
              onClick={handleSeedMockqs}
              disabled={isSeedingMockqs}
              style={{ background: 'var(--accent-gradient, var(--accent))' }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 hover:opacity-90 disabled:opacity-50 text-black text-xs font-mono font-bold tracking-tight transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {isSeedingMockqs ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Seeding Mockqs...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Seed 1,538 Legacy Mockqs to Supabase</span>
                </>
              )}
            </button>
          </div>

          {/* Live Progress Bar */}
          {seedProgress && (isSeedingMockqs || seedProgress.isDone) && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted">
                  {seedProgress.isDone
                    ? 'Upload complete'
                    : `Batch ${seedProgress.batchNum} of ${seedProgress.totalBatches}`}
                </span>
                <span className="text-accent font-semibold tabular-nums">
                  {seedProgress.current.toLocaleString()} / {seedProgress.total.toLocaleString()} ({seedProgress.percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-background overflow-hidden border border-border">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${seedProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 1. Top Controls */}
        <div className="bg-panel border border-border p-4 sm:p-5 space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Dropdown Menu to Manually Select Destination */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-muted uppercase tracking-widest">
                  Destination Target:
                </label>
                <select
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value as ImportDestination)}
                  className="bg-background border border-border focus:border-accent text-main text-xs font-mono py-2 px-3 focus:outline-none cursor-pointer min-w-[240px]"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-background text-main font-mono">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* QT Topic Dropdown */}
              {destination === 'quants_caselet' && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-muted uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span>QT Topic:</span>
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="bg-background border border-border focus:border-accent text-main text-xs font-mono py-2 px-3 focus:outline-none cursor-pointer min-w-[220px]"
                  >
                    {QT_TOPICS.map((topic) => (
                      <option key={topic} value={topic} className="bg-background text-main font-mono">
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* AR Topic Dropdown */}
              {destination === 'ar_puzzle' && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-muted uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span>AR Topic:</span>
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="bg-background border border-border focus:border-accent text-main text-xs font-mono py-2 px-3 focus:outline-none cursor-pointer min-w-[220px]"
                  >
                    {AR_TOPICS.map((topic) => (
                      <option key={topic} value={topic} className="bg-background text-main font-mono">
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quick Actions: Template & File Upload */}
            <div className="flex items-center gap-2 pt-2 md:pt-4">
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border hover:border-accent text-main text-xs font-mono transition-colors cursor-pointer"
                title="Populate input area with reference formatting"
              >
                <FileCode className="w-3.5 h-3.5 text-muted" />
                <span>Load Sample Template</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border hover:border-accent text-main text-xs font-mono transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-muted" />
                <span>Upload File</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Grammar & Delimiter Syntax Cue */}
          <div className="text-[11px] font-mono text-muted pt-1 border-t border-border">
            {destination === 'mental_math' ? (
              <span>
                Format rule:{' '}
                <span className="text-accent font-semibold">##LEVEL: {'{number}'}</span>,{' '}
                <span className="text-accent font-semibold">===SET: {'{number}'}===</span>,{' '}
                <span className="text-accent font-semibold">Q: {'{expression}'}</span>,{' '}
                <span className="text-accent font-semibold">A: {'{value}'}</span>,{' '}
                <span className="text-accent font-semibold">FLOW: {'{mermaid_and_markdown}'}</span>,{' '}
                <span className="text-accent font-semibold">===END_SET===</span>.
              </span>
            ) : isPassageBased ? (
              <span>
                Format rule: Enclose passage strictly between{' '}
                <span className="text-accent font-semibold">### PASSAGE START</span> and{' '}
                <span className="text-accent font-semibold">### PASSAGE END</span>. Separate questions with{' '}
                <span className="text-accent font-semibold">---</span>. Every question requires 4 options (A-D) and Answer.
              </span>
            ) : (
              <span>
                Format rule: Separate questions with triple dashes{' '}
                <span className="text-accent font-semibold">---</span>. Every question must have options A-D and Answer.
              </span>
            )}
          </div>
        </div>

        {/* 2. Input Area */}
        <div className="bg-panel border border-border p-4 sm:p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted">Raw Input Text</span>
            <span className="text-muted text-[11px] tabular-nums">
              {rawText.length.toLocaleString()} characters · {rawText.split('\n').length} lines
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              destination === 'mental_math'
                ? "##LEVEL: 1 Rapid Addition & Subtraction Foundations\n===SET: 1===\nQ: 47 + 89\nA: 136\nFLOW: ```mermaid\ngraph LR\n    A[47 + 89] --> B[47 + 90 = 137]\n    B --> C[137 - 1 = 136]\n```\n**Optimal Path:** Add 90 then subtract 1.\nQ: 64 + 28\nA: 92\nFLOW: ```mermaid\ngraph LR\n    A[64 + 28] --> B[64 + 30 = 94]\n    B --> C[94 - 2 = 92]\n```\n===END_SET==="
                : isPassageBased
                ? "Paste caselet and questions here...\n\n### PASSAGE START\nThe Ministry of Law approved outlay for 1,023 Fast Track Special Courts...\n### PASSAGE END\n\nWhat is the total number of regular courts?\nA) 580\nB) 613\nC) 640\nD) 672\nAnswer: B\nExplanation: 1023 - 410 = 613.\n\n---\n\nNext question..."
                : "Paste questions here separated by ---\n\nWhich Article guarantees right against self-incrimination?\nA) Article 20(1)\nB) Article 20(2)\nC) Article 20(3)\nD) Article 21\nAnswer: C\nExplanation: Article 20(3) protects the accused.\n\n---\n\nNext question..."
            }
            rows={10}
            className="w-full p-4 bg-background border border-border focus:border-accent text-xs font-mono text-main placeholder:text-muted/50 focus:outline-none leading-relaxed resize-y"
          />

          {/* Action Buttons: Parse & Preview (Primary), Clear (Secondary) */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleClear}
              disabled={!rawText && !parseResult && !mathParseResult}
              className="flex items-center gap-1.5 px-3 py-1.5 text-muted hover:text-rose-400 disabled:opacity-20 text-xs font-mono transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleParseAndPreview}
              disabled={!rawText.trim()}
              style={{ background: 'var(--accent-gradient, var(--accent))' }}
              className="px-5 py-2 hover:opacity-90 disabled:opacity-20 text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Parse & Preview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Mental Math Deterministic Parsing Preview (Client B Content Ingestion) */}
        {destination === 'mental_math' && mathParseResult && (
          <div className="bg-panel border border-border p-4 sm:p-5 space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-muted">
                  Levels: <span className="text-accent font-bold">{mathParseResult.levels.length}</span>
                </span>
                <span className="text-muted/40">|</span>
                <span className="text-muted">
                  Sets: <span className="text-accent font-bold">{mathParseResult.sets.length}</span>
                </span>
                <span className="text-muted/40">|</span>
                <span className="text-muted">
                  Questions: <span className="text-main font-bold">{mathParseResult.totalQuestions}</span>
                </span>
              </div>

              <div>
                {mathParseResult.errors.length > 0 ? (
                  <span className="text-rose-400 flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Parsing Errors: {mathParseResult.errors.length}
                  </span>
                ) : (
                  <span className="text-accent flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Deterministic Delimiters Validated
                  </span>
                )}
              </div>
            </div>

            {/* Ingestion Engine Errors if any */}
            {mathParseResult.errors.length > 0 && (
              <div className="p-3 bg-rose-900/20 border border-rose-900 text-rose-300 font-mono text-xs space-y-1">
                <div className="font-bold uppercase tracking-wider">Delimiter Errors:</div>
                <ul className="list-disc list-inside">
                  {mathParseResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions Table */}
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-background border-b border-border text-[11px] text-muted">
                  <tr>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3">Set</th>
                    <th className="py-2.5 px-3">Math Expression</th>
                    <th className="py-2.5 px-3 text-center">Exact Value (A)</th>
                    <th className="py-2.5 px-3">Cognitive Flowchart Snippet</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mathParseResult.sets.flatMap((s) =>
                    s.questions.map((q) => (
                      <tr key={q.id} className="hover:bg-hover transition-colors">
                        <td className="py-2.5 px-3 font-bold text-accent">LVL {s.levelNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-main">SET {s.setNumber}</td>
                        <td className="py-2.5 px-3 font-bold text-main">{q.expression}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{q.answer}</td>
                        <td className="py-2.5 px-3 text-muted text-[11px] truncate max-w-[280px]">
                          {q.thoughtProcess.replace(/```mermaid[\s\S]*?```/g, '[Mermaid Flowchart]').trim()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-accent font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                            Ready
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Commit Action for Mental Math (Chunked 50 per batch) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="font-mono text-xs text-muted">
                Target: Client B Content Tables (<span className="text-main font-medium">math_levels</span> &amp; <span className="text-main font-medium">math_sets</span>)
              </div>

              <button
                onClick={handleCommit}
                disabled={mathParseResult.sets.length === 0 || mathParseResult.errors.length > 0 || isCommitting}
                style={{ background: 'var(--accent-gradient, var(--accent))' }}
                className="px-6 py-2.5 hover:opacity-90 disabled:opacity-20 text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {isCommitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Upserting in 50-Item Batches...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Upsert {mathParseResult.sets.length} Sets in 50-Item Batches to Client B</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 3. Staging & Strict Validation Preview */}
        {parseResult && (
          <div className="bg-panel border border-border p-4 sm:p-5 space-y-4 transition-colors">
            {/* Header with counts and validation status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-muted">
                  Total Parsed: <span className="text-main font-bold">{parseResult.totalParsed}</span>
                </span>
                <span className="text-muted/40">|</span>
                <span className="text-accent font-semibold">
                  Valid: <span className="font-bold">{parseResult.validCount}</span>
                </span>
                <span className="text-muted/40">|</span>
                <span className="text-rose-400">
                  Errors: <span className="font-bold">{parseResult.errorCount}</span>
                </span>
              </div>

              <div>
                {hasErrors ? (
                  <span className="text-rose-400 flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Validation Failed: Fix highlighted rows to enable commit
                  </span>
                ) : (
                  <span className="text-accent flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    All questions validated (4 options + 1 answer)
                  </span>
                )}
              </div>
            </div>

            {/* General Errors if passage delimiter missing */}
            {parseResult.generalErrors.length > 0 && (
              <div className="p-3 bg-rose-900/20 border border-rose-900 text-rose-300 font-mono text-xs space-y-1">
                <div className="font-bold uppercase tracking-wider">Delimiter Error:</div>
                <ul className="list-disc list-inside">
                  {parseResult.generalErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Extracted Passage preview if QT / AR */}
            {parseResult.passage && (
              <div
                className={`p-4 border font-mono text-xs space-y-2 ${
                  parseResult.passage.isValid
                    ? 'bg-background border-border'
                    : 'bg-rose-900/20 border-rose-900 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="font-bold text-main font-sans">{parseResult.passage.title}</span>
                  </div>
                  <span className="text-[11px] text-muted tabular-nums">
                    {parseResult.passage.wordCount} words · ~{parseResult.passage.readTimeMinutes} min read
                  </span>
                </div>
                <p className="text-main font-sans line-clamp-3 leading-relaxed text-xs">
                  {parseResult.passage.text}
                </p>
                {parseResult.passage.errors.length > 0 && (
                  <div className="text-rose-400 text-[11px]">
                    {parseResult.passage.errors.join('; ')}
                  </div>
                )}
              </div>
            )}

            {/* Preview Table */}
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-background border-b border-border text-[11px] text-muted">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Prompt Snippet</th>
                    <th className="py-2.5 px-3 text-center">Options Found</th>
                    <th className="py-2.5 px-3 text-center">Parsed Answer</th>
                    <th className="py-2.5 px-3 text-center">Difficulty</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parseResult.questions.map((q) => {
                    const optionsFoundCount = q.options.filter(Boolean).length;
                    const isStrictlyValid = q.isValid;

                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors ${
                          isStrictlyValid
                            ? 'bg-background hover:bg-hover text-main'
                            : 'bg-rose-900/20 text-rose-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-muted">
                          {q.questionNumber}
                        </td>
                        <td className="py-2.5 px-3 text-muted text-[11px]">
                          {isPassageBased ? 'Passage Drill' : 'MCQ'}
                        </td>
                        <td className="py-2.5 px-3 max-w-[380px]">
                          <p className="font-sans line-clamp-2 leading-relaxed text-main">
                            {q.prompt}
                          </p>
                          {q.explanation && (
                            <p className="text-[10px] text-muted font-mono line-clamp-1 mt-0.5">
                              Expl: {q.explanation}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums">
                          <span
                            className={`px-2 py-0.5 font-bold text-xs ${
                              optionsFoundCount === 4
                                ? 'bg-panel text-main border border-border'
                                : 'bg-rose-900/80 text-white'
                            }`}
                          >
                            {optionsFoundCount}/4
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {q.correctAnswer ? (
                            <span className="text-accent text-sm font-semibold">{q.correctAnswer}</span>
                          ) : (
                            <span className="text-rose-400 text-xs">MISSING</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${
                              q.difficulty === 'Very Easy'
                                ? 'bg-sky-950/60 text-sky-300 border-sky-800'
                                : q.difficulty === 'Easy'
                                ? 'bg-accent/20 text-accent border-accent/60'
                                : q.difficulty === 'Hard'
                                ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                                : 'bg-amber-950/60 text-amber-300 border-amber-800'
                            }`}
                          >
                            {q.difficulty || 'Moderate'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isStrictlyValid ? (
                            <span className="text-accent font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                              Valid
                            </span>
                          ) : (
                            <span
                              className="text-rose-400 font-bold text-[11px] inline-flex items-center gap-1"
                              title={q.errors.join('; ')}
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{q.errors[0]}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Action: Commit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="font-mono text-xs text-muted">
                Target Table: <span className="text-main font-medium">{isPassageBased ? 'passages + questions' : 'questions'}</span>
              </div>

              <button
                onClick={handleCommit}
                disabled={!canCommit}
                style={{ background: 'var(--accent-gradient, var(--accent))' }}
                className="px-6 py-2.5 hover:opacity-90 disabled:opacity-20 text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {isCommitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Supabase Insert...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Commit {parseResult.validCount} Items to Supabase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
