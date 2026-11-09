# Grade 11 popup voice recovery

The shared SayaOwlHome popup now opts into bounded voice requests and recovery when `grade={11}`. Grade 10 keeps its existing defaults, provider, prompts and request behavior.

## Fixed failure paths

- Turn tracking records the expected user-message count before sending. A fast assistant response no longer depends on React first rendering a user-only message list.
- Chat errors stop the call, release the microphone and display an error. Tapping the owl restarts listening.
- Transcription has a 35-second client deadline covering response decoding; Grade 11 upstream transcription has a 25-second connection/response-header deadline.
- TTS requests and decoding have a 45-second total deadline, including at most one retry for explicit transient errors. On persistent speech failure, further voice chunks stop; the complete streamed answer remains readable and the student can restart with the owl.
- Filler playback has a short deadline. Answer playback has no fixed duration cap. A 90-second inactivity watchdog resets when streamed answer text changes, a voice chunk is prepared, or audio playback time advances. Long explanations continue while progressing; a genuinely stalled call displays a retry message. Neither the old 90-second total explanation limit nor the old 45-second answer-audio cap is used.
- Closed-call transcription and speech results are ignored after a new call generation starts.

## Burmese recognition

Grade 11 supplies a Burmese language preference and bounded vocabulary references from the current textbook section. The server keeps the existing Burmese-capable model and auto-detection because the current integration does not send a `my` provider language code. The prompt requires Myanmar Unicode and preservation of spoken English, without inventing a transcript. The Grade 11 silence window is 3 seconds; Grade 10 retains 2.3 seconds.

## Verification and limits

Mocked component tests exercise skipped user-only renders, failed TTS, chat errors/restart and stalled thinking. Request tests cover network and decoding deadlines. Route tests cover authenticated Grade 11 vocabulary hints and unchanged Grade 10 defaults.

No live student recordings, provider calls or production logs were available. These changes fix reproducible client failure paths; they do not establish which upstream request stalled in the reported session or prove Burmese transcription accuracy on the user's device. No production build or database migration is required for this change.

## Detailed translations and request intent

Grade 11 uses its own teaching policy rather than the Grade 10 exercise template. It distinguishes translation-only, detailed sentence-by-sentence translation, summaries, vocabulary, grammar, exercise answers and answer checking. Follow-up requests continue the preceding explanation, and ambiguous references prompt one clarification instead of a guessed answer.

Units 1–6 reading context now includes source-linked passage paragraphs in their display order before exercise questions. The introductory paragraph counts as Paragraph 1; printed heading blanks do not count as paragraph numbers. Units 7–12 retain their OCR page references rather than receiving invented paragraph boundaries. The policy asks for a first sentence or text when a reference cannot be identified reliably.

Regression tests cover a four-minute text stream, three-minute ongoing audio after streaming completes, and an actual 90-second stall following progress. Prompt/context tests verify wiring and source numbering; live AI answer quality still requires spoken user evaluation.

## Voice service diagnostics and Unit 3 question lookup

The old generic transcription failure toast could misreport a failed HTTP request as misunderstood speech. The old voice toast likewise called all TTS failures busy. Grade 11 now distinguishes session/HTTP errors, configuration/credit errors, timeouts, invalid responses and actual empty transcripts. Malformed upstream transcription output is a Grade 11 service error instead of a successful empty transcript.

Grade 11 no longer prepares three filler voice clips on opening the popup. It uses larger sentence groups and one TTS request at a time. A single retry is allowed for 429/502/503/504, respecting a short Retry-After; auth/credit/config errors are not retried. Closing the call aborts pending voice work and prevents further retries. Grade 10 keeps its existing defaults.

Textbook question context includes exercise letters and question numbers. Explicit English/Myanmar question numbers resolve only when exactly one source question matches, and are sent in a separate untrusted `resolved_question` reference. Unit 3 Grammar Question 3 resolves to source `3C-32`: “I finished ___________ (write) the assignment just before the deadline.” Ambiguous requests remain for the tutor to clarify.

These fixes are verified with mocked requests and playback. The actual production STT/TTS provider error cannot be determined without live deployment logs; provider/model availability and real-device Burmese recognition are not established by these tests.
