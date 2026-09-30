import React, { useState, useRef } from 'react';
import {
  ImportDestination,
  ParsedQuestionItem,
  ParseResult,
  parseImportData,
  getSampleTemplate,
} from '../utils/importParser';
import { commitImportBatch } from '../lib/clatService';
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
} from 'lucide-react';

interface ImportPageProps {
  onBackToApp?: () => void;
}

const DESTINATIONS: { id: ImportDestination; label: string; subjectTag: string }[] = [
  { id: 'gk_qb_mocks', label: '[ GK: QB Mocks ]', subjectTag: 'GK' },
  { id: 'gk_qb_current', label: '[ GK: QB Current ]', subjectTag: 'GK' },
  { id: 'quants_caselet', label: '[ Quants: Caselet + Questions ]', subjectTag: 'QT' },
  { id: 'ar_puzzle', label: '[ AR: Logic Puzzle + Questions ]', subjectTag: 'AR' },
];

export const ImportPage: React.FC<ImportPageProps> = ({ onBackToApp }) => {
  const [destination, setDestination] = useState<ImportDestination>('gk_qb_mocks');
  const [rawText, setRawText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDestinationChange = (newDest: ImportDestination) => {
    sounds.playClick();
    setDestination(newDest);
    setParseResult(null);
    setToast(null);
  };

  const handleLoadSample = () => {
    sounds.playClick();
    const sample = getSampleTemplate(destination);
    setRawText(sample);
    setParseResult(null);
    setToast(null);
  };

  const handleClear = () => {
    sounds.playClick();
    setRawText('');
    setParseResult(null);
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
        setToast(null);
      }
    };
    reader.readAsText(file);
  };

  const handleParseAndPreview = () => {
    sounds.playClick();
    setToast(null);
    const result = parseImportData(rawText, destination);
    setParseResult(result);

    if (result.errorCount === 0 && result.totalParsed > 0) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleCommit = async () => {
    if (!parseResult || parseResult.errorCount > 0 || parseResult.totalParsed === 0 || isCommitting) {
      return;
    }

    sounds.playClick();
    setIsCommitting(true);
    setToast(null);

    const res = await commitImportBatch({
      destination: parseResult.destination,
      passage: parseResult.passage,
      questions: parseResult.questions,
    });

    setIsCommitting(false);

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
        message: res.error || 'Failed to sync with Supabase.',
      });
    }
  };

  const isPassageBased = destination === 'quants_caselet' || destination === 'ar_puzzle';
  const hasErrors = parseResult ? parseResult.errorCount > 0 || parseResult.generalErrors.length > 0 : false;
  const canCommit = parseResult && !hasErrors && parseResult.totalParsed > 0 && !isCommitting;

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans select-none selection:bg-[#22c55e]/20">
      {/* Top Bar (Terminal aesthetic) */}
      <header className="border-b border-[#262626] bg-[#050505] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToApp) onBackToApp();
                else window.history.back();
              }}
              className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>← Back to CLAT</span>
            </button>

            <span className="text-neutral-700">|</span>

            <div className="flex items-center gap-2 font-mono text-xs text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="font-bold text-white tracking-wide">CLAT /import</span>
              <span className="text-neutral-500 hidden sm:inline text-[11px]">
                Deterministic Regex Parser
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
            <span className="text-neutral-400">Target DB:</span>
            <span className="text-[#22c55e] font-semibold">Supabase</span>
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
                ? 'bg-emerald-950/30 border-[#22c55e] text-emerald-300'
                : 'bg-rose-950/30 border-rose-500 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-white underline cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Top Controls */}
        <div className="bg-[#050505] border border-[#262626] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Dropdown Menu to Manually Select Destination */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                Destination Target:
              </label>
              <select
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value as ImportDestination)}
                className="bg-black border border-[#262626] focus:border-[#22c55e] text-neutral-100 text-xs font-mono py-2 px-3 focus:outline-none cursor-pointer min-w-[280px]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-black text-white font-mono">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions: Template & File Upload */}
            <div className="flex items-center gap-2 pt-2 md:pt-4">
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-[#262626] hover:border-neutral-500 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
                title="Populate input area with reference formatting"
              >
                <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                <span>Load Sample Template</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-[#262626] hover:border-neutral-500 text-neutral-300 text-xs font-mono transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
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
          <div className="text-[11px] font-mono text-neutral-500 pt-1 border-t border-[#262626]">
            {isPassageBased ? (
              <span>
                Format rule: Enclose passage strictly between{' '}
                <span className="text-[#22c55e]">### PASSAGE START</span> and{' '}
                <span className="text-[#22c55e]">### PASSAGE END</span>. Separate questions with{' '}
                <span className="text-[#22c55e]">---</span>. Every question requires 4 options (A-D) and Answer.
              </span>
            ) : (
              <span>
                Format rule: Separate questions with triple dashes{' '}
                <span className="text-[#22c55e]">---</span>. Every question must have options A-D and Answer.
              </span>
            )}
          </div>
        </div>

        {/* 2. Input Area */}
        <div className="bg-[#050505] border border-[#262626] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Raw Input Text</span>
            <span className="text-neutral-500 text-[11px] tabular-nums">
              {rawText.length.toLocaleString()} characters · {rawText.split('\n').length} lines
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              isPassageBased
                ? "Paste caselet and questions here...\n\n### PASSAGE START\nThe Ministry of Law approved outlay for 1,023 Fast Track Special Courts...\n### PASSAGE END\n\nWhat is the total number of regular courts?\nA) 580\nB) 613\nC) 640\nD) 672\nAnswer: B\nExplanation: 1023 - 410 = 613.\n\n---\n\nNext question..."
                : "Paste questions here separated by ---\n\nWhich Article guarantees right against self-incrimination?\nA) Article 20(1)\nB) Article 20(2)\nC) Article 20(3)\nD) Article 21\nAnswer: C\nExplanation: Article 20(3) protects the accused.\n\n---\n\nNext question..."
            }
            rows={10}
            className="w-full p-4 bg-black border border-[#262626] focus:border-[#22c55e] text-xs font-mono text-neutral-200 placeholder:text-neutral-700 focus:outline-none leading-relaxed resize-y"
          />

          {/* Action Buttons: Parse & Preview (Primary), Clear (Secondary) */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleClear}
              disabled={!rawText && !parseResult}
              className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-400 hover:text-rose-400 disabled:opacity-20 text-xs font-mono transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleParseAndPreview}
              disabled={!rawText.trim()}
              className="px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-20 disabled:hover:bg-[#22c55e] text-black font-mono font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Parse & Preview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Staging & Strict Validation Preview */}
        {parseResult && (
          <div className="bg-[#050505] border border-[#262626] p-4 sm:p-5 space-y-4">
            {/* Header with counts and validation status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262626] font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-neutral-400">
                  Total Parsed: <span className="text-white font-bold">{parseResult.totalParsed}</span>
                </span>
                <span className="text-neutral-700">|</span>
                <span className="text-emerald-400">
                  Valid: <span className="font-bold">{parseResult.validCount}</span>
                </span>
                <span className="text-neutral-700">|</span>
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
                  <span className="text-[#22c55e] flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
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
                    ? 'bg-black border-[#262626]'
                    : 'bg-rose-900/20 border-rose-900 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#22c55e]" />
                    <span className="font-bold text-white font-sans">{parseResult.passage.title}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 tabular-nums">
                    {parseResult.passage.wordCount} words · ~{parseResult.passage.readTimeMinutes} min read
                  </span>
                </div>
                <p className="text-neutral-300 font-sans line-clamp-3 leading-relaxed text-xs">
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
            <div className="overflow-x-auto border border-[#262626]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-black border-b border-[#262626] text-[11px] text-neutral-400">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Prompt Snippet</th>
                    <th className="py-2.5 px-3 text-center">Options Found</th>
                    <th className="py-2.5 px-3 text-center">Parsed Answer</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {parseResult.questions.map((q) => {
                    const optionsFoundCount = q.options.filter(Boolean).length;
                    const isStrictlyValid = q.isValid;

                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors ${
                          isStrictlyValid
                            ? 'bg-black hover:bg-neutral-900/50 text-neutral-300'
                            : 'bg-rose-900/20 text-rose-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-neutral-400">
                          {q.questionNumber}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400 text-[11px]">
                          {isPassageBased ? 'Passage Drill' : 'MCQ'}
                        </td>
                        <td className="py-2.5 px-3 max-w-[380px]">
                          <p className="font-sans line-clamp-2 leading-relaxed text-neutral-200">
                            {q.prompt}
                          </p>
                          {q.explanation && (
                            <p className="text-[10px] text-neutral-500 font-mono line-clamp-1 mt-0.5">
                              Expl: {q.explanation}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums">
                          <span
                            className={`px-2 py-0.5 font-bold text-xs ${
                              optionsFoundCount === 4
                                ? 'bg-neutral-900 text-neutral-300'
                                : 'bg-rose-900/80 text-white'
                            }`}
                          >
                            {optionsFoundCount}/4
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {q.correctAnswer ? (
                            <span className="text-[#22c55e] text-sm">{q.correctAnswer}</span>
                          ) : (
                            <span className="text-rose-400 text-xs">MISSING</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isStrictlyValid ? (
                            <span className="text-[#22c55e] font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#262626]">
              <div className="font-mono text-xs text-neutral-400">
                Target Table: <span className="text-white font-medium">{isPassageBased ? 'passages + questions' : 'questions'}</span>
              </div>

              <button
                onClick={handleCommit}
                disabled={!canCommit}
                className="px-6 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-20 disabled:hover:bg-[#22c55e] text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
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
