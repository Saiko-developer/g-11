# Grade 11 speaking: false login failures

The reported symptom was a repeated request to log in. Two existing helpers conflated service failures with authentication failures: `requireUser` returned 401 for upstream auth outages/unexpected responses, and speaking-session helpers returned 401 for every RPC error. A missing/expired conversation was also treated as a login failure. The Grade 11 client consequently suggested logging in (and could refresh/retry) even for unavailable backend services.

Grade 11 speaking now opts into explicit diagnostics. Actual token rejection still returns 401. Auth-service/network/malformed-response failures and speaking RPC failures return 503; missing conversations return 410. RPC diagnostics log only the operation and error code, never tokens or student data. Grade 10 callers omit the new option and retain their existing behavior. The existing functions, caller-owned sessions, credit costs and quota rules are unchanged.

The Grade 11 route checks the required Lovable model configuration before opening or charging a speaking session. Missing configuration returns `ai_not_configured` (503). Provider-credit/rate-limit failures are distinguished from the student's quota failures. The UI displays the corresponding message and offers Login only for a genuine 401; it does not automatically start Google login or retry paid service failures.

Voice playback previously depended solely on observing `speaking=true` followed by `false`. A fast playback failure could skip that observable transition and leave the call on “AI speaking”. The Grade 11 component also tracks the current speech attempt settling, waits while playback is actually active, and moves to the student's turn after playback fails/finishes. Generation/attempt checks discard stale completions after stop, interruption or unmount. Text entry remains available.

## Deployment checks and limits

These findings prove reproducible code paths, not the exact underlying failure of the user's production account. The current execution environment has no Lovable/Gemini server key, no real student session, and did not expose a usable remote database schema through the attempted read-only metadata request. Live provider availability and the deployed RPC definitions/permissions cannot be confirmed here.

If production returns `speaking_service_unavailable`, use the read-only [function/grant diagnostic](diagnostics/grade11-speaking.sql), inspect the server's operation/error-code log, and repair the existing project's RPC/schema-cache/permissions. If it returns `auth_service_unavailable`, verify the server's Supabase URL/key and auth-service connectivity. If it returns `ai_not_configured`, restore the same server-only provider configuration used by Grade 10. Do not expose keys in client code or bypass authentication, credit or session ownership checks.

Configuration preflight avoids a new session charge when the model key is missing. It does not refund sessions already opened before a later provider failure; the existing billing policy remains in effect. No database migration or credit/quota change is included.

## Validation

324 tests passed across 39 files, including opt-in service diagnostics, genuine auth rejection, unchanged Grade 10 defaults, configuration preflight without billing, quotas, expired conversations and fast playback failure. TypeScript and scoped ESLint passed. Browser checks passed 29 desktop/mobile speaking flows: typed conversations and feedback across all 12 units, service/configuration/expiry/quota/rate errors without a false Login prompt, a genuine 401 with one refresh, and recovery from failed TTS with microphone cleanup. Paid services and account/RPC responses were mocked; no production build, live AI spend or database mutation was performed.
