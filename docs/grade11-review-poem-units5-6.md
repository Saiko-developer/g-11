# Grade 11 Review 1, Poem 1 and Units 5–6

## Source and scope

Only the three user-supplied Grade 11 English PDFs supply curriculum text. Grade 10's `Review1View`, `Poem1View`, `CurriculumExplorer` and `ExerciseKit` were read as implementation references. None of the Grade 10 files, existing Units 1–4 textbook JSON, shared exercise controls, AI APIs, authentication, database, progress storage or dependencies changed.

The Grade 11 additions reuse the existing Check/Reveal, translation toggles, sentence-structure controls and Saya Owl context. Review uses the existing grouped question-card pattern; poem uses the two-column poem/glossary and questions pattern. No personal sample descriptions, new poems, dialogues or essays were authored as textbook content.

## Deliverables

| Content | Source | Lesson data | Separate answers |
| --- | --- | --- | --- |
| Review 1 | First PDF page 37; printed page 32 | `src/data/grade11/textbook/review1.json` | `review1-answer.json` |
| Poem 1, Bridges — James S. Tippett | First PDF page 38; printed page 33 | `poem1.json` | `poem1-answer.json` |
| Unit 5, Travel in Southeast Asia I | Second PDF pages 2–14; combined pages 50–62; printed 45–57 | `unit5.json` | `unit5-answer.json` |
| Unit 6, Travel in Southeast Asia II | Second PDF pages 15–24; combined pages 63–72; printed 58–67 | `unit6.json` | `unit6-answer.json` |

Review has two ten-item exercises. Damaged wording in B4 is shown through a bundled original scan and has no guessed answer; the other 19 answers are source-derived suggestions.

Bridges retains all 15 verse lines, three glossary entries, three pre-reading questions, three comprehension questions, the original completed table examples, three bridge-description responses, four personal descriptions and the six-line composition task. Six answers are derived from the printed poem. Eight personal responses remain open; no new six-line verse was supplied.

Unit 5 has 217 source blocks and 109 response blocks, including the original labelled ASEAN map, five reading destinations, noun-modifier table, 29 uncompleted grammar tasks, 11 audio-dependent responses and all five shuffled Dawei travelogue paragraphs. Its answer file contains 95 source-derived answers. Noun-table answers accept the missing nouns as well as complete pairs.

Unit 6 has 182 source blocks and 77 response blocks, including the five-country passage, original tourism-information table, 20 vocabulary and 20 uncompleted grammar questions, ten listening blanks and the original 200–250-word composition instructions. Its answer file contains 64 source-derived answers. The original printed sample travel tips are included; an additional model essay is not created.

Answers are kept separate from original lesson text and explicitly marked as not an official answer key. Equivalent full-sentence wording is valid. Original Grade 11 audio was not supplied; no Grade 10 recording or invented listening answers are used.

## Source details retained

The supplied Unit 5 cover at combined page 50 says “Unit 4 GLOBALIZATION OF FOOD”. The following pages are explicitly headed 5A–5E. This misprinted cover is documented rather than edited or used to replace the actual Unit 5 content. Geographical/historical source statements are retained as printed, including the Komodo National Park paragraph. Unit 6 explorer descriptions and page links were aligned with its actual Reading, Listening and Speaking sections. Existing Grade 10 syllabus and data are unchanged.

## Validation

- 44 tests; TypeScript, targeted ESLint and production build.
- Browser checks for Review/Poem and all twelve Unit 5/6 skill views on desktop/mobile, Check/Reveal, Burmese translations, original map, creative response fields, explorer and direct routes.
- Grade 10 Review 1 retains its original camera/function questions; Grade 10 Poem 1 retains Daffodils, original translation and controls. Grade 10 Unit 1 and existing Grade 11 Units 2–4 browser regressions pass.
- No browser runtime errors, paid AI requests or authenticated database writes during checks.
