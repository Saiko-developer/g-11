/**
 * Review 3 — revision of Units 7–9, rendered with the shared ExerciseKit so it
 * matches the existing unit layouts exactly.
 */
import { ExerciseGroup, OwlBadge } from "@/components/lesson/ExerciseKit";
import {
  REVIEW3_PART_A,
  REVIEW3_PART_A_INSTRUCTIONS,
  REVIEW3_PART_B,
  REVIEW3_PART_B_INSTRUCTIONS,
  REVIEW3_WORD_BANK,
} from "@/data/review3";

export function Review3View() {
  return (
    <div className="space-y-5">
      <OwlBadge>
        <p className="font-semibold">Review 3 — ဆရာ ဇီးကွက် 🦉</p>
        <p>
          ဒီပြန်လည်လေ့လာခြင်း အပိုင်းမှာ Unit 7, 8, 9 က ဝေါဟာရများနှင့် သဒ္ဒါများကို ပြန်စစ်ပါမည်။
          အဖြေကို မကြည့်ခင် ကိုယ်တိုင် ရေးဖြေကြည့်ပါ။
        </p>
      </OwlBadge>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Word box · စကားလုံးအကွက်
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {REVIEW3_WORD_BANK.map((word) => (
            <span
              key={word}
              className="rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <ExerciseGroup
        title="Part A — Complete each sentence with the appropriate word"
        titleMy="အပိုင်း A — သင့်တော်သော စကားလုံးဖြင့် ဝါကျများကို ဖြည့်ပါ"
        instructions={REVIEW3_PART_A_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write the complete sentence…"
        items={REVIEW3_PART_A.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />

      <ExerciseGroup
        title="Part B — Rewrite the sentences"
        titleMy="အပိုင်း B — ဝါကျများကို ပြန်ရေးပါ"
        instructions={REVIEW3_PART_B_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write your rewritten sentence…"
        items={REVIEW3_PART_B.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />
    </div>
  );
}
