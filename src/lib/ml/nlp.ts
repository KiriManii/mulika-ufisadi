/**
 * Machine Learning - Natural Language Processing Functions
 * Mulika Ufisadi - Corruption Reporting Platform
 * Text analysis, sentiment analysis, and keyword extraction
 */

import type { Report, Category } from '@/types/report';

export interface TextAnalysisResult {
  sentiment: Sentiment;
  keywords: Keyword[];
  readabilityScore: number;
  textStatistics: TextStatistics;
  suggestedCategories: Category[];
}

export interface Sentiment {
  score: number; // -1 to 1 (negative to positive)
  label: 'negative' | 'neutral' | 'positive';
  confidence: number; // 0 to 1
}

export interface Keyword {
  word: string;
  frequency: number;
  relevance: number;
}

export interface TextStatistics {
  wordCount: number;
  sentenceCount: number;
  characterCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

/**
 * Stop words to filter out during text analysis (common English + Swahili words)
 */
const STOP_WORDS = new Set([
  // English
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'they', 'them',
  // Swahili
  'na', 'ya', 'wa', 'ni', 'kwa', 'la', 'za', 'katika', 'kuwa', 'au', 'lakini',
]);

/**
 * Sentiment keywords for basic sentiment analysis
 */
const NEGATIVE_KEYWORDS = new Set([
  'corrupt', 'bribe', 'illegal', 'fraud', 'theft', 'embezzlement', 'extortion',
  'demanded', 'forced', 'threatened', 'refused', 'denied', 'stolen', 'cheated',
  'bad', 'terrible', 'awful', 'poor', 'unfair', 'unjust', 'wrong',
  'rushwa', 'ufisadi', 'wizi', 'uongo', 'haramu', // Swahili negative words
]);

const POSITIVE_KEYWORDS = new Set([
  'helped', 'resolved', 'fair', 'honest', 'transparent', 'justice', 'good',
  'excellent', 'professional', 'efficient', 'quick', 'helpful',
]);

/**
 * Category-related keywords for auto-categorization
 */
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  [Category.Bribery]: ['bribe', 'pay', 'money', 'cash', 'rushwa', 'demanded', 'asked for money'],
  [Category.Extortion]: ['extort', 'threaten', 'force', 'demanded', 'intimidate', 'coerce'],
  [Category.Embezzlement]: ['embezzle', 'steal', 'misappropriate', 'funds', 'missing money'],
  [Category.Nepotism]: ['nepotism', 'favoritism', 'relative', 'family', 'friend', 'bias'],
  [Category.ProcurementFraud]: ['tender', 'contract', 'procurement', 'bidding', 'supplier'],
  [Category.LandGrabbing]: ['land', 'grabbed', 'property', 'title deed', 'plot', 'eviction'],
  [Category.Other]: [],
};

/**
 * Analyzes text content from a report
 * @param text - The text to analyze
 * @returns Text analysis results
 */
export function analyzeText(text: string): TextAnalysisResult {
  try {
    const cleanedText = cleanText(text);
    const words = tokenize(cleanedText);

    const sentiment = analyzeSentiment(words, cleanedText);
    const keywords = extractKeywords(words);
    const textStatistics = calculateTextStatistics(text);
    const readabilityScore = calculateReadabilityScore(textStatistics);
    const suggestedCategories = suggestCategories(cleanedText, keywords);

    return {
      sentiment,
      keywords,
      readabilityScore,
      textStatistics,
      suggestedCategories,
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text');
  }
}

/**
 * Cleans and normalizes text
 * @param text - Raw text
 * @returns Cleaned text
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Tokenizes text into words
 * @param text - Cleaned text
 * @returns Array of words
 */
function tokenize(text: string): string[] {
  return text.split(' ').filter((word) => word.length > 0);
}

/**
 * Performs basic sentiment analysis
 * @param words - Array of words
 * @param text - Full text
 * @returns Sentiment analysis result
 */
function analyzeSentiment(words: string[], text: string): Sentiment {
  let score = 0;
  let matchCount = 0;

  words.forEach((word) => {
    if (NEGATIVE_KEYWORDS.has(word)) {
      score -= 1;
      matchCount++;
    } else if (POSITIVE_KEYWORDS.has(word)) {
      score += 1;
      matchCount++;
    }
  });

  // Normalize score to -1 to 1 range
  const normalizedScore = matchCount > 0 ? score / matchCount : 0;
  const confidence = Math.min(matchCount / 10, 1); // Higher with more keyword matches

  let label: 'negative' | 'neutral' | 'positive';
  if (normalizedScore < -0.2) {
    label = 'negative';
  } else if (normalizedScore > 0.2) {
    label = 'positive';
  } else {
    label = 'neutral';
  }

  return {
    score: normalizedScore,
    label,
    confidence,
  };
}

/**
 * Extracts keywords from text using TF-IDF-like approach
 * @param words - Array of words
 * @returns Array of keywords with frequency and relevance
 */
function extractKeywords(words: string[]): Keyword[] {
  const wordFrequency = new Map<string, number>();

  // Count word frequencies (excluding stop words)
  words.forEach((word) => {
    if (word.length < 3 || STOP_WORDS.has(word)) return;

    const count = wordFrequency.get(word) || 0;
    wordFrequency.set(word, count + 1);
  });

  // Calculate relevance (frequency * inverse document frequency estimate)
  const keywords: Keyword[] = Array.from(wordFrequency.entries()).map(
    ([word, frequency]) => {
      // Higher relevance for corruption-related terms
      const isCorruptionTerm =
        NEGATIVE_KEYWORDS.has(word) ||
        Object.values(CATEGORY_KEYWORDS)
          .flat()
          .some((kw) => kw.includes(word));

      const relevance = frequency * (isCorruptionTerm ? 2 : 1);

      return { word, frequency, relevance };
    }
  );

  // Sort by relevance and return top keywords
  return keywords.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
}

/**
 * Calculates text statistics
 * @param text - Original text
 * @returns Text statistics
 */
function calculateTextStatistics(text: string): TextStatistics {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const characters = text.replace(/\s/g, '').length;

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const characterCount = characters;

  const averageWordLength =
    wordCount > 0
      ? words.reduce((sum, word) => sum + word.length, 0) / wordCount
      : 0;

  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  return {
    wordCount,
    sentenceCount,
    characterCount,
    averageWordLength,
    averageSentenceLength,
  };
}

/**
 * Calculates readability score (simplified Flesch Reading Ease)
 * @param stats - Text statistics
 * @returns Readability score (0-100, higher = easier to read)
 */
function calculateReadabilityScore(stats: TextStatistics): number {
  if (stats.sentenceCount === 0 || stats.wordCount === 0) return 0;

  // Simplified Flesch Reading Ease formula
  const syllablesPerWord = stats.averageWordLength / 2; // Rough estimate
  const wordsPerSentence = stats.averageSentenceLength;

  const score = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Suggests categories based on text content
 * @param text - Cleaned text
 * @param keywords - Extracted keywords
 * @returns Array of suggested categories
 */
function suggestCategories(text: string, keywords: Keyword[]): Category[] {
  const categoryScores = new Map<Category, number>();

  // Check each category's keywords against the text
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, categoryKeywords]) => {
    let score = 0;

    categoryKeywords.forEach((keyword) => {
      // Check if keyword appears in text
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);

      if (matches) {
        score += matches.length * 2;
      }

      // Check if keyword appears in extracted keywords
      const keywordMatch = keywords.find((kw) => kw.word.includes(keyword));
      if (keywordMatch) {
        score += keywordMatch.relevance;
      }
    });

    if (score > 0) {
      categoryScores.set(category as Category, score);
    }
  });

  // Sort by score and return top categories
  return Array.from(categoryScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);
}

/**
 * Extracts entities (names, places, amounts) from text
 * @param text - Text to analyze
 * @returns Extracted entities
 */
export function extractEntities(text: string): {
  amounts: number[];
  locations: string[];
  dates: string[];
} {
  const amounts: number[] = [];
  const locations: string[] = [];
  const dates: string[] = [];

  // Extract amounts (KES, Ksh, shillings, numbers)
  const amountRegex = /(?:KES|Ksh|shillings?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi;
  let match;

  while ((match = amountRegex.exec(text)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(amount)) {
      amounts.push(amount);
    }
  }

  // Extract standalone numbers that might be amounts
  const numberRegex = /\b(\d{1,3}(?:,\d{3})+(?:\.\d{2})?)\b/g;
  while ((match = numberRegex.exec(text)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(amount) && amount >= 100) {
      // Minimum threshold
      amounts.push(amount);
    }
  }

  // Extract dates (simple patterns)
  const dateRegex =
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g;
  while ((match = dateRegex.exec(text)) !== null) {
    dates.push(match[0]);
  }

  // Extract potential locations (capitalized words, county names)
  const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  while ((match = locationRegex.exec(text)) !== null) {
    const location = match[0];
    if (location.length > 3 && !STOP_WORDS.has(location.toLowerCase())) {
      locations.push(location);
    }
  }

  return {
    amounts: Array.from(new Set(amounts)),
    locations: Array.from(new Set(locations)).slice(0, 5),
    dates: Array.from(new Set(dates)),
  };
}

/**
 * Compares similarity between two texts (Jaccard similarity)
 * @param text1 - First text
 * @param text2 - Second text
 * @returns Similarity score (0-1)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(tokenize(cleanText(text1)));
  const words2 = new Set(tokenize(cleanText(text2)));

  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Finds duplicate or similar reports based on text
 * @param reports - Array of reports
 * @param threshold - Similarity threshold (0-1)
 * @returns Groups of similar reports
 */
export function findSimilarReportsByText(
  reports: Report[],
  threshold = 0.7
): Report[][] {
  const groups: Report[][] = [];
  const processed = new Set<string>();

  reports.forEach((report1) => {
    if (processed.has(report1.id)) return;

    const similarReports = [report1];
    processed.add(report1.id);

    reports.forEach((report2) => {
      if (report2.id === report1.id || processed.has(report2.id)) return;

      const similarity = calculateTextSimilarity(
        report1.description,
        report2.description
      );

      if (similarity >= threshold) {
        similarReports.push(report2);
        processed.add(report2.id);
      }
    });

    if (similarReports.length > 1) {
      groups.push(similarReports);
    }
  });

  return groups;
}

/**
 * Generates a summary of multiple reports
 * @param reports - Array of reports
 * @returns Summary text
 */
export function generateReportSummary(reports: Report[]): string {
  if (reports.length === 0) return 'No reports to summarize.';

  const totalReports = reports.length;
  const avgAmount =
    reports
      .map((r) => r.estimatedAmount || 0)
      .reduce((a, b) => a + b, 0) / totalReports;

  const agencies = new Set(reports.map((r) => r.agency));
  const counties = new Set(reports.map((r) => r.county));

  const allText = reports.map((r) => r.description).join(' ');
  const analysis = analyzeText(allText);
  const topKeywords = analysis.keywords.slice(0, 5).map((k) => k.word);

  return `Summary of ${totalReports} reports from ${counties.size} counties involving ${agencies.size} agencies. Average amount: KES ${avgAmount.toFixed(0)}. Key themes: ${topKeywords.join(', ')}. Overall sentiment: ${analysis.sentiment.label}.`;
}
