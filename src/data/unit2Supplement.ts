// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 2 sections 2A / 2B / 2C. Keyed by section id, mirroring
// `unit1Supplement.ts`. Unit 1 data is never touched by this module.

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

/* ----------------------------- 2A Reading ------------------------------ */

export const partA2A_translations: Record<number, string> = {
  1: "ပန်းချီဆရာသည် အရောင်များကို အသုံးပြုသည်။ စာရေးဆရာသည် __________ ကို အသုံးပြုသည်။",
  2: "စာပေအောက်ရှိ ဘာသာရပ်သုံးခုမှာ __________ တို့ ဖြစ်သည်။",
  3: "Pride and Prejudice ကို ရေးသားခဲ့သူမှာ __________ ဖြစ်သည်။",
  4: "For Whom the Bell Tolls ကို __________ က ရေးသားခဲ့သည်။",
  5: "sonnet ကဗျာတစ်ပုဒ်တွင် စာကြောင်း __________ ကြောင်း ရှိသည်။",
  6: "limerick ကဗျာတစ်ပုဒ်တွင် စာကြောင်း __________ ကြောင်း ရှိသည်။",
  7: "ပြဇာတ် အမျိုးအစား သုံးမျိုးမှာ __________ တို့ ဖြစ်သည်။",
  8: "ဝမ်းနည်းဖွယ် အဆုံးသတ်ရှိသော ပြဇာတ်ကို __________ ဟု ခေါ်သည်။",
  9: "ရတု၊ ရကန်၊ အေးချင်း နှင့် ဘောလယ် တို့သည် မြန်မာ __________ အမျိုးအစား အသီးသီး ဖြစ်သည်။",
};

export const partB2A_translations: Record<number, string> = {
  1: "Wuthering Heights ကို မည်သူ ရေးသားခဲ့သနည်း။",
  2: "sonnet ဆိုသည်မှာ အဘယ်နည်း။",
  3: "limerick ဆိုသည်မှာ အဘယ်နည်း။",
  4: "As You Like It ပြဇာတ်ကို မည်သူ ရေးသားခဲ့သနည်း။",
  5: "tragicomedy ဆိုသည်မှာ အဘယ်နည်း။",
};

export const partC2A_translations: Record<number, string> = {
  1: "သတင်းဆောင်းပါးတစ်ပုဒ်ကို စာပေအဖြစ် သတ်မှတ်နိုင်ပါသလား။ အဘယ်ကြောင့်လဲ။",
  2: "အရေးအသားတစ်ခုကို မည်သည့်အခါတွင် စာပေအဖြစ် အသိအမှတ်ပြုနိုင်သနည်း။",
  3: "ပန်းချီဆရာနှင့် စာရေးဆရာ ကွာခြားချက်မှာ အဘယ်နည်း။",
  4: "ပြဇာတ်ကို မည်သည့်အတွက် ရည်ရွယ်ရေးသားသနည်း။",
  5: "ဟာသဇာတ်နှင့် ဝမ်းနည်းဖွယ်ဇာတ် ကွာခြားချက်မှာ အဘယ်နည်း။",
  6: "classic များဆိုသည်မှာ အဘယ်နည်း။",
  7: "ဟာသဇာတ်၊ ဝမ်းနည်းဖွယ်ဇာတ် သို့မဟုတ် နှစ်မျိုးရောနှောဇာတ် — မည်သည်ကို နှစ်သက်သနည်း။ အကြောင်းရင်း ရှင်းပြပါ။",
  8: "နာမည်ကျော် စာရေးဆရာတစ်ဦး ဖြစ်လိုပါသလား။ အဘယ်ကြောင့် ဖြစ်လို သို့မဟုတ် မဖြစ်လိုသနည်း။",
};

/* ---------------------------- 2B Vocabulary ---------------------------- */

export const partA2B_translations: Record<number, string> = {
  1: "စကားပြေ — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  2: "ကဗျာ — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  3: "ပြဇာတ် — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  4: "sonnet (စာကြောင်း ၁၄ ကြောင်းပါ ကဗျာ) — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  5: "limerick (ဟာသဉာဏ်ပါ ကဗျာတို) — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  6: "ဟာသဇာတ် — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  7: "ဝမ်းနည်းဖွယ်ဇာတ် — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
  8: "နှစ်မျိုးရောနှောဇာတ် — အဓိပ္ပာယ်ကို စာပိုဒ်ထဲမှ ကူးယူပါ။",
};

export const partB2B_translations: Record<number, string> = {
  1: "limerick သည် __________ ကဗျာတစ်မျိုး ဖြစ်သည်။",
  2: "tragedy သည် __________ ပြဇာတ်တစ်မျိုး ဖြစ်သည်။",
  3: "sonnet သည် __________ ကဗျာတစ်မျိုး ဖြစ်သည်။",
  4: "author (စာရေးဆရာ) သည် __________ သူ ဖြစ်သည်။",
  5: "comedy သည် __________ ပြဇာတ်တစ်မျိုး ဖြစ်သည်။",
  6: "poet (ကဗျာဆရာ) သည် __________ သူ ဖြစ်သည်။",
  7: "astronomer (နက္ခတ္တဗေဒပညာရှင်) သည် __________ သူ ဖြစ်သည်။",
  8: "dictionary (အဘိဓာန်) သည် __________ စာအုပ်တစ်အုပ် ဖြစ်သည်။",
  9: "botanist (ရုက္ခဗေဒပညာရှင်) သည် __________ သူ ဖြစ်သည်။",
  10: "ruler (ပေတံ) သည် __________ ကိရိယာတစ်ခု ဖြစ်သည်။",
};

export const vocab2B: VocabItem[] = [
  {
    word: "literature",
    pronunciation: "/ˈlɪtrətʃə(r)/ — လစ်တရာချာ",
    meaningMy: "စာပေ — စာဖတ်သူအပေါ် ရေရှည်တည်တံ့သော သက်ရောက်မှုရှိသည့် အရေးအသား",
    exampleEn: "Literature as a field of study is made up of three subjects.",
  },
  {
    word: "prose",
    pronunciation: "/prəʊz/ — ပရိုးဇ်",
    meaningMy: "စကားပြေ — စကားလုံး သို့မဟုတ် အသံလုံးရေ ကန့်သတ်ချက်မရှိသော လွတ်လပ်သည့် အရေးအသား",
    exampleEn: "Letters, essays, articles, biographies, short stories, and novels are all pieces of prose.",
  },
  {
    word: "poetry",
    pronunciation: "/ˈpəʊətri/ — ပိုအက်ထရီ",
    meaningMy: "ကဗျာ — အဆန်းတကြယ် (in verse) ရေးသားသော စာပေ",
    exampleEn: "Poetry is sometimes defined as \"literature in verse.\"",
  },
  {
    word: "drama",
    pronunciation: "/ˈdrɑːmə/ — ဒရာမာ",
    meaningMy: "ပြဇာတ် — စင်မြင့်ပေါ်တွင် ကပြရန် ရေးသားသော ဇာတ်လမ်း",
    exampleEn: "There are three kinds of drama: Comedy, Tragedy, and Tragicomedy.",
  },
  {
    word: "sonnet",
    pronunciation: "/ˈsɒnɪt/ — ဆွန်နက်",
    meaningMy: "စာကြောင်း ၁၄ ကြောင်းနှင့် သီးသန့်ကာရန်ပုံစံရှိသော ကဗျာ",
    exampleEn: "A sonnet is a poem that has fourteen lines and a particular pattern of rhyme.",
  },
  {
    word: "limerick",
    pronunciation: "/ˈlɪmərɪk/ — လင်မရစ်",
    meaningMy: "စာကြောင်းငါးကြောင်းပါ ဟာသဉာဏ်ရွှင် ကဗျာတို",
    exampleEn: "A limerick is a humorous poem with five lines and its own rhyming scheme.",
  },
  {
    word: "comedy",
    pronunciation: "/ˈkɒmədi/ — ကောမက်ဒီ",
    meaningMy: "ဟာသဇာတ် — ရယ်စရာကောင်းပြီး ပရိသတ်ကို ရယ်မောစေသော ပြဇာတ်",
    exampleEn: "A comedy is a play that is amusing and it makes people laugh.",
  },
  {
    word: "tragedy",
    pronunciation: "/ˈtrædʒədi/ — ထရက်ဂျဒီ",
    meaningMy: "ဝမ်းနည်းဖွယ်ဇာတ် — အလွန် ဝမ်းနည်းဖွယ် အဆုံးသတ်ရှိသော ပြဇာတ်",
    exampleEn: "A tragedy is a play that has a very sad ending.",
  },
  {
    word: "tragicomedy",
    pronunciation: "/ˌtrædʒɪˈkɒmədi/ — ထရက်ဂျီကောမက်ဒီ",
    meaningMy: "ဝမ်းနည်းဖွယ်လည်းကောင်း၊ ရယ်စရာလည်းကောင်းသော ပြဇာတ်",
    exampleEn: "A tragicomedy is a type of play that is both sad and amusing.",
  },
  {
    word: "classic",
    pronunciation: "/ˈklæsɪk/ — ကလက်ဆစ်",
    meaningMy: "အရည်အသွေး အမြင့်ဆုံးဖြစ်ပြီး ရေရှည်တည်တံ့သော ယဉ်ကျေးမှုတန်ဖိုးရှိသည့် စာပေ",
    exampleEn: "Classics in literature are novels, poems, and plays that are of top quality.",
  },
  {
    word: "stanza",
    pronunciation: "/ˈstænzə/ — စတန်ဇာ",
    meaningMy: "ကဗျာအပိုဒ် — ကဗျာတစ်ပုဒ်အတွင်းရှိ စာကြောင်းအုပ်စုတစ်ခု",
    exampleEn: "The poet has to follow the number of lines to a stanza.",
  },
  {
    word: "rhyme",
    pronunciation: "/raɪm/ — ရိုင်း",
    meaningMy: "ကာရန် — စာကြောင်းအဆုံးရှိ အသံတူညီမှု",
    exampleEn: "A sonnet has a particular pattern of rhyme.",
  },
  {
    word: "rhythm",
    pronunciation: "/ˈrɪðəm/ — ရစ်သမ်",
    meaningMy: "စည်းချက် — ဖတ်ရွတ်ရာတွင် ဖြစ်ပေါ်လာသော အသံအတက်အကျ ပုံစံ",
    exampleEn: "The poet must maintain the pattern of rhyme and rhythm.",
  },
  {
    word: "lyrical poem",
    pronunciation: "/ˈlɪrɪkl ˈpəʊɪm/ — လီရီကယ် ပိုအင်မ်",
    meaningMy: "ကဗျာဆရာ၏ အတွေးအမြင်နှင့် ခံစားချက်ကို ဖော်ပြသော ကဗျာ",
    exampleEn: "Daffodils by William Wordsworth is a famous lyrical poem.",
  },
  {
    word: "author",
    pronunciation: "/ˈɔːθə(r)/ — အော်သာ",
    meaningMy: "စာရေးဆရာ — ဝတ္ထု သို့မဟုတ် စာစီစာကုံးများ ရေးသားသူ",
    exampleEn: "The author or writer of Pride and Prejudice was Jane Austen.",
  },
  {
    word: "biography",
    pronunciation: "/baɪˈɒɡrəfi/ — ဘိုင်အောဂရဖီ",
    meaningMy: "အတ္ထုပ္ပတ္တိ — လူတစ်ဦး၏ ဘဝဖြစ်စဉ်ကို ရေးသားထားသော စာအုပ်",
    exampleEn: "Biographies are pieces of prose.",
  },
];

/* ------------------------------ 2C Grammar ------------------------------ */

export const partA2C_translations: Record<number, string> = {
  1: "Shakespeare ရေးသားခဲ့သော ပြဇာတ်များနှင့် ကဗျာများသည် နားလည်ရန် မလွယ်ကူပါ။",
  2: "ဦးဘ၏ ကြက်ခြံမှ ဥများသည် အရွယ်ကြီးပြီး လတ်ဆတ်သည်။",
  3: "အစိမ်းရောင် ရှပ်အင်္ကျီဝတ်ထားသော ထိုကောင်လေးသည် ကျွန်ုပ်၏ ဝမ်းကွဲ ဖြစ်သည်။",
  4: "ထိုသစ်ပင်အောက်တွင် စကားပြောနေသော အမျိုးသားနှစ်ဦးသည် အင်ဂျင်နီယာများ ဖြစ်ကြသည်။",
  5: "ထိုမြစ်ကို ဖြတ်ကူးထားသော တံတားသည် အသက် ငါးဆယ်ကျော် ရှိပြီ။",
  6: "ထိုဆိုင်ငယ်လေးတွင် ရောင်းချသော စာအုပ်များသည် အတော် ဈေးသက်သာသည်။",
  7: "ဤနေ့လယ်စာ ထုပ်များသည် ထိုသစ်ပင်အောက်တွင် နားနေသော အလုပ်သမားများအတွက် ဖြစ်သည်။",
  8: "ထိုပြခန်းအတွင်းရှိ နာရီများအားလုံးသည် ဂျပန်လုပ် ဖြစ်သည်။",
  9: "Agatha Christie ရေးသားခဲ့သော စုံထောက်ဝတ္ထုတစ်အုပ်အုပ်ကို ဖတ်ဖူးပါသလား။",
  10: "ကျွန်ုပ်တို့ စာကြည့်တိုက်မှ ငှားယူသော စာအုပ်မှန်သမျှကို နှစ်ပတ်အတွင်း ပြန်အပ်ရမည်။",
};

export const partB2C_translations: Record<number, string> = {
  1: "ဆရာသည် သင်ကြားနေစဉ် သူ၏ လက်ကိုင်ဖုန်းကို အမြဲတမ်း ပိတ်ထားသည်။",
  2: "သရဲ တစ္ဆေများ ရှိသည်ဟု သင် ယုံကြည်ပါသလား။",
  3: "ကျွန်ုပ်သည် စနေ၊ တနင်္ဂနွေများတွင် အားကစားခန်းမသို့ ပုံမှန် မသွားပါ။",
  4: "အဘယ်ကြောင့် ကိုယ်ရေးကိုယ်တာ မေးခွန်းများ မေးကာ ကျွန်ုပ်ကို စိတ်အနှောင့်အယှက် ဖြစ်စေနေသနည်း။",
  5: "အလေးအနက် ထားပါ! ကျွန်ုပ် နောက်ပြောင်နေသည် မဟုတ်ပါ။",
  6: "ဆရာကောင်းတစ်ယောက်သည် သင်ယူမှုကို အမြဲတမ်း စိတ်ဝင်စားဖွယ် ဖြစ်စေသည်။",
};

export const partC2C_translations: Record<number, string> = {
  1: "ကျွန်ုပ်သည် ယခုအချိန်တွင် အများပြည်သူ စာကြည့်တိုက်၌ အလုပ်လုပ်နေသည်။",
  2: "ကျွန်ုပ်တို့သည် လာမည့် နွေရာသီကို မိုးကုတ်တွင် ကုန်ဆုံးမည်။",
  3: "ထွန်းထွန်းသည် စောစော ဘယ်တော့မှ မထပါ။",
  4: "ဤအင်္ကျီသည် ကျွန်ုပ်၏ ဖခင် ပိုင်ဆိုင်သည်။",
  5: "ငှက်အချို့သည် သစ်ကိုင်းငယ်လေးများဖြင့် အသိုက်ဆောက်ကြသည်။",
  6: "ကျွန်ုပ်သည် ပုံမှန်အားဖြင့် စက်ဘီးဖြင့် အလုပ်သွားသည်။",
  7: "ကလေးတစ်ယောက်သည် မည်သည့်အချိန်တွင် လမ်းစလျှောက်တတ်သနည်း။",
  8: "ကြည့်စမ်း! ကောင်မလေးက လှလှပပ ကနေသည်။",
  9: "ဓာတ်ပုံထဲတွင် ကျွန်ုပ်တို့အားလုံး ပျော်ရွှင်စွာ ပြုံးကာ မုန့်များ စားနေကြသည်။",
  10: "ကျွန်ုပ်သည် မိတ်ကပ် အလွန်အကျွံ လိမ်းရသည်ကို မကြိုက်ပါ။",
};

export const grammar2C = {
  whatMy:
    "Adjectival Phrase (နာမဝိသေသန စကားစု) ဆိုသည်မှာ နာမ်တစ်ခု၏ နောက်တွင် တွဲလျက်ထားပြီး ထိုနာမ်ကို အထူးပြု ဖော်ပြပေးသော စကားစု ဖြစ်ပါသည်။ ဝိဘတ်စကားစု (in the green shirt) သို့မဟုတ် ကြိယာမှ ဆင်းသက်သော စကားစု (written by Shakespeare, talking under that tree) ပုံစံဖြင့် ဖြစ်တတ်ပါသည်။",
  whenMy:
    "မည်သည့် လူ၊ နေရာ၊ အရာဝတ္ထုကို ဆိုလိုကြောင်း တိတိကျကျ ဖော်ပြလိုသည့်အခါ ထိုနာမ်၏ နောက်တွင် နာမဝိသေသန စကားစုကို ချက်ချင်း ဆက်၍ ရေးပါသည်။",
  whyMy:
    "စာဖတ်သူအနေဖြင့် နာမ်တစ်ခုကို အခြားနာမ်များနှင့် မမှားစေဘဲ ချက်ချင်း ခွဲခြားသိရှိစေရန် ဖြစ်ပါသည်။",
  examples: [
    { en: "That boy in the green shirt is my cousin.", phrase: "in the green shirt" },
    { en: "The two men talking under that tree are engineers.", phrase: "talking under that tree" },
    { en: "Any book borrowed from our library must be returned in two weeks.", phrase: "borrowed from our library" },
  ],
};

export const tense2C = {
  whatMy:
    "Present Simple (ပစ္စုပ္ပန် ရိုးရိုး) ကို အမြဲဖြစ်လေ့ရှိသော အမှုကိစ္စ၊ အလေ့အထ နှင့် အမှန်တရားများအတွက် သုံးပါသည်။ Present Continuous (ပစ္စုပ္ပန် ဆက်လက်ဖြစ်ပျက်ဆဲ) ကို ယခုအချိန်တွင် ဖြစ်ပျက်နေဆဲ အမှုကိစ္စများအတွက် သုံးပါသည်။",
  whenMy:
    "always, usually, never, at weekends စသည့် စကားလုံးများနှင့် ရိုးရိုးကာလကို သုံးပါသည်။ now, at the moment, Look! စသည်တို့နှင့် ဆက်လက်ဖြစ်ပျက်ဆဲ ကာလကို သုံးပါသည်။",
  whyMy:
    "like, belong, believe, know ကဲ့သို့ ခံစားမှု/အခြေအနေပြ ကြိယာ (state verbs) များကို ဆက်လက်ဖြစ်ပျက်ဆဲ ပုံစံဖြင့် မသုံးပါ — ထို့ကြောင့် \"I am not liking…\" မှား၍ \"I do not like…\" မှန်ပါသည်။",
  examples: [
    { en: "The teacher always switches off his mobile phone while he is teaching.", phrase: "always switches off" },
    { en: "Look! The girl is dancing beautifully.", phrase: "is dancing" },
    { en: "This coat belongs to my father.", phrase: "belongs" },
  ],
};
