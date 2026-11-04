export type WordMark = { word: string; status: "ok" | "close" | "missed" };

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

function close(a: string, b: string) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  // Levenshtein distance <= 1 (or 2 for long words) counts as "close".
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length] <= (a.length > 6 ? 2 : 1);
}

/** Compare what the student said with the target sentence, word by word. */
export function scoreShadowing(target: string, spoken: string): { marks: WordMark[]; percent: number } {
  const said = spoken.split(/\s+/).map(norm).filter(Boolean);
  const used = new Array(said.length).fill(false);
  const words = target.split(/\s+/).filter((w) => norm(w));
  let points = 0;
  const marks = words.map((word): WordMark => {
    const n = norm(word);
    const exact = said.findIndex((s, i) => !used[i] && s === n);
    if (exact >= 0) {
      used[exact] = true;
      points += 1;
      return { word, status: "ok" };
    }
    const near = said.findIndex((s, i) => !used[i] && close(s, n));
    if (near >= 0) {
      used[near] = true;
      points += 0.5;
      return { word, status: "close" };
    }
    return { word, status: "missed" };
  });
  return { marks, percent: words.length ? Math.round((points / words.length) * 100) : 0 };
}
