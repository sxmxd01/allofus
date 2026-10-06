/**
 * Precision Search Helper (searchHelper.ts)
 * 
 * Optimizes Google's Knowledge Graph indexing and minimizes main-thread latency
 * with a high-performance regex cleaning pipeline, option injection fallback,
 * word count capping, and dual-screen ergonomics with clipboard fallback.
 */

export interface PrecisionSearchResult {
  success: boolean;
  openedWindow: boolean;
  copiedToClipboard: boolean;
  query: string;
}

/**
 * Regex Cleaning Pipeline:
 * 1. Strip numbering: /^(?:q(?:uestion)?\.?\s*\d+[\s:.-]*|\d+[\s:.-]+)/i
 * 2. Strip blanks: /_{2,}/g -> ' '
 * 3. Strip boilerplate: Remove phrases like "Which of the following", "Consider the following statements",
 *    "Who among the following", "With reference to", "Identify the correct statement"
 * 4. Option Injection Fallback: If clean.length < 40 and options exist, append first 2 options
 * 5. Word Count Capping: Truncate to maximum of 18 words
 */
export function cleanQuestionForSearch(rawQuestion: string, options: string[] = []): string {
  let clean = rawQuestion || '';

  // 1. Strip numbering
  clean = clean.replace(/^(?:q(?:uestion)?\.?\s*\d+[\s:.-]*|\d+[\s:.-]+)/i, '');

  // 2. Strip blanks
  clean = clean.replace(/_{2,}/g, ' ');

  // 3. Strip boilerplate phrases
  const boilerplateRegex = /\b(?:Which of the following|Consider the following statements|Who among the following|With reference to|Identify the correct statement)\b[:,-]?/gi;
  clean = clean.replace(boilerplateRegex, ' ');

  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ').trim();

  // 4. Option Injection Fallback: If clean.length < 40 and options exist, append first 2 options
  if (clean.length < 40 && options && options.length > 0) {
    const firstTwo = options.slice(0, 2).map((o) => (o || '').trim()).filter(Boolean);
    if (firstTwo.length > 0) {
      clean = `${clean} ${firstTwo.join(' ')}`.trim();
    }
  }

  // 5. Word Count Capping: Truncate the final query to a maximum of 18 words
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 18) {
    clean = words.slice(0, 18).join(' ');
  }

  return clean.trim();
}

/**
 * Execute precision Google Auto-Search with dual-screen window positioning
 * and graceful clipboard fallback if popup is blocked.
 */
export async function executePrecisionSearch(
  rawQuestion: string,
  options: string[] = []
): Promise<PrecisionSearchResult> {
  const query = cleanQuestionForSearch(rawQuestion, options);
  if (!query) {
    return { success: false, openedWindow: false, copiedToClipboard: false, query: '' };
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.google.com/search?q=${encodedQuery}`;

  let openedWindow = false;
  let copiedToClipboard = false;

  try {
    if (typeof window !== 'undefined') {
      const width = 860;
      const screenWidth = window.screen?.availWidth || window.screen?.width || 1920;
      const screenHeight = window.screen?.availHeight || window.screen?.height || 1080;
      const left = Math.max(0, screenWidth - width);
      const top = 0;
      const windowFeatures = `width=${width},height=${screenHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;

      const searchWindow = window.open(url, 'gksquad_search', windowFeatures);

      if (searchWindow && !searchWindow.closed) {
        openedWindow = true;
        try {
          searchWindow.focus();
        } catch {
          // Cross-origin focus guard
        }
      }
    }
  } catch (err) {
    console.warn('[searchHelper] window.open failed:', err);
  }

  // Clipboard Fallback: If window.open was blocked or returned null
  if (!openedWindow) {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(query);
        copiedToClipboard = true;
      }
    } catch (clipErr) {
      console.warn('[searchHelper] clipboard fallback failed:', clipErr);
    }
  }

  return {
    success: openedWindow || copiedToClipboard,
    openedWindow,
    copiedToClipboard,
    query,
  };
}

/**
 * Copy for AI (C) Fallback:
 * Uses navigator.clipboard.writeText to copy the uncleaned, raw question and all 4 options
 * formatted neatly with line breaks for easy pasting into an LLM.
 */
export async function copyQuestionForAI(
  rawQuestion: string,
  options: string[] = []
): Promise<boolean> {
  const letters = ['A', 'B', 'C', 'D'];
  const formattedOptions = options
    .map((opt, idx) => `${letters[idx] || `${idx + 1}`}) ${opt}`)
    .join('\n');

  const content = `${rawQuestion}\n\n${formattedOptions}`;

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(content);
      return true;
    }
  } catch (err) {
    console.warn('[searchHelper] copyQuestionForAI failed:', err);
  }
  return false;
}
