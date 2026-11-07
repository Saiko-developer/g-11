// Grade 11 Unit 1 sentence-structure overrides: chunk-by-chunk Burmese + grammar tag,
// same "train car" format as Grade 10 overrides in sentenceStructure.ts.
import type { TrainCar } from "./sentenceStructure";

type O = { cars: TrainCar[]; introMy: string; noteMy: string };
const c = (word: string, translation: string, tag: string): TrainCar => ({ word, translation, tag });
const B = "_______";

const whQ = "ဒါက Wh-question မေးခွန်းပါ။";
const fill = "ဒါက ကွက်လပ်ဖြည့်ရမယ့် ပြောကြားချက် ဝါကျပါ။";

export const G11_UNIT1_OVERRIDES: Record<string, O> = {
  /* ---------- 1A Reading ---------- */
  "how will you feel if you see a dolphin": {
    cars: [c("How", "မည်သို့", "WH-Question Word"), c("will", "မည်နည်း (အနာဂတ်)", "Helping Verb"), c("you", "သင်", "Noun Subject"), c("feel", "ခံစားရ", "Main Verb"), c("if you see a dolphin", "လင်းပိုင်တစ်ကောင်ကို မြင်လျှင်", "Adverb Clause")],
    introMy: whQ + " \"if\" နဲ့စတဲ့ အပိုင်းက အခြေအနေပြ clause ပါ။",
    noteMy: "ပုံစံ: How → will → ကတ္တား → ကြိယာ → if-clause ။",
  },
  "where are ayeyarwady dolphins usually found": {
    cars: [c("Where", "မည်သည့်နေရာတွင်", "WH-Question Word"), c("are", "(passive အကူ)", "Helping Verb"), c("Ayeyarwady dolphins", "ဧရာဝတီလင်းပိုင်များကို", "Noun Subject"), c("usually", "ပုံမှန်အားဖြင့်", "Adverb"), c("found", "တွေ့ရှိရသနည်း", "Main Verb")],
    introMy: whQ + " \"are … found\" သည် passive voice (တွေ့ရှိခံရ) ပုံစံပါ။",
    noteMy: "ပုံစံ: Where → are → ကတ္တား → usually → found (V3) ။",
  },
  "why are they called ayeyarwady dolphins": {
    cars: [c("Why", "အဘယ်ကြောင့်", "WH-Question Word"), c("are", "(passive အကူ)", "Helping Verb"), c("they", "၎င်းတို့ကို", "Noun Subject"), c("called", "ခေါ်ဆိုရသနည်း", "Main Verb"), c("Ayeyarwady dolphins", "ဧရာဝတီလင်းပိုင်ဟု", "Complement")],
    introMy: whQ + " \"are called\" = …ဟု ခေါ်ခံရသည် (passive)။",
    noteMy: "ပုံစံ: Why → are → ကတ္တား → called → အမည် (Complement) ။",
  },
  "what is the difference between ayeyarwady dolphins and other dolphins": {
    cars: [c("What", "ဘာ", "WH-Question Word"), c("is", "ဖြစ်သနည်း", "Linking Verb"), c("the difference", "ကွာခြားချက်", "Noun Subject"), c("between Ayeyarwady dolphins and other dolphins", "ဧရာဝတီလင်းပိုင်များနှင့် အခြားလင်းပိုင်များ အကြား", "Prepositional Phrase")],
    introMy: whQ + " \"between A and B\" = A နှင့် B အကြား။",
    noteMy: "ပုံစံ: What → is → ကတ္တား → between … and … ။",
  },
  "how do they eat their food": {
    cars: [c("How", "မည်သို့", "WH-Question Word"), c("do", "(အကူကြိယာ)", "Helping Verb"), c("they", "၎င်းတို့သည်", "Noun Subject"), c("eat", "စားသုံးကြသနည်း", "Main Verb"), c("their food", "၎င်းတို့၏ အစာကို", "Noun Object")],
    introMy: whQ,
    noteMy: "ပုံစံ: How → do → ကတ္တား → ကြိယာ → ကံ ။",
  },
  "where can you find them in myanmar": {
    cars: [c("Where", "မည်သည့်နေရာတွင်", "WH-Question Word"), c("can", "နိုင်", "Helping Verb"), c("you", "သင်", "Noun Subject"), c("find", "တွေ့နိုင်သနည်း", "Main Verb"), c("them", "၎င်းတို့ကို", "Noun Object"), c("in Myanmar", "မြန်မာနိုင်ငံတွင်", "Prepositional Phrase")],
    introMy: whQ,
    noteMy: "ပုံစံ: Where → can → ကတ္တား → ကြိယာ → ကံ → နေရာပြ ။",
  },
  "how do they communicate with one another": {
    cars: [c("How", "မည်သို့", "WH-Question Word"), c("do", "(အကူကြိယာ)", "Helping Verb"), c("they", "၎င်းတို့သည်", "Noun Subject"), c("communicate", "ဆက်သွယ်ကြသနည်း", "Main Verb"), c("with one another", "အချင်းချင်း", "Prepositional Phrase")],
    introMy: whQ,
    noteMy: "ပုံစံ: How → do → ကတ္တား → ကြိယာ → with one another ။",
  },
  "how did the local fishermen get the attention of the dolphins": {
    cars: [c("How", "မည်သို့", "WH-Question Word"), c("did", "(အတိတ် အကူ)", "Helping Verb"), c("the local fishermen", "ဒေသခံ တံငါသည်များသည်", "Noun Subject"), c("get", "ရယူခဲ့ကြသနည်း", "Main Verb"), c("the attention", "အာရုံစိုက်မှုကို", "Noun Object"), c("of the dolphins", "လင်းပိုင်များ၏", "Prepositional Phrase")],
    introMy: whQ + " \"did\" ကြောင့် အတိတ်ကာလ ဖြစ်ပါတယ်။",
    noteMy: "ပုံစံ: How → did → ကတ္တား → ကြိယာ (V1) → ကံ ။",
  },
  "why does the dolphin population decline year by year": {
    cars: [c("Why", "အဘယ်ကြောင့်", "WH-Question Word"), c("does", "(အကူကြိယာ)", "Helping Verb"), c("the dolphin population", "လင်းပိုင် အကောင်ရေသည်", "Noun Subject"), c("decline", "လျော့နည်းလာသနည်း", "Main Verb"), c("year by year", "တစ်နှစ်ထက်တစ်နှစ်", "Adverb")],
    introMy: whQ,
    noteMy: "ပုံစံ: Why → does → ကတ္တား → ကြိယာ → အချိန်ပြ ။",
  },
  "which part of the ayeyarwady river is kept as a sanctuary to protect the dolphins": {
    cars: [c("Which part", "မည်သည့်အပိုင်းကို", "WH-Question Word"), c("of the Ayeyarwady River", "ဧရာဝတီမြစ်၏", "Prepositional Phrase"), c("is kept", "ထားရှိသနည်း (passive)", "Main Verb"), c("as a sanctuary", "ဘေးမဲ့တောအဖြစ်", "Complement"), c("to protect the dolphins", "လင်းပိုင်များကို ကာကွယ်ရန်", "Infinitive Phrase")],
    introMy: whQ + " \"Which part\" ကိုယ်တိုင်က ကတ္တားဖြစ်ပြီး \"is kept\" က passive ပါ။",
    noteMy: "ပုံစံ: Which part (ကတ္တား) → is kept → as … → to + V1 (ရည်ရွယ်ချက်) ။",
  },
  "what can you do to protect the decline of ayeyarwady dolphin population": {
    cars: [c("What", "ဘာ", "WH-Question Word"), c("can", "နိုင်", "Helping Verb"), c("you", "သင်", "Noun Subject"), c("do", "လုပ်နိုင်သနည်း", "Main Verb"), c("to protect the decline", "လျော့နည်းမှုကို ကာကွယ်ရန်", "Infinitive Phrase"), c("of Ayeyarwady dolphin population", "ဧရာဝတီလင်းပိုင် အကောင်ရေ၏", "Prepositional Phrase")],
    introMy: whQ,
    noteMy: "ပုံစံ: What → can → ကတ္တား → do → to + V1 (ရည်ရွယ်ချက်) ။",
  },

  /* ---------- 1B Vocabulary ---------- */
  "my brother has been _ in voluntary work for over two years": {
    cars: [c("My brother", "ကျွန်ုပ်၏ အစ်ကိုသည်", "Noun Subject"), c("has been", "ဖြစ်နေခဲ့သည်", "Linking Verb"), c(B, B, "Complement"), c("in voluntary work", "စေတနာ့ဝန်ထမ်း လုပ်ငန်းတွင်", "Prepositional Phrase"), c("for over two years", "နှစ်နှစ်ကျော်ကြာ", "Prepositional Phrase")],
    introMy: fill + " \"has been\" = present perfect be-ကြိယာ။",
    noteMy: "ပုံစံ: ကတ္တား → has been → Adverb+Adjective → နေရာ → အချိန် ။",
  },
  "it is _ for you to have a balanced diet if you want to be healthy": {
    cars: [c("It", "(ကတ္တားအတု)", "Noun Subject"), c("is", "ဖြစ်သည်", "Linking Verb"), c(B, B, "Complement"), c("for you to have a balanced diet", "သင် မျှတသော အစားအစာ စားသုံးရန်", "Infinitive Phrase"), c("if you want to be healthy", "ကျန်းမာလိုလျှင်", "Adverb Clause")],
    introMy: fill + " \"It is … for you to …\" ပုံစံပါ။",
    noteMy: "ပုံစံ: It → is → Adj → for + someone + to V1 → if-clause ။",
  },
  "they had been _ for 5 years, but their marriage ended in divorce": {
    cars: [c("They", "သူတို့သည်", "Noun Subject"), c("had been", "ဖြစ်ခဲ့ကြသည်", "Linking Verb"), c(B, B, "Complement"), c("for 5 years", "ငါးနှစ်ကြာ", "Prepositional Phrase"), c("but", "သို့သော်", "Conjunction"), c("their marriage ended in divorce", "သူတို့၏ အိမ်ထောင်ရေးသည် ကွာရှင်းခြင်းဖြင့် အဆုံးသတ်ခဲ့သည်", "Sentence")],
    introMy: fill + " \"but\" နဲ့ ဝါကျနှစ်ခု ဆက်ထားပါတယ်။",
    noteMy: "ပုံစံ: ကတ္တား → had been → Complement → but → ဝါကျ ။",
  },
  "fortunately, no one was _ in the car accident": {
    cars: [c("Fortunately", "ကံကောင်းစွာဖြင့်", "Adverb"), c("no one", "မည်သူမျှ", "Noun Subject"), c("was", "(passive အကူ)", "Linking Verb"), c(B, B, "Complement"), c("in the car accident", "ကားမတော်တဆမှုတွင်", "Prepositional Phrase")],
    introMy: fill,
    noteMy: "ပုံစံ: Adverb → ကတ္တား → was → Complement → နေရာပြ ။",
  },
  "students must be trained to be _ of their responsibilities as good citizens": {
    cars: [c("Students", "ကျောင်းသားများကို", "Noun Subject"), c("must be trained", "လေ့ကျင့်ပေးရမည်", "Main Verb"), c("to be", "ဖြစ်စေရန်", "Linking Verb"), c(B, B, "Complement"), c("of their responsibilities", "၎င်းတို့၏ တာဝန်များကို", "Prepositional Phrase"), c("as good citizens", "နိုင်ငံသားကောင်းများအဖြစ်", "Prepositional Phrase")],
    introMy: fill + " \"must be trained\" = passive modal။",
    noteMy: "ပုံစံ: ကတ္တား → must be V3 → to be + Adj → of … ။",
  },
  "it is very challenging to take care of people who are _": {
    cars: [c("It", "(ကတ္တားအတု)", "Noun Subject"), c("is", "ဖြစ်သည်", "Linking Verb"), c("very challenging", "အလွန်ခက်ခဲသော", "Complement"), c("to take care of people", "လူများကို စောင့်ရှောက်ရန်", "Infinitive Phrase"), c("who are " + B, B + " ဖြစ်နေသော", "Relative Clause")],
    introMy: fill + " \"who are …\" က \"people\" ကို ဖော်ပြတဲ့ relative clause ပါ။",
    noteMy: "ပုံစံ: It → is → Adj → to V1 → who-clause ။",
  },
  "when i look around the surrounding area, it is now _ from it was five years ago": {
    cars: [c("When I look around the surrounding area", "ပတ်ဝန်းကျင်ကို ကြည့်လိုက်သောအခါ", "Adverb Clause"), c("it", "၎င်း (ပတ်ဝန်းကျင်) သည်", "Noun Subject"), c("is now", "ယခု ဖြစ်နေသည်", "Linking Verb"), c(B, B, "Complement"), c("from it was five years ago", "လွန်ခဲ့သော ငါးနှစ်က အခြေအနေနှင့်", "Prepositional Phrase")],
    introMy: fill + " \"different from\" ပုံစံကို သတိပြုပါ။",
    noteMy: "ပုံစံ: When-clause → ကတ္တား → is → Complement → from … ။",
  },
  "the townspeople are _ about the threat of health problems caused by polluted water in the river": {
    cars: [c("The townspeople", "မြို့သူမြို့သားများသည်", "Noun Subject"), c("are", "ဖြစ်ကြသည်", "Linking Verb"), c(B, B, "Complement"), c("about the threat of health problems", "ကျန်းမာရေးပြဿနာများ၏ ခြိမ်းခြောက်မှုအပေါ်", "Prepositional Phrase"), c("caused by polluted water in the river", "မြစ်ထဲရှိ ညစ်ညမ်းသောရေကြောင့် ဖြစ်ပေါ်လာသော", "Participle Phrase")],
    introMy: fill,
    noteMy: "ပုံစံ: ကတ္တား → are → Adj → about … → caused by … ။",
  },
  "when he said he was leaving school, we thought he was joking, but he said he was _": {
    cars: [c("When he said he was leaving school", "သူ ကျောင်းထွက်တော့မည်ဟု ပြောသောအခါ", "Adverb Clause"), c("we thought he was joking", "ကျွန်ုပ်တို့က သူ နောက်နေသည်ဟု ထင်ခဲ့သည်", "Sentence"), c("but", "သို့သော်", "Conjunction"), c("he said", "သူက ပြောခဲ့သည်", "Main Verb"), c("he was " + B, "သူ " + B + " ဖြစ်သည်ဟု", "Noun Clause")],
    introMy: fill + " ဝါကျအများ ပေါင်းထားတဲ့ ရှုပ်ထွေးဝါကျ ဖြစ်ပါတယ်။",
    noteMy: "ပုံစံ: When-clause → ဝါကျ → but → he said → (that) he was … ။",
  },
  "this book was so _ by critics that it became one of the bestsellers of the year": {
    cars: [c("This book", "ဤစာအုပ်သည်", "Noun Subject"), c("was so " + B, "အလွန် " + B + " ခံရသည်", "Main Verb"), c("by critics", "ဝေဖန်ရေးဆရာများ၏", "Prepositional Phrase"), c("that it became one of the bestsellers of the year", "ထို့ကြောင့် ယခုနှစ်၏ အရောင်းရဆုံးစာအုပ်များထဲမှ တစ်အုပ် ဖြစ်လာခဲ့သည်", "Adverb Clause")],
    introMy: fill + " \"so … that\" = အလွန် … သောကြောင့်။",
    noteMy: "ပုံစံ: ကတ္တား → was so V3 → by … → that-clause (ရလဒ်) ။",
  },

  /* ---------- 1C Grammar ---------- */
  "his watch remains in good condition -------- having been used for five years": {
    cars: [c("His watch", "သူ၏ နာရီသည်", "Noun Subject"), c("remains", "ရှိနေဆဲဖြစ်သည်", "Linking Verb"), c("in good condition", "ကောင်းမွန်သော အခြေအနေတွင်", "Complement"), c("--------", B, "Preposition"), c("having been used for five years", "ငါးနှစ်ကြာ အသုံးပြုခံခဲ့ရသည့်", "Participle Phrase")],
    introMy: fill + " ကွက်လပ်တွင် before / after ထည့်ရပါမည်။",
    noteMy: "ပုံစံ: ကတ္တား → remains → Complement → before/after + V-ing ။",
  },
  "i am looking forward to the trip as i have never been to japan _": {
    cars: [c("I", "ကျွန်ုပ်သည်", "Noun Subject"), c("am looking forward to", "မျှော်လင့်စောင့်စားနေသည်", "Main Verb"), c("the trip", "ခရီးစဉ်ကို", "Noun Object"), c("as", "အကြောင်းမှာ", "Conjunction"), c("I have never been to Japan", "ကျွန်ုပ် ဂျပန်နိုင်ငံသို့ တစ်ခါမျှ မရောက်ဖူးသောကြောင့်", "Sentence"), c(B, B, "Adverb")],
    introMy: fill + " ကွက်လပ်က adverb (before) နေရာပါ။",
    noteMy: "ပုံစံ: ကတ္တား → ကြိယာ → ကံ → as + ဝါကျ → Adverb ။",
  },
  "_ arriving at the hotel, u min aung went straight to the meeting room": {
    cars: [c(B, B, "Preposition"), c("arriving at the hotel", "ဟိုတယ်သို့ ရောက်ရှိခြင်း", "Participle Phrase"), c("U Min Aung", "ဦးမင်းအောင်သည်", "Noun Subject"), c("went straight", "တိုက်ရိုက် သွားခဲ့သည်", "Main Verb"), c("to the meeting room", "အစည်းအဝေးခန်းသို့", "Prepositional Phrase")],
    introMy: fill + " ကွက်လပ် + V-ing ပုံစံ (before/after + V-ing)။",
    noteMy: "ပုံစံ: before/after + V-ing → ကတ္တား → ကြိယာ → နေရာ ။",
  },
  "_ i gave him the shopping list, he had left for the market": {
    cars: [c(B, B, "Conjunction"), c("I gave him the shopping list", "ကျွန်ုပ်က သူ့ကို ဈေးဝယ်စာရင်း ပေးခြင်း", "Sentence"), c("he", "သူသည်", "Noun Subject"), c("had left", "ထွက်သွားနှင့်ပြီး ဖြစ်သည်", "Main Verb"), c("for the market", "ဈေးသို့", "Prepositional Phrase")],
    introMy: fill + " \"had left\" (past perfect) က အရင်ဖြစ်ခဲ့တဲ့ အရာကို ပြပါတယ်။",
    noteMy: "ပုံစံ: before/after + ဝါကျ → ကတ္တား → had + V3 ။",
  },

  /* ---------- 1D Listening ---------- */
  "animals, birds and plants that are found in their _": {
    cars: [c("animals, birds and plants", "တိရစ္ဆာန်များ၊ ငှက်များနှင့် အပင်များ", "Noun Subject"), c("that are found", "တွေ့ရှိရသော", "Relative Clause"), c("in their " + B, "၎င်းတို့၏ " + B + " တွင်", "Prepositional Phrase")],
    introMy: "ဒါက ကွက်လပ်ဖြည့်ရမယ့် နာမ်စကားစု (noun phrase) ပါ။",
    noteMy: "ပုံစံ: နာမ်များ → that-clause → in + ကွက်လပ် ။",
  },
  "the practice of protecting _ and animal species and their habitats": {
    cars: [c("the practice", "အလေ့အကျင့် / လုပ်ငန်း", "Noun Subject"), c("of protecting", "ကာကွယ်ခြင်း၏", "Prepositional Phrase"), c(B + " and animal species", B + " နှင့် တိရစ္ဆာန်မျိုးစိတ်များ", "Noun Object"), c("and their habitats", "နှင့် ၎င်းတို့၏ နေထိုင်ရာဒေသများ", "Noun Object")],
    introMy: "ဒါက ကွက်လပ်ဖြည့်ရမယ့် နာမ်စကားစု ပါ။",
    noteMy: "ပုံစံ: the practice → of + V-ing → ကံများ ။",
  },
  "to _ and collect information about wildlife": {
    cars: [c("to " + B, B + " ရန်", "Infinitive Phrase"), c("and collect", "နှင့် စုဆောင်းရန်", "Main Verb"), c("information", "သတင်းအချက်အလက်များကို", "Noun Object"), c("about wildlife", "တောရိုင်းသက်ရှိများအကြောင်း", "Prepositional Phrase")],
    introMy: "ဒါက to + V1 ပုံစံ ရည်ရွယ်ချက်ပြ စကားစုပါ။",
    noteMy: "ပုံစံ: to + V1 → and + V1 → ကံ ။",
  },
  "to _ of endangered animals and birds": {
    cars: [c("to " + B, B + " ရန်", "Infinitive Phrase"), c("of endangered animals and birds", "မျိုးသုဉ်းရန် အန္တရာယ်ရှိသော တိရစ္ဆာန်များနှင့် ငှက်များ၏", "Prepositional Phrase")],
    introMy: "ဒါက to + V1 ပုံစံ ရည်ရွယ်ချက်ပြ စကားစုပါ။",
    noteMy: "ပုံစံ: to + V1 (+ ကံ) → of … ။",
  },
  "to _ about the importance of wildlife": {
    cars: [c("to " + B, B + " ရန်", "Infinitive Phrase"), c("about the importance", "အရေးပါမှုအကြောင်း", "Prepositional Phrase"), c("of wildlife", "တောရိုင်းသက်ရှိများ၏", "Prepositional Phrase")],
    introMy: "ဒါက to + V1 ပုံစံ ရည်ရွယ်ချက်ပြ စကားစုပါ။",
    noteMy: "ပုံစံ: to + V1 → about … ။",
  },
  "to prohibit _ forest trees and to grow more trees for the animals": {
    cars: [c("to prohibit", "တားမြစ်ရန်", "Infinitive Phrase"), c(B + " forest trees", "သစ်တောသစ်ပင်များ " + B + " ကို", "Noun Object"), c("and to grow more trees", "နှင့် သစ်ပင်များ ပိုမိုစိုက်ပျိုးရန်", "Infinitive Phrase"), c("for the animals", "တိရစ္ဆာန်များအတွက်", "Prepositional Phrase")],
    introMy: "to + V1 စကားစု နှစ်ခုကို \"and\" နဲ့ ဆက်ထားပါတယ်။",
    noteMy: "ပုံစံ: to prohibit + V-ing → and to grow … ။",
  },
  "_ protected areas like national parks and wildlife sanctuaries": {
    cars: [c(B, B, "Main Verb"), c("protected areas", "ကာကွယ်ထားသော နယ်မြေများ", "Noun Object"), c("like national parks and wildlife sanctuaries", "အမျိုးသားဥယျာဉ်များနှင့် တောရိုင်းတိရစ္ဆာန်ဘေးမဲ့တောများကဲ့သို့", "Prepositional Phrase")],
    introMy: "ကွက်လပ်က ကြိယာ (Verb) နေရာဖြစ်ပါတယ်။",
    noteMy: "ပုံစံ: ကြိယာ → ကံ → like … (ဥပမာ) ။",
  },
};
