---
name: pronunciation-fluency-scoring
description: "Score spoken English pronunciation and fluency for PTE Academic using SpeechSuper or Azure Speech PronunciationAssessment. Use when implementing Speaking question scoring (Read Aloud, Repeat Sentence, Describe Image) and when converting API scores into PTE 10-90 rubrics."
argument-hint: "[provider|task]"
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

# Pronunciation & Fluency Scoring

> **Quick Guide:** Use a dedicated pronunciation assessment API (SpeechSuper or Azure Speech). Do NOT infer pronunciation correctness from a Whisper transcript alone. Audio must be 16-bit / 16 kHz / mono. Always send the reference text for read-aloud tasks and map API phoneme/word/fluency/prosody scores to the PTE 10-90 rubric with calibration.

---

<critical_requirements>

## CRITICAL: Before Using This Skill

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST use SpeechSuper or Azure Speech PronunciationAssessment for pronunciation/fluency — never derive scores from Whisper transcript text only)**

**(You MUST provide the reference text for read-along scoring (Read Aloud, Repeat Sentence, Answer Short Question)**

**(You MUST pre-process audio to 16-bit, 16 kHz, mono before sending to the scoring API)**

**(You MUST keep API credentials (appKey/secretKey/subscriptionKey) on the server — never expose them in the client)**

**(You MUST encrypt stored audio and scores at rest, and delete raw recordings after the retention period defined in data-privacy-vn)**

</critical_requirements>

---

**Auto-detection:** SpeechSuper, Azure Speech, pronunciation, fluency, PTE speaking, Read Aloud, Repeat Sentence, Describe Image, phoneme score, prosody, oral fluency, pronunciation assessment, speaking score

**When to use:**

- Scoring PTE Speaking items that require pronunciation, fluency, orintonation feedback
- Comparing learner audio against a reference text or free-response prompt
- Calibrating AI scores against human PTE teacher scores

**When NOT to use:**

- Transcribing audio to text only (use `ai-provider-openai-whisper` instead)
- Grading Writing content (use `ai-provider-openai-sdk` with PTE rubric)
- When the user only wants a rough transcript, not a pronunciation score

---

<philosophy>

## Philosophy

Pronunciation scoring is **not** transcript matching. A learner can say every word in the transcript but still be unintelligible. Real assessment evaluates:

- **Pronunciation** at phoneme, syllable, word, and sentence levels
- **Fluency** via words correct per minute, pauses, speaking rate
- **Prosody** such as stress, liaisons, and intonation
- **Completeness** and **content relevance** for extended responses

Therefore, always call an API designed for pronunciation assessment and treat the resulting scores as primary inputs to the final PTE 10-90 mapping.

</philosophy>

---

<patterns>

## Core Patterns

### Pattern 1: Audio Preprocessing and Validation

Normalize audio before sending to any provider.

```typescript
import { spawn } from 'node:child_process';

export async function normalizeAudio(inputPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-ac', '1',           // mono
      '-ar', '16000',       // 16 kHz
      '-sample_fmt', 's16', // 16-bit
      '-y', outputPath,
    ]);
    ffmpeg.on('close', (code) => (code === 0 ? resolve(undefined) : reject(new Error('ffmpeg failed'))));
  });
}

export function validateAudioMeta(buffer: Buffer, expectedMaxBytes = 25 * 1024 * 1024) {
  if (buffer.byteLength > expectedMaxBytes) {
    throw new Error('Audio file exceeds provider size limit');
  }
}
```

**Why good:** SpeechSuper and Azure both recommend 16 kHz / 16-bit / mono; normalization prevents API rejection and improves score consistency.

---

### Pattern 2: SpeechSuper Scripted Evaluation

Use `coreType` values such as `sent.eval.promax` (sentence), `word.eval.promax` (word), or `paragraph.eval.promax` when the learner reads a known text.

```typescript
import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';

const SPEECHSUPER_HOST = 'api.speechsuper.com';

function speechSuperSig(appKey: string, secretKey: string, timestamp: string) {
  return crypto.createHash('sha1').update(`${appKey}${timestamp}${secretKey}`).digest('hex');
}

export async function scoreSpeechSuperScripted(
  audioPath: string,
  refText: string,
  coreType: 'sent.eval.promax' | 'word.eval.promax' | 'paragraph.eval.promax' = 'sent.eval.promax',
) {
  const appKey = process.env.SPEECHSUPER_APP_KEY!;
  const secretKey = process.env.SPEECHSUPER_SECRET_KEY!;
  const userId = 'pte-user';
  const timestamp = Date.now().toString();
  const tokenId = crypto.randomUUID().toUpperCase();

  const params = {
    connect: {
      cmd: 'connect',
      param: {
        sdk: { version: 16777472, source: 9, protocol: 2 },
        app: { applicationId: appKey, sig: speechSuperSig(appKey, secretKey, timestamp), timestamp },
      },
    },
    start: {
      cmd: 'start',
      param: {
        app: { applicationId: appKey, sig: speechSuperSig(appKey, secretKey, `${timestamp}${userId}`), userId, timestamp },
        audio: { audioType: 'wav', sampleRate: '16000', channel: 1, sampleBytes: 2 },
        request: { coreType, refText, tokenId },
      },
    },
  };

  const fd = new FormData();
  fd.append('text', JSON.stringify(params));
  fd.append('audio', createReadStream(audioPath));

  const res = await fetch(`https://${SPEECHSUPER_HOST}/${coreType}`, {
    method: 'POST',
    headers: { 'Request-Index': '0', ...fd.getHeaders() },
    body: fd as any,
  });

  if (!res.ok) throw new Error(`SpeechSuper failed: ${res.status}`);
  return res.text();
}
```

**Why good:** The start signature includes `userId`; the audio spec matches the required 16 kHz mono format; the request is sent as multipart/form-data per SpeechSuper protocol.

---

### Pattern 3: SpeechSuper Unscripted / Spontaneous Speech

For `Describe Image` or `Retell Lecture` where there is no fixed reference text, use `speak.eval.pro` and provide a `question_prompt`.

```typescript
export async function scoreSpeechSuperUnscripted(
  audioPath: string,
  questionPrompt: string,
  testType: 'ielts' | 'pte' = 'pte',
) {
  const coreType = 'speak.eval.pro';
  const request = {
    coreType,
    test_type: testType,
    question_prompt: questionPrompt,
    model: 'non_native', // or 'native' for native-like speakers
    penalize_offtopic: 1,
  };
  // ... same FormData signing as Pattern 2 with request containing the above fields
  return scoreSpeechSuperScripted(audioPath, '', coreType);
}
```

**Why good:** `question_prompt` lets the API penalize irrelevant content; `penalize_offtopic` enforces task relevance.

---

### Pattern 4: Azure Speech PronunciationAssessment

Use the official `@azure/ai-speech` SDK or REST endpoint for granular pronunciation, fluency, and prosody scores.

```typescript
import { SpeechConfig, AudioConfig, SpeechRecognizer, PronunciationAssessmentConfig, PronunciationAssessmentGradingSystem, PronunciationAssessmentGranularity } from 'microsoft-cognitiveservices-speech-sdk';

export async function scoreAzurePronunciation(audioPath: string, referenceText: string) {
  const speechConfig = SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!,
  );
  speechConfig.speechRecognitionLanguage = 'en-US';

  const pronunciationConfig = new PronunciationAssessmentConfig(
    referenceText,
    PronunciationAssessmentGradingSystem.HundredMark,
    PronunciationAssessmentGranularity.Phoneme,
    true,
  );
  pronunciationConfig.enableProsodyAssessment = true;

  const audioConfig = AudioConfig.fromWavFileInput(audioPath);
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  pronunciationConfig.applyTo(recognizer);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        const json = result.properties.getProperty('SpeechServiceResponse_JsonResult');
        const assessment = JSON.parse(json)?.NBest?.[0]?.PronunciationAssessment;
        resolve({
          overallScore: assessment?.PronunciationScore,
          accuracyScore: assessment?.AccuracyScore,
          fluencyScore: assessment?.FluencyScore,
          completenessScore: assessment?.CompletenessScore,
          prosodyScore: assessment?.ProsodyScore,
        });
        recognizer.close();
      },
      (err) => reject(err),
    );
  });
}
```

**Why good:** Azure returns `PronunciationScore`, `AccuracyScore`, `FluencyScore`, `CompletenessScore`, and `ProsodyScore` — enough to build a calibrated PTE mapping.

---

### Pattern 5: Map API Scores to PTE 10-90

Calibration is required. Start with a linear mapping and adjust with teacher-labeled samples.

```typescript
type PteScores = {
  pronunciation: number;
  oralFluency: number;
  content?: number;
};

export function mapToPte10_90(
  apiScores: { pronunciation: number; fluency: number; completeness?: number; prosody?: number },
  weights = { pronunciation: 0.35, fluency: 0.35, completeness: 0.2, prosody: 0.1 },
): PteScores {
  const raw =
    apiScores.pronunciation * weights.pronunciation +
    apiScores.fluency * weights.fluency +
    (apiScores.completeness ?? 100) * weights.completeness +
    (apiScores.prosody ?? 100) * weights.prosody;

  // Linear map [0,100] -> [10,90]; calibrate with teacher data
  const pte = Math.round((raw / 100) * 80 + 10);
  return {
    pronunciation: pte,
    oralFluency: pte,
  };
}
```

**Why good:** API scores are provider-specific; a calibrated mapping makes them comparable across SpeechSuper/Azure and aligned with PTE 10-90.

---

### Pattern 6: Async Scoring Job with BullMQ

For Describe Image / Retell Lecture, scoring can take 5-30 seconds. Queue it.

```typescript
import { Queue } from 'bullmq';

const speakingScoreQueue = new Queue('speaking-score', { connection: redisConnection });

export async function enqueueSpeakingScore(
  attemptId: string,
  audioPath: string,
  referenceText: string,
  taskType: string,
) {
  return speakingScoreQueue.add(
    'score',
    { attemptId, audioPath, referenceText, taskType },
    { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
  );
}
```

Use `api-queue-bullmq` for worker implementation. Store the result and delete or archive the raw audio after the retention period.

**Why good:** Decouples recording upload from scoring latency; retries provider flakiness; keeps the test UI responsive.

---

### Pattern 7: Caching and Cost Control

Cache normalized audio and score results per (referenceTextHash + audioHash) to avoid re-scoring identical submissions.

```typescript
import { createHash } from 'node:crypto';

function cacheKey(referenceText: string, audioBuffer: Buffer) {
  return `pronunciation:${createHash('sha256').update(referenceText + audioBuffer.toString('base64')).digest('hex')}`;
}

// Check cache in Redis; if miss, call provider and store with TTL 30 days
```

**Why good:** Speaking APIs are metered per call; caching prevents duplicate charges for retakes and retries.

</patterns>

---

<decision_framework>

## Decision Framework

### Which Provider to Use

```
Need phoneme/syllable/word/sentence detail and PTE-specific rubric? -> SpeechSuper
Need official Microsoft SDK, prosody, and Azure ecosystem?          -> Azure Speech
Need free/cheap transcription fallback only?                        -> Whisper (but do NOT use for pronunciation score)
```

### Scripted vs Unscripted

```
Read Aloud / Repeat Sentence / Answer Short Question -> Scripted (reference text known)
Describe Image / Retell Lecture / Answer Short Question free form -> Unscripted (question prompt)
```

</decision_framework>

---

<red_flags>

## RED FLAGS

**High Priority Issues:**

- Deriving pronunciation/fluency score from Whisper transcript text alone
- Sending API secrets (appKey, secretKey, subscriptionKey) to the browser
- Storing or transmitting raw learner audio unencrypted
- Scoring without a reference text for read-aloud items
- Using audio with sample rate < 16 kHz or stereo for SpeechSuper/Azure

**Medium Priority Issues:**

- No normalization/ffmpeg pre-processing step
- Skipping calibration against human PTE teacher scores
- Not handling provider downtime or slow responses with a queue
- Keeping raw audio indefinitely

**Common Mistakes:**

- Confusing SpeechSuper `coreType` values (`sent.eval.promax` vs `speak.eval.pro`)
- Forgetting to compute the `sig` field with `appKey + timestamp + secretKey` and `appKey + timestamp + userId + secretKey`
- Sending `mp3` when provider documentation recommends `wav`
- Treating Azure `PronunciationScore` as the final PTE score without mapping

</red_flags>

---

<critical_reminders>

## CRITICAL REMINDERS

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST use SpeechSuper or Azure Speech PronunciationAssessment for pronunciation/fluency — never derive scores from Whisper transcript text only)**

**(You MUST provide the reference text for read-along scoring)**

**(You MUST pre-process audio to 16-bit, 16 kHz, mono before sending to the scoring API)**

**(You MUST keep API credentials on the server — never expose them in the client)**

**(You MUST encrypt stored audio and scores at rest, and delete raw recordings after the retention period defined in data-privacy-vn)**

**Failure to follow these rules will produce invalid PTE scores, credential leaks, and privacy violations.**

</critical_reminders>
