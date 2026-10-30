// Timed bilingual subtitles for the Unit 1 Khan Academy appositives video (QFcaUTd8DgY).
// Times are in seconds, taken from the video's own English captions.
export type SubtitleLine = { start: number; end: number; en: string; my: string };

export const UNIT1_VIDEO_SUBTITLES: SubtitleLine[] = [
  { start: 0, end: 4.1, en: "Hello grammarians! Hello Paige. Hi David.", my: "မင်္ဂလာပါ သဒ္ဒါလေ့လာသူများ! ဟယ်လို Paige၊ ဟိုင်း David။" },
  { start: 4.1, end: 9.9, en: "Today we are talking about the appositive — a very big word!", my: "ဒီနေ့ appositive (ထပ်ဆင့်ရှင်းပြနာမ်) အကြောင်း ပြောမယ် — စကားလုံးက တော်တော်ရှည်တယ်နော်!" },
  { start: 9.9, end: 23.4, en: "It comes from Latin 'ad positio' — 'putting next to'.", my: "ဒီစကားလုံးက လက်တင်ဘာသာ 'ad positio' ကလာတယ် — 'ဘေးမှာ ကပ်ထားခြင်း' လို့ အဓိပ္ပာယ်ရတယ်။" },
  { start: 23.4, end: 33.1, en: "What is it? How do we use it? What does it have to do with commas?", my: "ဒါဘာလဲ? ဘယ်လိုသုံးလဲ? ကော်မာ (,) နဲ့ ဘာဆိုင်လဲ?" },
  { start: 33.1, end: 41.0, en: "The definition is confusing, but examples will make it clear.", my: "အဓိပ္ပာယ်ဖွင့်ချက်က နည်းနည်းရှုပ်တယ်၊ ဒါပေမဲ့ ဥပမာတွေကြည့်ရင် ရှင်းသွားမယ်။" },
  { start: 41.0, end: 45.4, en: "Example: My older sister, Griselda, is going to college in the fall.", my: "ဥပမာ — ကျွန်တော့်အစ်မ Griselda က ဆောင်းဦးမှာ ကောလိပ်တက်တော့မယ်။" },
  { start: 45.4, end: 59.3, en: "An appositive is a noun phrase that explains the noun before it.", my: "Appositive ဆိုတာ သူ့ရှေ့က နာမ်ကို ရှင်းပြပေးတဲ့ နာမ်စုလေး ဖြစ်တယ်။" },
  { start: 59.3, end: 67.5, en: "'Antecedent' just means the word that comes before.", my: "'Antecedent' ဆိုတာ ရှေ့မှာ ရှိနေတဲ့ စကားလုံး လို့ပဲ အဓိပ္ပာယ်ရတယ်။" },
  { start: 67.5, end: 74.6, en: "'Griselda' tells us who my older sister is. We put it between commas.", my: "'Griselda' က ကျွန်တော့်အစ်မ ဘယ်သူလဲ ပြောပြတယ်။ ဒါကို ကော်မာနှစ်ခုကြားမှာ ထည့်တယ်။" },
  { start: 74.6, end: 84.6, en: "It does not always go in the middle of the sentence.", my: "ဒါပေမဲ့ ဝါကျရဲ့ အလယ်မှာပဲ အမြဲထားရတာ မဟုတ်ဘူး။" },
  { start: 84.6, end: 97.6, en: "It can go at the end: They stopped selling my favorite snack, the Cookie Cat.", my: "ဝါကျအဆုံးမှာလည်း ထားလို့ရတယ် — သူတို့ ကျွန်တော်အကြိုက်ဆုံး မုန့် Cookie Cat ကို မရောင်းတော့ဘူး။" },
  { start: 97.6, end: 112.9, en: "'The Cookie Cat' explains 'my favorite snack'.", my: "'The Cookie Cat' က 'ကျွန်တော်အကြိုက်ဆုံး မုန့်' ကို ရှင်းပြပေးတယ်။" },
  { start: 112.9, end: 125.1, en: "Without it, the sentence is still complete. It is extra information.", my: "Appositive မပါလည်း ဝါကျက ပြည့်စုံနေတယ်။ ဒါက ထပ်ဆောင်း အချက်အလက်ပဲ။" },
  { start: 125.1, end: 134.1, en: "But it helps the reader know exactly what I mean.", my: "ဒါပေမဲ့ စာဖတ်သူကို ကျွန်တော် ဘာကိုဆိုလိုလဲ အတိအကျ သိစေတယ်။" },
  { start: 134.1, end: 140.1, en: "Middle: My older sister, Griselda, is going to college.", my: "အလယ်မှာ — My older sister , Griselda , is going to college. (ကော်မာ ၂ ခု)" },
  { start: 140.1, end: 149.0, en: "End: ...my favorite snack, the Cookie Cat. — no second comma, just a full stop.", my: "အဆုံးမှာ — ...my favorite snack , the Cookie Cat. (ကော်မာ ၁ ခု + full stop)" },
  { start: 149.0, end: 163.6, en: "The comma separates the extra explaining part from the sentence.", my: "ကော်မာက ရှင်းပြတဲ့ ထပ်ဆောင်းအပိုင်းကို ဝါကျကနေ ခွဲထုတ်ပေးတယ်။" },
  { start: 163.6, end: 171.6, en: "Commas can do almost anything!", my: "ကော်မာတွေက အရာအားလုံးနီးပါး လုပ်နိုင်တယ်!" },
  { start: 171.6, end: 182, en: "You can learn anything! That's the appositive and commas.", my: "သင်လည်း ဘာမဆို သင်ယူနိုင်တယ်! ဒါက appositive နဲ့ ကော်မာ အကြောင်းပါ။" },
];
