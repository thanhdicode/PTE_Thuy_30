import 'server-only'
import { isConfigured as azureConfigured, scoreAzure } from './providers/azure'
import {
  isConfigured as speechSuperConfigured,
  scoreSpeechSuper,
} from './providers/speechsuper'

export interface PronunciationFluencyScore {
  pronunciation: number
  fluency: number
  overall: number
  content?: number
  provider: 'speechsuper' | 'azure' | 'none'
  raw?: any
}

export function isScoringConfigured(): boolean {
  return speechSuperConfigured() || azureConfigured()
}

export async function scorePronunciationFluency({
  audioUrl,
  refText,
  type,
}: {
  audioUrl: string
  refText: string
  type:
    | 'read_aloud'
    | 'repeat_sentence'
    | 'describe_image'
    | 'retell_lecture'
    | 'answer_short_question'
    | 'summarize_group_discussion'
    | 'respond_to_a_situation'
}): Promise<PronunciationFluencyScore | null> {
  if (speechSuperConfigured()) {
    const coreType =
      type === 'read_aloud' ? 'paragraph.eval.promax' : 'sent.eval.promax'
    const result = await scoreSpeechSuper(audioUrl, refText, coreType)
    return {
      pronunciation: result.pronunciation,
      fluency: result.fluency,
      overall: result.overall,
      content: result.content,
      provider: 'speechsuper',
      raw: result.raw,
    }
  }

  if (azureConfigured()) {
    const result = await scoreAzure(audioUrl, refText)
    return {
      pronunciation: result.pronunciation,
      fluency: result.fluency,
      overall: result.overall,
      content: result.content,
      provider: 'azure',
      raw: result.raw,
    }
  }

  return null
}
