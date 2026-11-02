// Burmese-only timed subtitles for Unit 3 grammar videos (keyed by YouTube id).
// Times are approximate (seconds); lines summarise the teacher's points in Burmese.
import type { SubtitleLine } from "@/data/unit1VideoSubtitles";

const s = (start: number, end: number, my: string): SubtitleLine => ({ start, end, en: "", my });

export const UNIT3_VIDEO_SUBTITLES: Record<string, SubtitleLine[]> = {
  VuXBh78Jkik: [
    s(0, 15, "မင်္ဂလာပါ။ ဒီနေ့ ဝါကျတစ်ကြောင်းရဲ့ အဓိကအပိုင်း ၂ ပိုင်း — Subject နဲ့ Predicate ကို လေ့လာမယ်။"),
    s(15, 40, "ဝါကျတိုင်းမှာ Subject (ကံပြုသူ) နဲ့ Predicate (ဝါစက) ဆိုတဲ့ အပိုင်း ၂ ခု ပါရတယ်။"),
    s(40, 70, "Subject ဆိုတာ ဝါကျက ဘယ်သူ့အကြောင်း / ဘာအကြောင်း ပြောနေလဲ ဆိုတာပါ။"),
    s(70, 100, "ဥပမာ — The dog barks loudly. ဒီမှာ 'The dog' က Subject ပါ။"),
    s(100, 130, "Predicate ဆိုတာ Subject က ဘာလုပ်လဲ / ဘယ်လိုဖြစ်လဲ ဆိုတာကို ပြောပြတဲ့ အပိုင်းပါ။"),
    s(130, 160, "'barks loudly' က Predicate ပါ — ခွေးက ဘာလုပ်လဲ (ကျယ်ကျယ်ဟောင်တယ်)။"),
    s(160, 190, "Predicate ထဲမှာ ကြိယာ (verb) အမြဲ ပါရတယ်။"),
    s(190, 220, "ဥပမာ — My little sister / loves ice cream. (Subject / Predicate)"),
    s(220, 250, "ရှာနည်း — 'ဘယ်သူလဲ? ဘာလဲ?' လို့မေးရင် Subject၊ 'ဘာလုပ်လဲ?' လို့မေးရင် Predicate ကို တွေ့မယ်။"),
    s(250, 280, "Subject က စကားလုံးတစ်လုံးတည်းလည်း ဖြစ်နိုင်တယ်၊ စကားစုအရှည်ကြီးလည်း ဖြစ်နိုင်တယ်။"),
    s(280, 400, "အနှစ်ချုပ် — Subject = ဘယ်သူ/ဘာ၊ Predicate = ဘာလုပ်/ဘယ်လိုဖြစ်။ ကျေးဇူးတင်ပါတယ်။"),
  ],
  LToct5dVXDA: [
    s(0, 20, "ဒီနေ့ Either နဲ့ Neither ရဲ့ ကွာခြားချက်ကို လေ့လာမယ်။"),
    s(20, 50, "Either ဆိုတာ 'နှစ်ခုထဲက တစ်ခုခု' လို့ အဓိပ္ပာယ်ရတယ်။"),
    s(50, 80, "ဥပမာ — You can have either tea or coffee. (လက်ဖက်ရည် ဒါမှမဟုတ် ကော်ဖီ တစ်ခုခု ယူလို့ရတယ်)"),
    s(80, 110, "Neither ဆိုတာ 'နှစ်ခုစလုံး မဟုတ်ဘူး' လို့ အဓိပ္ပာယ်ရတယ်။"),
    s(110, 140, "ဥပမာ — Neither Tom nor Mary came. (Tom ရော Mary ရော မလာကြဘူး)"),
    s(140, 170, "တွဲသုံးပုံ — Either ... or ...၊ Neither ... nor ... ။ Neither နဲ့ or ကို မတွဲရဘူး။"),
    s(170, 200, "Neither က အငြင်းအဓိပ္ပာယ်ပါပြီးသားမို့ not ထပ်မထည့်ရဘူး။ မှား — Neither of them didn't come."),
    s(200, 230, "ကြိယာ — Either/Neither ... or/nor ... ဆိုရင် ကြိယာက 'or/nor' နောက်ကနာမ်နဲ့ ကိုက်ရတယ်။"),
    s(230, 260, "ဥပမာ — Neither the teacher nor the students are here. / Either the boys or Mary is late."),
    s(260, 290, "စကားပြောမှာ — 'I don't like it.' 'Me neither.' / 'I don't either.' (ကျွန်တော်လည်း မကြိုက်ဘူး)"),
    s(290, 400, "မှတ်ရန် — Either = တစ်ခုခု၊ Neither = ဘယ်ဟာမှ မဟုတ်။ ကျေးဇူးတင်ပါတယ်။"),
  ],
};
