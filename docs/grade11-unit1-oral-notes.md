# Unit 1 oral notes follow playback

Only Grade 11 Unit 1 opts into authored oral cue segments. Other units keep their existing notes and playback inputs.

- The accepted Both … and, Before and After example narration is retained. Following the requested introduction-first update for all Grade 11 units, the former opening cue is replaced with a topic introduction and a grammar-pattern explanation. Regression tests retain SHA-256 hashes of the original scripts and verify that their example/walkthrough paragraphs remain unchanged after the two new opening cues.
- Cues reference the textbook sentence, translation and a brief teaching note. Worked exercises retain their source question through the walkthrough and switch to the combined answer when that answer is spoken.
- TTS chunks cannot cross cue boundaries. Long cues can use several chunks while keeping the same note.
- The visible cue advances only when its audio starts playing successfully. Prefetching does not advance the screen. Pausing or buffering preserves the current note; completion leaves the final note visible.
- Full notes remain available in a collapsed section. No word-level time alignment is claimed; synchronization is by authored teaching section.

The existing TTS API, voice and speed are reused. No live model generation, auth change, database change or production build is part of this update. Mocked playback tests cover synchronization, pause/resume, prefetch, buffering and closing the oral view. Actual provider audio was not generated during automated verification.

## Introduction-first update across Units 1–12

Every Grade 11 topic now starts by naming the topic and explaining its use, then teaches its basic construction before a textbook example appears. Grade 11 Units 2–12 highlight authored, literal grammar fragments in the currently spoken example. Unit 1 retains its existing focused note renderer. The new lesson frames are Grade 11 data only; no Grade 10 files, AI endpoints, quotas or exercise data are changed.
