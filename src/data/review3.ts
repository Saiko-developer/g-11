/**
 * Review 3 — revision exercises covering Units 7, 8 and 9.
 * Real textbook content (Part A: word bank, Part B: grammar rewriting).
 */

export type ReviewItem = {
  id: number;
  question: string;
  answer: string;
  translationMy: string;
};

export const REVIEW3_WORD_BANK = [
  "competitive",
  "costly",
  "decomposers",
  "erosion",
  "forgetful",
  "fossil",
  "gravy",
  "resist",
  "solar",
  "various",
  "unique",
  "using",
];

export const REVIEW3_PART_A_INSTRUCTIONS =
  "Complete each sentence with the appropriate word given in the box. There are two extra words you do not need. (competitive, costly, decomposers, erosion, forgetful, fossil, gravy, resist, solar, various, unique, using)";

export const REVIEW3_PART_A: ReviewItem[] = [
  {
    id: 1,
    question:
      "Buying new furniture can be very _______________, so why don't we think of buying used items?",
    answer:
      "Buying new furniture can be very costly, so why don't we think of buying used items?",
    translationMy:
      "ပရိဘောဂအသစ်ဝယ်ခြင်းသည် အလွန် _______________ (ကုန်ကျစရိတ်များ) နိုင်သဖြင့် အသုံးပြုပြီးပစ္စည်းများ ဝယ်ခြင်းကို မစဉ်းစားသင့်ဘူးလား။",
  },
  {
    id: 2,
    question: "My grandfather is getting very _______________ in his old age.",
    answer: "My grandfather is getting very forgetful in his old age.",
    translationMy:
      "ကျွန်ုပ်၏ အဘိုးသည် အသက်ကြီးလာသည်နှင့်အမှု အလွန် _______________ (မေ့လွယ်) လာသည်။",
  },
  {
    id: 3,
    question: "Graduates have to fight for jobs in a highly _______________ market.",
    answer: "Graduates have to fight for jobs in a highly competitive market.",
    translationMy:
      "ဘွဲ့ရများသည် အလွန် _______________ (ယှဉ်ပြိုင်မှုပြင်းထန်သော) ဈေးကွက်တွင် အလုပ်အတွက် အားထုတ်ရသည်။",
  },
  {
    id: 4,
    question:
      "That building is _______________ because all the others like it were destroyed.",
    answer:
      "That building is unique because all the others like it were destroyed.",
    translationMy:
      "အလားတူ အခြားအဆောက်အအုံအားလုံး ပြိုပျက်ခဲ့သဖြင့် ထိုအဆောက်အအုံသည် _______________ (တစ်ခုတည်းသာ ထူးခြားသည်) ဖြစ်သည်။",
  },
  {
    id: 5,
    question: "Teenagers may find it difficult to _______________ peer pressure.",
    answer: "Teenagers may find it difficult to resist peer pressure.",
    translationMy:
      "အရွယ်မတိုင်မီ လူငယ်များအတွက် သူတူရွယ်တူ ဖိအားကို _______________ (တွန်းလှန်ရန်) ခက်ခဲနိုင်သည်။",
  },
  {
    id: 6,
    question: "Many fungi and bacteria are important _______________ in food chains.",
    answer: "Many fungi and bacteria are important decomposers in food chains.",
    translationMy:
      "မှိုများနှင့် ဘက်တီးရီးယားများသည် အစားအစာကွင်းဆက်တွင် အရေးပါသော _______________ (ဖြိုခွဲသူများ) ဖြစ်သည်။",
  },
  {
    id: 7,
    question: "_______________ fuels are non-renewable and rapidly running out.",
    answer: "Fossil fuels are non-renewable and rapidly running out.",
    translationMy:
      "_______________ (ရုပ်ကြွင်း) စွမ်းအင်များသည် ပြန်လည်မရနိုင်ဘဲ လျင်မြန်စွာ ကုန်ခမ်းလာသည်။",
  },
  {
    id: 8,
    question: "We are _______________ up the earth's resources at an alarming rate.",
    answer: "We are using up the earth's resources at an alarming rate.",
    translationMy:
      "ကျွန်ုပ်တို့သည် ကမ္ဘာ့သယံဇာတများကို စိုးရိမ်ဖွယ်နှုန်းဖြင့် _______________ (အသုံးချ) ကုန်နေသည်။",
  },
  {
    id: 9,
    question:
      "The calculator I am currently using runs on _______________ power.",
    answer: "The calculator I am currently using runs on solar power.",
    translationMy:
      "ကျွန်ုပ် လက်ရှိအသုံးပြုနေသော ဂဏန်းတွက်စက်သည် _______________ (နေစွမ်းအင်) ဖြင့် အလုပ်လုပ်သည်။",
  },
  {
    id: 10,
    question:
      "As the roots of these trees go deep and are strong, they prevent soil _______________.",
    answer:
      "As the roots of these trees go deep and are strong, they prevent soil erosion.",
    translationMy:
      "ဤသစ်ပင်များ၏ အမြစ်များသည် နက်ရှိုင်းပြီး ခိုင်မာသဖြင့် မြေဆီလွှာ _______________ (တိုက်စားခြင်း) ကို တားဆီးပေးသည်။",
  },
];

export const REVIEW3_PART_B_INSTRUCTIONS =
  "Rewrite the sentences according to the instructions given in brackets.";

export const REVIEW3_PART_B: ReviewItem[] = [
  {
    id: 1,
    question:
      "If these shoes fit me, I _______________ (buy) them. (Complete using the correct verb tense.)",
    answer: "If these shoes fit me, I will buy them.",
    translationMy:
      "ဤဖိနပ်များ ကျွန်ုပ်နှင့် အံကိုက်ဖြစ်ပါက ကျွန်ုပ် ၎င်းတို့ကို _______________ (buy) မည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 2,
    question:
      "If I _______________ (listen) to the news last night, I would have known the good news earlier. (Complete using the correct verb tense.)",
    answer:
      "If I had listened to the news last night, I would have known the good news earlier.",
    translationMy:
      "မနေ့ညက သတင်းကို ကျွန်ုပ် _______________ (listen) ခဲ့လျှင် သတင်းကောင်းကို ပိုမိုစောစီးစွာ သိခဲ့မည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 3,
    question:
      "If I were rich, I _______________ (help) the poor and the needy as much as I can. (Complete using the correct verb tense.)",
    answer:
      "If I were rich, I would help the poor and the needy as much as I can.",
    translationMy:
      "ကျွန်ုပ် ချမ်းသာပါက ဆင်းရဲသားများနှင့် လိုအပ်သူများကို တတ်နိုင်သလောက် _______________ (help) မည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 4,
    question:
      "You can find rental car companies in all airports around the world and in most cities. (Change into the Passive voice.)",
    answer:
      "Rental car companies can be found in all airports around the world and in most cities.",
    translationMy:
      "ကမ္ဘာတစ်ဝှမ်း လေဆိပ်အားလုံးနှင့် မြို့အများစုတွင် ကားအငှားကုမ္ပဏီများကို ရှာနိုင်သည်။ (Passive voice သို့ ပြောင်းပါ။)",
  },
  {
    id: 5,
    question:
      "They painted not only the outside of the house but also the inside. (Change into the Passive voice.)",
    answer:
      "Not only the outside of the house but also the inside was painted.",
    translationMy:
      "သူတို့သည် အိမ်၏ အပြင်ဘက်သာမက အတွင်းဘက်ကိုပါ ဆေးသုတ်ခဲ့သည်။ (Passive voice သို့ ပြောင်းပါ။)",
  },
  {
    id: 6,
    question:
      "They will sort out the problem as soon as possible. (Change into the Passive voice.)",
    answer: "The problem will be sorted out as soon as possible.",
    translationMy:
      "သူတို့သည် ပြဿနာကို အတိုင်းအရှည်စွာ ဖြေရှင်းမည်။ (Passive voice သို့ ပြောင်းပါ။)",
  },
  {
    id: 7,
    question:
      "Carnivores eat meat, herbivores eat plants, and omnivores eat both meat and plants. (Rewrite omitting verbs where necessary.)",
    answer:
      "Carnivores eat meat, herbivores plants, and omnivores both meat and plants.",
    translationMy:
      "အသားစားသတ္တဝါများသည် အသားစားသည်၊ အရွက်စားသတ္တဝါများသည် အပင်စားသည်၊ နှစ်မျိုးစားသတ္တဝါများသည် အသားနှင့် အပင်နှစ်မျိုးစားသည်။ (လိုအပ်သည့်အခါ ကြိယာများကို ချန်လှပ်ပြီး ပြန်ရေးပါ။)",
  },
  {
    id: 8,
    question:
      "Mee Mee likes shopping online; Zaw Zaw likes chatting online and Si Si likes watching movies online. (Rewrite omitting verbs where necessary.)",
    answer:
      "Mee Mee likes shopping online; Zaw Zaw, chatting online and Si Si, watching movies online.",
    translationMy:
      "မီမီသည် အွန်လိုင်းဝယ်ယူခြင်းကို ကြိုက်သည်၊ ဇော်ဇော်သည် အွန်လိုင်းစကားပြောခြင်းကို ကြိုက်ပြီး စီစီသည် အွန်လိုင်းရုပ်ရှင်ကြည့်ခြင်းကို ကြိုက်သည်။ (လိုအပ်သည့်အခါ ကြိယာများကို ချန်လှပ်ပြီး ပြန်ရေးပါ။)",
  },
  {
    id: 9,
    question:
      "What subject _______________ (you, study) currently in school? (Complete using the correct verb tense.)",
    answer: "What subject are you studying currently in school?",
    translationMy:
      "ကျောင်းတွင် လက်ရှိ ဘာဘာသာရပ်ကို _______________ (you, study) နေသလဲ။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 10,
    question:
      "Every morning, customers _______________ (line up) outside the front door of the bakery. (Complete using the correct verb tense.)",
    answer:
      "Every morning, customers line up outside the front door of the bakery.",
    translationMy:
      "နေ့စဉ်နံနက်တွင် ဖောက်သည်များသည် မုန့်ဆိုင်၏ အရှေ့တံခါးအပြင်ဘက်တွင် _______________ (line up) ကြသည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 11,
    question:
      "These days, the police _______________ (watch) every move the suspect makes. (Complete using the correct verb tense.)",
    answer:
      "These days, the police are watching every move the suspect makes.",
    translationMy:
      "ဒီရက်များတွင် ရဲများသည် သံသယရှိသူ၏ လှုပ်ရှားမှုတိုင်းကို _______________ (watch) နေသည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
  {
    id: 12,
    question:
      "It is natural that young children _______________ (cling) onto their mothers for everything. (Complete using the correct verb tense.)",
    answer:
      "It is natural that young children cling onto their mothers for everything.",
    translationMy:
      "ကလေးငယ်များသည် အရာအားလုံးအတွက် သူတို့၏ အမေများကို _______________ (cling) ခြင်းသည် သဘာဝဖြစ်သည်။ (မှန်ကန်သော ကြိယာကာလဖြင့် ဖြည့်ပါ။)",
  },
];
