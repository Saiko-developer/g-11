// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 3 sections 3A / 3B / 3C. Keyed by section id, mirroring
// `unit1Supplement.ts` and `unit2Supplement.ts`. Unit 1 and Unit 2 data are
// never touched by this module.

export type VocabItem = {
  word: string;
  pronunciation: string; // simple phonetic guide
  meaningMy: string;
  exampleEn?: string;
};

/* ----------------------------- 3A Reading ------------------------------ */

export const partA3A_translations: Record<number, string> = {
  1: "စာကြောင်း ၃ ရှိ \"those\" ဟူသော စကားလုံးသည် __________ ကို ရည်ညွှန်းသည်။",
  2: "စာကြောင်း ၁၀ တွင် \"ရိုးရှင်းလွယ်ကူသော\" ဟု အဓိပ္ပာယ်တူသော စကားလုံးမှာ __________ ဖြစ်သည်။",
  3: "ဂဏန်း အမျိုးအစား နှစ်မျိုးမှာ __________ တို့ ဖြစ်သည်။",
  4: "စာကြောင်း ၁၈ ရှိ \"This\" ဟူသော စကားလုံးသည် __________ ကို ရည်ညွှန်းသည်။",
  5: "စာကြောင်း ၂၇ ရှိ \"it\" ဟူသော စကားလုံးသည် __________ ကို ရည်ညွှန်းသည်။",
  6: "သုညကို __________ သူများမှာ ဟိန္ဒူ သင်္ချာပညာရှင်များ ဖြစ်သည်။",
  7: "သုညအတွက် အာရပ် စကားလုံးမှာ __________ ဖြစ်သည်။",
};

export const partB3A_translations: Record<number, string> = {
  1: "ဤစာပိုဒ်သည် အဘယ်အကြောင်း ဖြစ်သနည်း။",
  2: "ဂဏန်း အမျိုးအစား နှစ်မျိုး၏ အဓိက ကွာခြားချက်မှာ အဘယ်နည်း။",
  3: "ဂဏန်း နှစ်မျိုးအနက် မည်သည့်အမျိုးအစားက သုံးရ လွယ်ကူသနည်း။ အဘယ်ကြောင့်နည်း။",
  4: "သုညအတွက် ဟိန္ဒူ စကားလုံး၏ အဓိပ္ပာယ်မှာ အဘယ်နည်း။",
  5: "စကေးများနှင့် အချိန်ညှိ ဝင်ရိုးများပေါ်တွင် သုညသည် အဘယ်အရာကို ကိုယ်စားပြုသနည်း။",
  6: "ဟိန္ဒူ သင်္ချာပညာရှင်များသည် သုညကို မည်သည့်အချိန်တွင် ရှာဖွေတွေ့ရှိခဲ့သနည်း။",
  7: "သုညအတွက် အခြား အင်္ဂလိပ် စကားလုံးမှာ အဘယ်နည်း။",
  8: "ယနေ့ခေတ်တွင် သုညကို မည်သို့ အသုံးပြုကြသနည်း။",
};

/* ---------------------------- 3B Vocabulary ---------------------------- */

export const partA3B_translations: Record<number, string> = {
  1: "ရန်သူကို တိုက်ခိုက်ရန် ည သန်းခေါင် ၁၂ နာရီကို __________ အဖြစ် သတ်မှတ်ခဲ့ကြသည်။",
  2: "ဒုတိယ ကမ္ဘာစစ်အတွင်း ဟီရိုရှီးမားသည် ပထမဆုံး __________ ဖြစ်ခဲ့သည်။",
  3: "ပထမဆုံး အစီအစဉ်တစ်ခု ဆုံးဖြတ်ပါ။ ထို့နောက် ၎င်းအပေါ်တွင်သာ __________ ပါ။",
  4: "နည်းပညာအရ ဆိုရလျှင် မည်သည့် အပူချိန်မျှ __________ ထက် နိမ့်၍ မရနိုင်ပါ။",
};

export const partB3B_translations: Record<number, string> = {
  1: "ကျားသည် ကြောင်မျိုးရိုးစု၏ လူသိများသော __________ တစ်ခု ဖြစ်သည်။",
  2: "သူမသည် ကြိုးစားသော်လည်း စိတ်ကူးဉာဏ် သိပ် __________ ပါ။",
  3: "ပင်နီစလင်သည် အလွန် အရေးပါသော ဆေးပညာဆိုင်ရာ __________ တစ်ခု ဖြစ်ခဲ့သည်။",
  4: "ကျွန်ုပ်တို့သည် မတူညီသော __________ နည်းလမ်းများကို သုံးခဲ့သော်လည်း အဖြေ တူညီခဲ့သည်။",
  5: "မနေ့က ပို့ချချက်တွင် ပါမောက္ခက ခက်ခဲသော နှိုင်းရသီအိုရီကို ပုံကြမ်းဖြင့် __________ ခဲ့သည်။",
  6: "ကျောင်းသားများအား လက်တွေ့ကျပြီး __________ နိုင်သော ပန်းတိုင်များ ချမှတ်ရန် ကထိကက အကြံပြုခဲ့သည်။",
  7: "စာမေးပွဲ အောင်ခြင်းနှင့် ဉာဏ်ရည်ကောင်းခြင်းကို __________ ၍ မရပါ။",
  8: "ပတ်ဝန်းကျင် ထိန်းသိမ်းရေး၏ __________ ကို သူက အလေးအနက် ပြောကြားခဲ့သည်။",
  9: "ရူပဗေဒ၊ ဓာတုဗေဒ နှင့် __________ တို့သည် သိပ္ပံဘာသာရပ်များ ဖြစ်သည်။",
  10: "__________ နှစ်မျိုး ရှိသည် — ရောမ နှင့် အာရေဗျ။",
};

export const vocab3B: VocabItem[] = [
  {
    word: "zero",
    pronunciation: "/ˈzɪərəʊ/ — ဇီးရိုး",
    meaningMy: "သုည — \"ဘာမျှ မရှိခြင်း\" ဟု အဓိပ္ပာယ်ရသော်လည်း ရေတွက်ခြင်းတွင် မရှိမဖြစ် လိုအပ်သော ဂဏန်း",
    exampleEn: "The word \"zero\" means \"nothing\", yet it is essential in counting and calculation.",
  },
  {
    word: "numeral",
    pronunciation: "/ˈnjuːmərəl/ — နျူးမရယ်",
    meaningMy: "ဂဏန်းသင်္ကေတ — ဂဏန်းတစ်ခုကို ကိုယ်စားပြု ရေးသားသည့် အမှတ်အသား",
    exampleEn: "There are two kinds of numerals: Roman and Arabic.",
  },
  {
    word: "calculation",
    pronunciation: "/ˌkælkjuˈleɪʃn/ — ကယ်လ်ကျူလေးရှင်း",
    meaningMy: "တွက်ချက်ခြင်း — ဂဏန်းများဖြင့် အဖြေ ရှာဖွေခြင်း",
    exampleEn: "Zero is essential in counting and calculation.",
  },
  {
    word: "equation",
    pronunciation: "/ɪˈkweɪʒn/ — အီကွေးရှင်း",
    meaningMy: "ညီမျှခြင်း — အညီအမျှ ဖြစ်ကြောင်း ပြသော သင်္ချာ ဖော်ပြချက်",
    exampleEn: "For a simple mathematical equation like 100 + 27 = 127 ...",
  },
  {
    word: "illustration",
    pronunciation: "/ˌɪləˈstreɪʃn/ — အီလပ်စထရေးရှင်း",
    meaningMy: "သရုပ်ဖော်ချက် — နားလည်လွယ်စေရန် ပြသည့် ဥပမာ သို့မဟုတ် ပုံ",
    exampleEn: "This illustration should be plain enough to help you see how important zero is.",
  },
  {
    word: "straightforward",
    pronunciation: "/ˌstreɪtˈfɔːwəd/ — စထရိတ်ဖော်ဝဒ်",
    meaningMy: "ရိုးရှင်း လွယ်ကူသော — ရှုပ်ထွေးမှု မရှိသော",
    exampleEn: "You will soon see that the task would no longer be as straightforward.",
  },
  {
    word: "boundary",
    pronunciation: "/ˈbaʊndri/ — ဘောင်းဒရီ",
    meaningMy: "နယ်နိမိတ် — အရာနှစ်ခုကြား ပိုင်းခြားထားသည့် မျဉ်း",
    exampleEn: "\"0\" represents the boundary between the negative and positive numbers.",
  },
  {
    word: "positive",
    pronunciation: "/ˈpɒzətɪv/ — ပေါ့စတစ်",
    meaningMy: "အပေါင်း — သုည အထက်ရှိ ဂဏန်း",
    exampleEn: "Any point above 0°C freezing point is positive.",
  },
  {
    word: "negative",
    pronunciation: "/ˈneɡətɪv/ — နက်ဂတစ်",
    meaningMy: "အနုတ် — သုည အောက်ရှိ ဂဏန်း၊ ဂဏန်းရှေ့တွင် အနုတ်လက္ခဏာ ထည့်၍ ရေးသည်",
    exampleEn: "Any point below 0°C freezing point is negative.",
  },
  {
    word: "freezing point",
    pronunciation: "/ˈfriːzɪŋ pɔɪnt/ — ဖရီးဇင်း ပွိုင့်",
    meaningMy: "ရေခဲမှတ် — ရေ ခဲစပြုသည့် အပူချိန် (၀ ဒီဂရီ စင်တီဂရိတ်)",
    exampleEn: "On a thermometer, any point above the 0°C freezing point is positive.",
  },
  {
    word: "coordinate axes",
    pronunciation: "/kəʊˈɔːdɪnət ˈæksiːz/ — ကိုအော်ဒီနိတ် အက်ဆီးဇ်",
    meaningMy: "အချိန်ညှိ ဝင်ရိုးများ — သင်္ချာတွင် အမှတ်တစ်ခု၏ တည်နေရာကို ဖော်ပြရန် သုံးသော မျဉ်းနှစ်ကြောင်း",
    exampleEn: "This can be seen on the coordinate axes and on many scales.",
  },
  {
    word: "umpire",
    pronunciation: "/ˈʌmpaɪə(r)/ — အမ်ပိုင်ယာ",
    meaningMy: "ဒိုင်လူကြီး — အားကစားပွဲတွင် ဥပဒေအတိုင်း ဆုံးဖြတ်ပေးသူ",
    exampleEn: "At the beginning of a badminton game, the umpire calls out: zero-zero.",
  },
  {
    word: "mathematician",
    pronunciation: "/ˌmæθəməˈtɪʃn/ — မက်သမတီရှင်း",
    meaningMy: "သင်္ချာပညာရှင် — သင်္ချာဘာသာရပ်ကို လေ့လာ သုတေသနပြုသူ",
    exampleEn: "It was the Hindu mathematicians of India who discovered zero.",
  },
  {
    word: "void",
    pronunciation: "/vɔɪd/ — ဗွိုက်",
    meaningMy: "ဟာလာဟင်းလင်း — ဘာမျှ မရှိသော အလွတ်နေရာ",
    exampleEn: "The Hindu word \"śūnya\" means \"empty\", or \"void\".",
  },
  {
    word: "cipher",
    pronunciation: "/ˈsaɪfə(r)/ — ဆိုက်ဖာ",
    meaningMy: "သုည — အာရပ် စကားလုံး \"sifr\" မှ ဆင်းသက်လာသော အင်္ဂလိပ် စကားလုံး",
    exampleEn: "\"Sifr\" became the root word for the English words \"cipher\" and \"zero\".",
  },
];

/* ------------------------------ 3C Grammar ------------------------------ */

export const partA3C_translations: Record<number, string> = {
  1: "ကျွန်ုပ်တို့နိုင်ငံ မြန်မာပြည်ကို ရွှေဘုရားစေတီများ၏ ပြည်ဟု မကြာခဏ ခေါ်ဆိုကြသည်။",
  2: "အင်္ဂလိပ် အက္ခရာတွင် အက္ခရာ နှစ်ဆယ့်ခြောက်လုံး ပါဝင်သည်။",
  3: "ကျွန်ုပ်တို့နိုင်ငံရှိ သစ်ပင်အများစုသည် နွေရာသီတွင် အရွက်များ ကြွေကျကြသည်။",
  4: "ယနေ့ခေတ် ရောဂါများစွာသည် မတူညီသော ဗိုင်းရပ်စ် အမျိုးအစားများကြောင့် ဖြစ်ပွားရသည်။",
  5: "ထိုပြခန်းရှိ ပန်းချီကား အားလုံးကို နာမည်ကျော် မြန်မာ ပန်းချီဆရာများက ရေးဆွဲထားခြင်း ဖြစ်သည်။",
  6: "ညစ်ညမ်းမှုသည် ကျွန်ုပ်တို့ ပတ်ဝန်းကျင်ကို ရေရှည် ထိခိုက်ပျက်စီးစေလျက် ရှိသည်။",
  7: "ရေစက်ငယ်လေးများနှင့် သဲမှုန်ငယ်လေးများသည် ကျယ်ပြန့်သော သမုဒ္ဒရာနှင့် သာယာသော မြေကို ဖြစ်စေသည်။",
  8: "ရှိတ်စပီးယား ရေးသားခဲ့သော ပြဇာတ် နီးပါးအားလုံးသည် လူသိများသည်။",
  9: "အင်္ဂလိပ် သီချင်းတစ်ပုဒ်အရ ဘဝတွင် အကောင်းဆုံး အရာများသည် အခမဲ့ ဖြစ်သည်။",
};

export const partB3C_translations: Record<number, string> = {
  1: "ဒဏ်ရာရသူသည် လမ်းလည်း မလျှောက်နိုင်၊ လှုပ်ရှားလည်း မလှုပ်ရှားနိုင်ပါ။",
  2: "ကျွန်ုပ်တို့ အိမ်သစ်ဝယ်နေကြောင်း ဆွေမျိုးများလည်း မသိ၊ သူငယ်ချင်းများလည်း မသိကြပါ။",
  3: "ကျွန်ုပ်ကို ဖုန်းဆက်ခေါ်လည်း ရသည်၊ အီးမေးလ် ပို့လည်း ရသည်။",
  4: "မိုးလေဝသ ခန့်မှန်းချက်အရ ယနေ့ မိုးအုံ့မည် သို့မဟုတ် မိုးရွာမည် ဖြစ်သည်။",
  5: "အချစ်ကို ဝယ်၍လည်း မရ၊ ရောင်း၍လည်း မရပါ။",
  6: "ထိုစားသောက်ဆိုင်၏ မီနူးတွင် ငါးလည်း မပါ၊ ကျောက်ပုဇွန်လည်း မပါပါ။",
  7: "သင့် မိဘများ သို့မဟုတ် သင့် အုပ်ထိန်းသူနှင့် စကားပြောလိုပါသည်။",
  8: "ငှက်ပျောသီးဖျော်ရည်လည်း မရှိ၊ ပန်းသီးဖျော်ရည်လည်း မရှိပါ။",
  9: "ကျွန်ုပ် ဆံပင်ကို ယနေ့ သို့မဟုတ် မနက်ဖြန် ညှပ်မည်။",
  10: "ထိုကောင်လေးသည် စာအုပ်လည်း မယူလာ၊ အိမ်စာလည်း မလုပ်ခဲ့ပါ။",
};

export const grammar3C = {
  whatMy:
    "ဝါကျတိုင်းတွင် အပိုင်း နှစ်ပိုင်း ရှိပါသည်။ ပထမပိုင်းမှာ ကတ္တား ဖြစ်ပြီး မည်သူ သို့မဟုတ် မည်သည့်အရာအကြောင်း ပြောနေသည်ကို ဖော်ပြပါသည်။ ဒုတိယပိုင်းမှာ ကြိယာပုဒ်စု ဖြစ်ပြီး ထိုကတ္တားအကြောင်း ဘာပြောသည်ကို ဖော်ပြပါသည်။ ကြိယာပုဒ်စုအတွင်း၌ ကြိယာ အမြဲ ပါဝင်ပါသည်။",
  whenMy:
    "ဝါကျတစ်ကြောင်းကို ခွဲခြမ်းစိတ်ဖြာသည့်အခါတိုင်း ကြိယာကို ဦးစွာ ရှာပါ။ ကြိယာ၏ ရှေ့ဘက်ရှိ စကားစုအားလုံးသည် ကတ္တား ဖြစ်ပြီး၊ ကြိယာမှစ၍ နောက်ဆုံးအထိသည် ကြိယာပုဒ်စု ဖြစ်ပါသည်။",
  whyMy:
    "ကတ္တားနှင့် ကြိယာပုဒ်စုကို ခွဲခြားတတ်လျှင် ကြိယာကို ကတ္တားနှင့် ကိုက်ညီအောင် ရွေးချယ်နိုင်ပြီး ဝါကျ ရှည်လျားသည့်တိုင် မှားယွင်းမှု မဖြစ်တော့ပါ။",
  examples: [
    { en: "All the teachers in our school are highly qualified.", phrase: "All the teachers in our school" },
    { en: "The boy who has won the scholarship is from my class.", phrase: "The boy who has won the scholarship" },
    { en: "The books in that bookcase belong to my father.", phrase: "The books in that bookcase" },
  ],
};

export const conjunction3C = {
  whatMy:
    "either ... or နှင့် neither ... nor တို့သည် တွဲဖက်၍သာ သုံးရသော သမ္ဗန္ဓများ ဖြစ်ပါသည်။ either ... or သည် အပြုသဘော ဖြစ်ပြီး ရွေးချယ်စရာ နှစ်ခုအနက် တစ်ခုကို ဆိုလိုပါသည်။ neither ... nor သည် အငြင်းသဘော ဖြစ်ပြီး နှစ်ခုစလုံးကို ငြင်းဆိုပါသည်။",
  whenMy:
    "ရွေးချယ်စရာ နှစ်ခု ပေးလိုသည့်အခါ either ... or ကို သုံးပါ။ နှစ်ခုစလုံး မဟုတ်ကြောင်း ပြောလိုသည့်အခါ neither ... nor ကို သုံးပါ။ neither ... nor တွင် not ကို ထပ်မံ မထည့်ရပါ။ အငြင်းစကားလုံး နှစ်လုံး ဖြစ်သွားပါမည်။",
  whyMy:
    "ဝါကျ နှစ်ကြောင်းကို တစ်ကြောင်းတည်း ပေါင်းစပ်လိုက်ခြင်းဖြင့် ပြောစရာ တိုတောင်း ရှင်းလင်းသွားပြီး စကားပြောလည်း သဘာဝကျ ဖြစ်စေပါသည်။",
  examples: [
    { en: "You can either meet me at home or at the office.", phrase: "either meet me at home or at the office" },
    { en: "Either mum or dad will come to pick you up this afternoon.", phrase: "Either mum or dad" },
    { en: "Neither the blue blouse nor the red one is available in size 4.", phrase: "Neither the blue blouse nor the red one" },
    { en: "I will neither call you nor send you a message after midnight.", phrase: "neither call you nor send you a message" },
  ],
};
