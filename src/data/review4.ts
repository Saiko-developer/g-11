/**
 * Review 4 — revision exercises covering compound nouns, comparisons, and grammar.
 * Real textbook content (Part A: matching, Part B: fill in blanks, Part C: rewriting).
 */

export type ReviewItem = {
  id: number;
  question: string;
  answer: string;
  translationMy: string;
};

export const REVIEW4_PART_A_INSTRUCTIONS =
  "Match the words in Column A with those in Column B to make compound nouns.";

export const REVIEW4_PART_A_COLUMN_A = [
  "beauty",
  "cause",
  "cultural",
  "recreation",
  "service",
];

export const REVIEW4_PART_A_COLUMN_B = [
  "heritage",
  "root",
  "provider",
  "centres",
  "products",
];

export const REVIEW4_PART_A: ReviewItem[] = [
  {
    id: 1,
    question: "beauty + _____",
    answer: "beauty products",
    translationMy: "အလှအပ + ထုတ်ကုန်များ = အလှအပထုတ်ကုန်များ",
  },
  {
    id: 2,
    question: "cause + _____",
    answer: "root cause",
    translationMy: "အကြောင်းအချက် + အမြစ် = အကြောင်းအချက်အမြစ်",
  },
  {
    id: 3,
    question: "cultural + _____",
    answer: "cultural heritage",
    translationMy: "ယဉ်ကျေးမှု + အမွေအနှစ် = ယဉ်ကျေးမှုအမွေအနှစ်",
  },
  {
    id: 4,
    question: "recreation + _____",
    answer: "recreation centres",
    translationMy: "အပန်းဖြေရာ + ဌာနခွဲများ = အပန်းဖြေရာဌာနခွဲများ",
  },
  {
    id: 5,
    question: "service + _____",
    answer: "service provider",
    translationMy: "ဝန်ဆောင်မှု + ပေးသူ = ဝန်ဆောင်မှုပေးသူ",
  },
];

export const REVIEW4_PART_B_INSTRUCTIONS =
  "Complete each sentence below with the appropriate compound noun from Exercise A.";

export const REVIEW4_PART_B: ReviewItem[] = [
  {
    id: 1,
    question:
      "The __________ of the current energy crisis is that we simply use too much energy.",
    answer: "The root cause of the current energy crisis is that we simply use too much energy.",
    translationMy:
      "လက်ရှိစွမ်းအင်အကျပ်အတည်း၏ အကြောင်းရင်းမှာ ကျွန်ုပ်တို့သည် စွမ်းအင်ကို အလွန်အကျွံသုံးစွဲလိုက်ခြင်း ဖြစ်သည်။",
  },
  {
    id: 2,
    question: "Our __________ are not tested on animals.",
    answer: "Our beauty products are not tested on animals.",
    translationMy:
      "ကျွန်ုပ်တို့၏ အလှအပထုတ်ကုန်များကို တိရိစ္ဆာန်များပေါ်တွင် စမ်းသပ်မှု မပြုလုပ်ပါ။",
  },
  {
    id: 3,
    question:
      "A __________ is an organization or business which offers service to others in exchange for payment.",
    answer:
      "A service provider is an organization or business which offers service to others in exchange for payment.",
    translationMy:
      "ဝန်ဆောင်မှုပေးသူဆိုသည်မှာ ငွေကြေးဖလှယ်ရာတွင် အခြားသူများအား ဝန်ဆောင်မှုကို ပေးသော အဖွဲ့အစည်း သို့မဟုတ် စီးပွားရေးလုပ်ငန်းတစ်ခုဖြစ်သည်။",
  },
  {
    id: 4,
    question:
      "To attract workers, companies build __________, sports fields and art galleries for their staff.",
    answer:
      "To attract workers, companies build recreation centres, sports fields and art galleries for their staff.",
    translationMy:
      "အလုပ်သမားများကို ဆွဲဆောင်ရန်၊ ကုမ္ပဏီများသည် ဝန်ထမ်းများအတွက် အပန်းဖြေရာဌာနခွဲများ၊ အားကစားကွင်းများနှင့် အနုပညပြခန်းများကို တည်ဆောက်ကြသည်။",
  },
  {
    id: 5,
    question:
      "Myanmar is a land with rich __________ such as ancient pagodas.",
    answer:
      "Myanmar is a land with rich cultural heritage such as ancient pagodas.",
    translationMy:
      "မြန်မာနိုင်ငံသည် ရှေးဟောင်းစေတီများကဲ့သို့သော ကြွယ်ဝသည့် ယဉ်ကျေးမှုအမွေအနှစ်များရှိသော မြေပြင်တစ်ခုဖြစ်သည်။",
  },
];

export const REVIEW4_PART_C_INSTRUCTIONS =
  "Rewrite the sentences according to the instructions given in brackets.";

export const REVIEW4_PART_C: ReviewItem[] = [
  {
    id: 1,
    question:
      "Commuting by bus is cheaper than other forms of transport. (Use 'not as ... as'.)",
    answer:
      "Other forms of transport are not as cheap as commuting by bus.",
    translationMy:
      "ဘတ်စ်ကားဖြင့် သွားလာခြင်းသည် အခြားသွားလာရေးနည်းလမ်းများထက် ဈေးသက်သာသည်။ ('not as ... as' ကို အသုံးပြုပါ။)",
  },
  {
    id: 2,
    question:
      "I like listening to the news on the radio. I also like watching it on TV. (Use 'as ... as'.)",
    answer:
      "I like listening to the news on the radio as much as watching it on TV.",
    translationMy:
      "ကျွန်ုပ်သည် ရေဒီယိုတွင် သတင်းနားထောင်ခြင်းကို နှစ်သက်သည်။ ရုပ်မြင်သံကြားတွင်လည်း ကြည့်ရှုခြင်းကို နှစ်သက်သည်။ ('as ... as' ကို အသုံးပြုပါ။)",
  },
  {
    id: 3,
    question:
      "Exercise can help lower blood pressure and protect against heart attacks. (Combine using 'not only ... but also'.)",
    answer:
      "Exercise can not only help lower blood pressure but also protect against heart attacks.",
    translationMy:
      "လေ့ကျင့်ခန်းလုပ်ခြင်းသည် သွေးတိုးကို လျှော့ချရာတွက် ကူညီနိုင်သည်။ နှလုံးရောဂါများမှ ကာကွယ်ပေးနိုင်သည်။ ('not only ... but also' ကို အသုံးပြု၍ ပေါင်းစပ်ပါ။)",
  },
  {
    id: 4,
    question:
      "We meet to share one another's joys and burdens. (Combine using 'not only ... but also'.)",
    answer:
      "We meet not only to share one another's joys but also burdens.",
    translationMy:
      "ကျွန်ုပ်တို့သည် တစ်ဦးကိုတစ်ဦး ပျော်ရွှင်မှုများကို မျှဝေရန် တွေ့ဆုံကြသည်။ ဝန်ထုပ်ဝန်ပိုးများကိုလည်း မျှဝေရန် တွေ့ဆုံကြသည်။ ('not only ... but also' ကို အသုံးပြု၍ ပေါင်းစပ်ပါ။)",
  },
  {
    id: 5,
    question:
      "If we study more, we discover our ignorance more. (Use 'the more / less / -er ..., the more / less / -er ...'.)",
    answer: "The more we study, the more we discover our ignorance.",
    translationMy:
      "ကျွန်ုပ်တို့သည် ပိုမိုလေ့လာလေ၊ ကျွန်ုပ်တို့၏ မသိခြင်းကို ပိုမိုရှာဖွေတွေ့ရှိလေဖြစ်သည်။ ('the more / less / -er ..., the more / less / -er ...' ကို အသုံးပြုပါ။)",
  },
  {
    id: 6,
    question:
      "If the food particles are fine, it is easier to digest. (Use 'the more / less / -er ..., the more / less / -er ...'.)",
    answer:
      "The finer the food particles are, the easier it is to digest.",
    translationMy:
      "အစားအစာအမှုန်များ ပိုမိုကောင်းမွန်လေ၊ အမျိုးအစားချေဖျက်ရန် ပိုမိုလွယ်ကူလေဖြစ်သည်။ ('the more / less / -er ..., the more / less / -er ...' ကို အသုံးပြုပါ။)",
  },
  {
    id: 7,
    question:
      "She's the student __________ handwriting is the best in my class. (Fill in with 'who', 'whom' or 'whose'.)",
    answer: "She's the student whose handwriting is the best in my class.",
    translationMy:
      "သူမသည် ကျွန်ုပ်တန်းထဲတွင် လက်ရေးအကောင်းဆုံးဖြစ်သော ကျောင်းသူမြောက်တစ်ဦးဖြစ်သည်။ ('who', 'whom' သို့မဟုတ် 'whose' ဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 8,
    question:
      "I rang Nilar, __________ was a good friend as well as the family doctor. (Fill in with 'who', 'whom' or 'whose'.)",
    answer:
      "I rang Nilar, who was a good friend as well as the family doctor.",
    translationMy:
      "ကျွန်ုပ်သည် နီလာကို ဖုန်းခေါ်ခဲ့သည်၊ သူမသည် မိသားစုဆရဝန်နှင့်အတူ သူငယ်ချင်းကောင်းတစ်ဦးလည်း ဖြစ်ခဲ့သည်။ ('who', 'whom' သို့မဟုတ် 'whose' ဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 9,
    question:
      "A person without common sense is __________ a house without a foundation. (Fill in with 'as' or 'like'.)",
    answer:
      "A person without common sense is like a house without a foundation.",
    translationMy:
      "သာမန်အသိဉာဏ်မရှိသော လူတစ်ဦးသည် အခြေခံအုတ်မြစ်မရှိသော အိမ်တစ်လုံးနှင့် တူသည်။ ('as' သို့မဟုတ် 'like' ဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 10,
    question:
      "He had worked variously __________ a waiter and shop assistant, but finally became a successful businessman. (Fill in with 'as' or 'like'.)",
    answer:
      "He had worked variously as a waiter and shop assistant, but finally became a successful businessman.",
    translationMy:
      "သူသည် စားသောက်ဆိုင်ဝန်ထမ်းနှင့် ဆိုင်ကူအဖြစ် အမျိုးမျိုးလုပ်ကိုင်ခဲ့သော်လည်း၊ နောက်ဆုံးတွင် အောင်မြင်သော စီးပွားရေးသမားတစ်ဦး ဖြစ်လာခဲ့သည်။ ('as' သို့မဟုတ် 'like' ဖြင့် ဖြည့်ပါ။)",
  },
];