/**
 * Forgiving answer matching for typed exercise answers.
 * Extra / missing spaces, punctuation, capitals, curly quotes and invisible
 * keyboard characters never make a right answer wrong.
 */

export function cleanAnswer(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\\"/g, '"')
    .replace(/[\u2018\u2019\u201B\u2032`]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .toLowerCase()
    .replace(/'/g, "") // didn't == didnt
    .replace(/[.,!?;:"()\[\]\u2014\u2013\-✔✘]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const squash = (s: string) => cleanAnswer(s).replace(/\s+/g, "");

/** Remove teacher notes like "(verb: is)" or "→ modifies ...". */
function stripNotes(s: string): string {
  return s.replace(/\([^)]*\)/g, " ").replace(/→.*$/, " ");
}

/** "that / which was built" -> ["that was built", "which was built"]. */
function expandSlashes(s: string): string[] {
  const m = s.match(/(\S+)\s*\/\s*(\S+)/);
  if (!m || m.index === undefined) return [s];
  const before = s.slice(0, m.index);
  const after = s.slice(m.index + m[0].length);
  return [
    ...expandSlashes(before + m[1] + after),
    ...expandSlashes(before + m[2] + after),
  ];
}

export function acceptedAnswers(correct: string): string[] {
  const out = new Set<string>();
  const parts = [correct, ...correct.split(/;| or /i)];
  for (const raw of parts) {
    for (const base of [raw, stripNotes(raw)]) {
      for (const v of expandSlashes(base)) {
        const c = squash(v);
        if (c) out.add(c);
      }
    }
  }
  return [...out];
}

export function isAnswerMatch(given: string, correct: string): boolean {
  const g = squash(given);
  if (!g) return false;
  const tfnm: Record<string, string[]> = {
    t: ["t", "true"],
    true: ["t", "true"],
    f: ["f", "false"],
    false: ["f", "false"],
    nm: ["nm", "notmentioned"],
    notmentioned: ["nm", "notmentioned"],
  };
  const c = squash(correct);
  if (tfnm[c]) return tfnm[c].includes(g);
  return acceptedAnswers(correct).some((a) => a === g);
}
