/**
 * Review 2 — revision exercises covering Units 4, 5 and 6.
 * Real textbook content (Part A: word choice, Part B: grammar rewriting).
 */

export type ReviewItem = {
  id: number;
  question: string;
  answer: string;
  translationMy: string;
};

export const REVIEW2_PART_A_INSTRUCTIONS =
  "Complete each sentence, choosing the correct expression given in brackets.";

export const REVIEW2_PART_A: ReviewItem[] = [
  {
    id: 1,
    question:
      "(Cubism / Graffiti) is a style of art in which objects are shown as a group of geometric shapes, and (cubism / graffiti) can be called street art.",
    answer:
      "Cubism is a style of art in which objects are shown as a group of geometric shapes, and graffiti can be called street art.",
    translationMy:
      "(Cubism / Graffiti) ဆိုသည်မှာ ဝတ္ထုပစ္စည်းများကို ဂျီဩမေတြီပုံသဏ္ဌာန်အုပ်စုတစ်ခုအဖြစ် ပြသထားသည့် အနုပညာပုံစံတစ်ခုဖြစ်ပြီး၊ (cubism / graffiti) ကို လမ်းဘေးအနုပညာဟု ခေါ်ဆိုနိုင်သည်။",
  },
  {
    id: 2,
    question: "(Art / Painting) is an (art / painting) of making pictures using paints.",
    answer: "Painting is an art of making pictures using paints.",
    translationMy:
      "(Art / Painting) ဆိုသည်မှာ ဆေးသုတ်ဆေးများ အသုံးပြု၍ ရုပ်ပုံများဖန်တီးခြင်း (art / painting) ဖြစ်သည်။",
  },
  {
    id: 3,
    question: "Don't (overeat / overweight) if you do not want to get (overeat / overweight).",
    answer: "Don't overeat if you do not want to get overweight.",
    translationMy:
      "အကယ်၍ မင်း (overeat / overweight) မဖြစ်ချင်ဘူးဆိုရင် (overeat / overweight) မလုပ်ပါနဲ့။",
  },
  {
    id: 4,
    question:
      "Several (disagreed / disagreements) have to be resolved because people (disagreed / disagreements) on the best way to raise the fund.",
    answer:
      "Several disagreements have to be resolved because people disagreed on the best way to raise the fund.",
    translationMy:
      "ရန်ပုံငွေရှာဖွေရန် အကောင်းဆုံးနည်းလမ်းအပေါ် လူတွေက (disagreed / disagreements) ဖြစ်ကြသောကြောင့် သဘောထားကွဲလွဲမှု (disagreed / disagreements) အနည်းငယ်ကို ဖြေရှင်းရမည်။",
  },
  {
    id: 5,
    question: "Thousands of (commuters / travellers) go to work by train every day.",
    answer: "Thousands of commuters go to work by train every day.",
    translationMy:
      "(commuters / travellers) ထောင်ပေါင်းများစွာသည် နေ့စဉ် ရထားဖြင့် အလုပ်သွားကြသည်။",
  },
  {
    id: 6,
    question:
      "I always buy (eco-friendly / guest-friendly) products so as not to harm the natural environment.",
    answer:
      "I always buy eco-friendly products so as not to harm the natural environment.",
    translationMy:
      "သဘာဝပတ်ဝန်းကျင်ကို မထိခိုက်စေရန်အတွက် ကျွန်ုပ်သည် (eco-friendly / guest-friendly) ထုတ်ကုန်များကို အမြဲဝယ်ယူသည်။",
  },
  {
    id: 7,
    question:
      "Traffic (congestion / maintenance) is getting worse and worse due to the increasing number of cars in the cities.",
    answer:
      "Traffic congestion is getting worse and worse due to the increasing number of cars in the cities.",
    translationMy:
      "မြို့ကြီးများတွင် ကားအရေအတွက် တိုးပွားလာခြင်းကြောင့် ယာဉ် (congestion / maintenance) သည် ပိုမိုဆိုးရွားလာနေသည်။",
  },
  {
    id: 8,
    question:
      "I had (run out of / run over) space and had to put my address on the other side of the paper.",
    answer:
      "I had run out of space and had to put my address on the other side of the paper.",
    translationMy:
      "ကျွန်ုပ်မှာ နေရာ (run out of / run over) သွားသဖြင့် စာရွက်၏ အခြားတစ်ဖက်တွင် လိပ်စာရေးခဲ့ရသည်။",
  },
  {
    id: 9,
    question: "When I was a child, Grandma always (said / told) me bedtime stories.",
    answer: "When I was a child, Grandma always told me bedtime stories.",
    translationMy:
      "ကျွန်ုပ် ငယ်ငယ်တုန်းက အဖွားသည် ကျွန်ုပ်ကို အိပ်ရာဝင်ပုံပြင်များ အမြဲ (said / told) ခဲ့သည်။",
  },
  {
    id: 10,
    question:
      "Our principal (said / told), \u201cI have something important to (say / tell) you today.\u201d",
    answer:
      "Our principal said, \u201cI have something important to tell you today.\u201d",
    translationMy:
      "ကျွန်ုပ်တို့၏ ကျောင်းအုပ်ကြီးက (said / told) သည်၊ \"ဒီနေ့ မင်းတို့ကို (say / tell) ဖို့ အရေးကြီးတဲ့အရာတစ်ခု ရှိတယ်။\"",
  },
];

export const REVIEW2_PART_B_INSTRUCTIONS =
  "Rewrite the sentences according to the instructions given in brackets.";

export const REVIEW2_PART_B: ReviewItem[] = [
  {
    id: 1,
    question:
      "Grandpa (has read / has been reading) the newspaper the whole morning. (Underline the correct answer.)",
    answer: "Grandpa has been reading the newspaper the whole morning.",
    translationMy:
      "အဘိုးသည် တစ်မနက်ခင်းလုံး သတင်းစာ (has read / has been reading) နေခဲ့သည်။ (မှန်ကန်သောအဖြေကို မျဉ်းသားပါ။)",
  },
  {
    id: 2,
    question:
      "Su Su (love) dogs when she was a child but she doesn't like them anymore. (Rewrite, using the correct form of 'used to'.)",
    answer:
      "Su Su used to love dogs when she was a child but she doesn't like them anymore.",
    translationMy:
      "စုစုသည် ငယ်ငယ်တုန်းက ခွေးများကို (love) ခဲ့သော်လည်း ယခုအခါ ၎င်းတို့ကို မကြိုက်တော့ပါ။ ('used to' ၏ မှန်ကန်သောပုံစံကို အသုံးပြု၍ ပြန်လည်ရေးသားပါ။)",
  },
  {
    id: 3,
    question:
      "In the past, people (not, use to) travel as much as they do today. (Rewrite, using the correct form of 'used to'.)",
    answer: "In the past, people did not use to travel as much as they do today.",
    translationMy:
      "အတိတ်ကာလက လူများသည် ယနေ့ခေတ်လောက် ခရီးအများကြီး (not, use to) မသွားခဲ့ကြပါ။ ('used to' ၏ မှန်ကန်သောပုံစံကို အသုံးပြု၍ ပြန်လည်ရေးသားပါ။)",
  },
  {
    id: 4,
    question:
      "Smiling and waving, the actress greeted her fans. (Spot the participial phrase and underline it.)",
    answer: "Smiling and waving \u2014 that is the participial phrase.",
    translationMy:
      "ပြုံးပြပြီး လက်ဝှေ့ယမ်းလျက်မီးသည် သူမ၏ပရိသတ်များကို နှုတ်ဆက်ခဲ့သည်။ (participial phrase ကို ရှာဖွေပြီး မျဉ်းသားပါ။)",
  },
  {
    id: 5,
    question:
      "Watched by millions, soccer is popular all around the world. (Underline the participial phrase.)",
    answer: "Watched by millions \u2014 that is the participial phrase.",
    translationMy:
      "လူသန်းပေါင်းများစွာ စောင့်ကြည့်ရသော ဘောလုံးအားကစားသည် ကမ္ဘာတစ်ဝှမ်းလုံးတွင် ရေပန်းစားသည်။ (participial phrase ကို မျဉ်းသားပါ။)",
  },
  {
    id: 6,
    question:
      "While I (cooked / was cooking), my brother (did / was doing) the cleaning up. (Underline the correct answer.)",
    answer: "While I was cooking, my brother was doing the cleaning up.",
    translationMy:
      "ကျွန်ုပ် (cooked / was cooking) နေစဉ်၊ ကျွန်ုပ်၏မောင်လေးသည် သန့်ရှင်းရေး (did / was doing) နေခဲ့သည်။ (မှန်ကန်သောအဖြေကို မျဉ်းသားပါ။)",
  },
  {
    id: 7,
    question:
      "My roommate (got / was getting) ready for school at 7:30 yesterday morning when I (woke up / was waking up). (Underline the correct answer.)",
    answer:
      "My roommate was getting ready for school at 7:30 yesterday morning when I woke up.",
    translationMy:
      "မနေ့မနက် ၇:၃၀ က ကျွန်ုပ် (woke up / was waking up) မိချိန်တွင် ကျွန်ုပ်၏ အခန်းဖော်သည် ကျောင်းသွားရန် (got / was getting) ပြင်ဆင်နေခဲ့သည်။ (မှန်ကန်သောအဖြေကို မျဉ်းသားပါ။)",
  },
  {
    id: 8,
    question:
      "Win Win said, \u201cMy mother will celebrate her birthday next weekend.\u201d (Change the sentence into the reported speech.)",
    answer:
      "Win Win said that her mother would celebrate her birthday the following weekend.",
    translationMy:
      "ဝင်းဝင်းက \"လာမယ့်သီတင်းပတ်ကုန်မှာ ကျွန်မအမေက မွေးနေ့ပွဲကျင်းပမှာပါ\" ဟု ပြောခဲ့သည်။ (ဝါကျကို reported speech သို့ ပြောင်းလဲပါ။)",
  },
  {
    id: 9,
    question:
      "A policeman asked the man, \u201cWhat are you doing here?\u201d (Change the sentence into the reported speech.)",
    answer: "A policeman asked the man what he was doing there.",
    translationMy:
      "ရဲသားတစ်ဦးက ထိုလူကို \"မင်း ဒီမှာ ဘာလုပ်နေတာလဲ\" ဟု မေးခဲ့သည်။ (ဝါကျကို reported speech သို့ ပြောင်းလဲပါ။)",
  },
  {
    id: 10,
    question:
      "The teacher said, \u201cAre you ready for the performance?\u201d (Change the sentence into the reported speech.)",
    answer: "The teacher asked whether they were ready for the performance.",
    translationMy:
      "ဆရာက \"မင်းတို့ ဖျော်ဖြေပွဲအတွက် အဆင်သင့်ဖြစ်ပြီလား\" ဟု မေးခဲ့သည်။ (ဝါကျကို reported speech သို့ ပြောင်းလဲပါ။)",
  },
  {
    id: 11,
    question:
      "Mother said, \u201cNilar, don't worry about what others think of you.\u201d (Change the sentence into the reported speech.)",
    answer:
      "Mother told Nilar not to worry about what others thought of her.",
    translationMy:
      "အမေက \"နီလာ၊ သူတစ်ပါးတွေ မင်းအပေါ် ဘယ်လိုထင်မလဲဆိုတာကို စိတ်မပူပါနဲ့\" ဟု ပြောခဲ့သည်။ (ဝါကျကို reported speech သို့ ပြောင်းလဲပါ။)",
  },
];
