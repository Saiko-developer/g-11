import type { GrammarSection } from "@/data/grammar/types";
import { UNIT1_KEYS, UNIT1_SECTIONS } from "@/lib/grade11Unit1";

const blocks = UNIT1_SECTIONS.find((section) => section.code === "1C")!.blocks;
const source = (number: number) => blocks.find((block) => block.id === `1C-${number}`)!;
const clean = (text: string) => text.replace(/^e\.g\.\s*/, "").replace(/^\d+\.\s*/, "");
const plans = {
  "both-and": {
    idea: "တစ်ခုတည်း မဟုတ်ဘဲ နှစ်ခုစလုံး ပါဝင်ကြောင်း အလေးပေးပါတယ်။",
    patterns: [
      ["both + အရာ ၁ + and + အရာ ၂", "နာမ်၊ လုပ်ရပ် သို့မဟုတ် အရည်အချင်းကို ပုံစံတူအောင် ဆက်ပါ။"],
      [
        "Both + ကတ္တား ၁ + and + ကတ္တား ၂ + အများကိန်းကြိယာ",
        "ကတ္တားနှစ်ခု ဆက်ထားမှ ကြိယာကို အများကိန်းထားရပါတယ်။",
      ],
    ],
    example: 4,
    focus: ["Both", "Ko Zaw", "and", "Soe Thu", "are"],
    why: "ကိုဇော် + စိုးသူ = လူနှစ်ဦး။ ဒါကြောင့် is မဟုတ်ဘဲ are ကို သုံးပါတယ်။",
    question: 15,
    steps: [
      "မတူတဲ့ ကတ္တားနှစ်ခုကို ရှာပါ — You နဲ့ Kyaw Zaw။",
      "Both you and Kyaw Zaw လို့ ဆက်ပါ။",
      "တူနေတဲ့ are wasting too much time ကို တစ်ခါသာ ထားပါ။",
    ],
    timeline: null,
    caution:
      "နှစ်ခုစလုံး မလုပ်ဘူးဆိုတဲ့ အဓိပ္ပာယ်အတွက် neither … nor ကို သုံးပါ။ not both က အဓိပ္ပာယ်တူမဟုတ်ပါ။",
    check: "ကိုယ်ဆက်ထားတဲ့ အပိုင်းနှစ်ခုက ပုံစံတူသလား။ အဲဒါတွေက ကတ္တားလား၊ ကံလား။",
  },
  before: {
    idea: "before နောက်က ဖြစ်ရပ် မဖြစ်မီ အဓိကဖြစ်ရပ် ဖြစ်ပါတယ်။",
    patterns: [
      [
        "before + နာမ် / before + ကတ္တား + ကြိယာ",
        "နောက်က အပိုင်းပေါ်မူတည်ပြီး အသုံးအနှုန်း ကွာပါတယ်။",
      ],
      [
        "အရင်လုပ်ရပ် + before + နောက်လုပ်ရပ်၏ V-ing",
        "လုပ်ဆောင်သူတူလျှင် နောက်လုပ်ရပ်ကို V-ing နဲ့ ချုံ့ရေးနိုင်ပါတယ်။",
      ],
    ],
    example: 33,
    focus: ["switch off", "before", "leaving"],
    why: "မီးပိတ်တာ အရင်၊ ရုံးကထွက်တာ နောက်။ အမိန့်ပေးဝါကျမှာ မရေးထားတဲ့ ကတ္တားက you ပါ။",
    question: 65,
    steps: [
      "ဆေးတာ အရင်၊ ရေခဲသေတ္တာထဲ ထည့်တာ နောက်လို့ ခွဲပါ။ လုပ်ဆောင်သူက အေးအေး တစ်ဦးတည်းပါ။",
      "နောက်ဖြစ်တဲ့ she put … ကို before putting … ပြောင်းပါ။ put → putting။",
      "Aye Aye washed … ကို ထားပါ။ ဟင်းသီးဟင်းရွက်ကို ပြန်ညွှန်းတဲ့ them ကိုလည်း ထားပါ။",
    ],
    timeline: ["ဟင်းသီးဟင်းရွက်ဆေး", "ရေခဲသေတ္တာထဲထည့်"],
    caution:
      "လုပ်ဆောင်သူမတူလျှင် ကတ္တားကို ဖျက်ပြီး V-ing ပုံစံနဲ့ မပေါင်းပါနှင့်။ before တွေ့တိုင်း V-ing လိုတာ မဟုတ်ပါ။",
    check: "before နောက်က လုပ်ရပ်က နောက်မှဖြစ်သလား။ ဝါကျနှစ်ပိုင်းရဲ့ လုပ်ဆောင်သူ တူသလား။",
  },
  after: {
    idea: "after နောက်က လုပ်ရပ်ပြီးမှ အဓိကလုပ်ရပ် ဖြစ်ပါတယ်။",
    patterns: [
      [
        "after + နာမ် / after + ကတ္တား + ကြိယာ",
        "ညစာစားချိန် သို့မဟုတ် လုပ်ရပ်တစ်ခု ပြီးဆုံးသည့်နောက်ကို ပြပါတယ်။",
      ],
      [
        "After + အရင်လုပ်ရပ်၏ V-ing, နောက်လုပ်ရပ်",
        "လုပ်ဆောင်သူတူရပါမယ်။ ရှေ့က after အပိုင်းအဆုံးမှာ ကော်မာ ထည့်ပါ။",
      ],
    ],
    example: 41,
    focus: ["After", "completing", "give"],
    why: "ပုံစံဖြည့်တာ အရင်၊ အတွင်းရေးမှူးဆီပေးတာ နောက်။ လုပ်ဆောင်သူ နှစ်ဦးမဟုတ်ဘဲ တစ်ဦးတည်းပါ။",
    question: 54,
    steps: [
      "ကွန်ပစ်တာ အရင်၊ စောင့်တာ နောက်လို့ ခွဲပါ။ the fisherman နဲ့ He က တစ်ဦးတည်းပါ။",
      "အရင်လုပ်ရပ်ကို after နောက်မှာထားပါ။ threw → throw → throwing။",
      "အဓိကဝါကျမှာ the fisherman ကို ပြန်ရေးပြီး waited patiently ကို မူရင်းအတိုင်း ထားပါ။",
    ],
    timeline: ["ကွန်ပစ်ချ", "စိတ်ရှည်စွာစောင့်"],
    caution:
      "အတိတ်ကြိယာကို -ing တန်းမဆက်ပါနှင့်။ အခြေခံပုံစံကို ပြန်ယူပါ။ လုပ်ဆောင်သူ မတူလျှင် ကတ္တားကို မဖျက်ပါနှင့်။",
    check: "after နောက်က လုပ်ရပ်က အရင်ပြီးသလား။ မူရင်းဝါကျရဲ့ အချိန်အစီအစဉ် မပြောင်းဘူးလား။",
  },
} as const;

function Highlight({ text, words }: { text: string; words: readonly string[] }) {
  // Authored fragments are matched literally; textbook wording remains intact.
  const pattern = new RegExp(
    `(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  return (
    <>
      {text.split(pattern).map((part, index) =>
        words.includes(part) ? (
          <mark key={index} className="rounded bg-primary/15 px-0.5 font-semibold text-primary">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Static reading notes for the existing narration; no extra playback or AI requests. */
export function Grade11Unit1OralNotes({ section }: { section: GrammarSection }) {
  const id = section.id.replace("grade11-unit1-", "") as keyof typeof plans;
  const plan = plans[id];
  if (!plan) return null;
  const example = source(plan.example);
  const question = source(plan.question);
  const answer = UNIT1_KEYS[question.id];
  return (
    <div className="mt-3 space-y-4 text-sm leading-relaxed">
      <p className="rounded-xl bg-background p-3 font-medium" lang="my">
        {plan.idea}
      </p>
      <section aria-label="Grammar patterns" className="space-y-2">
        <h4 className="font-semibold">၁။ ပုံစံကို မှတ်ပါ</h4>
        {plan.patterns.map(([pattern, meaning]) => (
          <div key={pattern} className="rounded-lg border border-border bg-background p-3">
            <p className="break-words font-semibold text-primary">{pattern}</p>
            <p className="mt-1 text-xs text-muted-foreground">{meaning}</p>
          </div>
        ))}
      </section>
      <section
        aria-label="Textbook example"
        className="rounded-xl border border-border bg-background p-3"
      >
        <h4 className="text-xs font-semibold text-muted-foreground">၂။ စာအုပ်နမူနာ</h4>
        <p lang="en" className="mt-2">
          <Highlight text={clean(example.x)} words={plan.focus} />
        </p>
        <p lang="my" className="mt-2 text-muted-foreground">
          {example.my}
        </p>
        <p className="mt-2 border-t border-border pt-2">💡 {plan.why}</p>
      </section>
      <section aria-label="Worked textbook exercise" className="space-y-3">
        <h4 className="font-semibold">၃။ စာအုပ်လေ့ကျင့်ခန်းကို ပေါင်းကြည့်ပါ</h4>
        <p lang="en" className="rounded-lg bg-background p-3">
          {clean(question.x)}
        </p>
        {plan.timeline && (
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-border bg-background p-3 text-center text-xs"
            aria-label="Event order"
          >
            <div>
              <p className="font-semibold text-primary">အရင်</p>
              <p>{plan.timeline[0]}</p>
            </div>
            <span aria-hidden="true">→</span>
            <div>
              <p className="font-semibold text-primary">နောက်</p>
              <p>{plan.timeline[1]}</p>
            </div>
          </div>
        )}
        <ol className="space-y-2">
          {plan.steps.map((step, index) => (
            <li key={step} className="flex gap-2">
              <span className="shrink-0 font-semibold text-primary">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="rounded-xl border border-primary/30 bg-background p-3">
          <p className="text-xs font-semibold text-primary">ပေါင်းပြီးဝါကျ</p>
          <p lang="en" className="mt-1 font-medium">
            {answer.answer}
          </p>
          <p lang="my" className="mt-1 text-muted-foreground">
            {answer.answerMy}
          </p>
        </div>
      </section>
      <aside className="rounded-xl border border-border bg-background p-3">
        <p className="font-semibold">သတိပြုရန်</p>
        <p className="mt-1">{plan.caution}</p>
        <p className="mt-3 text-xs font-semibold text-primary">ကိုယ့်ကိုယ်ကို ပြန်စစ်ပါ</p>
        <p className="mt-1">{plan.check}</p>
      </aside>
      <details className="rounded-lg border border-border bg-background p-3">
        <summary className="cursor-pointer font-medium">အသံထဲက စာအုပ်နမူနာများ ထပ်ကြည့်မယ်</summary>
        <ul className="mt-3 space-y-3">
          {section.oral.note.examples.map((item) => (
            <li key={item.en} className="border-t border-border pt-2">
              <p lang="en">{clean(item.en)}</p>
              <p lang="my" className="mt-1 text-xs text-muted-foreground">
                {item.my}
              </p>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
