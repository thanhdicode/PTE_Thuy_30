import 'server-only'
import crypto from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

function getMasterKey(): Buffer {
  const secret = process.env.AUDIO_ENCRYPTION_KEY
  if (!secret || secret.length < 32) {
    throw new Error('AUDIO_ENCRYPTION_KEY must be at least 32 characters')
  }
  return crypto.scryptSync(secret, 'pte-talents-audio-salt', KEY_LENGTH)
}

function getUserKey(userId: string): Buffer {
  const master = getMasterKey()
  const derived = crypto.hkdfSync(
    'sha256',
    master,
    userId,
    'audio-encryption',
    KEY_LENGTH
  )
  return Buffer.from(derived).subarray(0, KEY_LENGTH)
}

export interface EncryptedAudio {
  ciphertext: string // base64
  iv: string // base64
  tag: string // base64
  userId: string
}

export function encryptAudio(buffer: Buffer, userId: string): EncryptedAudio {
  const key = getUserKey(userId)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    userId,
  }
}

export function decryptAudio(payload: EncryptedAudio): Buffer {
  const key = getUserKey(payload.userId)
  const iv = Buffer.from(payload.iv, 'base64')
  const tag = Buffer.from(payload.tag, 'base64')
  const ciphertext = Buffer.from(payload.ciphertext, 'base64')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}
