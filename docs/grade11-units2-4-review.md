# Grade 11 Units 2–4 source review

## Unit 2: necessary fixes only

The existing reading passage, vocabulary tasks, printed website review and short-answer keys were retained. PDF comparison found three missing picture responses in Listening A, missing original pictures, and grammar explanations incorrectly parsed as exercises. Explicit lesson/exercise metadata now yields the original 10 + 5 + 15 grammar questions. Added model answers, a dialogue and a mart review that were not printed in the supplied PDF were removed from textbook content. The original listening page is bundled locally. Eight listening responses remain unkeyed because no Grade 11 recording was supplied.

## Unit 3: Burmese answers using Grade 10 controls

`src/data/grade11/textbook/unit3.json` retains the verified textbook text and per-block Burmese translations. `unit3-answer.json` covers all 58 numbered response blocks plus the two open production tasks. It contains 31 short answers and 10 suggested full-sentence reading answers, each with Burmese translation and source references. Personal responses, ten audio-dependent questions and three damaged-source questions have explicit null answers. These answers are source-derived, not an official answer key.

The runtime reads this answer file and passes `answerMy` to the existing Grade 10 `AnswerTryBox.correctMy` property. Check, Reveal and optional AI hints retain their existing implementation. The older `unit3-keys.json` remains a compatible short-answer subset.

## Unit 4: complete supplied source range

Source: combined PDF pages 39–49, printed textbook pages 34–44. The final writing page is local page 1 of the second uploaded PDF (`49-96.pdf`); it must not be omitted at the file boundary.

`unit4.json` contains Reading, Vocabulary, Grammar, Listening/Speaking and Writing with Burmese translations. Both printed writing samples and the obesity essay starter are transcribed from the PDFs. No new curriculum sentences, personal experiences or model essays were added. The damaged Speaking C instruction remains available as an original scan rather than guessed text.

`unit4-answer.json` contains 53 source-derived bilingual answers: 24 vocabulary, 20 grammar suggestions, five reading suggestions and four essay-structure suggestions. Open food-table entries, personal survey responses, eight audio-dependent blanks and the open essay are not given invented answers. Full-sentence suggestions permit equivalent wording; the existing answer matcher is unchanged.

## Scope and verification

- Existing Grade 11 layout reused; no UI redesign.
- Grade 10 lesson data/components, database, authentication, progress storage, AI routes/providers and dependencies unchanged.
- 36 tests pass; TypeScript, targeted ESLint and production build pass.
- Browser checks cover direct unit routes and curriculum explorer, question/answer translations, Check/Reveal, local scans, response progress and all 18 mobile skill views for Units 2–4.
- Grade 10 and Unit 1 browser regression checks pass. No paid AI calls or authenticated database writes were run.

The user subsequently approved the header copy correction. Grade 11 routes now use “English for Grade 11 Myanmar” (and its Burmese equivalent); other routes retain the original Grade 10 tagline. Desktop browser checks cover both route families and client navigation.
