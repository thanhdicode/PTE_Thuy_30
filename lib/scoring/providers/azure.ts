import 'server-only'
import { promises as fs } from 'node:fs'
import { normalizeAudio, createTempAudioPath, downloadAudio } from '../audio'

export interface AzureResult {
  overall: number
  pronunciation: number
  fluency: number
  content?: number
  raw: any
}

export function isConfigured() {
  return !!(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION)
}

export async function scoreAzure(
  audioUrl: string,
  refText: string
): Promise<AzureResult> {
  if (!isConfigured()) {
    throw new Error('Azure Speech credentials not configured')
  }

  const key = process.env.AZURE_SPEECH_KEY!
  const region = process.env.AZURE_SPEECH_REGION!

  const originalPath = createTempAudioPath('azure-input', 'webm')
  const wavPath = createTempAudioPath('azure-normalized', 'wav')

  try {
    const buffer = await downloadAudio(audioUrl)
    await fs.writeFile(originalPath, buffer)
    await normalizeAudio(originalPath, wavPath)

    const wavBuffer = await fs.readFile(wavPath)

    // Azure pronunciation assessment endpoint.
    const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'audio/wav',
        'Pronunciation-Assessment': 'false',
      },
      body: wavBuffer as any,
    })

    const raw = await res.json()
    if (!res.ok) {
      throw new Error(`Azure Speech failed: ${res.status} ${JSON.stringify(raw)}`)
    }

    return {
      overall: Number(raw.PronunciationAssessment?.OverallScore || 0),
      pronunciation: Number(raw.PronunciationAssessment?.PronunciationScore || 0),
      fluency: Number(raw.PronunciationAssessment?.FluencyScore || 0),
      content: Number(raw.PronunciationAssessment?.CompletenessScore || 0),
      raw,
    }
  } finally {
    await Promise.all([
      fs.unlink(originalPath).catch(() => {}),
      fs.unlink(wavPath).catch(() => {}),
    ])
  }
}
