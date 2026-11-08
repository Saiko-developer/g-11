# Grade 11 popup voice recovery

The shared SayaOwlHome popup now opts into bounded voice requests and recovery when `grade={11}`. Grade 10 keeps its existing defaults, provider, prompts and request behavior.

## Fixed failure paths

- Turn tracking records the expected user-message count before sending. A fast assistant response no longer depends on React first rendering a user-only message list.
- Chat errors stop the call, release the microphone and display an error. Tapping the owl restarts listening.
- Transcription has a 30-second client deadline covering response decoding; Grade 11 upstream transcription has a 25-second connection/response-header deadline.
- TTS requests and decoding have a 20-second deadline. Failed voice output preserves the response text and returns to listening after the stream finishes.
- Filler playback and answer playback have deadlines. A 90-second thinking/speaking watchdog stops a stalled call and displays a retry message.
- Closed-call transcription and speech results are ignored after a new call generation starts.

## Burmese recognition

Grade 11 supplies a Burmese language preference and bounded vocabulary references from the current textbook section. The server keeps the existing Burmese-capable model and auto-detection because the current integration does not send a `my` provider language code. The prompt requires Myanmar Unicode and preservation of spoken English, without inventing a transcript. The Grade 11 silence window is 3 seconds; Grade 10 retains 2.3 seconds.

## Verification and limits

Mocked component tests exercise skipped user-only renders, failed TTS, chat errors/restart and stalled thinking. Request tests cover network and decoding deadlines. Route tests cover authenticated Grade 11 vocabulary hints and unchanged Grade 10 defaults.

No live student recordings, provider calls or production logs were available. These changes fix reproducible client failure paths; they do not establish which upstream request stalled in the reported session or prove Burmese transcription accuracy on the user's device. No production build or database migration is required for this change.
