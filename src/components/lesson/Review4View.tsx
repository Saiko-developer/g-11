/**
 * Review 4 — revision of Units 10–12, rendered with the shared ExerciseKit.
 */
import { ExerciseGroup, OwlBadge } from "@/components/lesson/ExerciseKit";
import {
  REVIEW4_PART_A,
  REVIEW4_PART_A_COLUMN_A,
  REVIEW4_PART_A_COLUMN_B,
  REVIEW4_PART_A_INSTRUCTIONS,
  REVIEW4_PART_B,
  REVIEW4_PART_B_INSTRUCTIONS,
  REVIEW4_PART_C,
  REVIEW4_PART_C_INSTRUCTIONS,
} from "@/data/review4";

function WordBox({ title, words }: { title: string; words: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {words.map((w) => (
          <span
            key={w}
            className="rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Review4View() {
  const toItems = (list: typeof REVIEW4_PART_A) =>
    list.map((q) => ({ id: q.id, text: q.question, translation: q.translationMy, answer: q.answer }));

  return (
    <div className="space-y-5">
      <OwlBadge>
        <p className="font-semibold">Review 4 — ဆရာ ဇီးကွက် 🦉</p>
        <p>
          ဒီပြန်လည်လေ့လာခြင်း အပိုင်းမှာ Unit 10, 11, 12 က ဝေါဟာရများနှင့် သဒ္ဒါများကို ပြန်စစ်ပါမည်။
          အဖြေကို မကြည့်ခင် ကိုယ်တိုင် ရေးဖြေကြည့်ပါ။
        </p>
      </OwlBadge>

      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
        <WordBox title="Column A" words={REVIEW4_PART_A_COLUMN_A} />
        <WordBox title="Column B" words={REVIEW4_PART_A_COLUMN_B} />
      </div>

      <ExerciseGroup
        title="Part A — Make compound nouns"
        titleMy="အပိုင်း A — ပေါင်းစပ်နာမ်များ ဖွဲ့ပါ"
        instructions={REVIEW4_PART_A_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write the compound noun…"
        items={toItems(REVIEW4_PART_A)}
      />
      <ExerciseGroup
        title="Part B — Complete each sentence"
        titleMy="အပိုင်း B — ဝါကျများကို ဖြည့်ပါ"
        instructions={REVIEW4_PART_B_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write the complete sentence…"
        items={toItems(REVIEW4_PART_B)}
      />
      <ExerciseGroup
        title="Part C — Rewrite the sentences"
        titleMy="အပိုင်း C — ဝါကျများကို ပြန်ရေးပါ"
        instructions={REVIEW4_PART_C_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write your rewritten sentence…"
        items={toItems(REVIEW4_PART_C)}
      />
    </div>
  );
}
