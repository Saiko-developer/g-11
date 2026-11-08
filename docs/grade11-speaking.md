# Grade 11 audio, captions and speaking

The original user-supplied recordings are in `public/grade11/audio/`. Their source filenames, durations and SHA-256 hashes are in `src/data/grade11/listeningAudio.json`. Grade 10 assets and lesson components are independent.

## Captions and original-audio shadowing

`listeningCaptions.json` contains English machine transcripts with word timestamps from offline faster-whisper `small.en` (CPU/int8). Units 2, 6, 11 and 12 use a second decode without VAD to recover recognition omissions. The first pass speech boundary excludes outro-music hallucinations. Textbook spellings were used for recognisable names such as Ayeyarwady, Soe Thu, Mi Phyu, Su Mon, Thadingyut, Bagan, Johnsy and Behrman. These are not official transcripts; recognition and alignment errors remain possible, especially with names. Burmese translations for every cue are stored separately in `listeningTranslations.my.json`, with a hash tying them to the current English source. They translate the meaning in context; uncertain names retain the transcript spelling. The underlying machine transcript can still contain errors. Translations are prewritten and incur no AI credit cost when viewed.

The media element's current time drives highlighting, including after seeking and changing playback speed. After speech starts, the current English/Burmese cue stays visible through pauses until the next cue starts, including after the last spoken line. Word highlighting still clears between spoken words. Seeking selects the latest cue at that media time; rewinding before the first cue clears the caption. Clicking a transcript cue plays only that cue. The live card and full transcript have independent English and Burmese subtitle toggles. Both can be disabled. Before the first cue there is no empty caption card or instructional placeholder. Original-audio shadowing uses the same translations. English and Burmese (`unitN.my.vtt`) WebVTT files remain in `public/grade11/captions/` as static assets. Download controls are omitted from the Grade 11 UI, including the native audio download menu.

Speaking → Shadowing has two sources: the original Listening recording, with timed clips, and textbook speaking phrases using browser speech synthesis. They use separate versioned sessionStorage keys. Text match percentages compare recognised words in order, not pronunciation or accent. Neither source requires paid AI. Speech recognition depends on browser support; manual entry remains available.

## AI speaking

`/api/g11-roleplay` is separate from the existing Grade 10 endpoint. It validates login and input, derives the Grade 11 theme/objective from the server's syllabus and source phrases, and treats student conversation as untrusted data. The generated role-play is labelled as AI practice, not a textbook dialogue.

It reuses the existing model helper, `startSpeakingSession`, `chargeSpeakingTurn`, TTS, microphone transcription and login integration. No provider, billing RPC, database schema or Grade 10 endpoint has been changed. The existing quota is keyed by unit number, not grade: matching Grade 10/11 unit numbers share the same quota. This is stated before starting a call. Final feedback retains the existing policy allowing feedback when credit has just run out.

Calls stop recording/playback and abort pending client requests when leaving the mode. Text mode supports browsers without microphone access. Server generation already started before cancellation may still complete; cancellation cannot refund a session charge made by the existing billing system.

## Validation

Use `npx tsc --noEmit` and `npx vitest run`. Caption tests check asset hashes, ordered bounds, word coverage, silence and VTT consistency. AI handler tests mock the existing billing/model helpers and cover authentication, quota/credit denials, context isolation and continuations. UI tests simulate speech recognition and cover typed/voice turns, feedback, permission denial and cleanup. Paid production AI calls require a real signed-in account and credits; mock tests do not prove provider availability.
