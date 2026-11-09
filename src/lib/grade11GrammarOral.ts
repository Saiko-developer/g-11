import type { GrammarOralSegment, GrammarSection, UnitGrammar } from "@/data/grammar/types";
import { UNIT2_GRAMMAR } from "./grade11Unit2Grammar";
import { UNIT3_GRAMMAR, UNIT4_GRAMMAR, UNIT5_GRAMMAR } from "./grade11GrammarLessons";
import { GRADE11_GRAMMAR_LESSON_FRAMES, grade11LessonOpening } from "./grade11GrammarLessonFrames";
import { GRADE11_TEACHING_VOICE, GRADE11_TEXTBOOK_WALKTHROUGHS } from "./grade11GrammarTeaching";
import { EXTENDED_GRADE11_PLANS } from "./grade11GrammarOralUpper";

export type OralExample = { en: string; my: string; whyMy: string; source: string };
export type OralPlan = {
  id: string;
  titleEn: string;
  titleMy: string;
  ideaMy: string;
  formula: string;
  rules: string[];
  examples: OralExample[];
  cautionMy: string;
};
/** Each teaching cue remains its own playback boundary for the Grade 11 player. */
export function oralSegments(plan: OralPlan): GrammarOralSegment[] {
  const topic = plan.id.replace(/^grade11-unit\d+-/, "");
  const teacher = GRADE11_TEACHING_VOICE[topic];
  if (!teacher || teacher.examples.length !== plan.examples.length)
    throw new Error(`Missing independent Grade 11 teaching script: ${plan.id}`);
  const walkthrough = GRADE11_TEXTBOOK_WALKTHROUGHS[topic];
  const lessonFrame = GRADE11_GRAMMAR_LESSON_FRAMES[topic];
  if (!lessonFrame || lessonFrame.exampleFocus.length !== plan.examples.length)
    throw new Error(`Missing Grade 11 grammar focus: ${plan.id}`);
  const segments: GrammarOralSegment[] = grade11LessonOpening(topic, plan.titleEn);
  plan.examples.forEach((example, index) => {
    if (walkthrough?.exampleIndex === index)
      segments.push({
        titleMy: "မူရင်းစာအုပ်ဝါကျ → ပြောင်းနည်း",
        sentenceEn: walkthrough.en,
        sentenceMy: walkthrough.my,
        noteMy: walkthrough.noteMy,
        scriptMy: `${walkthrough.en}\n${walkthrough.my}\n${walkthrough.explanationMy}`,
      });
    const coach = teacher.examples[index];
    // A parenthesized original is already taught in the preceding walkthrough.
    // Present the textbook's main example sentence, without letter labels or its annotation.
    const sentenceEn = example.en.replace(/^\([a-z]\)\s*/i, "").replace(/\s+\([^()]*\)\s*$/, "");
    segments.push({
      titleMy:
        walkthrough?.exampleIndex === index
          ? "ပြောင်းပြီးစာအုပ်နမူနာကို စစ်ကြည့်ပါ"
          : `စာအုပ်နမူနာ ${index + 1} ကို အတူကြည့်မယ်`,
      sentenceEn,
      sentenceMy: example.my,
      focus: lessonFrame.exampleFocus[index],
      noteMy: coach.noteMy,
      scriptMy: `${coach.leadMy}\n${sentenceEn}\n${example.my}\n${example.whyMy}`,
    });
  });
  segments.push({
    titleMy: "နမူနာများမှ စည်းမျဉ်းကို ပြန်စုကြည့်ပါ",
    noteMy: teacher.ideaNoteMy,
    scriptMy: `${teacher.closingMy}\n${plan.rules.join(" ")}\n${plan.cautionMy}`,
  });
  return segments;
}
export type Grade11OralSection = Omit<GrammarSection, "quiz">;
export type Grade11OralGrammar = Omit<UnitGrammar, "sections"> & { sections: Grade11OralSection[] };
export function withOralPlan<T extends Grade11OralSection>(section: T, plan: OralPlan): T {
  const segments = oralSegments(plan);
  return {
    ...section,
    oral: {
      ...section.oral,
      segments,
      scriptMy: segments.map((item) => item.scriptMy).join("\n\n"),
    },
  };
}
// The index refers to the existing, textbook-derived formula/example list, not a fabricated sentence.
const commentary: Record<string, { indexes: number[]; why: string[]; caution: string }> = {
  "present-simple": {
    indexes: [0, 1, 3, 9],
    why: [
      "ဓာတ်ငွေ့တွေကို အပူပေးရင် ပြန့်ကားတယ်ဆိုတာ ယေဘုယျအမှန်တရားပါ။ Gases က အများကိန်းဖြစ်လို့ expand ကို သုံးပါတယ်။",
      "လက ကိုယ်တိုင်အလင်းမထွက်ဘူးဆိုတဲ့ အငြင်းအပိုင်းမှာ does not နောက်ကို shine အခြေခံပုံစံထားပါတယ်။ နောက်က it reflects မှာတော့ it အတွက် -s ပါပါတယ်။",
      "usually နဲ့ in the evenings က ထပ်တလဲလဲအလေ့အထကို ပြပါတယ်။ Grandpa က အနည်းကိန်းဖြစ်လို့ go ကို goes ပြောင်းထားပါတယ်။",
      "tomorrow ပါပေမယ့် ရထားအချိန်ဇယားကို ပြောနေတာဖြစ်လို့ leaves သုံးထားပါတယ်။ အနာဂတ်အချိန်ပြစကားလုံးတစ်လုံးတည်းနဲ့ ကာလကို မရွေးပါနှင့်။",
    ],
    caution:
      "အနည်းကိန်းကတ္တားနဲ့ အပြုဝါကျမှာ -s/-es လိုနိုင်ပါတယ်။ ဒါပေမယ့် does နောက်မှာ အခြေခံကြိယာကိုပဲ ထားပါ။ အလေ့အထ၊ လက်ရှိအခြေအနေ၊ အမှန်တရားနဲ့ အချိန်ဇယားကို ခွဲစဉ်းစားပါ။",
  },
  "present-continuous": {
    indexes: [0, 3, 6],
    why: [
      "Look ဆိုတဲ့ သတိပေးစကားနဲ့ လက်ရှိဖြစ်နေတဲ့ အခြေအနေကို ပြပါတယ်။ The sun အတွက် is နဲ့ shining ကို တွဲထားပါတယ်။",
      "next summer ကို ပြောပေမယ့် စီစဉ်ထားတဲ့အနာဂတ်အစီအစဉ်ဖြစ်လို့ are spending သုံးထားပါတယ်။ အခုလုပ်နေသည့်အရာတစ်မျိုးတည်းကိုသာ ဒီကာလက ပြတာ မဟုတ်ပါ။",
      "always နဲ့ is asking က ထပ်တလဲလဲလုပ်လို့ စိတ်အနှောင့်အယှက်ဖြစ်တာကို အလေးပေးပါတယ်။ ရိုးရိုးအလေ့အထပြဝါကျနဲ့ လေသံကွာပါတယ်။",
    ],
    caution:
      "am/is/are ကို မချန်ပါနှင့်။ -ing ပါရုံနဲ့ ဖြစ်ဆဲကြိယာလို့ မဆုံးဖြတ်ပါနှင့်။ နာမ်အဖြစ်သုံးတဲ့ gerund နဲ့ မတူပါ။",
  },
  "present-perfect": {
    indexes: [0, 3, 6, 9],
    why: [
      "so far this month က ဒီလအတွင်း အခုအချိန်အထိကို ပြပါတယ်။ ဖတ်ပြီးတဲ့အရေအတွက် သုံးအုပ်ကို အလေးပေးလို့ have read သုံးထားပါတယ်။",
      "Thailand ကို နှစ်ကြိမ်ရောက်ဖူးတယ်ဆိုတဲ့ အတွေ့အကြုံပါ။ သွားခဲ့တဲ့ရက်တစ်ရက်ကို အတိအကျ မပြောထားပါ။",
      "လွန်ခဲ့တဲ့အချိန်ကစပြီး အခုထိ ရန်ကုန်မှာ နေထိုင်လာတာပါ။ for နောက်မှာ ကြာချိန် more than 15 years လိုက်ပါတယ်။",
      "အခန်းဆေးသုတ်တာ ပြီးသွားပြီး အခုမြင်ရတဲ့ရလဒ်ကို ပြထားပါတယ်။ have painted က ပြီးစီးမှုကို အလေးပေးပါတယ်။",
    ],
    caution:
      "have/has နောက်မှာ V3 ကို သုံးပါ။ since က အချိန်အစ၊ for က ကြာချိန်ပါ။ ပြီးစီးသတ်မှတ်ထားတဲ့ အတိတ်အချိန်နဲ့ ဝါကျတစ်ခုလုံးကိုပါ စစ်ပြီး ကာလရွေးပါ။",
  },
  "present-perfect-continuous": {
    indexes: [0, 2, 4],
    why: [
      "all morning ဆိုတဲ့ ကြာချိန်တစ်လျှောက် ချက်နေခဲ့တာကို အလေးပေးပါတယ်။ she အတွက် has been cooking ကို သုံးထားပါတယ်။",
      "since 2010 က လုပ်ငန်းစခဲ့တဲ့အချိန်ပါ။ အဲဒီကတည်းက အခုထိ ဆက်လုပ်လာတာကို has been working နဲ့ ပြပါတယ်။",
      "အခန်းဆေးသုတ်နေခဲ့တာကို အလေးပေးပြီး မပြီးသေးကြောင်း နောက်ဝါကျမှာ ဆက်ပြထားပါတယ်။ ရှေ့က ပြီးစီးမှုကိုပြတဲ့ have painted နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။",
    ],
    caution:
      "have/has နောက်မှာ been ကို မမေ့ပါနှင့်။ ဆက်လုပ်နေခြင်း သို့မဟုတ် မကြာမီကရပ်ထားသည့်လုပ်ရပ်ကို အလေးပေးနိုင်ပါတယ်။ ပုံစံကို မြင်ရုံနဲ့ အမြဲမပြီးသေးဘူးဟု မကောက်ချက်ချပါနှင့်။",
  },
  "must-have-to": {
    indexes: [0, 1, 2, 3, 5],
    why: [
      "လာရောက်သူအားလုံး ဧည့်ကြိုနေရာကို သတင်းပို့ရမယ့် လိုအပ်ချက်ပါ။ must နောက်မှာ report အခြေခံပုံစံ သုံးပါတယ်။",
      "mustn't က ညနက်အောင် အပြင်မှာ မနေရဘူးဆိုတဲ့ တားမြစ်ချက်ပါ။ မလုပ်လည်းရတယ်လို့ ဆိုလိုတာ မဟုတ်ပါ။",
      "ကျောင်းစည်းကမ်းဆိုတဲ့ အပြင်ဘက်စည်းမျဉ်းကြောင့် လိုက်နာရတာကို have to နဲ့ ပြထားပါတယ်။",
      "don't have to က မဖြစ်မနေ မလိုအပ်ဘူးဆိုတဲ့ အဓိပ္ပာယ်ပါ။ mustn't လို တားမြစ်တာ မဟုတ်ပါ။",
      "ဆီးချိုရှိမှန်းသိပြီး နေထိုင်စားသောက်ပုံ ပြောင်းခဲ့ရတဲ့ အတိတ်လိုအပ်ချက်ကို had to နဲ့ ပြပါတယ်။",
    ],
    caution:
      "mustn't = မလုပ်ရ၊ don't have to = မလုပ်လည်းရ။ အတိတ်က လိုအပ်ချက်ကို had to သုံးပါ။ does/did နောက်မှာ have to ကို မူရင်းပုံစံထားပါ။",
  },
  gerund: {
    indexes: [0, 1, 2, 3],
    why: [
      "Smoking က ဆေးလိပ်သောက်ခြင်းဆိုတဲ့ လုပ်ရပ်အမည်ပါ။ ဝါကျကတ္တားအဖြစ် နာမ်အလုပ် လုပ်ပါတယ်။",
      "finished နောက်က cooking က ပြီးဆုံးသွားတဲ့ လုပ်ရပ်ကို အမည်ပေးထားတာပါ။ have finished က ကာလပြကြိယာဖြစ်ပြီး cooking က နာမ်အလုပ်လုပ်ပါတယ်။",
      "cooking က hobby ဟာ ဘာလဲဆိုတာကို ဖြည့်ရှင်းပါတယ်။ is cooking ဆိုတာကိုသာ ခွဲကြည့်ပြီး ဖြစ်ဆဲကာလလို့ မဆုံးဖြတ်ပါနှင့်။",
      "ဝိဘတ် of နောက်မှာ လုပ်ရပ်ကို ထည့်ချင်လို့ going ကို သုံးပါတယ်။ of to go လို့ မရေးပါ။",
    ],
    caution:
      "-ing ပုံစံတူပေမယ့် နာမ်အလုပ်လုပ်သလား၊ ကာလပြကြိယာအလုပ်လုပ်သလား ဝါကျထဲက အခန်းကဏ္ဍကို ကြည့်ပါ။",
  },
  infinitive: {
    indexes: [0, 1, 2, 3],
    why: [
      "To travel around the country က လုပ်ရပ်တစ်ခုလုံးကို ကတ္တားအဖြစ် သုံးထားတာပါ။ to နောက်မှာ travel အခြေခံပုံစံထားပါတယ်။",
      "promised နောက်က to return က ကတိပေးထားတဲ့ လုပ်ရပ်ကို ပြပါတယ်။ ရှေ့ကြိယာရဲ့ အသုံးပုံကို ကြည့်ပြီး ရွေးရပါတယ်။",
      "It is important နောက်မှာ ဘာက အရေးကြီးသလဲဆိုတာ to study hard နဲ့ ဖြည့်ပြထားပါတယ်။",
      "for students က လုပ်ဆောင်ရမယ့်သူကို ဖော်ပြတာပါ။ to wear uniforms က လုပ်ရပ်ကို ပြပါတယ်။",
    ],
    caution:
      "to နောက်မှာ V1 ထားပါ။ to အားလုံးက infinitive မဟုတ်တာကြောင့် နောက်လိုက်ပုံကို ကြည့်ပါ။",
  },
  meaning: {
    indexes: [0, 1, 2, 3],
    why: [
      "continued studying က ဆက်လက်လေ့လာခဲ့ကြောင်း ပြပါတယ်။ နောက်နမူနာနဲ့ အဓိပ္ပာယ်ကို နှိုင်းယှဉ်ပါ။",
      "continued to study ကလည်း ဒီအသုံးမှာ ဆက်လက်လေ့လာခဲ့ခြင်းကိုပဲ ပြပါတယ်။ ကြိယာတိုင်းမှာ ပုံစံနှစ်မျိုး အစားထိုးလို့ရတယ်လို့ မယေဘုယျချပါနှင့်။",
      "stopped drinking coffee က ကော်ဖီသောက်တဲ့ အပြုအမူကို ရပ်လိုက်တာပါ။ drinking က ရပ်လိုက်တဲ့လုပ်ရပ် ဖြစ်ပါတယ်။",
      "stopped to drink coffee က လုပ်နေတဲ့အရာတစ်ခုကို ခဏရပ်ပြီး ကော်ဖီသောက်ဖို့ ရပ်တာပါ။ to drink က ရပ်ရတဲ့ရည်ရွယ်ချက်ကို ပြပါတယ်။",
    ],
    caution:
      "stop + V-ing နဲ့ stop + to V1 က အဓိပ္ပာယ်မတူပါ။ စကားလုံးစာရင်းကိုပဲ မကျက်ဘဲ ဘာကို ရပ်တာလဲ၊ ဘာလုပ်ဖို့ ရပ်တာလဲ ပြန်မေးကြည့်ပါ။",
  },
  too: {
    indexes: [0, 1, 2],
    why: [
      "အားနည်းလွန်းတာကြောင့် ကိုယ့်အလေးချိန်ကို မထိန်းနိုင်ပါ။ too weak က လိုအပ်တာထက် လွန်ကဲတဲ့အခြေအနေကို ပြပါတယ်။",
      "သီချင်းဆိုသူနဲ့ အိပ်ချင်သူ မတူပါ။ for me က အိပ်မရတဲ့သူကို ပြပြီး loudly က too နောက်က ကြိယာဝိသေသနပါ။",
      "softly ရှေ့မှာ too ထားပါတယ်။ တင်ဆက်သူပြောတာ ညင်သာလွန်းလို့ နားထောင်သူတွေ မကြားရတာဖြစ်လို့ for us ပါပါတယ်။",
    ],
    caution:
      "ဒီအသုံးမှာ မလုပ်နိုင်တဲ့အဓိပ္ပာယ် ပါပြီးသားဖြစ်လို့ not ကို မလိုအပ်ဘဲ ထပ်မထည့်ပါနှင့်။ လုပ်ဆောင်သူကွာလျှင် for + ကံပုဒ်ကို စစ်ပါ။",
  },
  enough: {
    indexes: [0, 1, 2],
    why: [
      "not strong enough က အားလုံလောက်စွာ မရှိတာပါ။ enough ကို strong နောက်မှာ ထားပါတယ်။",
      "quickly enough မှာလည်း enough က ကြိယာဝိသေသန quickly ရဲ့နောက်မှာ နေပါတယ်။",
      "လေးမိုင်လျှောက်နိုင်ဖို့ လိုတဲ့သန်စွမ်းမှု လုံလောက်တယ်ဆိုတဲ့ ဝါကျနှစ်ခုကို enough to နဲ့ ပေါင်းထားပါတယ်။",
    ],
    caution:
      "adjective/adverb + enough ဖြစ်ပါတယ်။ too နဲ့ ဆန့်ကျင်ဘက်နေရာမှာ ရှိပါတယ်။ enough + noun ဆိုတဲ့ တခြားအသုံးနဲ့ မရောပါနှင့်။",
  },
  conversion: {
    indexes: [0, 1, 2, 3],
    why: [
      "ဆူညံလွန်းတာကြောင့် အေးအေးဆေးဆေး မနားနိုင်ပါ။ noisy ရဲ့ ဆန့်ကျင်ဘက်ကို နောက်ဝါကျမှာ ရှာပါ။",
      "not quiet enough က လိုသလောက် မငြိမ်သက်တာပါ။ ပုံစံပြောင်းပေမယ့် မနားနိုင်တဲ့ မူရင်းအဓိပ္ပာယ်ကို ထိန်းထားပါတယ်။",
      "အသက်အရွယ် မလုံလောက်သေးတာကို not old enough နဲ့ ပြထားပါတယ်။",
      "too young က ငယ်လွန်းတာဖြစ်လို့ ဆုံးဖြတ်နိုင်သေးတဲ့အရွယ် မရောက်ကြောင်း အဓိပ္ပာယ်တူအောင် ပြန်ရေးထားပါတယ်။",
    ],
    caution:
      "ပုံစံပြောင်းရုံမဟုတ်ဘဲ ဆန့်ကျင်ဘက် adjective၊ အငြင်းပုံစံနဲ့ မူရင်းလုပ်နိုင်/မနိုင် အဓိပ္ပာယ်ကိုပါ ထိန်းပါ။",
  },
  inversion: {
    indexes: [0, 1, 2],
    why: [
      "On display inside ဆိုတဲ့ နေရာပြစကားစုကို ရှေ့တင်ပြီး are ကို ကတ္တား works of art ရှေ့မှာ ထားပါတယ်။ အများကိန်းမို့ are ဖြစ်ပါတယ်။",
      "At the bottom of the mountains ကို ရှေ့တင်ထားပါတယ်။ ကတ္တားက a beautiful village ဖြစ်လို့ lies လို့ -s ပါပါတယ်။ mountains ကို ကတ္တားလို့ မမှားပါနှင့်။",
      "On the grass နောက်မှာ sat၊ ပြီးမှ an enormous frog လိုက်ပါတယ်။ sat ရဲ့ အတိတ်ကာလကို မပြောင်းထားပါ။",
    ],
    caution:
      "နေရာပြစကားစုထဲက နာမ်ကို ကတ္တားလို့ မရွေးပါနှင့်။ ဒီလို inversion က မေးခွန်းမဟုတ်လို့ do/does/did အသစ် မထည့်ပါ။ pronoun ကတ္တားတွေကိုလည်း အလိုအလျောက် မရွှေ့ပါနှင့်။",
  },
  participle: {
    indexes: [0, 1],
    why: [
      "that surround က walls ကို ရှင်းပြပြီး လုပ်ဆောင်တဲ့သဘောဖြစ်လို့ surrounding ဖြစ်ပါတယ်။ that depict ကလည်း frescos နဲ့ဆိုင်ပြီး depicting ပြောင်းထားပါတယ်။",
      "which is surrounded က ခံရတဲ့သဘောဖြစ်ပါတယ်။ relative pronoun နဲ့ be ကို ချန်ပြီး surrounded ဆိုတဲ့ V3 ကို ထားပါတယ်။ နံရံတွေက ခံတပ်ကို ဝန်းရံထားတာပါ။",
    ],
    caution:
      "လုပ်ဆောင်တဲ့သဘောလား၊ ခံရတဲ့သဘောလား အရင်ခွဲပါ။ relative pronoun ရှိတိုင်း V-ing ပြောင်းလို့ မရပါ။",
  },
  "object-relative": {
    indexes: [0],
    why: [
      "that က reading ရဲ့ ကံကို ပြန်ရည်ညွှန်းပြီး ဝါကျခွဲရဲ့ ကတ္တား I က ရှိပြီးသားပါ။ that ကိုသာ ဖြုတ်ပြီး I was reading ကို မပြောင်းထားပါ။",
    ],
    caution:
      "ကံအဖြစ်သုံးတဲ့ relative pronoun ကို ချန်တာနဲ့ ကတ္တားအဖြစ်သုံးတဲ့ clause ကို participle ပြောင်းတာ မတူပါ။ non-defining clause မှာလည်း ဒီနည်းကို အလိုအလျောက် မသုံးပါနှင့်။",
  },
};
const existing = [UNIT2_GRAMMAR, UNIT3_GRAMMAR, UNIT4_GRAMMAR, UNIT5_GRAMMAR];
export const GRADE11_ORAL_GRAMMAR: Record<number, Grade11OralGrammar> = Object.fromEntries([
  ...existing.map((grammar) => [
    grammar.unit,
    {
      ...grammar,
      sections: grammar.sections.map((section) => {
        const shortId = section.id.replace(/^grade11-unit\d+-/, "");
        const plan = commentary[shortId];
        if (!plan) throw new Error(`Missing Grade 11 oral plan: ${section.id}`);
        return withOralPlan(section, {
          id: section.id,
          titleEn: section.titleEn,
          titleMy: section.titleMy,
          ideaMy: [...section.text.whatMy, ...section.text.whyMy].join(" "),
          formula: section.text.formulas[0].formula,
          rules: [...new Set(section.text.goldenRulesMy)],
          examples: plan.indexes.map((index, ordinal) => {
            const example = section.text.formulas[index];
            if (!example || !plan.why[ordinal])
              throw new Error(`Missing textbook example: ${section.id}/${index}`);
            return {
              en: example.exampleEn,
              my: example.exampleMy,
              whyMy: plan.why[ordinal],
              source: section.id,
            };
          }),
          cautionMy: plan.caution,
        });
      }),
    },
  ]),
  ...Object.entries(EXTENDED_GRADE11_PLANS).map(([unit, plans]) => [
    Number(unit),
    {
      unit: Number(unit),
      topicEn: plans.map((plan) => plan.titleEn).join("; "),
      topicMy: "စာအုပ်ပါ သဒ္ဒါရှင်းလင်းချက်",
      sections: plans.map((plan) =>
        withOralPlan(
          {
            id: `grade11-unit${unit}-${plan.id}`,
            titleEn: plan.titleEn,
            titleMy: plan.titleMy,
            text: {
              whatMy: [plan.ideaMy],
              whyMy: [],
              goldenRulesMy: plan.rules,
              formulas: plan.examples.map((example) => ({
                labelMy: plan.titleMy,
                formula: plan.formula,
                exampleEn: example.en,
                exampleMy: example.my,
                parts: [{ chunk: example.en, role: "[Textbook example]", glossMy: example.whyMy }],
              })),
              transformation: {
                beforeEn: [],
                afterEn: "",
                stepsMy: [],
              },
              mistakes: [],
            },
            oral: {
              scriptMy: "",
              note: { ideaMy: plan.ideaMy, formula: plan.formula, examples: plan.examples },
            },
          },
          plan,
        ),
      ),
    },
  ]),
]);
