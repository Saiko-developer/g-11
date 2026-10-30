/**
 * Review 2 — revision of Units 4–6, rendered with the shared ExerciseKit so it
 * matches the existing unit layouts exactly.
 */
import { ExerciseGroup, OwlBadge } from "@/components/lesson/ExerciseKit";
import {
  REVIEW2_PART_A,
  REVIEW2_PART_A_INSTRUCTIONS,
  REVIEW2_PART_B,
  REVIEW2_PART_B_INSTRUCTIONS,
} from "@/data/review2";

export function Review2View() {
  return (
    <div className="space-y-5">
      <OwlBadge>
        <p className="font-semibold">Review 2 — ဆရာ ဇီးကွက် 🦉</p>
        <p>
          ဒီပြန်လည်လေ့လာခြင်း အပိုင်းမှာ Unit 4, 5, 6 က စကားလုံးများနှင့် သဒ္ဒါများကို ပြန်စစ်ပါမည်။
          အဖြေကို မကြည့်ခင် ကိုယ်တိုင် ရေးဖြေကြည့်ပါ။
        </p>
      </OwlBadge>

      <ExerciseGroup
        title="Part A — Choose the correct expression"
        titleMy="အပိုင်း A — မှန်ကန်သော စကားလုံးကို ရွေးပါ"
        instructions={REVIEW2_PART_A_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write the complete sentence…"
        items={REVIEW2_PART_A.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />

      <ExerciseGroup
        title="Part B — Rewrite the sentences"
        titleMy="အပိုင်း B — ဝါကျများကို ပြန်ရေးပါ"
        instructions={REVIEW2_PART_B_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write your rewritten sentence…"
        items={REVIEW2_PART_B.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />
    </div>
  );
}
