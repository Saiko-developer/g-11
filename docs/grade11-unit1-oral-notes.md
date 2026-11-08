# Unit 1 oral notes follow playback

Only Grade 11 Unit 1 opts into authored oral cue segments. Other units keep their existing notes and playback inputs.

- The accepted Both … and, Before and After narration is preserved character for character. Regression tests retain SHA-256 hashes of the approved scripts and verify that all segments rejoin to the same script, without gaps or duplication.
- Cues reference the textbook sentence, translation and a brief teaching note. Worked exercises retain their source question through the walkthrough and switch to the combined answer when that answer is spoken.
- TTS chunks cannot cross cue boundaries. Long cues can use several chunks while keeping the same note.
- The visible cue advances only when its audio starts playing successfully. Prefetching does not advance the screen. Pausing or buffering preserves the current note; completion leaves the final note visible.
- Full notes remain available in a collapsed section. No word-level time alignment is claimed; synchronization is by authored teaching section.

The existing TTS API, voice and speed are reused. No live model generation, auth change, database change or production build is part of this update. Mocked playback tests cover synchronization, pause/resume, prefetch, buffering and closing the oral view. Actual provider audio was not generated during automated verification.
