import type { GrammarOralSegment } from "@/data/grammar/types";
import { UNIT1_ORAL_PARAGRAPHS, type Unit1OralTopic } from "./grade11Unit1Oral";
import { UNIT1_KEYS, UNIT1_SECTIONS } from "./grade11Unit1";
const blocks = UNIT1_SECTIONS.find((section) => section.code === "1C")!.blocks;
type Cue = Omit<GrammarOralSegment, "scriptMy"> & { start: number };
function cue(
  start: number,
  titleMy: string,
  noteMy: string,
  sourceNumber?: number,
  answer = false,
  focus?: string[],
): Cue {
  const block = blocks.find((item) => item.id === `1C-${sourceNumber}`);
  const key = answer && block ? UNIT1_KEYS[block.id] : undefined;
  return {
    start,
    titleMy,
    noteMy,
    focus,
    sentenceEn:
      key?.answer ??
      block?.x
        .replace(/^e\.g\.\s*|^\d+\.\s*/, "")
        .replace(/\s+\((?:preposition|adverb|conjunction)\)$/, ""),
    sentenceMy: key?.answerMy ?? block?.my,
  };
}
const cues: Record<Unit1OralTopic, Cue[]> = {
  "both-and": [
    cue(
      0,
      "နှစ်ခုစလုံးကို အလေးပေးခြင်း",
      "တစ်ခုတည်း မဟုတ်ဘဲ နှစ်ခုစလုံး ပါဝင်ပါတယ်။ both ကို ပထမအတွဲရှေ့၊ and ကို ဒုတိယအတွဲရှေ့မှာ ထားပါ။",
    ),
    cue(
      4,
      "နာမ်နှစ်ခုကို ဆက်ခြင်း",
      "နှစ်သက်တာက the novel နဲ့ the movie နှစ်ခုစလုံးပါ။",
      3,
      false,
      ["both", "the novel", "and", "the movie"],
    ),
    cue(
      6,
      "ကတ္တားနှစ်ခု → အများကိန်းကြိယာ",
      "လူနှစ်ဦးက ကတ္တားဖြစ်တာကြောင့် is မဟုတ်ဘဲ are ကို သုံးပါတယ်။",
      4,
      false,
      ["Both", "and", "are"],
    ),
    cue(
      9,
      "အတိတ်ကာလမှာလည်း အများကိန်း",
      "ကတ္တားနှစ်ခုရှိပြီး အတိတ်ကာလဖြစ်လို့ were ကို သုံးပါတယ်။",
      8,
      false,
      ["Both", "and", "were"],
    ),
    cue(
      11,
      "လုပ်ဆောင်ချက်နှစ်ခုကို ဆက်ခြင်း",
      "can က speak နဲ့ write နှစ်ခုစလုံးနဲ့ သက်ဆိုင်ပါတယ်။",
      5,
      false,
      ["can", "both", "speak", "and", "write"],
    ),
    cue(
      13,
      "အရည်အချင်းနှစ်ခုကို ဆက်ခြင်း",
      "intelligent နဲ့ friendly တို့က ပုံစံတူ နာမဝိသေသနတွေပါ။",
      6,
      false,
      ["both", "intelligent", "and", "friendly"],
    ),
    cue(
      15,
      "မူရင်းဝါကျနှစ်ကြောင်း",
      "တူနေတဲ့ I like ကို တစ်ခါပဲထားပြီး ရေခဲမုန့်နှစ်မျိုးကို ဆက်ပါ။",
      13,
    ),
    cue(
      19,
      "ပေါင်းပြီးစာအုပ်နမူနာ",
      "both … and က ရေခဲမုန့်နှစ်မျိုးစလုံးကို နှစ်သက်ကြောင်း ပြပါတယ်။",
      14,
      false,
      ["both", "and"],
    ),
    cue(
      20,
      "အငြင်းအဓိပ္ပာယ်ကို သတိပြုပါ",
      "နှစ်ခုစလုံး မလုပ်ဘူးဆိုတဲ့ အဓိပ္ပာယ်အတွက် neither … nor ကို သုံးပါတယ်။",
    ),
    cue(
      22,
      "နှစ်မျိုးစလုံးကို ငြင်းခြင်း",
      "အရက်လည်း မသောက်၊ ဆေးလိပ်လည်း မသောက်ပါ။ not both နဲ့ အဓိပ္ပာယ် မတူပါ။",
      10,
      false,
      ["neither", "nor"],
    ),
    cue(
      24,
      "လေ့ကျင့်ခန်း A · နံပါတ် ၁",
      "လုပ်ဆောင်သူနှစ်ဦးလား၊ လုပ်ဆောင်ချက်နှစ်ခုလား အရင်ရှာပါ။",
      15,
    ),
    cue(
      26,
      "အဆင့် — ကတ္တားနှစ်ခုကို ဆက်ပါ",
      "You နဲ့ Kyaw Zaw ကို Both you and Kyaw Zaw လို့ ဆက်ပါ။ are wasting … ကို တစ်ခါပဲထားပါ။",
      15,
    ),
    cue(27, "ပေါင်းပြီးအဖြေ", "ကတ္တားနှစ်ဦးဖြစ်လို့ are wasting ကို သုံးပါတယ်။", 15, true, [
      "Both",
      "and",
      "are wasting",
    ]),
    cue(28, "ပြန်စစ်ရန်", "ဆက်မယ့်အတွဲ → ပုံစံတူမှု → တူနေတဲ့အပိုင်း → ကတ္တားနဲ့ကြိယာ ကိုက်ညီမှု။"),
  ],
  before: [
    cue(
      0,
      "မဖြစ်မီ / ယခင်က",
      "before ရဲ့နောက်မှာ နာမ်၊ ဝါကျခွဲ သို့မဟုတ် V-ing လိုက်နိုင်ပါတယ်။ ဝါကျအဆုံးမှာလည်း ယခင်ကလို့ သုံးနိုင်ပါတယ်။",
    ),
    cue(3, "before + နာမ်", "လာမယ့်အချိန်က နေ့လယ်စာစားချိန်ထက် စောရပါတယ်။", 28, false, [
      "before lunch",
    ]),
    cue(5, "before = ယခင်က", "ဒီမှာ before နောက်မှာ နာမ် သို့မဟုတ် ကြိယာမလိုက်ပါ။", 29, false, [
      "before",
    ]),
    cue(
      7,
      "before + ဝါကျခွဲ",
      "လက်ဆောင်ပေး → ထွက်ခွာ။ she left မှာ ကတ္တားနဲ့ ကြိယာ နှစ်ခုလုံးပါပါတယ်။",
      30,
      false,
      ["before she left"],
    ),
    cue(
      9,
      "ပြီးစီးမှုနှင့် V-ing အသုံး",
      "ပြီးစီးကာလကိုလည်း သုံးနိုင်ပါတယ်။ before ပါတိုင်း ကာလတစ်မျိုးတည်း သုံးရတာ မဟုတ်ပါ။",
    ),
    cue(
      10,
      "မပြီးမီ ဖြစ်သွားခြင်း",
      "ကျွန်ုပ်စကားပြောတာ မပြီးခင် သူထွက်သွားတာပါ။ ဝါကျတစ်ခုလုံးရဲ့ အဓိပ္ပာယ်ကို ကြည့်ပါ။",
      32,
      false,
      ["before", "had finished"],
    ),
    cue(
      12,
      "before + V-ing",
      "မီးပိတ် → ရုံးကထွက်။ လုပ်ဆောင်သူတူပြီး မရေးထားတဲ့ ကတ္တားက you ပါ။",
      33,
      false,
      ["switch off", "before leaving"],
    ),
    cue(14, "လေ့ကျင့်ခန်း D · နံပါတ် ၁", "ဟင်းသီးဟင်းရွက်ဆေး → ရေခဲသေတ္တာထဲထည့်။", 65),
    cue(
      17,
      "အဆင့် ၁ — အရင်လုပ်ရပ်ကို ထားပါ",
      "Aye Aye washed the vegetables ကို အဓိကဝါကျအဖြစ် ထားပါ။ လုပ်ဆောင်သူက အေးအေး တစ်ဦးတည်းပါ။",
      65,
    ),
    cue(
      18,
      "အဆင့် ၂ — နောက်လုပ်ရပ်ကို ချုံ့ပါ",
      "she put … → before putting … ။ put → putting ။ ကံပုဒ် them ကို မဖျက်ပါနှင့်။",
      65,
    ),
    cue(
      19,
      "ပေါင်းပြီးအဖြေ",
      "washed က အတိတ်ကာလပြပါတယ်။ putting က before နောက်က ပုံစံပါ။ ဖြစ်ဆဲကာလမဟုတ်ပါ။",
      65,
      true,
      ["washed", "before putting", "them"],
    ),
    cue(
      21,
      "မှားတတ်သည့်အချက်",
      "လုပ်ဆောင်သူမတူလျှင် ကတ္တားကို ဖျက်ပြီး မပေါင်းပါနှင့်။ အရင်/နောက် မပြောင်းပြန်စေပါနှင့်။",
    ),
    cue(
      22,
      "ပြန်စစ်ရန်",
      "before နောက်ကလုပ်ရပ် မဖြစ်မီ အဓိကလုပ်ရပ် ဖြစ်ပါတယ်။ လုပ်ဆောင်သူ၊ ကြိယာပုံစံနဲ့ အဓိပ္ပာယ်ကို ပြန်စစ်ပါ။",
    ),
  ],
  after: [
    cue(0, "ပြီးနောက် / နောက်မှ", "after နောက်က လုပ်ရပ်ပြီးမှ အဓိကလုပ်ရပ် ဖြစ်ပါတယ်။"),
    cue(
      3,
      "after + နာမ်",
      "ညစာစား → လမ်းလျှောက်။ ဝါကျထဲမှာ ရှေ့ကရေးထားတာတိုင်း အရင်ဖြစ်တာ မဟုတ်ပါ။",
      36,
      false,
      ["after dinner"],
    ),
    cue(5, "after = နောက်မှ", "ဇွန်လ ၁၇ ရက်က စပြီး တစ်ပတ်အကြာမှာ ပြီးပါတယ်။", 37, false, [
      "a week after",
    ]),
    cue(
      7,
      "after + ဝါကျခွဲ",
      "သင်ထွက်သွား → သူဇာထံမှဖုန်းရ။ ရှေ့က after အပိုင်းအဆုံးမှာ ကော်မာ ပါပါတယ်။",
      38,
      false,
      ["After you had left"],
    ),
    cue(
      9,
      "ပြီးစီးမှုနှင့် V-ing အသုံး",
      "ပြီးစီးကာလနဲ့လည်း သုံးနိုင်ပြီး လုပ်ဆောင်သူတူလျှင် V-ing ပုံစံနဲ့ ချုံ့နိုင်ပါတယ်။",
    ),
    cue(
      10,
      "အနာဂတ်အချိန်ပြဝါကျခွဲ",
      "အိမ်စာပြီး → ဖုန်းခေါ်။ after နောက်က အချိန်ပြဝါကျခွဲမှာ will ထပ်မထည့်ပါ။",
      40,
      false,
      ["will call", "after", "have done"],
    ),
    cue(12, "after + V-ing", "ပုံစံဖြည့် → အတွင်းရေးမှူးဆီပေး။ လုပ်ဆောင်သူတူပါတယ်။", 41, false, [
      "After completing",
      "give",
    ]),
    cue(14, "လေ့ကျင့်ခန်း C · နံပါတ် ၁", "ကွန်ပစ်ချ → စိတ်ရှည်စွာစောင့်။", 54),
    cue(
      17,
      "အဆင့် ၁ — အရင်လုပ်ရပ်ကို ရွေးပါ",
      "the fisherman နဲ့ He က တစ်ဦးတည်းပါ။ ကွန်ပစ်ချတာကို after နောက်မှာ ထားပါ။",
      54,
    ),
    cue(
      18,
      "အဆင့် ၂ — အခြေခံကြိယာကို ပြန်ယူပါ",
      "threw → throw → throwing ။ အတိတ်ပုံစံနောက်မှာ -ing တန်းမဆက်ပါနှင့်။",
      54,
    ),
    cue(
      19,
      "အဆင့် ၃ — နောက်လုပ်ရပ်ကို ဆက်ပါ",
      "အဓိကဝါကျမှာ the fisherman ကို ပြန်ရေးပါ။ waited patiently ကို မူရင်းကာလအတိုင်း ထားပါ။",
      54,
    ),
    cue(
      20,
      "ပေါင်းပြီးအဖြေ",
      "ကွန်ပစ်ချပြီးမှ စောင့်ပါတယ်။ after အပိုင်းကို ရှေ့မှာထားလို့ ကော်မာ ပါပါတယ်။",
      54,
      true,
      ["After throwing", "the fisherman", "waited"],
    ),
    cue(
      22,
      "မှားတတ်သည့်အချက်",
      "V-ing လုပ်ရပ်နဲ့ အဓိကဝါကျရဲ့ လုပ်ဆောင်သူ တူရပါမယ်။ အရင်ဖြစ်တဲ့လုပ်ရပ်ကို မရွေးမှားပါနှင့်။",
    ),
    cue(
      23,
      "before နဲ့ after ကို နှိုင်းယှဉ်ပါ",
      "after နောက်ကလုပ်ရပ်က အရင်ဖြစ်ပါတယ်။ before နောက်ကလုပ်ရပ်က နောက်ဖြစ်ပါတယ်။",
    ),
  ],
};
export function unit1OralTimeline(topic: Unit1OralTopic): GrammarOralSegment[] {
  const paragraphs = UNIT1_ORAL_PARAGRAPHS[topic];
  return cues[topic].map(({ start, ...note }, index) => ({
    ...note,
    scriptMy: paragraphs
      .slice(start, cues[topic][index + 1]?.start ?? paragraphs.length)
      .join("\n\n"),
  }));
}
