/**
 * Review 1 — revision exercises covering Units 1, 2 and 3.
 * Real textbook content (Part A: functions of utterances, Part B: word forms,
 * Part C: grammar rewriting).
 */

export type ReviewItem = {
  id: number;
  question: string;
  answer: string;
  translationMy: string;
};

export const REVIEW1_PART_A_INSTRUCTIONS =
  "Write the function of each utterance within the brackets.";

export const REVIEW1_PART_A: ReviewItem[] = [
  {
    id: 1,
    question: "I'm sorry I dropped your camera and broke it. ( __________ )",
    answer: "Apologizing",
    translationMy:
      "\u201cမင်းရဲ့ ကင်မရာကို ကျွန်တော် ချမိပြီး ကျိုးသွားလို့ တောင်းပန်ပါတယ်။\u201d (ဤစကားသည် တောင်းပန်ခြင်း — apologizing ဖြစ်သည်။)",
  },
  {
    id: 2,
    question: "I'd like some yogurt, please. ( __________ )",
    answer: "Ordering (making a request)",
    translationMy:
      "\u201cဒိန်ချဉ် အနည်းငယ် လိုချင်ပါတယ်။\u201d (ဤစကားသည် မှာယူခြင်း/တောင်းဆိုခြင်း — ordering ဖြစ်သည်။)",
  },
  {
    id: 3,
    question: "Walk two blocks to the traffic light and turn right. ( __________ )",
    answer: "Giving directions",
    translationMy:
      "\u201cမီးပွိုင့်အထိ လမ်းနှစ်တန်း လျှောက်ပြီး ညာဘက်ကွေ့ပါ။\u201d (ဤစကားသည် လမ်းညွှန်ခြင်း — giving directions ဖြစ်သည်။)",
  },
  {
    id: 4,
    question: "Take two teaspoons of this medicine twice a day. ( __________ )",
    answer: "Giving instructions",
    translationMy:
      "\u201cဤဆေးကို တစ်နေ့နှစ်ကြိမ် လက်ဖက်ရည်ဇွန်း နှစ်ဇွန်းစီ သောက်ပါ။\u201d (ဤစကားသည် ညွှန်ကြားခြင်း — giving instructions ဖြစ်သည်။)",
  },
  {
    id: 5,
    question: "This is the best restaurant I have been to. ( __________ )",
    answer: "Expressing an opinion",
    translationMy:
      "\u201cဒါက ကျွန်တော်ရောက်ဖူးသမျှ အကောင်းဆုံး စားသောက်ဆိုင်ပါပဲ။\u201d (ဤစကားသည် ထင်မြင်ချက်ဖော်ပြခြင်း — expressing an opinion ဖြစ်သည်။)",
  },
];

export const REVIEW1_PART_B_INSTRUCTIONS =
  "Complete the sentences with the correct forms of the words in brackets.";

export const REVIEW1_PART_B: ReviewItem[] = [
  {
    id: 1,
    question: "Listening and reading are known as __________ (receive) skills.",
    answer: "Listening and reading are known as receptive skills.",
    translationMy:
      "နားထောင်ခြင်းနှင့် ဖတ်ရှုခြင်းကို __________ (receive) ကျွမ်းကျင်မှုများဟု ခေါ်သည်။",
  },
  {
    id: 2,
    question:
      "Ko Tu is learning __________ (Spain) as he is going to Spain on a study visit next month.",
    answer:
      "Ko Tu is learning Spanish as he is going to Spain on a study visit next month.",
    translationMy:
      "ကိုတူသည် လာမည့်လတွင် စပိန်နိုင်ငံသို့ ပညာရေးခရီးသွားမည်ဖြစ်၍ __________ (Spain) စာကို လေ့လာနေသည်။",
  },
  {
    id: 3,
    question:
      "Most __________ (India) foods are spicy and hot, but I like them all.",
    answer: "Most Indian foods are spicy and hot, but I like them all.",
    translationMy:
      "__________ (India) အစားအစာအများစုသည် အစပ်များပြီး ပူသော်လည်း ကျွန်ုပ် အားလုံးကို ကြိုက်သည်။",
  },
  {
    id: 4,
    question: "A __________ (novel) is a person who writes novels.",
    answer: "A novelist is a person who writes novels.",
    translationMy: "__________ (novel) ဆိုသည်မှာ ဝတ္ထုများ ရေးသားသူ ဖြစ်သည်။",
  },
  {
    id: 5,
    question: "A tragedy is a play that has a very sad __________ (end).",
    answer: "A tragedy is a play that has a very sad ending.",
    translationMy:
      "ဝမ်းနည်းဖွယ်ပြဇာတ် (tragedy) ဆိုသည်မှာ အလွန်ဝမ်းနည်းဖွယ် __________ (end) ရှိသော ပြဇာတ်ဖြစ်သည်။",
  },
  {
    id: 6,
    question:
      "As Myanmar has its own __________ (literature), it is a literate nation.",
    answer: "As Myanmar has its own literature, it is a literate nation.",
    translationMy:
      "မြန်မာနိုင်ငံတွင် မိမိကိုယ်ပိုင် __________ (literature) ရှိသောကြောင့် စာပေတတ်မြောက်သော နိုင်ငံဖြစ်သည်။",
  },
  {
    id: 7,
    question: "The internet is one of the most useful __________ (invent).",
    answer: "The internet is one of the most useful inventions.",
    translationMy:
      "အင်တာနက်သည် အသုံးဝင်ဆုံး __________ (invent) များထဲမှ တစ်ခုဖြစ်သည်။",
  },
  {
    id: 8,
    question:
      "Our teacher always uses a lot of __________ (illustrate) in teaching us biology.",
    answer:
      "Our teacher always uses a lot of illustrations in teaching us biology.",
    translationMy:
      "ကျွန်ုပ်တို့၏ ဆရာသည် ဇီဝဗေဒ သင်ကြားရာတွင် __________ (illustrate) များစွာကို အမြဲအသုံးပြုသည်။",
  },
  {
    id: 9,
    question:
      "A person who lacks __________ (imagine) cannot be a good writer.",
    answer: "A person who lacks imagination cannot be a good writer.",
    translationMy:
      "__________ (imagine) ချို့တဲ့သူသည် စာရေးဆရာကောင်း မဖြစ်နိုင်ပါ။",
  },
  {
    id: 10,
    question:
      "When I was young, I dreamt of becoming a __________ (mathematics), but my dream did not come true.",
    answer:
      "When I was young, I dreamt of becoming a mathematician, but my dream did not come true.",
    translationMy:
      "ငယ်စဉ်က ကျွန်ုပ်သည် __________ (mathematics) ဖြစ်လိုကြောင်း အိပ်မက်ခဲ့သော်လည်း ကျွန်ုပ်၏အိပ်မက် မပြည့်ခဲ့ပါ။",
  },
];

export const REVIEW1_PART_C_INSTRUCTIONS =
  "Rewrite the sentences according to the instructions given in brackets.";

export const REVIEW1_PART_C: ReviewItem[] = [
  {
    id: 1,
    question:
      "Typhoon Hagibis was a large and powerful tropical cyclone. It caused widespread flooding. (Join, using nouns in apposition.)",
    answer:
      "Typhoon Hagibis, a large and powerful tropical cyclone, caused widespread flooding.",
    translationMy:
      "ဟာဂီးဘစ် တိုင်ဖွန်းသည် ကြီးမားပြီး အင်အားပြင်းသော အပူပိုင်းဆိုင်ကလုန်းမုန်တိုင်း ဖြစ်သည်။ ၎င်းကြောင့် ကျယ်ပြန့်သော ရေကြီးမှု ဖြစ်ပွားခဲ့သည်။ (nouns in apposition သုံး၍ ပေါင်းစပ်ရေးပါ။)",
  },
  {
    id: 2,
    question:
      "London is the capital of the UK. It is in the southeast of England on the River Thames. (Join, using nouns in apposition.)",
    answer:
      "London, the capital of the UK, is in the southeast of England on the River Thames.",
    translationMy:
      "လန်ဒန်သည် ယူကေနိုင်ငံ၏ မြို့တော်ဖြစ်သည်။ ၎င်းသည် အင်္ဂလန်၏ အရှေ့တောင်ပိုင်း သိမ်းမြစ်ပေါ်တွင် တည်ရှိသည်။ (nouns in apposition သုံး၍ ပေါင်းစပ်ရေးပါ။)",
  },
  {
    id: 3,
    question:
      "You can read the novel online. You can also read it in the form of a book. (Join, using 'either ... or'.)",
    answer:
      "You can read the novel either online or in the form of a book.",
    translationMy:
      "ဝတ္ထုကို အွန်လိုင်းတွင် ဖတ်နိုင်သည်။ စာအုပ်ပုံစံဖြင့်လည်း ဖတ်နိုင်သည်။ ('either ... or' သုံး၍ ပေါင်းစပ်ရေးပါ။)",
  },
  {
    id: 4,
    question:
      "My friends do not eat beef. I do not eat beef. (Join, using 'neither ... nor'.)",
    answer: "Neither my friends nor I eat beef.",
    translationMy:
      "ကျွန်ုပ်၏သူငယ်ချင်းများသည် အမဲသား မစားကြပါ။ ကျွန်ုပ်လည်း အမဲသား မစားပါ။ ('neither ... nor' သုံး၍ ပေါင်းစပ်ရေးပါ။)",
  },
  {
    id: 5,
    question:
      "Ko Toe can be selected as the representative of our class. Nilar can be selected as the representative of our class. (Join, using 'either ... or'.)",
    answer:
      "Either Ko Toe or Nilar can be selected as the representative of our class.",
    translationMy:
      "ကိုတိုးကို ကျွန်ုပ်တို့အတန်း၏ ကိုယ်စားလှယ်အဖြစ် ရွေးချယ်နိုင်သည်။ နီလာကိုလည်း ရွေးချယ်နိုင်သည်။ ('either ... or' သုံး၍ ပေါင်းစပ်ရေးပါ။)",
  },
  {
    id: 6,
    question:
      "My favourite food is spaghetti, an Italian food. (Spot and underline the noun in apposition to 'spaghetti' in the sentence.)",
    answer: "an Italian food \u2014 that is the noun in apposition to 'spaghetti'.",
    translationMy:
      "ကျွန်ုပ်အနှစ်သက်ဆုံး အစားအစာမှာ အီတလီအစားအစာဖြစ်သော စပါဂတ်တီ ဖြစ်သည်။ ('spaghetti' နှင့် တွဲဖက်ထားသော noun in apposition ကို ရှာပြီး မျဉ်းသားပါ။)",
  },
  {
    id: 7,
    question:
      "The children playing in the garden are my nieces and nephews. (Box the adjectival phrase in the sentence.)",
    answer: "playing in the garden \u2014 that is the adjectival phrase.",
    translationMy:
      "ဥယျာဉ်ထဲတွင် ကစားနေသော ကလေးများသည် ကျွန်ုပ်၏ တူမများနှင့် တူများ ဖြစ်ကြသည်။ (adjectival phrase ကို ဘောင်ခတ်ပါ။)",
  },
  {
    id: 8,
    question:
      "All of us think that bikes are better than cars for travelling in small towns. (Underline the verb in the predicate.)",
    answer: "think \u2014 that is the verb in the predicate.",
    translationMy:
      "မြို့ငယ်များတွင် သွားလာရန် စက်ဘီးများသည် ကားများထက် ပိုကောင်းသည်ဟု ကျွန်ုပ်တို့အားလုံး ထင်ကြသည်။ (predicate ထဲရှိ ကြိယာကို မျဉ်းသားပါ။)",
  },
  {
    id: 9,
    question:
      "Normally, I wear glasses, but now I __________ (not / wear) them. (Complete the sentence with the correct tense of the verb given in brackets.)",
    answer: "Normally, I wear glasses, but now I am not wearing them.",
    translationMy:
      "ပုံမှန်အားဖြင့် ကျွန်ုပ်သည် မျက်မှန်တပ်သည်၊ သို့သော် ယခုအခါ ၎င်းတို့ကို __________ (not / wear) ။ (ကွင်းစကွင်းပိတ်အတွင်းရှိ ကြိယာ၏ မှန်ကန်သော tense ဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 10,
    question:
      "How often __________ (you / have) medical check-ups? (Complete the sentence with the correct tense of the verb given in brackets.)",
    answer: "How often do you have medical check-ups?",
    translationMy:
      "ဆေးစစ်ဆေးမှုကို ဘယ်နှစ်ကြိမ် __________ (you / have) လဲ။ (ကွင်းစကွင်းပိတ်အတွင်းရှိ ကြိယာ၏ မှန်ကန်သော tense ဖြင့် ဖြည့်ပါ။)",
  },
];
