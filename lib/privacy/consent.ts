import 'server-only'
import { db } from '@/lib/db/drizzle'
import { privacyConsent, type PrivacyConsent } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'

export type ConsentPurpose = 'audio_recording' | 'analytics' | 'payment' | 'marketing'

export interface ConsentRecordInput {
  userId: string
  purpose: ConsentPurpose
  granted: boolean
  ipAddress?: string | null
  userAgent?: string | null
}

export async function recordConsent(input: ConsentRecordInput): Promise<PrivacyConsent> {
  const [record] = await db
    .insert(privacyConsent)
    .values({
      userId: input.userId,
      purpose: input.purpose,
      granted: input.granted,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    })
    .onConflictDoUpdate({
      target: [privacyConsent.userId, privacyConsent.purpose],
      set: {
        granted: input.granted,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        updatedAt: new Date(),
      },
    })
    .returning()

  return record
}

export async function hasConsent(
  userId: string,
  purpose: ConsentPurpose
): Promise<boolean> {
  const [row] = await db
    .select({ granted: privacyConsent.granted })
    .from(privacyConsent)
    .where(
      and(
        eq(privacyConsent.userId, userId),
        eq(privacyConsent.purpose, purpose)
      )
    )
    .orderBy(desc(privacyConsent.createdAt))
    .limit(1)

  return row?.granted ?? false
}

export async function getConsentHistory(
  userId: string
): Promise<PrivacyConsent[]> {
  return db
    .select()
    .from(privacyConsent)
    .where(eq(privacyConsent.userId, userId))
    .orderBy(desc(privacyConsent.createdAt))
    .limit(100)
}

export async function revokeAllConsent(userId: string): Promise<void> {
  await db
    .update(privacyConsent)
    .set({ granted: false, updatedAt: new Date() })
    .where(eq(privacyConsent.userId, userId))
}
