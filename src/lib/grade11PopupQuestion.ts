/** Resolve only an explicit question number with a unique matching source entry.
 * Missing/ambiguous references remain for the tutor to clarify, never guessed.
 */
export function grade11PopupQuestion(context: string, spoken: string): string | null {
  const text = spoken
    .replace(/[၀-၉]/g, (digit) => String(digit.charCodeAt(0) - "၀".charCodeAt(0)))
    .replace(
      /(နံပါတ်\s*)(တစ်ဆယ်|ကိုး|ရှစ်|ခုနစ်|ခြောက်|ငါး|လေး|သုံး|နှစ်|တစ်)/g,
      (_match, label: string, word: string) =>
        label +
        (
          {
            တစ်: 1,
            နှစ်: 2,
            သုံး: 3,
            လေး: 4,
            ငါး: 5,
            ခြောက်: 6,
            ခုနစ်: 7,
            ရှစ်: 8,
            ကိုး: 9,
            တစ်ဆယ်: 10,
          } as Record<string, number>
        )[word],
    );
  const number = text.match(
    /(?:exercise|question|number|no\.?|နံပါတ်|မေးခွန်း|လေ့ကျင့်ခန်း)\s*(?:no\.?|number|နံပါတ်)?\s*(\d{1,2})(?!\d)/i,
  )?.[1];
  if (!number) return null;
  const group = text.match(/(?:exercise|လေ့ကျင့်ခန်း)\s*([A-E])\b/i)?.[1]?.toUpperCase();
  const entries = [
    ...context.matchAll(
      /^\[(?:Exercise ([A-E]) · )?Question (\d+) \| source ([^\]]+)\] ([^\n]*)\n([^\n]*)/gm,
    ),
  ].filter((entry) => Number(entry[2]) === Number(number) && (!group || entry[1] === group));
  if (entries.length !== 1) return null;
  const entry = entries[0];
  return `${entry[1] ? `Exercise ${entry[1]} · ` : ""}Question ${entry[2]} | source ${entry[3]}\n${entry[4]}\n${entry[5]}`;
}
