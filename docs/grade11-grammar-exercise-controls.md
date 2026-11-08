# Individual Grade 11 grammar exercise controls

Units 2–12 now use one question card per original grammar task (271 cards). Each card has a Myanmar translation toggle, an answer field, Check Answer, and Reveal/Hide Answer. Rewritten sentences have multiline fields. Feedback is scoped to the question, resets on editing, and revealing an answer retains the student's draft. Existing workspace draft keys are unchanged.

Closed tasks use the existing answer matcher locally. An incorrect answer exposes the existing `/api/answer-hint` action only after an explicit click. Pending hints are cancelled on editing/unmount and stale replies are discarded. No AI calls happen on rendering, typing, checking a closed task, or revealing a stored answer.

The new `grammarExerciseSupport.json` supplies Myanmar prompt translations and worked answers for the 162 existing Unit 7–12 grammar questions, which previously lacked both. These are source-derived teaching support, not an official answer key, and do not add or rewrite textbook exercises. Unit 11 A's underlined targets were checked against PDF page 126 (printed page 121) and are displayed inline. Unit 10 B's a/b/c/d function labels were checked on PDF page 116 (printed page 111).

Unit 10 B combines a sentence with a function classification; Unit 12 E accepts logical personal completions. These 20 tasks reuse authenticated `/api/g11-check` for semantic feedback on an explicit Check Answer click. Reveal shows an identified sample answer without a paid request. Other valid phrasings for closed tasks remain subject to the existing answer matcher; the optional hint can explain differences.

Grammar explanation panels, videos, original source pages, other skills, Unit 1, Grade 10, providers, authentication and billing/quota configuration are unchanged. No production build is required for this change.

Validation: 245 tests passed across 30 files, including all 271 question cards, independent feedback, reveal/hide with draft retention, Myanmar toggles, source underlining, open-ended checking, and stale-hint cancellation. TypeScript and scoped ESLint passed. Browser interaction checks covered Units 2–12 at desktop and mobile widths; the final repeat of Units 2–6 passed all 10 views without page errors or horizontal overflow. AI endpoints were mocked for browser/test validation; no live paid AI request or production build was run.
