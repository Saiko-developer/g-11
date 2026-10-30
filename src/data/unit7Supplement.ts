// Supplementary Burmese translations, vocabulary, and grammar explanations
// for Unit 7 sections 7A / 7B / 7C. Keyed by section id, mirroring
// `unit1Supplement.ts`, `unit2Supplement.ts`, `unit3Supplement.ts`,
// `unit4Supplement.ts`, `unit5Supplement.ts` and `unit6Supplement.ts`.
// Units 1, 2, 3, 4, 5 and 6 data are never touched by this module.

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

/* ----------------------------- 7A Reading ------------------------------ */

export const partA7A_translations: Record<number, string> = {
  1: "လိုအပ်သည်ထက် ပိုလွန်သော အမြောက်အမြား ပမာဏ",
  2: "မွှေးပျံ့သော သာယာသော အနံ့ ရှိသော",
  3: "အရည်ထဲသို့ နှစ်ပြီး ပြန်ထုတ်ထားသော",
  4: "တူညီသော ရည်မှန်းချက်တစ်ခုဆီသို့ အခြားသူများနှင့်အတူ ပူးပေါင်း လုပ်ဆောင်ခြင်း ပါဝင်သော",
  5: "စျေးကြီးသော",
  6: "(အစားအစာ) ကြွပ်ရွပြီး ခြောက်သွေ့သော",
  7: "၎င်း၏ အမျိုးအစားတွင် တစ်ခုတည်းသော / ထူးခြားသော",
  8: "အသား သို့မဟုတ် ငါးကို ချက်စဉ် ထွက်လာသော အရည်ထဲသို့ ဂျုံမှုန့် ထည့်၍ ပြုလုပ်ထားသော အညိုရောင် အနှစ်ရည်",
  9: "အလွန် ပြုလုပ်ချင်သော အရာကို မပြုလုပ်ဘဲ မိမိကိုယ်ကို ထိန်းချုပ်ခြင်း",
  10: "နေ့တစ်နေ့ သို့မဟုတ် အခါသမယတစ်ခု၏ အရေးပါမှုကို အထူးတစ်စုံတစ်ရာ ပြုလုပ်ခြင်းဖြင့် ဂုဏ်ပြုဖော်ပြခြင်း",
};

export const partB7A_translations: Record<number, string> = {
  1: "လူသားတိုင်းတွင် ________ လက်ဗွေရာ ရှိသည်။",
  2: "မြန်မာ့ဟင်းလျာများ ပြုလုပ်ရာတွင် မွှေးပျံ့သော ________ အပင်များ အမျိုးမျိုးကို အသုံးပြုကြသည်။",
  3: "အဖွားသည် မစားမီ ပေါင်မုန့်ကို ကော်ဖီထဲတွင် ________ လိုက်သည်။",
  4: "ကျွန်ုပ်တို့သည် တီဗီကြည့်ရင်း များသောအားဖြင့် ________ အာလူးကြော်နှင့် ပေါက်ပေါင်းကို စားကြသည်။",
  5: "ကျောင်းသားများသည် အတန်းထဲတွင် အဖွဲ့လိုက် အလုပ်လုပ်ရန် ________ ပြီး သတိရှိကြသည်။",
  6: "သူတို့သည် သားဖြစ်သူ၏ ဘွဲ့ရခြင်းကို ________ ရန် ညစာစားပွဲတစ်ခု ကျင်းပနေကြသည်။",
  7: "ကျွန်ုပ်တို့၏ ခြံသည် သစ်သီးနှင့် ဟင်းသီးဟင်းရွက် ________ ထွက်သည်။",
  8: "သင်သည် ________ သော အလှကုန်များ ဝယ်ရာတွင် ငွေအမြောက်အမြား မသုံးသင့်ပါ။",
  9: "အာလူးထောင်းကို များသောအားဖြင့် ________ နှင့်တွဲ၍ စားကြသည်။",
  10: "တိုးတိုးသည် ချောကလက် ရေခဲမုန့်ကို အလွန် နှစ်သက်သဖြင့် မြင်တိုင်း မစားဘဲ ________ မနိုင်ချေ။",
};

export const partC7A_translations: Record<number, string> = {
  1: "အလှူပွဲနီးပါးတိုင်းတွင် မုန့်ဟင်းခါးသည် မဖြစ်မနေ လိုအပ်ကြောင်း မည်သည့် ဝါကျက ဖော်ပြသနည်း။",
  2: "ထမနဲ ပြုလုပ်ရန် မည်သည့် ပါဝင်ပစ္စည်းများကို အသုံးပြုကြသနည်း။",
  3: "ပြီးပြည့်စုံသော ထမနဲရရှိရန် ကျွန်ုပ်တို့ ဘာများ လိုအပ်သနည်း။",
  4: "မုန့်လင်မယားကို ထိုအမည်ဖြင့် အဘယ်ကြောင့် ခေါ်ကြသနည်း။",
  5: "ကျွန်ုပ်တို့သည် ဘူးသီးကြော်ကို များသောအားဖြင့် မည်သည့်အရာနှင့် တွဲ၍ စားကြသနည်း။",
  6: "အချို့က ဂုဏ်ပြုကျင်းပရန် သရေစာများ ပြုလုပ်ကြသည်။ ထိုနည်းတူ ကျင်းပသည့် မြန်မာ့ဓလေ့ သရေစာ တစ်ခုကို ဥပမာပေးပါ။",
  7: "စာပိုဒ်တွင် ဖော်ပြထားသော မြန်မာ့သရေစာများ၏ အသုံးအများဆုံး ပါဝင်ပစ္စည်းမှာ အဘယ်နည်း။",
  8: "ကောက်ညှင်းပေါင်းကို သင်နှစ်သက်ပါသလား။ သင့်အဖြေအတွက် အကြောင်းပြချက်များ ပေးပါ။",
  9: "မုန့်ဟင်းခါးရည် ပြုလုပ်ရာတွင် အသုံးပြုသော ပါဝင်ပစ္စည်းများအနက် မည်သည့်အရာက အရေးအကြီးဆုံးဟု သင်ထင်သနည်း။",
  10: "စာပိုဒ်တွင် ဖော်ပြထားသော မြန်မာ့သရေစာများအနက် မည်သည့်အရာကို သင်အကြိုက်ဆုံးလဲ။ အဘယ်ကြောင့်နည်း။",
};

/* ---------------------------- 7B Vocabulary ---------------------------- */

export const partB7B_translations: Record<number, string> = {
  1: "အနုပညာရှင်သည် ကွယ်လွန်မှသာ ကျော်ကြားမှုကို ရရှိခဲ့သည်။ သူသည် သူ၏ နောက်ဆုံးလက်ရာအတွက် ________ ဖြစ်လာခဲ့သည်။",
  2: "ကျွန်ုပ်တို့ မိသားစုတွင် နှစ်သစ်ကူးနေ့တွင် ပါတီပွဲ ကျင်းပလေ့ရှိသည့် အစဉ်အလာ တစ်ခု ရှိသည်။ ထိုနေ့တွင် ကောက်ညှင်းပေါင်း ပြုလုပ်ခြင်းသည် ________ ဖြစ်သည်။",
  3: "ဤစားသောက်ဆိုင်၏ မီနူးသည် ရာသီပေါ်မူတည်၍ ပြောင်းလဲသည်။ ________ ဟင်းလျာများကို ရာသီအမျိုးမျိုးတွင် ရရှိနိုင်သည်။",
  4: "အာလူးကြော်တွင် အာဟာရ သိပ်မပါဝင်လှပါ။ အခွံမာသီးနှင့် သစ်သီးများမှာ ပို၍ ________ ဖြစ်သည်။",
  5: "ကျောင်းသား အားလုံးသည် ကျောင်းစာကြည့်တိုက်သို့ ဝင်ရောက်ခွင့် ရှိသည်။ သူတို့ လိုအပ်သော အချက်အလက်များသည် သူတို့အတွက် ________ ဖြစ်သည်။",
  6: "ကျွန်ုပ်တို့သည် ပုဂံခရီးစဉ်ကို ပျော်ရွှင်စွာ ခံစားခဲ့ရသည်။ ၎င်းသည် တကယ့်ကို ________ ခဲ့သည်။",
  7: "အလွန် ________ သော မုန်တိုင်းတစ်ခုသည် မနေ့ညက ကမ်းရိုးတန်းဒေသကို ဝင်ရောက် တိုက်ခတ်ခဲ့သည်။ သင်္ဘောများသည် ၎င်း၏ စွမ်းအားကို မတွန်းလှန်နိုင်ခဲ့ကြချေ။",
  8: "သူမသည် သွားလေရာရာ နေရာတိုင်းတွင် လူများကို အမြဲ ဆွဲဆောင်နိုင်သည်။ သူမသည် တကယ့်ကို ________ သော အမျိုးသမီးတစ်ဦး ဖြစ်သည်။",
  9: "သူမ၏ အစားအသောက် အစီအစဉ်သစ်သည် သူမအတွက် အံ့ဖွယ်ရလဒ်များ ဖြစ်ထွန်းစေခဲ့သည်။ ၎င်းသည် ________ ဖြစ်သည်။",
  10: "သင်၏ အင်္ဂလိပ်စာ တိုးတက်မှုကို သတိပြုမိသဖြင့် ဝမ်းသာပါသည် — အဘယ်ကြောင့်ဆိုသော် သင့်၏ တိုးတက်မှုသည် အတော်ပင် ________ သောကြောင့် ဖြစ်သည်။",
};

export const vocab7B: VocabItem[] = [
  {
    word: "traditional",
    pronunciation: "/trəˈdɪʃənl/ — ထရဒစ်ရှ်နယ်",
    meaningMy: "အစဉ်အလာနှင့်ဆိုင်သော — ရိုးရာဓလေ့အရ ပြုလုပ်သော",
    exampleEn: "It is traditional to make steamed glutinous rice on that day.",
  },
  {
    word: "nutritional",
    pronunciation: "/njuːˈtrɪʃənl/ — နယူထရစ်ရှ်နယ်",
    meaningMy: "အာဟာရဆိုင်ရာ",
    exampleEn: "Nuts and fruit are more nutritional than potato chips.",
  },
  {
    word: "national",
    pronunciation: "/ˈnæʃnəl/ — နက်ရှ်နယ်",
    meaningMy: "နိုင်ငံတော်ဆိုင်ရာ — တစ်နိုင်ငံလုံးနှင့် ဆက်စပ်သော",
    exampleEn: "Mont-hin-gah is almost always a must in alms-giving ceremonies.",
  },
  {
    word: "seasonal",
    pronunciation: "/ˈsiːzənl/ — ဆီဇင်နယ်",
    meaningMy: "ရာသီအလိုက် ဖြစ်သော",
    exampleEn: "Seasonal dishes are available in different seasons.",
  },
  {
    word: "competitive",
    pronunciation: "/kəmˈpetɪtɪv/ — ခန်ပက်တစ်တစ်",
    meaningMy: "ပြိုင်ဆိုင်မှု ရှိသော",
    exampleEn: "Hta-ma-ne-making competitions are held in many parts of the country.",
  },
  {
    word: "effective",
    pronunciation: "/ɪˈfektɪv/ — အီဖက်တစ်",
    meaningMy: "ထိရောက်သော — အကျိုးသက်ရောက်မှု ရှိသော",
    exampleEn: "Her new diet programme is very effective.",
  },
  {
    word: "reflective",
    pronunciation: "/rɪˈflektɪv/ — ရီဖလက်တစ်",
    meaningMy: "ပြန်လှန်သော — ရောင်ပြန်ဟပ်သော",
    exampleEn: "A mirror is a reflective surface.",
  },
  {
    word: "attractive",
    pronunciation: "/əˈtræktɪv/ — အက်ထရက်တစ်",
    meaningMy: "ဆွဲဆောင်မှုရှိသော — စွဲမက်ဖွယ်ကောင်းသော",
    exampleEn: "She is really an attractive lady.",
  },
  {
    word: "various",
    pronunciation: "/ˈveəriəs/ — ဗေရီရက်စ်",
    meaningMy: "အမျိုးမျိုးသော — အများအပြားသော",
    exampleEn: "Various spicy herbs are used in making Myanmar dishes.",
  },
  {
    word: "nutritious",
    pronunciation: "/njuːˈtrɪʃəs/ — နယူထရစ်ရှပ်စ်",
    meaningMy: "အာဟာရ ပြည့်ဝသော",
    exampleEn: "Mont-lin-ma-yar is delicious and nutritious.",
  },
  {
    word: "famous",
    pronunciation: "/ˈfeɪməs/ — ဖေမာစ်",
    meaningMy: "ကျော်ကြားသော — နာမည်ကြီးသော",
    exampleEn: "He became famous for his latest work.",
  },
  {
    word: "adventurous",
    pronunciation: "/ədˈventʃərəs/ — အဒ်ဗင်ချာရာစ်",
    meaningMy: "စွန့်စားမှု ရှိသော",
    exampleEn: "An adventurous traveller enjoys exploring new places.",
  },
  {
    word: "successful",
    pronunciation: "/səkˈsesfl/ — ဆက်ဆက်စ်ဖု",
    meaningMy: "အောင်မြင်သော",
    exampleEn: "She is a successful businesswoman.",
  },
  {
    word: "powerful",
    pronunciation: "/ˈpaʊəfl/ — ပါဝါဖု",
    meaningMy: "အားကြီးသော — စွမ်းအားရှိသော",
    exampleEn: "A very powerful storm hit the coastal region last night.",
  },
  {
    word: "colourful",
    pronunciation: "/ˈkʌləfl/ — ကာလာဖု",
    meaningMy: "အရောင်စုံသော — ရောင်စုံသော",
    exampleEn: "The festival stalls are colourful and lively.",
  },
  {
    word: "forgetful",
    pronunciation: "/fəˈɡetfl/ — ဖေဂတ်ဖု",
    meaningMy: "မေ့လွယ်သော — မေ့တတ်သော",
    exampleEn: "My grandfather is quite forgetful nowadays.",
  },
  {
    word: "accessible",
    pronunciation: "/əkˈsesəbl/ — အက်ဆက်စီဘယ်",
    meaningMy: "ဝင်ရောက်ရလွယ်ကူသော — ရယူနိုင်သော",
    exampleEn: "The information they need is accessible to them.",
  },
  {
    word: "horrible",
    pronunciation: "/ˈhɒrəbl/ — ဟောရာဘယ်",
    meaningMy: "ကြောက်မက်ဖွယ်ကောင်းသော — ဆိုးဝါးသော",
    exampleEn: "The storm caused a horrible disaster.",
  },
  {
    word: "digestible",
    pronunciation: "/daɪˈdʒestəbl/ — ဒိုင်ဂျက်စတီဘယ်",
    meaningMy: "အစာကြေလွယ်သော",
    exampleEn: "Steamed food is light and easily digestible.",
  },
  {
    word: "responsible",
    pronunciation: "/rɪˈspɒnsəbl/ — ရီစပွန်စီဘယ်",
    meaningMy: "တာဝန်ရှိသော — တာဝန်ယူတတ်သော",
    exampleEn: "Students are responsible and attentive to do the group work.",
  },
  {
    word: "available",
    pronunciation: "/əˈveɪləbl/ — အဗေးလာဘယ်",
    meaningMy: "ရရှိနိုင်သော — အသုံးပြုနိုင်သော",
    exampleEn: "Mont-hin-gah is available in any city, town and village.",
  },
  {
    word: "enjoyable",
    pronunciation: "/ɪnˈdʒɔɪəbl/ — အင်ဂျွိုင်ယာဘယ်",
    meaningMy: "ပျော်စရာကောင်းသော — နှစ်သက်ဖွယ်ကောင်းသော",
    exampleEn: "The trip to Bagan was really enjoyable.",
  },
  {
    word: "comfortable",
    pronunciation: "/ˈkʌmftəbl/ — ကမ်ဖိုတာဘယ်",
    meaningMy: "သက်တောင့်သက်သာရှိသော — သက်သောင့်သက်သာဖြစ်သော",
    exampleEn: "He made himself comfortable on the soft sofa.",
  },
  {
    word: "reasonable",
    pronunciation: "/ˈriːznəbl/ — ရီစနာဘယ်",
    meaningMy: "ကျိုးကြောင်းဆီလျော်သော — သင့်တင့်သော",
    exampleEn: "The price of mont-hin-gah is quite reasonable.",
  },
];

/* ------------------------------ 7C Grammar ----------------------------- */

export const partA7C_translations: Record<number, string> = {
  1: "ဇော်ဇော်သည် ယခုအချိန်တွင် ကားကို ပြုပြင်နေသည်။",
  2: "ရဲများသည် ဆိုင်ခိုးမှုအတွက် ထိုလူကို ဖမ်းဆီးခဲ့သည်။",
  3: "စားပွဲထိုးများသည် ဧည့်သည်များ မရောက်မီ စားပွဲများကို ခင်းကျင်းပြီးသား ဖြစ်ခဲ့သည်။",
  4: "သိပ္ပံပညာရှင်များသည် သဘာဝဘေးအန္တရာယ်များဆိုင်ရာ အချက်အလက်များကို အမြဲ စုဆောင်းကြသည်။",
  5: "တောမီးတစ်ခုသည် မိနစ်အနည်းငယ်အတွင်း မြေဧရိယာ ကျယ်ပြန့်စွာကို ဖျက်ဆီးနိုင်သည်။",
  6: "အီဂျစ်လူမျိုးများသည် သူတို့၏ ဘုရင်များ၏ အမည်များနှင့် ဇာတ်လမ်းများကို ထာဝရ တည်တံ့စေရန် ပိရမစ်များကို တည်ဆောက်ခဲ့ကြသည်။",
  7: "အင်တာနက်သည် အချက်အလက်များ ဖလှယ်နိုင်စေခြင်းဖြင့် လူများကို စွမ်းရည်မြှင့်တင်ပေးသည်။",
  8: "စွန့်ဦးတီထွင်သူများသည် ဖောက်သည်များ လိုချင်သည်ဟု ပြောသည့်အရာများကို အခြေခံ၍ ထုတ်ကုန်များကို ဒီဇိုင်းဆွဲသင့်သည်။",
  9: "ဗိုင်းရပ်စ် ပညာရှင်များသည် လူများကို ရောဂါကူးစက်ခြင်းမှ မည်သို့ တားဆီးရမည်ကို ရှာဖွေရန် ဗိုင်းရပ်စ်များကို လေ့လာကြသည်။",
  10: "သိပ္ပံပညာရှင်များသည် ကူးစက်ရောဂါများကို လေ့လာရန် ချင်ပန်ဇီများကို အသုံးပြုခဲ့ကြသည်။",
};

export const partB7C_translations: Record<number, string> = {
  1: "ဘိန်းမုန့် သို့မဟုတ် မြန်မာမုန့်ကို ဆန်မှုန့်၊ ထန်းလျက်၊ ကြက်ဥ၊ အုန်းသီးစိမ်းနှင့် မြေပဲတို့မှ ပြုလုပ်ပြီး ဘိန်းစေ့များဖြင့် အလှဆင်ထားသည်။",
  2: "ဆန်မှုန့်ကို ထန်းလျက်နှင့် ________ သည်။",
  3: "ဤမုန့်အတွက် မုန့်ရည် ပြုလုပ်ရန် ________ သည်။",
  4: "ဦးစွာ ဒယ်အိုးတစ်လုံးကို မုန့်မကပ်စေရန် စားသုံးဆီ အနည်းငယ်ဖြင့် ________ သည်။",
  5: "ထို့နောက် မုန့်ရည်တစ်ဇွန်းကို ဒယ်အိုးထဲသို့ ________ သည်။",
  6: "ထို့နောက် အုန်းသီးစိမ်းနှင့် ဘိန်းစေ့များကို မုန့်ရည်ပေါ်တွင် ________ သည်။",
  7: "ဒယ်အိုးကို မီးဖွင့်ထားသော မီးဖိုပေါ်တွင် ________ ပြီး မီးသွေးလုံးများ တင်ထားသော အဖုံးဖြင့် အုပ်ထားသည်။",
  8: "တစ်နည်းဆိုရသော် မုန့်ကို အောက်နှင့် အပေါ်မှ အပူဖြင့် ________ သည်။",
  9: "ဘိန်းမုန့်ကို လက်ဖက်ရည် သို့မဟုတ် ကော်ဖီနှင့် ________ သည်။",
  10: "၎င်းသည် မြန်မာနိုင်ငံရှိ ကျေးလက်နှင့် မြို့ပြနေ ပြည်သူများက ________ သော အလွန် အသုံးများသည့် နံနက်စာ တစ်ခု ဖြစ်သည်။",
};

export const grammar7C = {
  whatMy:
    "Active Voice (ပြုလုပ်သူအလေးပေးသော အသံ) တွင် ပြုလုပ်သူ (doer / agent) ကို ဝါကျ၏ အကြောင်းခံအဖြစ် ထားပြီး ခံရသူ (recipient) ကို ကံအဖြစ် ထားပါသည်။ Passive Voice (ခံရသူအလေးပေးသော အသံ) တွင် ခံရသူကို ဝါကျ၏ အကြောင်းခံအဖြစ် ထားကာ passive verb = be + V3 (past participle) ဖြင့် ဖွဲ့စည်းပါသည်။",
  whenMy:
    "Passive Voice ကို အမှုကိစ္စ၏ ခံရသူ (recipient) ကို အလေးပေးလိုသည့်အခါ၊ ပြုလုပ်သူကို မသိရသည့်အခါတွင် အသုံးပြုပါသည်။ ပြုလုပ်သူကို ဖော်ပြလိုလျှင် 'by + agent' ဖြင့် ထည့်သွင်းနိုင်သည်။",
  whyMy:
    "တင်းစ်တစ်ခုစီအလိုက် 'be' ၏ ပုံစံကို ပြောင်းလဲရပြီး passive verb = be + V3 ပုံစံဖြင့် ဖွဲ့ပါသည်။ Present perfect continuous, past perfect continuous, future continuous နှင့် future perfect continuous တို့သည် passive voice တွင် အသုံးပြုမှု နည်းပါးသောကြောင့် ချန်လှပ်ထားပါသည်။",
  examples: [
    { en: "Daw Lay May cleans the kitchen every Sunday.", phrase: "cleans" },
    { en: "The kitchen is cleaned by Daw Lay May every Sunday.", phrase: "is cleaned" },
    { en: "The letter was sent to the wrong address by Nwe Ni.", phrase: "was sent" },
  ],
};

/* ------------------ 7A Sentence Structure Breakdowns ------------------- */
// Rules for this data (identical to the Unit 6 standards):
//  • Grammar tags are English only; every translation string is pure Burmese.
//  • Auxiliary verbs, WH-words, subjects and main verbs are separate cars —
//    a subject is never merged with its verb.
//  • Single articles / single prepositions are never their own car; they
//    travel inside the complete phrase they belong to.
//  • Translations follow Burmese SOV order, phrase by phrase.

const DEF_INTRO7 =
  "ဤအဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို အပိုင်းလိုက် ခွဲကြည့်ပါ — အဓိက စကားစု၊ ကြိယာ၊ ဖြည့်စွက်စကားလုံး ဟူ၍ ဖြစ်သည်။";
const DEF_NOTE7 =
  "ပုံစံ: နာမ်/ကြိယာစကားစု → ဖြည့်စွက်စကားလုံး ။ 'that is ...' ကဲ့သို့သော ဝိဘတ်စကားစုကို စကားလုံးတစ်လုံးချင်း မခွဲဘဲ တစ်ခုလုံးအဖြစ် မြန်မာလို ပြန်ပါ။";
const SV_INTRO7 =
  "ဤဝါကျကို ကတ္တား → ကြိယာ → ကံ အစီအစဉ်ဖြင့် ခွဲကြည့်ပါ။";
const SV_NOTE7 =
  "ကွက်လပ်ကို ပန်းတိုင်အဖြစ် သတ်မှတ်ပြီး ကျန်အပိုင်းများကို မြန်မာစကားစဉ်အတိုင်း ပြန်ဆိုပါ။ ဝိဘတ်စကားစုကို တစ်လုံးချင်း မခွဲပါနှင့်။";
const WH_INTRO7 =
  "မေးခွန်းဝါကျဖြစ်သဖြင့် မေးခွန်းစကားလုံးက ရှေ့ဆုံးတွင် ရပ်ပြီး အကူကြိယာက ကတ္တားရှေ့သို့ ရွှေ့သွားသည်။";
const WH_NOTE7 =
  "ပုံစံ: မေးခွန်းစကားလုံး → အကူကြိယာ → ကတ္တား → ကြိယာ ။ မြန်မာလို ပြန်ဆိုသည့်အခါ ကြိယာကို နောက်ဆုံးတွင် ထားပါ။";

// Exercise A — dictionary definitions. Answers: abundance, aromatic, dipped,
// cooperative, costly, crispy, unique, gravy, resist, celebrate.
export const partA7A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "a large quantity that", translation: "များပြားသော ပမာဏတစ်ခုဖြစ်သည့်", tag: "Noun Subject / Phrase" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "more than enough", translation: "လုံလောက်သည်ထက် ပိုသော", tag: "Complement" },
    ],
  },
  2: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "having", translation: "ပါရှိသော", tag: "Gerund Verb" },
      { word: "a pleasant noticeable smell", translation: "သာယာပြီး ထင်ရှားသော အနံ့တစ်ခုကို", tag: "Noun Phrase" },
    ],
  },
  3: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "put into a liquid", translation: "အရည်ထဲသို့ နှစ်ထားသော", tag: "Passive Verb Phrase" },
      { word: "and taken out again", translation: "ထို့နောက် ပြန်ထုတ်ထားသော", tag: "Coordinated Verb Phrase" },
    ],
  },
  4: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "involving", translation: "ပါဝင်စေသော", tag: "Gerund Verb" },
      { word: "doing something together with others", translation: "အခြားသူများနှင့် အတူတကွ လုပ်ဆောင်ခြင်း", tag: "Noun Phrase" },
      { word: "towards a shared aim", translation: "တူညီသော ရည်မှန်းချက်တစ်ခုဆီသို့", tag: "Prepositional Phrase" },
    ],
  },
  5: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "expensive", translation: "စျေးကြီးသော", tag: "Adjective" },
    ],
  },
  6: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "(of food)", translation: "(အစားအစာ၏)", tag: "Context Note" },
      { word: "pleasantly hard and dry", translation: "စားရာ ကောင်းအောင် ကြွပ်ရွပြီး ခြောက်သွေ့သော", tag: "Adjective Phrase" },
    ],
  },
  7: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "being", translation: "ဖြစ်သော", tag: "Linking Verb" },
      { word: "the only one of its kind", translation: "၎င်း၏ အမျိုးအစားတွင် တစ်ခုတည်းသော", tag: "Complement" },
    ],
  },
  8: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "brown sauce", translation: "အညိုရောင် အနှစ်ရည်", tag: "Noun Subject" },
      { word: "made by adding flour", translation: "ဂျုံမှုန့် ထည့်၍ ပြုလုပ်ထားသော", tag: "Passive Participle Phrase" },
      { word: "to the juices that come from meat or fish", translation: "အသား သို့မဟုတ် ငါးမှ ထွက်လာသော အရည်ထဲသို့", tag: "Prepositional Phrase" },
      { word: "while cooking", translation: "ချက်စဉ်", tag: "Adverbial Clause" },
    ],
  },
  9: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "stop yourself", translation: "မိမိကိုယ်ကို ထိန်းချုပ်ခြင်း", tag: "Main Verb Phrase" },
      { word: "from doing something", translation: "အရာတစ်ခု မပြုလုပ်ဘဲ", tag: "Prepositional Phrase" },
      { word: "you very much want to do", translation: "အလွန် ပြုလုပ်ချင်သော", tag: "Relative Clause" },
    ],
  },
  10: {
    introMy: DEF_INTRO7,
    noteMy: DEF_NOTE7,
    cars: [
      { word: "show", translation: "ဖော်ပြခြင်း", tag: "Main Verb" },
      { word: "that a day or an event is important", translation: "နေ့တစ်နေ့ သို့မဟုတ် အခါသမယတစ်ခု အရေးပါကြောင်း", tag: "Noun Clause" },
      { word: "by doing something special on it", translation: "ထိုအချိန်တွင် အထူးတစ်စုံတစ်ရာ ပြုလုပ်ခြင်းဖြင့်", tag: "Prepositional Phrase" },
    ],
  },
};

// Exercise B — fill-in-the-blank sentences. The blank car keeps the placeholder
// "________" so the student sees exactly where the target word belongs.
export const partB7A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Every human being", translation: "လူသားတိုင်းတွင်", tag: "Noun Subject" },
      { word: "has", translation: "ရှိသည်", tag: "Main Verb" },
      { word: "a ________ fingerprint", translation: "________ လက်ဗွေရာ", tag: "Noun Object" },
    ],
  },
  2: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Various ________ herbs", translation: "မွှေးပျံ့သော ________ အပင်များ အမျိုးမျိုးကို", tag: "Noun Subject" },
      { word: "are used", translation: "အသုံးပြုကြသည်", tag: "Passive Verb" },
      { word: "in making Myanmar dishes", translation: "မြန်မာ့ဟင်းလျာများ ပြုလုပ်ရာတွင်", tag: "Prepositional Phrase" },
    ],
  },
  3: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Grandma", translation: "အဖွားသည်", tag: "Noun Subject" },
      { word: "________", translation: "________ လိုက်သည်", tag: "Main Verb" },
      { word: "the bread", translation: "ပေါင်မုန့်ကို", tag: "Noun Object" },
      { word: "into her coffee", translation: "သူမ၏ ကော်ဖီထဲသို့", tag: "Prepositional Phrase" },
      { word: "before eating it", translation: "မစားမီ", tag: "Adverbial Clause" },
    ],
  },
  4: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "We", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "usually eat", translation: "များသောအားဖြင့် စားကြသည်", tag: "Adverb + Main Verb" },
      { word: "________ potato chips and popcorn", translation: "________ အာလူးကြော်နှင့် ပေါက်ပေါင်းကို", tag: "Noun Object" },
      { word: "while watching TV", translation: "တီဗီကြည့်ရင်း", tag: "Adverbial Clause" },
    ],
  },
  5: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Students", translation: "ကျောင်းသားများသည်", tag: "Noun Subject" },
      { word: "are ________ and attentive", translation: "________ ပြီး သတိရှိကြသည်", tag: "Linking Verb + Complement" },
      { word: "to do the group work", translation: "အဖွဲ့လိုက် အလုပ်လုပ်ရန်", tag: "Infinitive Phrase" },
      { word: "in class", translation: "အတန်းထဲတွင်", tag: "Prepositional Phrase" },
    ],
  },
  6: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "They", translation: "သူတို့သည်", tag: "Noun Subject" },
      { word: "are having a dinner party", translation: "ညစာစားပွဲတစ်ခု ကျင်းပနေကြသည်", tag: "Main Verb Phrase" },
      { word: "to ________", translation: "________ ရန်", tag: "Infinitive of Purpose" },
      { word: "their son's graduation", translation: "သားဖြစ်သူ၏ ဘွဲ့ရခြင်းကို", tag: "Noun Phrase" },
    ],
  },
  7: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Our farm", translation: "ကျွန်ုပ်တို့၏ ခြံသည်", tag: "Noun Subject" },
      { word: "produces", translation: "ထွက်သည်", tag: "Main Verb" },
      { word: "an ________ of fruit and vegetables", translation: "်သီးနှင့် ဟင်းသီးဟင်းရွက် ________ ကို", tag: "Noun Object" },
    ],
  },
  8: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "You", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "shouldn't spend a lot of money", translation: "ငွေအမြောက်အမြား မသုံးသင့်ပါ", tag: "Verb Phrase" },
      { word: "on buying ________ cosmetics", translation: "________ သော အလှကုန်များ ဝယ်ရာတွင်", tag: "Prepositional Phrase" },
    ],
  },
  9: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Mashed potatoes", translation: "အာလူးထောင်းကို", tag: "Noun Subject" },
      { word: "are often eaten", translation: "များသောအားဖြင့် တွဲ၍ စားကြသည်", tag: "Passive Verb" },
      { word: "with ________", translation: "________ နှင့်", tag: "Prepositional Phrase" },
    ],
  },
  10: {
    introMy: SV_INTRO7,
    noteMy: SV_NOTE7,
    cars: [
      { word: "Toe Toe", translation: "တိုးတိုးသည်", tag: "Noun Subject" },
      { word: "likes chocolate ice cream so much", translation: "ချောကလက် ရေခဲမုန့်ကို အလွန်ှစ်သက်သဖြင့်", tag: "Main Verb Phrase" },
      { word: "he can't ________ it", translation: "မစားဘဲ ________ မနိုင်ချေ", tag: "Verb Phrase" },
      { word: "whenever he sees it", translation: "မြင်တိုင်း", tag: "Adverbial Clause" },
    ],
  },
};

// Exercise C — full-sentence comprehension questions (mostly WH-questions).
export const partC7A_breakdowns: Record<number, SentenceBreakdown> = {
  1: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Which sentence", translation: "မည်သည့် ဝါကျက", tag: "WH-Question Phrase" },
      { word: "tells you", translation: "သင့်အား ဖော်ပြသည်", tag: "Main Verb" },
      { word: "that mont-hin-gah is essential", translation: "မုန့်ဟင်းခါး မဖြစ်မနေ လိုအပ်ကြောင်း", tag: "Noun Clause" },
      { word: "in almost every ceremony in Myanmar", translation: "မြန်မာနိုင်ငံ၏ အလှူပွဲနီးပါးတိုင်းတွင်", tag: "Prepositional Phrase" },
    ],
  },
  2: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "What ingredients", translation: "မည်သည့် ပါဝင်ပစ္စည်းများကို", tag: "WH-Question Phrase" },
      { word: "are used", translation: "အသုံးပြုကြသနည်း", tag: "Passive Verb" },
      { word: "to make hta-ma-ne", translation: "ထမနဲ ပြုလုပ်ရန်", tag: "Infinitive Phrase" },
    ],
  },
  3: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "What", translation: "ဘာများကို", tag: "WH-Question Word" },
      { word: "do", translation: "နည်း", tag: "Auxiliary Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့", tag: "Noun Subject" },
      { word: "need", translation: "လိုအပ်", tag: "Main Verb" },
      { word: "in order to get perfect hta-ma-ne", translation: "ပြီးပြည့်စုံသော ထမနဲ ရရှိရန်", tag: "Infinitive Phrase" },
    ],
  },
  4: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Why", translation: "အဘယ်ကြောင့်", tag: "WH-Question Word" },
      { word: "is", translation: "ခံရသနည်း", tag: "Auxiliary Verb" },
      { word: "mont-lin-ma-yar", translation: "မုန့်လင်မယားကို", tag: "Noun Subject" },
      { word: "given that name", translation: "ထိုအမည်ဖြင့် ခေါ်ဝေါ်", tag: "Passive Verb Phrase" },
    ],
  },
  5: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "What", translation: "မည်သည့်အရာနှင့်", tag: "WH-Question Word" },
      { word: "do", translation: "နည်း", tag: "Auxiliary Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "usually eat", translation: "များသောအားဖြင့် တွဲ၍ စား", tag: "Main Verb Phrase" },
      { word: "bu-thee-gyaw", translation: "ဘသီးကြော်ကို", tag: "Noun Object" },
    ],
  },
  6: {
    introMy: SV_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Some make snacks to celebrate", translation: "အချို့က ဂုဏ်ပြုကျင်းပရန် သရေစာများ ပြုလုပ်ကြသည်", tag: "Context Sentence" },
      { word: "Give", translation: "ဥပမာပေးပါ", tag: "Imperative Verb" },
      { word: "an example of a Myanmar tradition", translation: "မြန်မာ့ဓလေ့တစ်ခု၏ ဥပမာတစ်ခုကို", tag: "Noun Object" },
      { word: "of snacking to celebrate", translation: "ဂုဏ်ပြုကျင်းပရန် သရေစာ ပြုလုပ်ခြင်းပိုင်းဆိုင်ရာ", tag: "Noun Phrase Modifier" },
    ],
  },
  7: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "What", translation: "အဘယ်နည်း", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်", tag: "Linking Verb" },
      { word: "the common ingredient of Myanmar snacks", translation: "မြန်မာ့သရေစာများ၏ အသုံးအများဆုံး ပါဝင်ပစ္စည်း", tag: "Noun Subject" },
      { word: "mentioned in the passage", translation: "စာပိုဒ်တွင် ဖော်ပြထားသော", tag: "Passive Participle Phrase" },
    ],
  },
  8: {
    introMy: SV_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Do", translation: "လား", tag: "Auxiliary Verb" },
      { word: "you", translation: "သင်", tag: "Noun Subject" },
      { word: "like", translation: "နှစ်သက်", tag: "Main Verb" },
      { word: "steamed glutinous rice", translation: "ကောက်ညှင်းပေါင်းကို", tag: "Noun Object" },
      { word: "Give reasons for your answer", translation: "သင့်အဖြေအတွက် အကြောင်းပြချက်များ ပေးပါ", tag: "Imperative Sentence" },
    ],
  },
  9: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Among the ingredients used in making mont-hin-gah", translation: "မုန့်ဟင်းခါးရည် ပြုလုပ်ရာတွင် အသုံးပြုသော ပါဝင်ပစ္စည်းများအနက်", tag: "Prepositional Phrase" },
      { word: "what", translation: "မည်သည့်အရာက", tag: "WH-Question Word" },
      { word: "do you think", translation: "သင်ထင်", tag: "Inserted Clause" },
      { word: "is the most important", translation: "အရေးအကြီးဆုံး ဖြစ်သနည်း", tag: "Linking Verb Phrase" },
    ],
  },
  10: {
    introMy: WH_INTRO7,
    noteMy: WH_NOTE7,
    cars: [
      { word: "Out of the Myanmar snacks mentioned in the passage", translation: "စာပိုဒ်တွင် ဖော်ပြထားသော မြန်မာ့သရေစာများအနက်မှ", tag: "Prepositional Phrase" },
      { word: "which", translation: "မည်သည့်အရာကို", tag: "WH-Question Word" },
      { word: "do you like most", translation: "သင် အကြိုက်ဆုံး ဖြစ်သနည်း", tag: "Main Verb Phrase" },
      { word: "Why", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
  },
};
