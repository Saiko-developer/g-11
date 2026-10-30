/**
 * Review 1 — revision of Units 1–3, rendered with the shared ExerciseKit so it
 * matches the existing unit layouts exactly.
 */
import { ExerciseGroup, OwlBadge } from "@/components/lesson/ExerciseKit";
import {
  REVIEW1_PART_A,
  REVIEW1_PART_A_INSTRUCTIONS,
  REVIEW1_PART_B,
  REVIEW1_PART_B_INSTRUCTIONS,
  REVIEW1_PART_C,
  REVIEW1_PART_C_INSTRUCTIONS,
} from "@/data/review1";

export function Review1View() {
  return (
    <div className="space-y-5">
      <OwlBadge>
        <p className="font-semibold">Review 1 — ဆရာ ဇီးကွက် 🦉</p>
        <p>
          ဒီပြန်လည်လေ့လာခြင်း အပိုင်းမှာ Unit 1, 2, 3 က သဒ္ဒါနှင့် ဝေါဟာရများကို ပြန်စစ်ပါမည်။
          အဖြေကို မကြည့်ခင် ကိုယ်တိုင် ရေးဖြေကြည့်ပါ။
        </p>
      </OwlBadge>

      <ExerciseGroup
        title="Part A — Write the function of each utterance"
        titleMy="အပိုင်း A — စကားပြောအသုံးအနှုန်း၏ လုပ်ဆောင်ချက်ကို ရေးပါ"
        instructions={REVIEW1_PART_A_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Type the function…"
        items={REVIEW1_PART_A.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />

      <ExerciseGroup
        title="Part B — Complete the sentences with the correct word forms"
        titleMy="အပိုင်း B — မှန်ကန်သော စကားလုံးပုံစံများဖြင့် ဝါကျများကို ဖြည့်ပါ"
        instructions={REVIEW1_PART_B_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write the complete sentence…"
        items={REVIEW1_PART_B.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />

      <ExerciseGroup
        title="Part C — Rewrite the sentences"
        titleMy="အပိုင်း C — ဝါကျများကို ပြန်ရေးပါ"
        instructions={REVIEW1_PART_C_INSTRUCTIONS}
        enableStructure={false}
        placeholder="Write your rewritten sentence…"
        items={REVIEW1_PART_C.map((q) => ({
          id: q.id,
          text: q.question,
          translation: q.translationMy,
          answer: q.answer,
        }))}
      />
    </div>
  );
}