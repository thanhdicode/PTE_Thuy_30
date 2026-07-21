import 'server-only'
import { scorePronunciationFluency } from '@/lib/scoring'
import type { SpeakingType, SpeakingQuestion } from './types'

export interface SpeakingScoreInput {
  type: SpeakingType
  question: SpeakingQuestion
  transcript: string
  audioUrl: string
  durationMs: number
}

export interface SpeakingScoreResult {
  content: number
  pronunciation: number
  fluency: number
  total: number
  rubric: string
  feedback: string
  meta?: {
    wordsPerMinute?: number
    fillerRate?: number
    pauseCount?: number
    transcriberProvider?: string
    provider?: string
    providerRaw?: any
  }
}

export async function scoreAttempt(
  input: SpeakingScoreInput
): Promise<SpeakingScoreResult> {
  const { type, question, transcript, durationMs } = input

  // Handle empty transcripts
  if (!transcript || transcript.trim().length === 0) {
    return {
      content: 0,
      pronunciation: 0,
      fluency: 0,
      total: 0,
      rubric: getRubricForType(type),
      feedback: 'No speech detected. Please ensure your microphone is working and try again.',
      meta: { wordsPerMinute: 0, fillerRate: 0, pauseCount: 0 },
    }
  }

  // Calculate metrics
  const words = transcript.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const durationMinutes = durationMs / 60000
  const wordsPerMinute = durationMinutes > 0 ? Math.round(wordCount / durationMinutes) : 0

  // Content score from transcript (task-specific)
  let contentScore = getContentScore(type, question, transcript, wordsPerMinute)

  // Pronunciation + fluency from real provider when configured,
  // otherwise fall back to heuristic estimates.
  let pronunciationScore = 50
  let fluencyScore = 50
  let provider = 'none'
  let providerRaw: any

  const refText = question.promptText || question.title || ''
  try {
    const providerResult = await scorePronunciationFluency({
      audioUrl: input.audioUrl,
      refText,
      type,
    })
    if (providerResult) {
      pronunciationScore = providerResult.pronunciation || pronunciationScore
      fluencyScore = providerResult.fluency || fluencyScore
      if (providerResult.content && providerResult.content > contentScore) {
        contentScore = providerResult.content
      }
      provider = providerResult.provider
      providerRaw = providerResult.raw
    }
  } catch (e) {
    console.error('[speaking-score] pronunciation provider failed, using heuristic fallback', e)
  }

  if (provider === 'none') {
    const fallback = getFallbackPronunciationFluency(type, transcript, wordsPerMinute)
    pronunciationScore = fallback.pronunciation
    fluencyScore = fallback.fluency
  }

  const total = Math.round((contentScore + pronunciationScore + fluencyScore) / 3)

  return {
    content: contentScore,
    pronunciation: pronunciationScore,
    fluency: fluencyScore,
    total,
    rubric: getRubricForType(type),
    feedback: generateFeedback(type, total, wordsPerMinute),
    meta: {
      wordsPerMinute,
      fillerRate: calculateFillerRate(transcript),
      pauseCount: 0,
      provider,
      providerRaw,
    },
  }
}

function getContentScore(
  type: SpeakingType,
  question: SpeakingQuestion,
  transcript: string,
  wordsPerMinute: number
): number {
  switch (type) {
    case 'read_aloud':
      return scoreReadAloud(question, transcript, wordsPerMinute).content
    case 'repeat_sentence':
      return scoreRepeatSentence(question, transcript, wordsPerMinute).content
    case 'describe_image':
      return scoreDescribeImage(transcript, wordsPerMinute).content
    case 'retell_lecture':
      return scoreRetellLecture(transcript, wordsPerMinute).content
    case 'answer_short_question':
      return transcript.length > 3 ? 90 : 30
    case 'summarize_group_discussion':
    case 'respond_to_a_situation':
      return scoreDescribeImage(transcript, wordsPerMinute).content
    default:
      return 50
  }
}

function getFallbackPronunciationFluency(
  type: SpeakingType,
  transcript: string,
  wordsPerMinute: number
): { pronunciation: number; fluency: number } {
  const fallbackQuestion = {
    id: 'fallback',
    type,
    title: transcript,
    promptText: transcript,
  } as SpeakingQuestion

  switch (type) {
    case 'read_aloud': {
      const s = scoreReadAloud(fallbackQuestion, transcript, wordsPerMinute)
      return { pronunciation: s.pronunciation, fluency: s.fluency }
    }
    case 'repeat_sentence': {
      const s = scoreRepeatSentence(fallbackQuestion, transcript, wordsPerMinute)
      return { pronunciation: s.pronunciation, fluency: s.fluency }
    }
    case 'describe_image':
    case 'retell_lecture':
    case 'summarize_group_discussion':
    case 'respond_to_a_situation': {
      const s = scoreDescribeImage(transcript, wordsPerMinute)
      return { pronunciation: s.pronunciation, fluency: s.fluency }
    }
    case 'answer_short_question':
      return { pronunciation: 70, fluency: 70 }
    default:
      return { pronunciation: 50, fluency: 50 }
  }
}

function scoreReadAloud(
  question: SpeakingQuestion,
  transcript: string,
  wpm: number
): { content: number; pronunciation: number; fluency: number } {
  const promptText = question.promptText || question.title || ''
  const promptWords = promptText.toLowerCase().split(/\s+/).filter(Boolean)
  const transcriptWords = transcript.toLowerCase().split(/\s+/).filter(Boolean)

  // Content: how many words from the prompt were captured
  const matchedWords = transcriptWords.filter((word) => promptWords.includes(word))
  const contentScore = Math.min(90, Math.round((matchedWords.length / Math.max(promptWords.length, 1)) * 90))

  // Fluency based on WPM
  let fluencyScore = 50
  if (wpm >= 120 && wpm <= 160) fluencyScore = 90
  else if (wpm >= 100 && wpm <= 180) fluencyScore = 75
  else if (wpm >= 80) fluencyScore = 60

  // Pronunciation estimate
  const pronunciationScore = Math.min(90, Math.round((contentScore + fluencyScore) / 2))

  return { content: contentScore, pronunciation: pronunciationScore, fluency: fluencyScore }
}

function scoreRepeatSentence(
  question: SpeakingQuestion,
  transcript: string,
  wpm: number
): { content: number; pronunciation: number; fluency: number } {
  // Similar to read aloud but stricter on exact matching
  const original = question.promptText || question.title || ''
  const similarity = calculateSimilarity(original.toLowerCase(), transcript.toLowerCase())

  const contentScore = Math.min(90, Math.round(similarity * 90))
  const fluencyScore = wpm >= 100 && wpm <= 180 ? 80 : 60
  const pronunciationScore = Math.round((contentScore + fluencyScore) / 2)

  return { content: contentScore, pronunciation: pronunciationScore, fluency: fluencyScore }
}

function scoreDescribeImage(
  transcript: string,
  wpm: number
): { content: number; pronunciation: number; fluency: number } {
  const wordCount = transcript.split(/\s+/).filter(Boolean).length

  // Content based on word count and variety
  let contentScore = 40
  if (wordCount >= 60) contentScore = 85
  else if (wordCount >= 40) contentScore = 70
  else if (wordCount >= 25) contentScore = 55

  // Fluency
  let fluencyScore = 50
  if (wpm >= 100 && wpm <= 160) fluencyScore = 85
  else if (wpm >= 80 && wpm <= 180) fluencyScore = 70

  const pronunciationScore = Math.round((contentScore + fluencyScore) / 2)

  return { content: contentScore, pronunciation: pronunciationScore, fluency: fluencyScore }
}

function scoreRetellLecture(
  transcript: string,
  wpm: number
): { content: number; pronunciation: number; fluency: number } {
  // Similar to describe image
  return scoreDescribeImage(transcript, wpm)
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/).filter(Boolean)
  const words2 = str2.split(/\s+/).filter(Boolean)

  if (words1.length === 0 || words2.length === 0) return 0

  let matches = 0
  for (const word of words2) {
    if (words1.includes(word)) matches++
  }

  return matches / Math.max(words1.length, words2.length)
}

function calculateFillerRate(transcript: string): number {
  const fillers = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'basically']
  const words = transcript.toLowerCase().split(/\s+/)
  let fillerCount = 0

  for (const word of words) {
    if (fillers.includes(word)) fillerCount++
  }

  return words.length > 0 ? Math.round((fillerCount / words.length) * 100) : 0
}

function getRubricForType(type: SpeakingType): string {
  const rubrics: Record<SpeakingType, string> = {
    read_aloud: 'Content: Word accuracy and completeness. Pronunciation: Clarity and stress. Fluency: Smooth delivery.',
    repeat_sentence: 'Content: Sentence accuracy. Pronunciation: Native-like sounds. Fluency: Natural rhythm.',
    describe_image: 'Content: Key features covered. Organization: Logical flow. Fluency: Smooth delivery.',
    retell_lecture: 'Content: Main points captured. Coherence: Logical structure. Fluency: Natural speech.',
    answer_short_question: 'Content: Correct answer. Pronunciation: Clear delivery.',
    summarize_group_discussion: 'Content: Key points summarized. Organization: Logical flow. Fluency: Smooth delivery.',
    respond_to_a_situation: 'Content: Appropriate response. Pronunciation: Clear delivery. Fluency: Natural speech.',
  }
  return rubrics[type] || 'Standard PTE Academic speaking rubric.'
}

function generateFeedback(type: SpeakingType, score: number, wpm: number): string {
  let feedback = ''

  if (score >= 80) {
    feedback = 'Excellent performance! Your response demonstrated strong command of spoken English.'
  } else if (score >= 60) {
    feedback = 'Good attempt. Continue practicing to improve fluency and pronunciation.'
  } else if (score >= 40) {
    feedback = 'Fair performance. Focus on speaking clearly and maintaining a steady pace.'
  } else {
    feedback = 'More practice needed. Work on reading aloud daily to build confidence.'
  }

  if (wpm < 80) {
    feedback += ' Your speaking pace was slow - aim for 120-150 words per minute.'
  } else if (wpm > 180) {
    feedback += ' Try to slow down slightly for clearer pronunciation.'
  }

  return feedback
}
