import type { Grade11Caption } from "@/lib/grade11Captions";

export function Grade11CaptionText({
  cue,
  wordIndex = -1,
}: {
  cue: Grade11Caption;
  wordIndex?: number;
}) {
  return (
    <p lang="en" className="text-lg font-semibold leading-relaxed">
      {cue.words.map((word, index) => (
        <span
          key={index}
          aria-current={index === wordIndex ? "true" : undefined}
          className={index === wordIndex ? "rounded bg-primary/15 text-primary" : undefined}
        >
          {word.word}
        </span>
      ))}
    </p>
  );
}
