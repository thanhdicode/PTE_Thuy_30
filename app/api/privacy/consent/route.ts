import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/server'
import { recordConsent, hasConsent, getConsentHistory, type ConsentPurpose } from '@/lib/privacy/consent'

const VALID_PURPOSES: ConsentPurpose[] = [
  'audio_recording',
  'analytics',
  'payment',
  'marketing',
]

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const purpose = body.purpose
  const granted = body.granted === true

  if (!VALID_PURPOSES.includes(purpose)) {
    return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
  }

  const record = await recordConsent({
    userId: session.user.id,
    purpose,
    granted,
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  })

  return NextResponse.json({ record })
}

export async function GET(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const purpose = url.searchParams.get('purpose') as ConsentPurpose | null

  if (purpose && !VALID_PURPOSES.includes(purpose)) {
    return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
  }

  if (purpose) {
    const granted = await hasConsent(session.user.id, purpose)
    return NextResponse.json({ purpose, granted })
  }

  const history = await getConsentHistory(session.user.id)
  return NextResponse.json({ history })
}
