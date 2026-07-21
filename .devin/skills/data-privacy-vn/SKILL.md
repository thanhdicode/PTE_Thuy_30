---
name: data-privacy-vn
description: "Protect learner personal data under Vietnam's Personal Data Protection Law (PDPL) and Decree 356/2025/ND-CP. Use when collecting, storing, encrypting, or deleting learner audio, profile, payment, and behavioral data in PTE Talents."
argument-hint: "[data-type|action]"
model: sonnet
allowed-tools:
  - read
  - grep
  - exec
  - web_search
  - web_get_contents
triggers:
  - user
  - model
---

# Data Privacy Vietnam (PDPL / Decree 356)

> **Quick Guide:** Vietnam's PDPL took effect 1 Jan 2026, and Decree 356/2025/ND-CP details consent, data-subject rights, encryption, retention, and cross-border rules. For PTE Talents: obtain clear verifiable consent before recording audio, encrypt recordings and PII at rest and in transit, retain only as long as legally/operationally necessary, and implement access/export/deletion flows.

---

<critical_requirements>

## CRITICAL: Before Using This Skill

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST obtain clear, verifiable consent before collecting voice recordings, photos, identity documents, or any sensitive personal data)**

**(You MUST encrypt learner audio and PII at rest using AES-256-GCM and in transit using TLS 1.2+)**

**(You MUST NEVER commit encryption keys, KMS credentials, or personal data to version control)**

**(You MUST implement data-subject rights: access, rectification, erasure, and restricted processing)**

**(You MUST define and enforce retention periods; delete raw audio after the period expires unless legally required to keep it)**

**(You MUST keep an audit log of who accesses or exports personal data)**

</critical_requirements>

---

**Auto-detection:** PDPL, Decree 356, data privacy, personal data protection, consent, encryption, PII, sensitive data, GDPR-style, data subject rights, retention, deletion, audio recording consent, Vietnam law

**When to use:**

- Collecting learner registration data, voice recordings, payment info, or behavioral logs
- Designing encryption, retention, and deletion policies
- Implementing "download my data" or "delete my account" features
- Auditing access to personal data

**When NOT to use:**

- Generic application logging without PII (use `api-observability-axiom-pino-sentry`)
- Payment gateway security only (use `payment-vietnam` and `shared-security-auth-security`)
- International GDPR compliance as the primary frame (PDPL has Vietnam-specific requirements)

---

<philosophy>

## Philosophy

Vietnam's data-protection regime is built on **lawful basis**, **purpose limitation**, **data minimization**, **security**, and **accountability**:

1. **Consent must be clear, specific, and verifiable** — no pre-ticked boxes, no bundled forced consent.
2. **Encryption is mandatory for sensitive data** — including voice recordings, identity documents, and biometrics.
3. **Retention must be justified** — store the minimum time necessary and delete securely afterwards.
4. **Data subjects have enforceable rights** — you must provide mechanisms to exercise them and respond within timelines set by Decree 356.
5. **Auditability** — log every access, export, and deletion of personal data.

</philosophy>

---

<patterns>

## Core Patterns

### Pattern 1: Consent Capture and Storage

Store consent as a timestamped, immutable record linked to the user.

```typescript
// Prisma schema excerpt
model ConsentRecord {
  id        String   @id @default(cuid())
  userId    String
  purpose   String   // e.g. "voice_recording_for_pte_scoring"
  grantedAt DateTime @default(now())
  ip        String?
  userAgent String?
  version   String   // version of the consent text shown
  withdrawn Boolean  @default(false)
  @@index([userId, purpose])
}
```

```typescript
export async function recordConsent(
  userId: string,
  purpose: string,
  req: { ip: string; userAgent: string },
) {
  return prisma.consentRecord.create({
    data: { userId, purpose, ip: req.ip, userAgent: req.userAgent, version: 'v1.0' },
  });
}

export async function hasConsent(userId: string, purpose: string) {
  const latest = await prisma.consentRecord.findFirst({
    where: { userId, purpose, withdrawn: false },
    orderBy: { grantedAt: 'desc' },
  });
  return Boolean(latest && latest.grantedAt > Date.now() - 365 * 24 * 60 * 60 * 1000); // annual re-consent
}
```

**Why good:** Consent must be verifiable; storing IP/userAgent/version supports audit and re-consent tracking.

---

### Pattern 2: Audio Encryption at Rest

Use envelope encryption: a data-encryption key (DEK) encrypts the file, and the DEK is encrypted by a master key from a KMS.

```typescript
import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export function encryptBuffer(plaintext: Buffer, key: Buffer): { ciphertext: Buffer; iv: Buffer; tag: Buffer } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return { ciphertext: encrypted, iv, tag: cipher.getAuthTag() };
}

export async function storeRecording(userId: string, audioBuffer: Buffer) {
  const dek = crypto.randomBytes(32);
  const { ciphertext, iv, tag } = encryptBuffer(audioBuffer, dek);

  // In production: wrap DEK with AWS KMS / Azure Key Vault / HashiCorp Vault
  const encryptedDek = await kmsWrap(dek);

  await s3.putObject({
    Bucket: process.env.RECORDING_BUCKET!,
    Key: `recordings/${userId}/${crypto.randomUUID()}.enc`,
    Body: Buffer.concat([iv, tag, ciphertext]),
    Metadata: { 'x-amz-meta-encrypted-dek': encryptedDek },
  });
}
```

**Why good:** `AES-256-GCM` provides confidentiality and authenticity. Keeping the DEK out of object storage requires a KMS breach plus object-storage breach to decrypt.

---

### Pattern 3: Decryption and Access Audit

```typescript
export async function getRecording(key: string, actorId: string) {
  await auditLog.create({
    actorId,
    action: 'RECORDING_ACCESS',
    targetKey: key,
    timestamp: new Date(),
  });

  const obj = await s3.getObject({ Bucket: process.env.RECORDING_BUCKET!, Key: key });
  const encryptedDek = obj.Metadata?.['x-amz-meta-encrypted-dek'];
  if (!encryptedDek) throw new Error('Missing encrypted DEK');

  const dek = await kmsUnwrap(encryptedDek);
  const body = await obj.Body!.transformToByteArray();
  const iv = body.slice(0, IV_LENGTH);
  const tag = body.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = body.slice(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
```

**Why good:** Every access is logged; decryption uses the stored tag for authenticated encryption.

---

### Pattern 4: Retention and Scheduled Deletion

```typescript
// prisma/schema.prisma
model RecordingRetention {
  recordingKey String   @id
  userId       String
  createdAt    DateTime @default(now())
  retainUntil  DateTime
}

// BullMQ worker (see api-queue-bullmq)
export async function purgeExpiredRecordings() {
  const expired = await prisma.recordingRetention.findMany({
    where: { retainUntil: { lt: new Date() } },
    take: 500,
  });

  await Promise.all(
    expired.map(async (r) => {
      await s3.deleteObject({ Bucket: process.env.RECORDING_BUCKET!, Key: r.recordingKey });
      await prisma.recordingRetention.delete({ where: { recordingKey: r.recordingKey } });
      await auditLog.create({ action: 'RECORDING_DELETED', targetKey: r.recordingKey, actorId: 'system' });
    }),
  );
}
```

**Why good:** Automated deletion honors PDPL minimization/retention principles and reduces breach scope.

---

### Pattern 5: Data Subject Rights Endpoints

```typescript
// app/api/me/data/route.ts
export async function GET() {
  // Export all personal data (pseudonymize where possible)
  const data = await exportUserData(userId);
  return Response.json(data);
}

export async function DELETE() {
  // Soft-delete account, schedule hard deletion after legal hold period
  await requestAccountDeletion(userId);
  return new Response(null, { status: 202 });
}

export async function PATCH(req: Request) {
  const { field, value } = await req.json();
  // Validate and update rectification
  await updatePersonalData(userId, field, value);
  return Response.json({ updated: true });
}
```

**Why good:** PDPL grants data subjects access, rectification, and erasure; these endpoints form the implementation boundary.

---

### Pattern 6: Minimize PII in Logs

```typescript
import { pino } from 'pino';

const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'password', '*.email', '*.phone', '*.voiceRecording'],
    remove: true,
  },
});
```

**Why good:** Prevents accidental logging of sensitive data, reducing breach impact.

</patterns>

---

<decision_framework>

## Decision Framework

### Is This Data Sensitive Under PDPL?

```
Voice recordings, ID documents, biometrics, health data, financial account details -> YES -> encrypt + explicit consent
Name, email, phone, study progress, IP address, device ID                  -> Personal data -> inform + lawful basis
Anonymized analytics aggregates (cannot be re-identified)                    -> Not personal data
```

### Retention Period

```
Raw speaking recordings for scoring/feedback -> 30-90 days after final score delivered
Payment records for tax/audit               -> 10 years (consult accountant)
Account profile                             -> Until account deletion + legal hold
Consent records                             -> 10 years after withdrawal
```

</decision_framework>

---

<red_flags>

## RED FLAGS

**High Priority Issues:**

- Recording audio or collecting ID without verifiable consent
- Storing learner audio or PII unencrypted
- Committing encryption keys, KMS credentials, or sample PII to git
- No data-subject access/export/deletion mechanism
- Indefinite retention of raw audio

**Medium Priority Issues:**

- Logging PII to plain text or Sentry without redaction
- No audit log for personal-data access
- No process for handling data-subject requests within PDPL timelines
- Storing consent without timestamp/version

**Common Mistakes:**

- Treating encrypted data as "safe to share" without access controls
- Using ECB mode or AES without authentication tag
- Confusing "anonymized" with "hashed email" (hashes can still identify)
- Keeping raw audio for "future use" beyond the defined retention period

</red_flags>

---

<critical_reminders>

## CRITICAL REMINDERS

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST obtain clear, verifiable consent before collecting voice recordings or sensitive data)**

**(You MUST encrypt learner audio and PII at rest using AES-256-GCM and in transit using TLS 1.2+)**

**(You MUST NEVER commit encryption keys or personal data to version control)**

**(You MUST implement data-subject rights: access, rectification, erasure, and restricted processing)**

**(You MUST define and enforce retention periods and delete raw audio after it expires)**

**(You MUST keep an audit log of who accesses or exports personal data)**

**Failure to follow these rules will violate Vietnam PDPL/Decree 356 and create severe legal and reputational risk for PTE Talents.**

</critical_reminders>
