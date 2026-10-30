// Supplementary Burmese translations, vocabulary, and grammar explanation
// for Unit 1 sections 1A / 1B / 1C. Keyed by section id.

import type { TrainCar } from "@/lib/sentenceStructure";

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

// Curated "Sentence Structure" breakdown for a single question. Every chunk
// keeps its natural phrase together (no isolated prepositions) and carries a
// Burmese fragment that mirrors the wording used in the main sentence
// translation so students never see out-of-context machine glosses.
export type SentenceBreakdown = {
  introMy: string;
  noteMy: string;
  cars: TrainCar[];
};

export const partA1A_translations: Record<number, string> = {
  1: "ဘာသာစကား စွမ်းရည် လေးခုမှာ __________ တို့ ဖြစ်ကြသည်။",
  2: "အစောဆုံး ဖွံ့ဖြိုးတဲ့ ဘာသာစကား စွမ်းရည်သည် __________ ဖြစ်သည်။",
  3: "ကလေးငယ်တစ်ဦးသည် __________ အရွယ်တွင် စတင်ပြောတတ်သည်။",
  4: "နားထောင်ခြင်းနှင့် __________ တို့သည် တွဲဖက်စွမ်းရည်များအဖြစ် အတူတကွ လုပ်ဆောင်ကြသည်။",
  5: "နောက်ထပ် တွဲဖက် စွမ်းရည်များတွင် __________ တို့ ပါဝင်ကြသည်။",
  6: "ပြောဆိုခြင်းနှင့် ရေးသားခြင်းတို့သည် __________ စွမ်းရည်များ ဖြစ်ကြသည်။",
  7: "ဘာသာစကားကို ဆက်သွယ်ရေး အတွက် __________ အဖြစ်လည်း ခေါ်ဆိုကြသည်။",
  8: "ဆက်သွယ်ရေး ပုံစံ နှစ်မျိုးမှာ __________ နှင့် __________ တို့ ဖြစ်ကြသည်။",
  9: "ပြောဆိုသည့်အခါ နားထောင်သူ ပိုနားလည်စေရန် __________ ကို အသုံးပြုကြသည်။",
  10: "ရေးသားသည့်အခါ စာဖတ်သူ ပိုနားလည်စေရန် __________ ကို အသုံးပြုကြသည်။",
};

export const partB1A_translations: Record<number, string> = {
  1: "ကလေးငယ်တစ်ဦးသည် စာဖတ်ခြင်းနှင့် စာရေးခြင်းကို မည်သည့်အချိန်တွင် စတင်လေ့လာသနည်း။",
  2: "ဘာသာစကား၏ ထုတ်လုပ်နိုင်သော စွမ်းရည်များမှာ ဘာတွေလဲ။",
  3: "ဘာသာစကား၏ လက်ခံစုပ်ယူသော စွမ်းရည်များမှာ ဘာတွေလဲ။",
  4: "ပြောဆိုသည့်အခါ လက်ဟန်ခြေဟန်များကို အဘယ်ကြောင့် အသုံးပြုကြသနည်း။",
  5: "ကျွန်ုပ်တို့ ရေးသားထားသည့်အရာကို စာဖတ်သူ ပိုမိုနားလည်စေရန် မည်သို့ ကူညီပေးနိုင်သနည်း။",
  6: "ဆက်သွယ်ရေး ပုံစံ နှစ်မျိုးမှာ ဘာတွေလဲ။",
  7: "အင်္ဂလိပ်ဘာသာအပြင် အခြားနိုင်ငံခြားဘာသာစကားတစ်ခုခုကို သင်ယူလိုပါသလား။ အဘယ်ကြောင့်လဲ။",
  8: "သင့်အတွက် အခက်ဆုံး ဘာသာစကား စွမ်းရည်က ဘယ်ဟာလဲ။ အဘယ်ကြောင့်လဲ။",
};

export const partC1A_translations: Record<number, string> = {
  1: "မင်္ဂလာပါ၊ မင်္ဂလာနံနက်ခင်းပါ။",
  2: "ဖုန်းကို ခဏ သုံးပါရစေ။",
  3: "ကျွန်ုပ်ကို ကူညီပေးတဲ့အတွက် အရမ်း ကျေးဇူးတင်ပါတယ်။",
  4: "ဓာတ်ပုံကို ကျွန်ုပ်အတွက် scan ဖတ်ပေးနိုင်မလား။",
  5: "နောက်ကျသွားလို့ တောင်းပန်ပါတယ်။",
  6: "ဒီလမ်းအတိုင်း သွားပြီး ညာဘက်သို့ ကွေ့ပါ။",
  7: "ကျွန်ုပ်၏ ဝမ်းမြောက်ဖို့ပါပဲ။",
  8: "သင့်အဖွား ဘယ်လို နေထိုင်ရပါသလဲ။",
  9: "သင် ပြောခဲ့သည့်အရာနှင့် ကျွန်ုပ် သိပ်တော့ သဘောမတူပါ။",
  10: "အယ်လ်ဘာ့တ် အိုင်န်စတင်း၊ ထင်ရှားသော ရူပဗေဒပညာရှင်၊ သည် သူ၏ သီအိုရီ (relativeity theory) ကြောင့် နာမည်ကြီးခဲ့သည်။",
};

export const vocab1B: VocabItem[] = [
  { word: "Australia", pronunciation: "/ɒˈstreɪliə/ — အော်စထရေးလျား", meaningMy: "သြစတြေးလျနိုင်ငံ" },
  { word: "Australian", pronunciation: "/ɒˈstreɪliən/ — အော်စထရေးလျန်", meaningMy: "သြစတြေးလျနိုင်ငံသား / သြစတြေးလျနှင့် ဆက်စပ်သော" },
  { word: "China", pronunciation: "/ˈtʃaɪnə/ — ချိုင်းနား", meaningMy: "တရုတ်နိုင်ငံ" },
  { word: "Chinese", pronunciation: "/tʃaɪˈniːz/ — ချိုင်းနီးဇ်", meaningMy: "တရုတ်လူမျိုး / တရုတ်ဘာသာစကား" },
  { word: "France", pronunciation: "/frɑːns/ — ဖရန့်စ်", meaningMy: "ပြင်သစ်နိုင်ငံ" },
  { word: "French", pronunciation: "/frentʃ/ — ဖရင်ချ်", meaningMy: "ပြင်သစ်လူမျိုး / ပြင်သစ်ဘာသာစကား" },
  { word: "Germany", pronunciation: "/ˈdʒɜːməni/ — ဂျာမနီ", meaningMy: "ဂျာမနီနိုင်ငံ" },
  { word: "German", pronunciation: "/ˈdʒɜːmən/ — ဂျာမန်", meaningMy: "ဂျာမန်လူမျိုး / ဘာသာစကား" },
  { word: "Italy", pronunciation: "/ˈɪtəli/ — အီတလီ", meaningMy: "အီတလီနိုင်ငံ" },
  { word: "Italian", pronunciation: "/ɪˈtæliən/ — အီတယ်လီယန်", meaningMy: "အီတလီလူမျိုး / ဘာသာစကား" },
  { word: "Japan", pronunciation: "/dʒəˈpæn/ — ဂျပန်", meaningMy: "ဂျပန်နိုင်ငံ" },
  { word: "Japanese", pronunciation: "/ˌdʒæpəˈniːz/ — ဂျပန်နီးဇ်", meaningMy: "ဂျပန်လူမျိုး / ဘာသာစကား" },
  { word: "Korea", pronunciation: "/kəˈriːə/ — ကိုရီးယား", meaningMy: "ကိုရီးယားနိုင်ငံ" },
  { word: "Korean", pronunciation: "/kəˈriːən/ — ကိုရီးယန်း", meaningMy: "ကိုရီးယားလူမျိုး / ဘာသာစကား" },
  { word: "Laos", pronunciation: "/laʊs/ — လឹកစ်", meaningMy: "လာအိုနိုင်ငံ" },
  { word: "Laotian", pronunciation: "/ˈlaʊʃən/ — လောက်ရှန်း", meaningMy: "လာအိုလူမျိုး / ဘာသာစကား" },
  { word: "Myanmar", pronunciation: "/ˈmjænmɑːr/ — မြန်မာ", meaningMy: "မြန်မာနိုင်ငံ" },
  { word: "Burmese", pronunciation: "/bɜːˈmiːz/ — ဘားမီးဇ်", meaningMy: "မြန်မာလူမျိုး / မြန်မာဘာသာစကား" },
  { word: "Vietnam", pronunciation: "/ˌvjetˈnæm/ — ဗီယက်နမ်", meaningMy: "ဗီယက်နမ်နိုင်ငံ" },
  { word: "Vietnamese", pronunciation: "/ˌvjetnəˈmiːz/ — ဗီယက်နမ်နီးဇ်", meaningMy: "ဗီယက်နမ်လူမျိုး / ဘာသာစကား" },
];

export const partB1B_translations: Record<number, string> = {
  1: "ကျွန်ုပ်သည် _______ ဘာသာစကားကို ကျွမ်းကျင်စွာ ပြောဆိုနိုင်သောကြောင့် ပြင်သစ်နိုင်ငံတွင် အခက်အခဲ သိပ်မရှိခဲ့ပါ။",
  2: "ထိုကမ္ဘာလှည့်ခရီးသည်များသည် အီတလီနိုင်ငံမှ လာကြသူများဖြစ်ပြီး _______ ဘာသာစကားကိုသာ ပြောတတ်ကာ အင်္ဂလိပ်စကားကို လုံးဝ နားမလည်ကြပါ။",
  3: "ကျွန်ုပ်သည် ဗီယက်နမ်နိုင်ငံသို့ သွားရောက်လည်ပတ်လိုသော်လည်း _______ ဘာသာစကားကို လုံးဝ မပြောတတ်ပါ။",
  4: "သင်သည် _______ ဘာသာစကားကို တော်တော်လေး ကောင်းမွန်စွာ ပြောတတ်သောကြောင့် အမေရိကန်နိုင်ငံတွင် ပညာသင်ကြားရန် အခက်အခဲ ရှိမည် မဟုတ်ပါ။",
  5: "ကျွန်ုပ်သည် ကိုရီးယားနိုင်ငံတွင် အလုပ်လုပ်ရန် စီစဉ်ထားသောကြောင့် ရန်ကုန်နိုင်ငံခြားဘာသာတက္ကသိုလ်တွင် _______ ဘာသာစကားကို သင်ယူနေပါသည်။",
  6: "ကီမိုနိုသည် ရိုးရာ _______ ဝတ်စုံတစ်ခု ဖြစ်သည်။",
  7: "ဝီလျံ ရှိတ်စပီးယားသည် ကျယ်ကျယ်ပြန့်ပြန့် ကျော်ကြားသော _______ ပြဇာတ်ရေးဆရာနှင့် ကဗျာဆရာ တစ်ဦး ဖြစ်သည်။",
  8: "ကျွန်ုပ်သည် လာအိုနိုင်ငံသို့ တစ်ခါမျှ မရောက်ဖူးသကဲ့သို့ _______ အစားအစာကိုလည်း တစ်ခါမျှ မစားဖူးပါ။",
  9: "သူသည် ဂျာမနီနိုင်ငံတွင် ကြီးပြင်းခဲ့ပြီး _______ ဘာသာစကားကို ကျွမ်းကျင်စွာ ပြောဆိုနိုင်သည်။",
  10: "ကျွန်ုပ်သည် တူများကို အသုံးပြုတတ်ခြင်း မရှိသော်လည်း _______ အစားအစာကို နှစ်သက်ပါသည်။",
};

export const partA1C_translations: Record<number, string> = {
  1: "ပုဂံ၊ မြန်မာ၏ ရှေးခေတ်မြို့တော် တွင် ဘုရားများစွာ ရှိသည်။",
  2: "သိုက်ငှက်၊ မပျံတတ်သော ငှက်တစ်မျိုး သည် အာဖရိကမှာသာ တွေ့ရသည်။",
  3: "ကျွန်တော့်သား၊ ဂီတပညာရှင်တစ်ဦး သည် ဝင်ငွေနည်းပါးပြီး ကျွန်တော်နှင့်အတူ နေထိုင်သည်။",
  4: "Loch Ness၊ တောင်ပေါ်ရေကန်ကြီးတစ်ခု သည် စကော့တလန်တွင် ရှိသည်။",
  5: "Mt. Everest၊ ကမ္ဘာ့အမြင့်ဆုံးတောင်ထွတ် သည် နီပေါတွင် ရှိသည်။",
  6: "Tanzania ၏ အမြင့်ဆုံးတောင် ဖြစ်သော ကီလီမန်ဂျာရိုကို တက်ချင်တယ်။",
  7: "Brussels sprout၊ ဂေါ်ဖီထုပ်ငယ်လေးနှင့်တူသော အစိမ်းရောင် ဟင်းသီးဟင်းရွက်တစ်မျိုး သည် စားရသည်မှာ အလွန် အရသာရှိသည်။",
  8: "နိုင်းမြစ်၊ ကမ္ဘာ့အရှည်ဆုံးမြစ် သည် အာဖရိကတိုက် အရှေ့မြောက်ပိုင်းတွင် တည်ရှိသည်။",
  9: "ဂျူဒို၊ ဂျပန်ကိုယ်ခံပညာတစ်မျိုး သည် ဆာမူရိုင်းတို့၏ လက်နက်မဲ့ တိုက်ခိုက်နည်း ဖြစ်သော ဂျူဂျစ်ဆူမှ ဆင်းသက်လာသည်။",
};

export const partB1C_translations: Record<number, string> = {
  1: "မြန်မာနိုင်ငံ၊ အရှေ့တောင်အာရှတွင် ဒုတိယအကြီးဆုံးနိုင်ငံ သည် ဘုရားများ၏ တိုင်းပြည်အဖြစ် လူသိများသည်။",
  2: "ဦးထွန်းထွန်း၊ ကျွန်ုပ်တို့၏ အင်္ဂလိပ်စာဆရာ သည် အလွန် တင်းကျပ်သူတစ်ဦး ဖြစ်သည်။",
  3: "အောင်အောင်၊ ကျွန်ုပ်တို့ကျောင်း၏ အတော်ဆုံး ဘောလုံးသမား သည် ဆုများစွာ ရရှိခဲ့သည်။",
  4: "ဆင်ခြေတစ်ခု၊ တောင်းပန်ရန်အတွက် အကြောင်းပြချက်တစ်ခု သည် မှန်ကောင်းမှန်နိုင်သလို မမှန်ကောင်းလည်း မမှန်နိုင်ပါ။",
  5: "ဂျက်သည် ရေကန်တစ်ထောင်၏ တိုင်းပြည် ဖြစ်သော ဖင်လန်နိုင်ငံတွင် မွေးဖွားခဲ့သည်။",
  6: "အဲလ်ဗစ် ပရက်စလီ၊ အလွန် ရေပန်းစားသော အဆိုတော်တစ်ဦး သည် \"Rock and Roll ဘုရင်\" အဖြစ် ရည်ညွှန်းခေါ်ဆိုခြင်း ခံခဲ့ရသည်။",
  7: "ကျွန်ုပ်တို့သည် ကျွန်ုပ်တို့နိုင်ငံ၏ အလှပဆုံး ကမ်းခြေ ဖြစ်သော ငပလီကမ်းခြေတွင် အားလပ်ရက်ကို ကုန်ဆုံးစေမည် ဖြစ်သည်။",
  8: "ဝီလျံ ဟင်နရီ ဂိတ်၊ Microsoft ၏ အဓိက တည်ထောင်သူ သည် ဝါရှင်တန်ပြည်နယ်တွင် မွေးဖွားခဲ့သည်။",
  9: "ကျွန်ုပ်သည် ခေါက်ဆွဲနှင့် အနှစ်ရည်ဖြင့် ပြုလုပ်ထားသော အီတလီအစားအစာတစ်မျိုး ဖြစ်သော စပါဂတ်တီကို နှစ်သက်ပါသည်။",
  10: "ကျွန်ုပ်၏ ကလေးဘဝနေအိမ်၊ သစ်သားအိမ်ဟောင်းတစ်လုံး သည် ဤလမ်းအတိုင်း အနည်းငယ်သာ ဝေးပါသည်။",
};

export const grammar1C = {
  whatMy:
    "Noun in Apposition (နာမ်ရှင်းလင်းစု) ဆိုသည်မှာ နာမ်တစ်ခု၏ ဘေးတွင် ကော်မာဖြင့် ခြားထား၍ ထိုနာမ်ကို ရှင်းလင်းဖော်ပြပေးသော နောက်ထပ် နာမ်စု ဖြစ်ပါသည်။",
  whenMy:
    "လူ၊ နေရာ၊ အရာဝတ္ထု တစ်ခုခုကို ပိုမို ရှင်းလင်းစွာ ဖော်ပြလိုသည့်အခါ ထိုနာမ်၏ နောက်တွင် ကော်မာခံပြီး ရှင်းလင်းချက်စု ထည့်သွင်း ရေးသားပါသည်။",
  whyMy:
    "စာဖတ်သူအနေဖြင့် မည်သည့်လူ၊ မည်သည့်နေရာ၊ မည်သည့်အရာကို ရည်ညွှန်းသည်ကို ချက်ချင်း သိရှိနားလည်စေရန် ဖြစ်ပါသည်။",
  examples: [
    { en: "Bagan, an ancient capital of Myanmar, has many pagodas.", apposition: "an ancient capital of Myanmar" },
    { en: "Mt. Everest, the highest peak in the world, is in Nepal.", apposition: "the highest peak in the world" },
    { en: "My son, a musician, lives with me.", apposition: "a musician" },
  ],
  // A short, freely-embeddable English-grammar video on appositives
  youtubeId: "QFcaUTd8DgY",
  youtubeTitle: "Appositives — Khan Academy",
  subtitleNoteMy: "မြန်မာ စာတန်းထိုး အလိုအလျောက် ပေါ်ပါမည်။ (CC ခလုတ်ဖြင့် ပိတ်/ဖွင့် နိုင်သည်)",
};

/* ------------------------------------------------------------------ */
/* Curated sentence-structure breakdowns                              */
/* Each chunk is a full grammatical block, and each Burmese fragment  */
/* is copied from the main sentence translation so the words match.   */
/* ------------------------------------------------------------------ */

const SVC_INTRO = "ဒါက Subject → Verb → Complement ပုံစံ ပြောကြားချက် ဝါကျပါ။";
const SVC_NOTE =
  "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Linking Verb) → ဖြည့်စွက်စာ (Complement) ။";
const SVO_INTRO = "ဒါက Subject → Verb → Object ပုံစံ ပြောကြားချက် ဝါကျပါ။";
const SVO_NOTE =
  "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Main Verb) → ကံ (Object) ။ ဝိဘတ်စကားလုံး (of / at / for) များကို နာမ်စု၏ အစိတ်အပိုင်းအဖြစ် တွဲဖက်၍ ဖတ်ပါ။";
const WH_INTRO = "ဒါက WH-မေးခွန်း ဝါကျပါ။";
const WH_NOTE =
  "ပုံစံ: WH-စကားလုံး → အကူကြိယာ (Helping Verb) → ကံတ္တား → ကြိယာ/ကံ ။ ဝိဘတ်စကားလုံးများကို နာမ်စုနှင့် တွဲဖက်၍ ဖတ်ပါ။";

export const partA1A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: SVC_INTRO,
    noteMy: SVC_NOTE,
    cars: [
      { word: "The four language skills", translation: "ဘာသာစကား စွမ်းရည် လေးခုမှာ", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "___________", translation: "__________ တို့", tag: "Complement" },
    ],
  },
  2: {
    introMy: SVC_INTRO,
    noteMy: SVC_NOTE,
    cars: [
      { word: "The first language skill to develop", translation: "အစောဆုံး ဖွံ့ဖြိုးလာသော ဘာသာစကားစွမ်းရည်သည်", tag: "Noun Subject" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "___________", translation: "__________", tag: "Complement" },
    ],
  },
  3: {
    introMy: SVO_INTRO,
    noteMy:
      "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Main Verb \"begins\") → ကံ (Object) ။ \"to speak\" သည် \"begins\" ၏ ကံ ဖြစ်ပြီး ကြိယာမဟုတ်ပါ။",
    cars: [
      { word: "A baby", translation: "ကလေးငယ်တစ်ဦးသည်", tag: "Noun Subject" },
      { word: "begins", translation: "စတင်သည်", tag: "Main Verb" },
      { word: "to speak", translation: "ပြောတတ်ရန်", tag: "Noun Object" },
      { word: "at the age of ___________", translation: "__________ အရွယ်တွင်", tag: "Prepositional Phrase" },
    ],
  },
  4: {
    introMy: SVO_INTRO,
    noteMy: SVO_NOTE,
    cars: [
      { word: "Listening and ___________", translation: "နားထောင်ခြင်းနှင့် __________ တို့သည်", tag: "Noun Subject" },
      { word: "work together", translation: "တွဲဖက် လုပ်ဆောင်ကြသည်", tag: "Main Verb" },
      { word: "as a pair of skills", translation: "စွမ်းရည်များအဖြစ်", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: SVO_INTRO,
    noteMy: SVO_NOTE,
    cars: [
      { word: "The other pair of skills", translation: "နောက်ထပ် တွဲဖက် စွမ်းရည်များတွင်", tag: "Noun Subject" },
      { word: "includes", translation: "���ါဝင်ကြသည်", tag: "Main Verb" },
      { word: "___________", translation: "__________ တို့", tag: "Noun Object" },
    ],
  },
  6: {
    introMy: SVC_INTRO,
    noteMy: SVC_NOTE,
    cars: [
      { word: "Speaking and writing", translation: "ပြောဆိုခြင်းနှင့် ရေးသားခြင်းတို့သည်", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "___________ skills", translation: "__________ စွမ်းရည်များ", tag: "Complement" },
    ],
  },
  7: {
    introMy: SVO_INTRO,
    noteMy: SVO_NOTE,
    cars: [
      { word: "Language", translation: "ဘာသာစကားကို", tag: "Noun Subject" },
      { word: "is also known as", translation: "အဖြစ်လည်း ခေါ်ဆိုကြသည်", tag: "Main Verb" },
      { word: "a ___________", translation: "__________", tag: "Noun Object" },
      { word: "for communication", translation: "ဆက်သွယ်ရေး အတွက်", tag: "Prepositional Phrase" },
    ],
  },
  8: {
    introMy: SVC_INTRO,
    noteMy: SVC_NOTE,
    cars: [
      { word: "The two forms of communication", translation: "ဆက်သွယ်ရေး ပုံစံ နှစ်မျိုးမှာ", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "___________ and ___________", translation: "__________ နှင့် __________ တို့", tag: "Complement" },
    ],
  },
  9: {
    introMy: SVO_INTRO,
    noteMy: SVO_NOTE,
    cars: [
      { word: "We", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "use", translation: "အသုံးပြုကြသည်", tag: "Main Verb" },
      { word: "___________", translation: "__________ ကို", tag: "Noun Object" },
      { word: "when we speak", translation: "ပြောဆိုသည့်အခါ", tag: "Adverb Clause" },
      { word: "to help the listener understand better", translation: "နားထောင်သူ ပိုနားလည်စေရန်", tag: "Purpose Clause" },
    ],
  },
  10: {
    introMy: SVO_INTRO,
    noteMy: SVO_NOTE,
    cars: [
      { word: "We", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "use", translation: "အသုံးပြုကြသည်", tag: "Main Verb" },
      { word: "___________", translation: "__________ ကို", tag: "Noun Object" },
      { word: "when we write", translation: "ရေးသားသည့်အခါ", tag: "Adverb Clause" },
      { word: "to help the reader understand better", translation: "စာဖတ်သူ ပိုနားလည်စေရန်", tag: "Purpose Clause" },
    ],
  },
};

export const partB1A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO,
    noteMy: WH_NOTE,
    cars: [
      { word: "When", translation: "ဘယ်အချိန်တွင်", tag: "WH-Question Word" },
      { word: "does", translation: "—", tag: "Helping Verb" },
      { word: "a child", translation: "ကလေးငယ်တစ်ဦးသည်", tag: "Noun Subject" },
      { word: "begin", translation: "စတင်လုပ်ဆောင်သနည်း", tag: "Main Verb" },
      { word: "to read and write", translation: "ဖတ်ခြင်းနှင့် ရေးခြင်းကို", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: WH_INTRO,
    noteMy: "ပုံစံ: WH-စကားလုံး (What) → Linking Verb (are) → ကံတ္တား (Subject) ။",
    cars: [
      { word: "What", translation: "ဘာတွေလဲ", tag: "WH-Question Word" },
      { word: "are", translation: "—", tag: "Linking Verb" },
      { word: "the productive skills of language", translation: "ဘာသာစကား၏ ထုတ်လုပ်နိုင်သော စွမ်းရည်များမှာ", tag: "Noun Subject" },
    ],
  },
  3: {
    introMy: WH_INTRO,
    noteMy: "ပုံစံ: WH-စကားလုံး (What) → Linking Verb (are) → ကံတ္တား (Subject) ။",
    cars: [
      { word: "What", translation: "ဘာတွေလဲ", tag: "WH-Question Word" },
      { word: "are", translation: "—", tag: "Linking Verb" },
      { word: "the receptive skills of language", translation: "ဘာသာစကား၏ လက်ခံစုပ်ယူသော စွမ်းရည်များမှာ", tag: "Noun Subject" },
    ],
  },
  4: {
    introMy: WH_INTRO,
    noteMy: WH_NOTE,
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "do", translation: "—", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "use", translation: "အသုံးပြုကြသနည်း", tag: "Main Verb" },
      { word: "gestures", translation: "လက်ဟန်ခြေဟန်များကို", tag: "Noun Object" },
      { word: "when we speak", translation: "ပြောဆိုသည့်အခါ", tag: "Adverb Clause" },
    ],
  },
  5: {
    introMy: WH_INTRO,
    noteMy: WH_NOTE,
    cars: [
      { word: "How", translation: "မည်သို့", tag: "WH-Question Word" },
      { word: "do", translation: "—", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "help", translation: "ကူညီပေးနိုင်သနည်း", tag: "Main Verb" },
      { word: "the reader", translation: "စာဖတ်သူကို", tag: "Noun Object" },
      { word: "understand what we write better", translation: "ကျွန်ုပ်တို့ ရေးသားသည့်အရာကို ပိုမိုနားလည်စေရန်", tag: "Noun Object" },
    ],
  },
  6: {
    introMy: WH_INTRO,
    noteMy: "ပုံစံ: WH-စကားလုံး (What) → Linking Verb (are) → ကံတ္တား (Subject) ။",
    cars: [
      { word: "What", translation: "ဘာတွေလဲ", tag: "WH-Question Word" },
      { word: "are", translation: "—", tag: "Linking Verb" },
      { word: "the two forms of communication", translation: "ဆက်သွယ်ရေး ပုံစံ နှစ်မျိုးမှာ", tag: "Noun Subject" },
    ],
  },
  7: {
    introMy: "ဒါက Yes/No မေးခွန်း ဝါကျဖြစ်ပြီး နောက်မှာ Why? ပါဝင်ပါတယ်။",
    noteMy: WH_NOTE,
    cars: [
      { word: "Do", translation: "—", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "want to learn", translation: "သင်ယူလိုပါသလား", tag: "Main Verb" },
      { word: "any other foreign language", translation: "အခြားနိုင်ငံခြားဘာသာစကားတစ်ခုခုကို", tag: "Noun Object" },
      { word: "apart from English", translation: "အင်္ဂလိပ်ဘာသာစကားအပြင်", tag: "Prepositional Phrase" },
      { word: "Why", translation: "အဘယ်ကြောင့်လဲ", tag: "WH-Question Word" },
    ],
  },
  8: {
    introMy: WH_INTRO,
    noteMy: SVC_NOTE,
    cars: [
      { word: "Which language skill", translation: "ဘယ် ဘာသာစကား စွမ်းရည်က", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the most difficult", translation: "အခက်ဆုံး", tag: "Complement" },
      { word: "for you to learn", translation: "သင့်အတွက် သင်ယူရန်", tag: "Prepositional Phrase" },
      { word: "Why", translation: "အဘယ်ကြောင့်လဲ", tag: "WH-Question Word" },
    ],
  },
};
