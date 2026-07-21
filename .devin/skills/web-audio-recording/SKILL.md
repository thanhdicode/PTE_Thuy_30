---
name: web-audio-recording
description: "Record microphone audio in the browser for PTE Speaking using getUserMedia, MediaRecorder, and the Web Audio API. Handles cross-browser format support (Chrome, Safari, iOS), permission UX, live waveform visualization, and safe upload patterns."
argument-hint: "[action|browser]"
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

# Web Audio Recording (MediaRecorder / Web Audio API)

> **Quick Guide:** Capture audio with `getUserMedia`, encode with `MediaRecorder`, and pre-process with the Web Audio API only when needed (visualization, gain, noise gate). Cross-browser recording works best with `audio/webm;codecs=opus` on modern browsers; Safari/iOS may need `audio/mp4`. Always record in a secure context (HTTPS/localhost), request permission explicitly, and validate the final blob before upload.

---

<critical_requirements>

## CRITICAL: Before Using This Skill

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST run audio recording only in a secure context — `getUserMedia()` requires HTTPS or `localhost`)**

**(You MUST request microphone permission explicitly with a user gesture and show a clear recording indicator)**

**(You MUST verify `MediaRecorder.isTypeSupported()` before starting and provide a fallback MIME type for Safari/iOS)**

**(You MUST stop and release the `MediaStream` tracks when recording ends to free the microphone)**

**(You MUST validate the recorded blob (duration, size, MIME type) before uploading and reject empty/clipped recordings)**

**(You MUST use `AudioWorklet` for custom DSP — `ScriptProcessorNode` is deprecated and causes dropouts under load)**

</critical_requirements>

---

**Auto-detection:** MediaRecorder, getUserMedia, Web Audio API, AudioContext, AnalyserNode, AudioWorklet, microphone, recording, speech, audio blob, opus, webm, mp4, iOS Safari

**When to use:**

- Building the PTE Speaking recording UI (Read Aloud, Repeat Sentence, Describe Image)
- Adding live waveform/level meters during recording
- Handling cross-browser audio format inconsistencies
- Implementing noise gate, gain control, or audio visualization

**When NOT to use:**

- Server-side audio processing (use Node.js/ffmpeg on the backend)
- Text-to-speech playback (use `speech` or `ai-provider-openai-sdk` audio.speech)
- Transcribing audio (use `ai-provider-openai-whisper`)

---

<philosophy>

## Philosophy

The Web platform has three audio primitives:

1. **`getUserMedia()`** — captures the microphone as a `MediaStream`.
2. **Web Audio API** — processes/routes audio in an `AudioContext`.
3. **`MediaRecorder`** — encodes a `MediaStream` into a file `Blob`.

The Web Audio API does **not** record by itself. Use it between capture and recording only when you need visualization, gain, or noise reduction. For simple recording, `getUserMedia` → `MediaRecorder` is the shortest, most reliable path.

</philosophy>

---

<patterns>

## Core Patterns

### Pattern 1: Minimal Cross-Browser Recording

```typescript
export const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/ogg;codecs=opus',
];

export function getBestMimeType(): string {
  for (const type of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return ''; // use browser default
}

export async function startRecording(): Promise<{ recorder: MediaRecorder; stream: MediaStream }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = getBestMimeType();
  const options = mimeType ? { mimeType } : undefined;
  const recorder = new MediaRecorder(stream, options);

  return { recorder, stream };
}
```

**Why good:** Prefers `opus` in `webm` (best quality/size, now supported in Safari 18.4+) and falls back to `mp4` on iOS.

---

### Pattern 2: Capture, Stop, and Validate Blob

```typescript
export function recordAudio(maxDurationMs = 40_000): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    const { recorder, stream } = await startRecording();
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });

      if (blob.size < 1024) {
        reject(new Error('Recording too short or silent'));
        return;
      }
      if (blob.size > 25 * 1024 * 1024) {
        reject(new Error('Recording exceeds upload size limit'));
        return;
      }
      resolve(blob);
    };

    recorder.onerror = (e) => {
      stream.getTracks().forEach((t) => t.stop());
      reject(new Error(`MediaRecorder error: ${e.message}`));
    };

    recorder.start(1000); // emit chunks every 1s for resilience
    setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, maxDurationMs);
  });
}
```

**Why good:** `recorder.start(1000)` yields chunks periodically so a crash does not lose the whole recording; tracks are released immediately after stop; empty/large blobs are rejected client-side.

---

### Pattern 3: Live Waveform with AnalyserNode

```typescript
export function createVisualizer(
  stream: MediaStream,
  canvas: HTMLCanvasElement,
  analyser?: AnalyserNode,
): () => void {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const node = analyser ?? audioContext.createAnalyser();
  node.fftSize = 256;
  source.connect(node);

  const bufferLength = node.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const ctx = canvas.getContext('2d')!;
  let raf = 0;

  const draw = () => {
    raf = requestAnimationFrame(draw);
    node.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  draw();

  return () => {
    cancelAnimationFrame(raf);
    audioContext.close();
  };
}
```

**Why good:** `AnalyserNode` is cheap and does not alter the recorded stream; `AudioContext` is closed on cleanup.

---

### Pattern 4: Gain Control / Noise Gate with AudioWorklet

Use `AudioWorklet` instead of the deprecated `ScriptProcessorNode`.

```typescript
// public/audio-gate-processor.js
// registerProcessor('gate-processor', class extends AudioWorkletProcessor { ... });

export async function startRecordingWithWorklet() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext({ sampleRate: 16000 });
  await audioContext.audioWorklet.addModule('/audio-gate-processor.js');

  const source = audioContext.createMediaStreamSource(stream);
  const gate = new AudioWorkletNode(audioContext, 'gate-processor');
  const destination = audioContext.createMediaStreamDestination();

  source.connect(gate).connect(destination);

  const recorder = new MediaRecorder(destination.stream, { mimeType: getBestMimeType() });
  return { recorder, stream, audioContext };
}
```

**Why good:** `AudioWorklet` runs on the audio rendering thread with stable timing; `createMediaStreamDestination` converts the processed graph back to a `MediaStream` for `MediaRecorder`.

---

### Pattern 5: Polyfill for Older Safari / iOS

If `MediaRecorder` is missing (older Safari), use `extendable-media-recorder` or `RecordRTC` to encode with opus/wav.

```typescript
import { MediaRecorder as PolyfillMediaRecorder, register } from 'extendable-media-recorder';
import { connect as connectEncoder } from 'extendable-media-recorder-wav-encoder';

let MediaRecorderClass: typeof MediaRecorder;

export async function initRecorderPolyfill() {
  if (typeof window !== 'undefined' && typeof (window as any).MediaRecorder === 'undefined') {
    await register(await connectEncoder());
    MediaRecorderClass = PolyfillMediaRecorder;
  } else {
    MediaRecorderClass = window.MediaRecorder;
  }
}
```

**Why good:** Some older iOS versions do not ship `MediaRecorder`; a polyfill ensures the same recording flow.

---

### Pattern 6: Permission and Error UX

```typescript
export async function ensureMicrophonePermission(): Promise<boolean> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    if (result.state === 'denied') return false;
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    return false;
  }
}
```

```tsx
// UI component
{state === 'idle' && (
  <button onClick={onStart} aria-label="Start recording">Start</button>
)}
{state === 'recording' && (
  <>
    <canvas ref={canvasRef} aria-label="Recording level" role="img" />
    <p role="status" aria-live="polite">Recording... {seconds}s</p>
    <button onClick={onStop} aria-label="Stop recording">Stop</button>
  </>
)}
```

**Why good:** Explicit permission check prevents silent failures; `aria-live` announces recording status to screen readers.

---

### Pattern 7: Upload Recorded Audio

Use a `FormData` upload to a presigned S3 endpoint or your own upload API.

```typescript
export async function uploadRecording(blob: Blob, attemptId: string) {
  const form = new FormData();
  form.append('file', blob, `attempt-${attemptId}.webm`);
  form.append('attemptId', attemptId);

  const res = await fetch('/api/speaking/upload', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
```

**Why good:** `FormData` is the simplest cross-browser way to send a `Blob` to the server; backend then handles normalization and scoring.

</patterns>

---

<decision_framework>

## Decision Framework

### Which Browser MIME Type

```
Chrome/Edge/Firefox/Modern Safari -> audio/webm;codecs=opus
Older iOS / macOS Safari         -> audio/mp4 or audio/mp4;codecs=mp4a.40.2
MediaRecorder missing entirely   -> extendable-media-recorder/RecordRTC polyfill
```

### Do You Need the Web Audio API?

```
Just record and upload                          -> getUserMedia + MediaRecorder only
Live waveform or level meter                    -> add AnalyserNode
Noise gate / automatic gain / custom DSP        -> add AudioWorklet
```

</decision_framework>

---

<red_flags>

## RED FLAGS

**High Priority Issues:**

- Attempting to record without HTTPS or localhost
- Not releasing the microphone stream after recording, causing the tab indicator to stay red
- Using `ScriptProcessorNode` for production DSP (deprecated, causes dropouts)
- Trusting client-side recording duration without server-side validation
- Uploading raw audio without file-size or MIME-type checks

**Medium Priority Issues:**

- No fallback MIME type for Safari/iOS
- No user feedback during permission denial
- Recording at a sample rate below 16 kHz before sending to scoring API
- Not disabling recording buttons while permission is being requested

**Common Mistakes:**

- Assuming `MediaRecorder` is available in every browser/version
- Trying to record processed Web Audio output without `createMediaStreamDestination()`
- Concatenating `Blob` chunks with wrong MIME type (use `recorder.mimeType`)
- Forgetting `AudioContext` must be resumed after a user gesture on some browsers

</red_flags>

---

<critical_reminders>

## CRITICAL REMINDERS

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST run audio recording only in a secure context — HTTPS or `localhost`)**

**(You MUST request microphone permission explicitly with a user gesture and show a clear recording indicator)**

**(You MUST verify `MediaRecorder.isTypeSupported()` and provide a fallback MIME type for Safari/iOS)**

**(You MUST stop and release the `MediaStream` tracks when recording ends)**

**(You MUST validate the recorded blob before uploading)**

**(You MUST use `AudioWorklet` for custom DSP, not `ScriptProcessorNode`)**

**Failure to follow these rules will cause recording failures on iOS, silent permissions bugs, and audio quality issues that lower PTE scores.**

</critical_reminders>
