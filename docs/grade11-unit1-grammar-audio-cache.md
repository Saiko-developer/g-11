# Grade 11 Unit 1 grammar audio reuse

Only Unit 1 authored GrammarScriptView clips opt into `lessonCache: grade11-unit1` on the existing authenticated `/api/tts` route. Grade 10, Units 2–12, popup chat, personal replies, login and quotas retain their existing behavior. Scripts, notes, segmentation, playback and audio-start synchronization are unchanged.

The server validates each clip against the current authored Unit 1 segments. Only the existing sarah/Puck voice at normal speed is eligible. SHA-256 keys include exact text, both configured model names, voice settings and pipeline version. Changing text/model invalidates the corresponding audio. Bump the pipeline version if voice mapping, sanitization or generation settings change.

Cloudflare Cache API (`caches.default`) stores successful Gemini audio for up to 30 days. This is best-effort, data-center-local caching, not durable global storage: eviction, expiration, cold data centers or unsupported runtimes can regenerate audio. A 24 MiB bounded in-process cache also reuses clips within a worker. Maximum cached clip size is 8 MiB. Cache operations have a 500 ms wait budget; failures fall through to generation/playback. Failed and OpenAI fallback audio are not persisted. Same-worker simultaneous requests for a clip share generation; different workers can still generate simultaneously. This does not promise exactly-once global generation.

Authentication remains before every lookup. Cached audio is only public authored teaching content, never user text. HTTP responses remain `no-store`; only an internal edge copy is cacheable. Cache telemetry logs `hit`, `miss`, or `shared` and a short hash, without scripts, tokens or user IDs. `X-Grade11-Audio-Cache` exposes the result for inspection. Counts demonstrate reuse, not actual provider credits or savings.

## Verification and rollout

Automated tests use fake audio and no paid provider calls. They cover reuse, changed models, concurrent requests, private-text/voice rejection, provider errors, temporary fallback, edge reuse after restart, cache failure, and existing Unit 1 note synchronization.

After deployment, sign in and replay a Unit 1 lesson. Compare `/api/tts` response headers for miss then hit, inspect audio and notes, and compare Lovable AI usage. Repeat in a second signed-in account on the same deployment. Actual Cloudflare persistence and billing require deployment verification; local tests cannot establish them.

Rollback: remove the Unit 1 `lessonCache` request field to resume the original TTS path. No database migration or credential change is required. No production build is needed for the tests.
