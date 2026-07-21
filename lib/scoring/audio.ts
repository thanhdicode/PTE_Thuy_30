import 'server-only'
import { spawn } from 'node:child_process'
import { promises as fs, createReadStream } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export async function normalizeAudio(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      inputPath,
      '-ac',
      '1',
      '-ar',
      '16000',
      '-sample_fmt',
      's16',
      '-y',
      outputPath,
    ])

    let stderr = ''
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`ffmpeg failed (code ${code}): ${stderr}`))
      }
    })

    ffmpeg.on('error', reject)
  })
}

export function createTempAudioPath(prefix: string, ext: string): string {
  const tmpDir = path.join(os.tmpdir(), 'pte-scoring')
  fs.mkdir(tmpDir, { recursive: true }).catch(() => {})
  return path.join(tmpDir, `${prefix}-${Date.now()}.${ext}`)
}

export async function downloadAudio(audioUrl: string): Promise<Buffer> {
  const isLocal = audioUrl.startsWith('/')
  const url = isLocal
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${audioUrl}`
    : audioUrl

  if (isLocal && url.startsWith('http://localhost')) {
    const localPath = path.join(
      process.cwd(),
      'public',
      audioUrl.replace(/^\//, '')
    )
    try {
      return await fs.readFile(localPath)
    } catch {
      // fall through to fetch
    }
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download audio: ${res.status} ${url}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

export { createReadStream, fs, path }
