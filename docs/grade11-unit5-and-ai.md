# Unit 5 refinement and Grade 11 AI access

Unit 5 now has a zoomable original ASEAN map, direct exercise translations, grouped reading/vocabulary checks, a noun-pair table, Grade 10-style text/oral grammar explanation panels and the existing per-question grammar controls. Eleven listening responses are bound to the supplied MP3 hash and evidence cue IDs. Speaking C has a six-point bilingual trip planner; C and D open task-specific conversations through the existing caller-owned speaking sessions. Switching tasks unmounts the previous conversation. Writing preserves the original five travelogue paragraphs, orders them with five selects, checks the sequence together, reviews the student's own title/essay, counts words and retains existing draft keys.

## Shared AI workflow

All 12 units and six skills have an inline Grade 11 tutor. It uses the same AI SDK `useChat`/`DefaultChatTransport`, `/api/chat-home`, `tutorFetch`, `TutorQuotaBar`, model/fallback helper, Whisper `/api/transcribe`, cloud `/api/tts`, and existing Google/Supabase account as Grade 10. Students can type without microphone permission, dictate, attach a compressed question photo, hear an answer, stop a streamed response and submit an answer to a real textbook question for semantic review. Grammar extra practice uses the existing generator and exercise-specific daily storage key. Speaking retains the existing Grade 11 roleplay and shadowing modes.

The teacher receives the selected Grade 11 unit/skill and actual textbook questions, not only a title. Units 7–12 also include reference OCR of the supplied page images; original scans remain authoritative and uncertain OCR must not be invented. Context excludes hidden answer keys. The shared chat/hint routes accept an optional Grade 11 flag; omitted flags retain Grade 10 defaults. No model/provider, database schema, credits or quota configuration changes were made.

## Repeated login

Grade 10's tutor explicitly supplies the active bearer token. Grade 11 review/hint actions previously relied on a global fetch installer, and some review buttons offered login while AuthGate was still restoring its session. Grade 11 actions now explicitly read the same active session, attach its bearer token and retry a 401 once only when token refresh produces a different token. They never retry paid quota, credit or provider failures. This does not bypass authentication or grant access.

Grade 11 login gates wait for AuthGate readiness and preserve the current internal unit/skill in the existing validated `postLoginRedirect` flow. An already authenticated student is not sent to Google again. A missing provider configuration is reported as an unavailable AI service rather than a login issue.

These fixes address reproducible client authentication weaknesses. They do not establish that a particular production account or remote database is healthy. Production-only provider secrets, account/session rejection and quota configuration require the actual deployment/session to verify. No secret values are logged or added to source control.

The checking adapter also preserves complete submissions up to its documented 12,000-character limit; the former default untrusted-data wrapper silently truncated longer drafts at 8,000 characters.

## Validation

292 tests passed across 36 files. TypeScript and scoped ESLint passed. A final 10-test repeat covered the last shared-prompt adjustment and Unit 5 exercises. Browser tests passed all 72 desktop unit/skill combinations plus 17 mobile views with no page errors or horizontal overflow. They checked actual bearer headers, an expired-session 401 followed by one refresh/retry without Google login, the existing AI SDK SSE format, full-length writing review, all six Unit 5 sections, task-specific conversations, original audio/caption persistence, map zoom, paragraph ordering and saved drafts. Separate mobile checks covered compressed textbook photos and the same TTS endpoint. Grade 10 speaking received smoke checks and the shared server prompt retains Grade 10 defaults in tests.

AI providers, auth/RPC responses and paid endpoints were mocked during these checks. The current execution environment has neither a Lovable nor Gemini server key configured, so production paid-provider responses and the user's real account cannot be verified here. No production build, real credit spending, schema migration or secret change was performed.
