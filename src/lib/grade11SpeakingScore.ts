export type SpeakingWord = { word: string; matched: boolean };
export type SpeakingMatch = { percent: number; words: SpeakingWord[]; spoken: string };
const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Ordered text alignment, not a phonetic/accent assessment. Extra words reduce the result. */
export function grade11SpeakingMatch(target: string, spoken: string): SpeakingMatch {
  const words = target.split(/\s+/).filter((word) => normalize(word));
  const heard = spoken.split(/\s+/).map(normalize).filter(Boolean);
  const reference = words.map(normalize);
  const dp = Array.from({ length: reference.length + 1 }, () =>
    new Array<number>(heard.length + 1).fill(0),
  );
  for (let i = reference.length - 1; i >= 0; i--)
    for (let j = heard.length - 1; j >= 0; j--)
      dp[i][j] =
        reference[i] === heard[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const matched = new Set<number>();
  let i = 0,
    j = 0;
  while (i < reference.length && j < heard.length) {
    if (reference[i] === heard[j]) {
      matched.add(i);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const denominator = Math.max(reference.length, heard.length);
  return {
    percent: denominator ? Math.round((matched.size / denominator) * 100) : 0,
    words: words.map((word, index) => ({ word, matched: matched.has(index) })),
    spoken,
  };
}
