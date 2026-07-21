import 'server-only'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'
import { normalizeAudio, createTempAudioPath, downloadAudio } from '../audio'

const SPEECHSUPER_HOST = 'api.speechsuper.com'

function speechSuperSig(appKey: string, secretKey: string, timestamp: string) {
  return crypto
    .createHash('sha1')
    .update(`${appKey}${timestamp}${secretKey}`)
    .digest('hex')
}

export function isConfigured() {
  return !!(
    process.env.SPEECHSUPER_APP_KEY && process.env.SPEECHSUPER_SECRET_KEY
  )
}

export interface SpeechSuperResult {
  overall: number
  pronunciation: number
  fluency: number
  content?: number
  raw: string
}

export async function scoreSpeechSuper(
  audioUrl: string,
  refText: string,
  coreType: 'sent.eval.promax' | 'word.eval.promax' | 'paragraph.eval.promax' =
    'sent.eval.promax'
): Promise<SpeechSuperResult> {
  if (!isConfigured()) {
    throw new Error('SpeechSuper credentials not configured')
  }

  const appKey = process.env.SPEECHSUPER_APP_KEY!
  const secretKey = process.env.SPEECHSUPER_SECRET_KEY!

  const originalPath = createTempAudioPath('speechsuper-input', 'webm')
  const wavPath = createTempAudioPath('speechsuper-normalized', 'wav')

  try {
    const buffer = await downloadAudio(audioUrl)
    await fs.writeFile(originalPath, buffer)
    await normalizeAudio(originalPath, wavPath)

    const userId = 'pte-user'
    const timestamp = Date.now().toString()
    const tokenId = crypto.randomUUID().toUpperCase()

    const params = {
      connect: {
        cmd: 'connect',
        param: {
          sdk: { version: 16777472, source: 9, protocol: 2 },
          app: {
            applicationId: appKey,
            sig: speechSuperSig(appKey, secretKey, timestamp),
            timestamp,
          },
        },
      },
      start: {
        cmd: 'start',
        param: {
          app: {
            applicationId: appKey,
            sig: speechSuperSig(appKey, secretKey, `${timestamp}${userId}`),
            userId,
            timestamp,
          },
          audio: {
            audioType: 'wav',
            sampleRate: '16000',
            channel: 1,
            sampleBytes: 2,
          },
          request: { coreType, refText, tokenId },
        },
      },
    }

    const fd = new FormData()
    fd.append('text', JSON.stringify(params))

    const wavBuffer = await fs.readFile(wavPath)
    fd.append('audio', new File([wavBuffer], 'audio.wav', { type: 'audio/wav' }))

    const res = await fetch(`https://${SPEECHSUPER_HOST}/${coreType}`, {
      method: 'POST',
      headers: { 'Request-Index': '0' },
      body: fd as any,
    })

    const raw = await res.text()
    if (!res.ok) {
      throw new Error(`SpeechSuper failed: ${res.status} ${raw.slice(0, 200)}`)
    }

    const parsed = JSON.parse(raw)
    const result =
      parsed?.result || parsed?.rsp?.result || parsed?.rsp?.recog_result || {}

    return {
      overall: Number(result.overall || result.score || 0),
      pronunciation: Number(result.pronunciation || result.accuracy || 0),
      fluency: Number(result.fluency || result.smoothness || 0),
      content: Number(result.content || result.integrity || 0),
      raw,
    }
  } finally {
    await Promise.all([
      fs.unlink(originalPath).catch(() => {}),
      fs.unlink(wavPath).catch(() => {}),
    ])
  }
}
