// Burmese-only timed subtitles for Unit 2 grammar videos (keyed by YouTube id).
// Times are approximate (seconds); lines summarise the teacher's points in Burmese.
import type { SubtitleLine } from "@/data/unit1VideoSubtitles";

const s = (start: number, end: number, my: string): SubtitleLine => ({ start, end, en: "", my });

export const UNIT2_VIDEO_SUBTITLES: Record<string, SubtitleLine[]> = {
  W3HdjN3cLiM: [
    s(0, 15, "မင်္ဂလာပါ။ ဒီနေ့ Present Simple နဲ့ Present Continuous ကို အပြည့်အစုံ လေ့လာကြမယ်။"),
    s(15, 45, "Present Simple ကို အမြဲဖြစ်နေတဲ့ အကျင့်၊ အလေ့အထ (habits) တွေအတွက် သုံးတယ်။"),
    s(45, 80, "ဥပမာ — I drink coffee every morning. (ကျွန်တော် မနက်တိုင်း ကော်ဖီသောက်တယ်။)"),
    s(80, 120, "အမှန်တရား၊ သိပ္ပံအချက်အလက်တွေအတွက်လည်း သုံးတယ် — Water boils at 100°C."),
    s(120, 170, "He / She / It နောက်မှာ ကြိယာကို -s သို့မဟုတ် -es ထည့်ရမယ် — She works, He watches."),
    s(170, 220, "အငြင်းဝါကျ — do not / does not + ကြိယာ ပုံစံရင်း။ She doesn't like tea."),
    s(220, 270, "အမေးဝါကျ — Do / Does ကို ရှေ့ဆုံးထား။ Do you live here? Does he play football?"),
    s(270, 320, "always, usually, often, sometimes, never စတဲ့ စကားလုံးတွေက Present Simple ရဲ့ လက္ခဏာပါ။"),
    s(320, 370, "Present Continuous ကတော့ အခု ပြောနေတဲ့အချိန်မှာ ဖြစ်နေတဲ့ အရာအတွက် သုံးတယ်။"),
    s(370, 420, "ပုံစံ — am / is / are + ကြိယာ-ing။ I am studying now. They are playing."),
    s(420, 470, "ယာယီ (temporary) ဖြစ်နေတဲ့ အခြေအနေအတွက်လည်း သုံးတယ် — I'm living with my aunt this month."),
    s(470, 520, "now, at the moment, right now, Look!, Listen! တွေက Present Continuous ရဲ့ လက္ခဏာပါ။"),
    s(520, 580, "သတိ — know, like, want, believe လို ခံစားချက်/စိတ်ပြ ကြိယာ (stative verbs) တွေကို -ing မသုံးရဘူး။"),
    s(580, 640, "မှား — I am knowing him. မှန် — I know him."),
    s(640, 720, "နှိုင်းယှဉ်ချက် — I usually walk to school, but today I am taking a bus."),
    s(720, 900, "အနှစ်ချုပ် — အလေ့အထ = Present Simple၊ အခုဖြစ်နေ/ယာယီ = Present Continuous။ ကျေးဇူးတင်ပါတယ်။"),
  ],
  z5DDa4vBvfA: [
    s(0, 15, "ဒီနေ့ Adjective Phrase (နာမ်ဝိသေသန စကားစု) အကြောင်း လေ့လာမယ်။"),
    s(15, 40, "Adjective Phrase ဆိုတာ နာမ်တစ်ခုကို အထူးပြုပေးတဲ့ စကားလုံးအုပ်စု ဖြစ်တယ်။"),
    s(40, 70, "အများဆုံးက Preposition (in, on, with, of...) နဲ့ စတဲ့ စကားစုတွေပါ။"),
    s(70, 100, "ဥပမာ — The girl with long hair is my sister. (ဆံပင်ရှည်တဲ့ ကောင်မလေး)"),
    s(100, 130, "'with long hair' က 'The girl' ဆိုတဲ့ နာမ်ကို ဘယ်သူလဲ ရှင်းပြပေးတယ်။"),
    s(130, 160, "ဥပမာ — The book on the table is mine. 'on the table' က ဘယ်စာအုပ်လဲ ပြောပြတယ်။"),
    s(160, 190, "Adjective Phrase က သူအထူးပြုတဲ့ နာမ်ရဲ့ နောက်မှာ ချက်ချင်း လိုက်လေ့ရှိတယ်။"),
    s(190, 220, "ဘယ်လိုခွဲမလဲ — 'ဘယ်ဟာလဲ? ဘယ်လိုမျိုးလဲ?' လို့မေးကြည့်ပါ။ အဖြေက Adjective Phrase ပါ။"),
    s(220, 260, "သတိ — Adverb Phrase က ကြိယာကို အထူးပြုတယ်၊ Adjective Phrase က နာမ်ကို အထူးပြုတယ်။"),
    s(260, 360, "အနှစ်ချုပ် — Preposition စကားစုက နာမ်ကို ရှင်းပြရင် Adjective Phrase ပါ။"),
  ],
  I9tEYgpOQiA: [
    s(0, 20, "ဒီနေ့ -ing နဲ့ -ed နဲ့ဆုံးတဲ့ နာမ်ဝိသေသန (adjectives) တွေရဲ့ ကွာခြားချက်ကို လေ့လာမယ်။"),
    s(20, 50, "ဒီနှစ်မျိုးကို ကျောင်းသားအများစု မကြာခဏ မှားသုံးတတ်ကြတယ်။"),
    s(50, 90, "-ed နာမ်ဝိသေသန — လူတစ်ယောက်ရဲ့ ခံစားချက်ကို ပြတယ်။ I am bored. (ကျွန်တော် ပျင်းနေတယ်)"),
    s(90, 130, "-ing နာမ်ဝိသေသန — ခံစားချက်ဖြစ်စေတဲ့ အကြောင်းရင်း (အရာ/လူ) ကို ပြတယ်။ The movie is boring."),
    s(130, 170, "ဥပမာ — I am interested in English. English is interesting."),
    s(170, 210, "ဥပမာ — She was tired after work. The work was tiring."),
    s(210, 250, "မှား — I am boring. (ဒါဆို 'ကျွန်တော်က ပျင်းစရာကောင်းတဲ့ လူ' လို့ ဖြစ်သွားတယ်!)"),
    s(250, 290, "excited / exciting, surprised / surprising, confused / confusing စတာတွေလည်း အတူတူပါပဲ။"),
    s(290, 400, "မှတ်ရန် — -ed = ကိုယ်ခံစားရတာ၊ -ing = ခံစားချက်ဖြစ်စေတဲ့ အရာ။ ကျေးဇူးတင်ပါတယ်။"),
  ],
};
