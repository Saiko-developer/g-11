# Grade 11 section popup assistant

Grade 11 now uses the actual `SayaOwl` floating assistant used by Grade 10's dedicated unit/skill practice pages. The separate inline `Grade11AITutor` panel and its question-selector UI have been removed. Existing textbook exercises, their answer-checking controls, speaking roleplay, lesson audio and subtitles remain in place.

`Grade11PopupTutor` supplies the real Grade 11 unit/skill context and the existing Grade 11 session-readiness/login-return gate. All 12 units and six sections use it. Revision and poem views use the same popup with their visible section text. The popup keeps Grade 10's launcher, layout, drag behavior, quick prompts, conversation and open/close controls. Its compact header uses a short label while the request retains full textbook references. A section change remounts the popup to avoid mixing conversations between lessons.

The shared component and `/api/chat` accept an optional Grade 11 flag. Only Grade 11 requests include this flag and visible-section reference text. The server uses the Grade 11 teacher level and bounded untrusted textbook context. Requests without the flag keep the existing Grade 10 payload, prompt and context limits. Provider selection, Google authentication, tutor quota and billing configuration are unchanged.

This supersedes the inline-panel UI described in the original Unit 5/AI implementation note. It does not add a separate AI service or replace the existing exercise-specific checks and speaking practice.

Validation: 298 tests passed across 37 files; an 18-test repeat verified the final popup/context changes. TypeScript and scoped ESLint passed (legacy shared files retain their existing formatting). Browser checks exercised all 72 desktop section routes and 17 mobile views. A final 12-view repeat plus revision/poem, Grade 10 and SPA-navigation checks passed without page errors. Checks covered authenticated streaming messages, the three existing quick prompts, dragging/opening/closing, removal of the inline panel and conversation reset after changing sections. Paid AI responses were mocked; no production build, live provider request or secret/configuration change was made.
