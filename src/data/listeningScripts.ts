/** Timed bilingual scripts for each unit's Listening & Speaking (D) track. Times are in seconds. */
export type ListeningLine = { speaker: string; en: string; my: string; start: number; end: number };
export type ListeningScript = { multiSpeaker: boolean; lines: ListeningLine[] };

export const LISTENING_SCRIPTS: Record<number, ListeningScript> = {
 "1": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "One. Language.",
    "my": "၁။ ဘာသာစကား။",
    "start": 0.31,
    "end": 2.42
   },
   {
    "speaker": "Narrator",
    "en": "Here are seven most widely spoken languages in the world.",
    "my": "ကမ္ဘာပေါ်မှာ အသုံးအများဆုံး ဘာသာစကား (၇) မျိုးကို ဖော်ပြပေးထားပါတယ်။",
    "start": 2.42,
    "end": 8.95
   },
   {
    "speaker": "Narrator",
    "en": "English is the most widely spoken language because over one billion people in the world are using it.",
    "my": "ကမ္ဘာတစ်ဝန်းမှာ လူသန်းပေါင်း တစ်ထောင်ကျော် အသုံးပြုနေကြတာကြောင့် အင်္ဂလိပ်စာဟာ အသုံးအများဆုံး ဘာသာစကား ဖြစ်ပါတယ်။",
    "start": 8.95,
    "end": 22.05
   },
   {
    "speaker": "Narrator",
    "en": "Second is Chinese, and it also has over one billion total speakers.",
    "my": "ဒုတိယကတော့ တရုတ်ဘာသာစကား ဖြစ်ပြီး ပြောဆိုသူ စုစုပေါင်း သန်းတစ်ထောင်ကျော် ရှိပါတယ်။",
    "start": 22.05,
    "end": 29.83
   },
   {
    "speaker": "Narrator",
    "en": "Hindi takes the third place with more than 530 million speakers.",
    "my": "ဟင်ဒီဘာသာစကားကတော့ ပြောဆိုသူ သန်း ၅၃၀ ကျော်နဲ့ တတိယနေရာမှာ ရှိပါတယ်။",
    "start": 29.83,
    "end": 39.87
   },
   {
    "speaker": "Narrator",
    "en": "It belongs to the Indian language family, like Punjabi.",
    "my": "ပန်ဂျာပီဘာသာစကားလိုပဲ ၎င်းဟာ အိန္ဒိယဘာသာစကားမိသားစုဝင် ဖြစ်ပါတယ်။",
    "start": 39.87,
    "end": 45.07
   },
   {
    "speaker": "Narrator",
    "en": "More than half a billion people speak one or more of these languages.",
    "my": "လူသန်းပေါင်း ငါးရာကျော်ဟာ အဆိုပါ ဘာသာစကားတွေထဲက တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး ပြောဆိုကြပါတယ်။",
    "start": 45.07,
    "end": 54.88
   },
   {
    "speaker": "Narrator",
    "en": "The fourth is Spanish, with more than 510 million speakers in Spain, Central and South America.",
    "my": "စတုတ္ထမြောက်ကတော့ စပိန်၊ အလယ်ပိုင်းနဲ့ တောင်အမေရိကတို့မှာ ပြောဆိုသူ သန်း ၅၁၀ ကျော်ရှိတဲ့ စပိန်ဘာသာစကား ဖြစ်ပါတယ်။",
    "start": 54.88,
    "end": 64.83
   },
   {
    "speaker": "Narrator",
    "en": "French is spoken by 285 million people, and it is followed by Arabic, which has a total of 273 million speakers.",
    "my": "ပြင်သစ်ဘာသာစကားကို လူ ၂၈၅ သန်းက ပြောဆိုကြပြီး သူ့နောက်မှာတော့ စုစုပေါင်း ပြောဆိုသူ ၂၇၃ သန်းရှိတဲ့ အာရဗီဘာသာစကား ဖြစ်ပါတယ်။",
    "start": 64.83,
    "end": 80.86
   },
   {
    "speaker": "Narrator",
    "en": "At number seven on the list is Russian, with about 265 million speakers.",
    "my": "စာရင်းရဲ့ နံပါတ် ၇ နေရာမှာတော့ ပြောဆိုသူ ၂၆၅ သန်းခန့်ရှိတဲ့ ရုရှားဘာသာစကား ဖြစ်ပါတယ်။",
    "start": 80.86,
    "end": 90.28
   }
  ]
 },
 "2": {
  "multiSpeaker": true,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 2. Literature.",
    "my": "ယူနစ် ၂။ စာပေ။",
    "start": 1.2,
    "end": 3.34
   },
   {
    "speaker": "Adam",
    "en": "Adam.",
    "my": "အာဒမ်။",
    "start": 3.34,
    "end": 5.17
   },
   {
    "speaker": "Adam",
    "en": "I study literature because I like stories.",
    "my": "ကျွန်တော် ပုံပြင်တွေကို ကြိုက်တာကြောင့် စာပေကို လေ့လာတာ ဖြစ်ပါတယ်။",
    "start": 5.17,
    "end": 7.94
   },
   {
    "speaker": "Adam",
    "en": "I love the way people are described through stories.",
    "my": "ပုံပြင်တွေကတစ်ဆင့် လူတွေအကြောင်း ဖော်ပြပုံကို ကျွန်တော် သဘောကျပါတယ်။",
    "start": 7.94,
    "end": 12.66
   },
   {
    "speaker": "Adam",
    "en": "Different stories describe people differently.",
    "my": "မတူညီတဲ့ ပုံပြင်တွေက လူတွေကို ပုံစံအမျိုးမျိုးနဲ့ ဖော်ပြကြပါတယ်။",
    "start": 12.66,
    "end": 19.0
   },
   {
    "speaker": "Adam",
    "en": "It is not easy to describe people.",
    "my": "လူတွေအကြောင်းကို ဖော်ပြရတာ မလွယ်ကူပါဘူး။",
    "start": 19.0,
    "end": 20.43
   },
   {
    "speaker": "Adam",
    "en": "It requires countless words to describe people.",
    "my": "လူတွေအကြောင်း ဖော်ပြဖို့အတွက် ရေတွက်လို့မရနိုင်တဲ့ စကားလုံးတွေ အများကြီး လိုအပ်ပါတယ်။",
    "start": 20.43,
    "end": 25.32
   },
   {
    "speaker": "Adam",
    "en": "That's the joy of studying literature.",
    "my": "ဒါဟာ စာပေလေ့လာခြင်းရဲ့ ပျော်ရွှင်မှုပါပဲ။",
    "start": 25.32,
    "end": 28.1
   },
   {
    "speaker": "Adam",
    "en": "There is always something new to discover in literature.",
    "my": "စာပေထဲမှာ ရှာဖွေတွေ့ရှိစရာ အသစ်အဆန်းတွေ အမြဲတမ်း ရှိနေပါတယ်။",
    "start": 28.1,
    "end": 34.37
   },
   {
    "speaker": "Lucy",
    "en": "Lucy.",
    "my": "လူစီ။",
    "start": 34.37,
    "end": 36.02
   },
   {
    "speaker": "Lucy",
    "en": "At first, I did not like studying literature.",
    "my": "ပထမတော့ ကျွန်မ စာပေလေ့လာရတာကို မကြိုက်ခဲ့ပါဘူး။",
    "start": 36.02,
    "end": 41.26
   },
   {
    "speaker": "Lucy",
    "en": "To me, only people who are not smart study literature because I think that most of the stories in literature are not real and are not scientific.",
    "my": "ကျွန်မအတွက်တော့ စာပေထဲက ပုံပြင်တော်တော်များများဟာ အစစ်အမှန်မဟုတ်သလို သိပ္ပံနည်းကျလည်း မဟုတ်ဘူးလို့ ထင်တဲ့အတွက် မတော်တဲ့သူတွေပဲ စာပေကို လေ့လာတယ်လို့ ထင်ခဲ့ပါတယ်။",
    "start": 41.26,
    "end": 52.82
   },
   {
    "speaker": "Lucy",
    "en": "However, the more I study literature, the more I find it interesting.",
    "my": "ဒါပေမဲ့ ကျွန်မ စာပေကို ပိုလေ့လာလေလေ ပိုစိတ်ဝင်စားဖို့ကောင်းတာကို တွေ့ရှိလေလေပါပဲ။",
    "start": 52.82,
    "end": 61.34
   },
   {
    "speaker": "Lucy",
    "en": "I start to see that although stories in literature still are not scientific, it is an art.",
    "my": "စာပေထဲက ပုံပြင်တွေဟာ သိပ္ပံနည်းမကျသေးပေမဲ့ ဒါဟာ အနုပညာတစ်ခုဖြစ်တယ်ဆိုတာကို ကျွန်မ စတင်မြင်တွေ့လာရပါတယ်။",
    "start": 61.34,
    "end": 66.39
   },
   {
    "speaker": "Lucy",
    "en": "And art is the greatest expression of human feelings.",
    "my": "ပြီးတော့ အနုပညာဆိုတာ လူသားတွေရဲ့ ခံစားချက်တွေကို အကြီးကျယ်ဆုံး ဖော်ပြခြင်း ဖြစ်ပါတယ်။",
    "start": 66.39,
    "end": 73.27
   },
   {
    "speaker": "Tom",
    "en": "Tom.",
    "my": "တွမ်။",
    "start": 73.27,
    "end": 74.03
   },
   {
    "speaker": "Tom",
    "en": "First, I studied literature because I wanted to read and write well.",
    "my": "ပထမတော့ ကျွန်တော် ကောင်းကောင်းဖတ်နိုင်၊ ရေးနိုင်ချင်လို့ စာပေကို လေ့လာခဲ့တာပါ။",
    "start": 74.03,
    "end": 80.0
   },
   {
    "speaker": "Tom",
    "en": "I believe that the chance to read and write is something that everyone should be able to experience.",
    "my": "စာဖတ်ခြင်းနဲ့ စာရေးခြင်း အခွင့်အရေးဆိုတာ လူတိုင်း ကြုံတွေ့ခံစားနိုင်သင့်တဲ့ အရာတစ်ခုလို့ ကျွန်တော် ယုံကြည်ပါတယ်။",
    "start": 80.0,
    "end": 91.51
   },
   {
    "speaker": "Tom",
    "en": "As I tried to read and write, I found that literature in all forms is everywhere in today's human society.",
    "my": "စာဖတ်ဖို့နဲ့ စာရေးဖို့ ကြိုးစားရင်းနဲ့ပဲ ပုံစံအမျိုးမျိုးရှိတဲ့ စာပေဟာ ယနေ့လူ့ဘောင်အဖွဲ့အစည်းမှာ နေရာတိုင်းမှာ ရှိနေတယ်ဆိုတာ ကျွန်တော် တွေ့ရှိခဲ့ပါတယ်။",
    "start": 91.51,
    "end": 101.62
   },
   {
    "speaker": "Tom",
    "en": "Whether it is studied in the classroom or read for pleasure, literature is the central part of many lives.",
    "my": "စာသင်ခန်းထဲမှာ လေ့လာသည်ဖြစ်စေ၊ အပျော်ဖတ်သည်ဖြစ်စေ စာပေဟာ လူအများအပြားရဲ့ ဘဝမှာ အဓိက အစိတ်အပိုင်းတစ်ခု ဖြစ်ပါတယ်။",
    "start": 101.62,
    "end": 110.93
   }
  ]
 },
 "3": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Three. Zero.",
    "my": "၃။ ၀။",
    "start": 0.0,
    "end": 2.03
   },
   {
    "speaker": "Narrator",
    "en": "Most inventors are men, but we will now look at some of the most important discoveries made by women.",
    "my": "တီထွင်သူအများစုမှာ အမျိုးသားများဖြစ်ကြသော်လည်း ယခုအခါ အမျိုးသမီးများပြုလုပ်ခဲ့သော အရေးအကြီးဆုံး တွေ့ရှိချက်အချို့ကို ကြည့်ရှုလေ့လာကြပါမည်။",
    "start": 2.03,
    "end": 10.86
   },
   {
    "speaker": "Narrator",
    "en": "Some inventions by women are essential if we think about them in the present times.",
    "my": "ယခုမျက်မှောက်ခေတ်တွင် ပြန်စဉ်းစားကြည့်မည်ဆိုလျှင် အမျိုးသမီးများ၏ တီထွင်မှုအချို့သည် မရှိမဖြစ် အရေးပါလှပါသည်။",
    "start": 10.86,
    "end": 17.93
   },
   {
    "speaker": "Narrator",
    "en": "Marie Curie is remembered for her discovery of radium and polonium, and her huge role to fight against cancer.",
    "my": "မာရီကျူးရီးကို ရေဒီယမ်နှင့် ပိုလိုနီယမ်တို့ကို ရှာဖွေတွေ့ရှိခဲ့မှုနှင့် ကင်ဆာရောဂါကို တိုက်ဖျက်ရာတွင် သူမ၏ ကြီးမားသော အခန်းကဏ္ဍတို့ကြောင့် အမှတ်ရနေကြပါသည်။",
    "start": 17.93,
    "end": 29.55
   },
   {
    "speaker": "Narrator",
    "en": "Grace Hopper was an American computer scientist who invented computer programming, without which the world would be a very different place.",
    "my": "ဂရေ့စ်ဟော့ပါသည် ကွန်ပျူတာပရိုဂရမ်ရေးဆွဲခြင်းကို တီထွင်ခဲ့သည့် အမေရိကန် ကွန်ပျူတာသိပ္ပံပညာရှင်တစ်ဦးဖြစ်ပြီး၊ ထိုတီထွင်မှုသာမရှိခဲ့လျှင် ကမ္ဘာကြီးသည် များစွာကွဲပြားခြားနားနေပေလိမ့်မည်။",
    "start": 29.55,
    "end": 42.32
   },
   {
    "speaker": "Narrator",
    "en": "In 1952, she and her team created the first compiler for computer languages.",
    "my": "၁၉၅၂ ခုနှစ်တွင် သူမနှင့် သူမ၏အဖွဲ့သည် ကွန်ပျူတာဘာသာစကားများအတွက် ပထမဆုံး compiler ကို ဖန်တီးခဲ့ကြသည်။",
    "start": 42.32,
    "end": 50.98
   },
   {
    "speaker": "Narrator",
    "en": "In 1966, Stephanie Kwolek invented Kevlar, a material five times stronger than steel and currently used around the world in making bulletproof vests to protect people from bullets.",
    "my": "၁၉၆၆ ခုနှစ်တွင် စတက်ဖနီခဝိုလက်ခ်သည် သံမဏိထက် ငါးဆပိုမိုခိုင်မာပြီး လူများကို ကျည်ဆန်များရန်မှ ကာကွယ်ရန် ကျည်ကာအင်္ကျီများပြုလုပ်ရာတွင် ကမ္ဘာတစ်ဝန်း အသုံးပြုနေသော ကဗလာ (Kevlar) အမျှင်ဓာတ်ပစ္စည်းကို တီထွင်ခဲ့သည်။",
    "start": 50.98,
    "end": 67.99
   },
   {
    "speaker": "Narrator",
    "en": "Her invention has saved the lives of many soldiers, policemen, and politicians.",
    "my": "သူမ၏ တီထွင်မှုသည် စစ်သားများ၊ ရဲများနှင့် နိုင်ငံရေးသမားများစွာ၏ အသက်ကို ကယ်တင်နိုင်ခဲ့သည်။",
    "start": 67.99,
    "end": 75.77
   },
   {
    "speaker": "Narrator",
    "en": "Mary Anderson, an American inventor of the 20th century, invented windscreen wipers in 1903.",
    "my": "၂၀ ရာစုမှ အမေရိကန် တီထွင်သူ မေရီအန်ဒါဆန်သည် ၁၉၀၃ ခုနှစ်တွင် မော်တော်ကားလေကာမှန် သုတ်တံများကို တီထွင်ခဲ့သည်။",
    "start": 75.77,
    "end": 86.32
   },
   {
    "speaker": "Narrator",
    "en": "Before the invention, drivers found it very difficult to see where they were going when it was raining or snowing.",
    "my": "ထိုတီထွင်မှုမတိုင်မီက မိုးရွာသည့်အခါ သို့မဟုတ် နှင်းကျသည့်အခါ ယာဉ်မောင်းများသည် မည်သည့်နေရာသို့ သွားနေသည်ကို ကြည့်ရှုရန် အလွန်ခက်ခဲခဲ့ကြသည်။",
    "start": 86.32,
    "end": 96.41
   },
   {
    "speaker": "Narrator",
    "en": "Marion Donovan invented the waterproof diapers first and later went on to design a disposable model too.",
    "my": "မာရီယွန်ဒိုနိုဗန်သည် ရေစိုခံအနှီးများကို ဦးစွာတီထွင်ခဲ့ပြီး နောက်ပိုင်းတွင် တစ်ခါသုံးအနှီးဒီဇိုင်းကိုပါ ဆက်လက်ဖန်တီးခဲ့သည်။",
    "start": 96.41,
    "end": 107.36
   },
   {
    "speaker": "Narrator",
    "en": "This invention has definitely changed the way parenting works and has made many parents and children happy.",
    "my": "ဤတီထွင်မှုသည် ကလေးထိန်းသိမ်းစောင့်ရှောက်သည့်ပုံစံကို အမှန်တကယ် ပြောင်းလဲစေခဲ့ပြီး မိဘများနှင့် ကလေးငယ်များစွာကို ပျော်ရွှင်စေခဲ့သည်။",
    "start": 107.36,
    "end": 117.09
   },
   {
    "speaker": "Narrator",
    "en": "Josephine Cochrane had the motivation of helping people with her invention.",
    "my": "ဂျိုးဇက်ဖင်းကော့ခ်ရိန်းသည် သူမ၏တီထွင်မှုဖြင့် လူများကို ကူညီလိုသော စိတ်ဆန္ဒရှိခဲ့သည်။",
    "start": 117.09,
    "end": 126.72
   },
   {
    "speaker": "Narrator",
    "en": "She invented the dishwasher to help her servants with washing dishes.",
    "my": "သူမသည် သူမ၏ အိမ်အကူများ ပန်းကန်ဆေးရာတွင် အထောက်အကူဖြစ်စေရန် ပန်းကန်ဆေးစက်ကို တီထွင်ခဲ့ခြင်းဖြစ်သည်။",
    "start": 126.72,
    "end": 131.92
   }
  ]
 },
 "4": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Painting.",
    "my": "ပန်းချီဆွဲခြင်း။",
    "start": 0.0,
    "end": 0.81
   },
   {
    "speaker": "Narrator",
    "en": "Spending time doing an enjoyable activity will help increase your satisfaction with life.",
    "my": "ပျော်စရာကောင်းသော လှုပ်ရှားမှုတစ်ခုကို ပြုလုပ်ရင်း အချိန်ကုန်ဆုံးခြင်းက ဘဝအပေါ် ကျေနပ်ရောင့်ရဲမှုကို တိုးတက်စေပါလိမ့်မည်။",
    "start": 0.81,
    "end": 10.65
   },
   {
    "speaker": "Narrator",
    "en": "Without having a hobby, your life may become boring, seem demanding, and end up in an unhealthy cycle.",
    "my": "ဝါသနာတစ်ခုမျှ မရှိပါက သင့်ဘဝသည် ပျင်းစရာကောင်းလာနိုင်ပြီး ပင်ပန်းခက်ခဲပုံပေါ်လာကာ ကျန်းမာရေးနှင့်မညီညွတ်သော သံသရာထဲတွင် အဆုံးသတ်သွားနိုင်ပါသည်။",
    "start": 10.65,
    "end": 16.7
   },
   {
    "speaker": "Narrator",
    "en": "Pursuing a hobby will then improve your performance in your study and ability to maintain a healthy family.",
    "my": "ဝါသနာတစ်ခုကို လိုက်စားခြင်းက သင့်စာပေလေ့လာမှု စွမ်းဆောင်ရည်နှင့် ကျန်းမာပျော်ရွှင်သော မိသားစုဘဝကို ထိန်းသိမ်းနိုင်စွမ်းကို တိုးတက်စေပါလိမ့်မည်။",
    "start": 16.7,
    "end": 30.06
   },
   {
    "speaker": "Narrator",
    "en": "Now, let's learn about the many different ways that having a hobby can improve your life.",
    "my": "ယခုအခါ ဝါသနာတစ်ခုရှိခြင်းက သင့်ဘဝကို တိုးတက်စေနိုင်သည့် နည်းလမ်းအမျိုးမျိုးအကြောင်းကို လေ့လာကြည့်ကြပါစို့။",
    "start": 30.06,
    "end": 37.74
   },
   {
    "speaker": "Narrator",
    "en": "One.",
    "my": "နံပါတ် တစ်။",
    "start": 37.74,
    "end": 38.8
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies are a great stress reliever.",
    "my": "ဝါသနာများသည် စိတ်ဖိစီးမှုကို အလွန်ပြေလျော့စေပါသည်။",
    "start": 38.8,
    "end": 39.32
   },
   {
    "speaker": "Narrator",
    "en": "Your hobby should be a completely pleasurable activity.",
    "my": "သင့်ဝါသနာသည် လုံးဝပျော်ရွှင်ကြည်နူးဖွယ်ကောင်းသော လှုပ်ရှားမှုတစ်ခု ဖြစ်သင့်သည်။",
    "start": 39.32,
    "end": 47.14
   },
   {
    "speaker": "Narrator",
    "en": "While adding an activity to your list of things to do might seem like it could create more stress, but it's actually a great way of releasing stress.",
    "my": "လုပ်ဆောင်ရမည့်အရာများ စာရင်းထဲသို့ နောက်ထပ်လှုပ်ရှားမှုတစ်ခု ထပ်ထည့်လိုက်ခြင်းက စိတ်ဖိစီးမှု ပိုများလာနိုင်သည်ဟု ထင်ရသော်လည်း အမှန်တကယ်တွင် စိတ်ဖိစီးမှုကို လျှော့ချရန် အကောင်းဆုံးနည်းလမ်းတစ်ခု ဖြစ်ပါသည်။",
    "start": 47.14,
    "end": 56.55
   },
   {
    "speaker": "Narrator",
    "en": "When you focus on a hobby, all of your stress seems to fade away.",
    "my": "သင်သည် ဝါသနာတစ်ခုခုအပေါ် အာရုံစိုက်လိုက်သောအခါ သင့်စိတ်ဖိစီးမှုအားလုံး ပျောက်ကွယ်သွားပုံရသည်။",
    "start": 56.55,
    "end": 66.3
   },
   {
    "speaker": "Narrator",
    "en": "Two.",
    "my": "နံပါတ် နှစ်။",
    "start": 66.3,
    "end": 63.94
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies encourage you to take a break.",
    "my": "ဝါသနာများသည် သင့်ကို အနားယူရန် အားပေးတိုက်တွန်းပါသည်။",
    "start": 63.94,
    "end": 67.49
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies offer you an opportunity to take a break while also giving you a sense of purpose.",
    "my": "ဝါသနာများသည် သင့်အား ရည်ရွယ်ချက်ရှိသည့် ခံစားချက်ကို ပေးစွမ်းသလို တစ်ချိန်တည်းမှာပင် အနားယူရန် အခွင့်အရေးကိုလည်း ပေးပါသည်။",
    "start": 67.49,
    "end": 75.49
   },
   {
    "speaker": "Narrator",
    "en": "You are able to do something while still having fun.",
    "my": "ပျော်ရွှင်မှုကို ရရှိနေစဉ်မှာပင် အရာတစ်ခုခုကိုလည်း သင်လုပ်ဆောင်နိုင်ပါသည်။",
    "start": 75.49,
    "end": 80.44
   },
   {
    "speaker": "Narrator",
    "en": "Also, the more you do a hobby, the more you are likely to learn about the subject, which will provide you with an increased sense of satisfaction.",
    "my": "ထို့အပြင် ဝါသနာကို ပိုမိုလုပ်ဆောင်လေလေ ထိုအကြောင်းအရာနှင့်ပတ်သက်၍ သင်ပိုမိုလေ့လာသင်ယူနိုင်လေလေဖြစ်ပြီး ယင်းက သင့်ကို ပိုမိုကြီးမားသော ကျေနပ်မှုကို ရရှိစေပါလိမ့်မည်။",
    "start": 80.44,
    "end": 91.35
   },
   {
    "speaker": "Narrator",
    "en": "Three.",
    "my": "နံပါတ် သုံး။",
    "start": 91.35,
    "end": 96.07
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies offer new challenges and experiences.",
    "my": "ဝါသနာများသည် စိန်ခေါ်မှုအသစ်များနှင့် အတွေ့အကြုံသစ်များကို ပေးစွမ်းပါသည်။",
    "start": 96.07,
    "end": 98.45
   },
   {
    "speaker": "Narrator",
    "en": "Work and study-related challenges are often accompanied by stress and the pressure to be the best at what you are doing.",
    "my": "အလုပ်နှင့် ပညာရေးဆိုင်ရာ စိန်ခေါ်မှုများသည် စိတ်ဖိစီးမှုများ၊ မိမိလုပ်ဆောင်နေသောအရာတွင် အကောင်းဆုံးဖြစ်ရမည်ဟူသော ဖိအားများနှင့်အတူ မကြာခဏ ပေါ်ပေါက်လာတတ်သည်။",
    "start": 98.45,
    "end": 109.46
   },
   {
    "speaker": "Narrator",
    "en": "When taking up a hobby, you can enjoy the process of learning something new.",
    "my": "ဝါသနာတစ်ခုကို စတင်လုပ်ဆောင်သည့်အခါ အသစ်အဆန်းတစ်ခုခုကို သင်ယူရသည့် လုပ်ငန်းစဉ်ကို သင်ပျော်ရွှင်စွာ ခံစားနိုင်ပါသည်။",
    "start": 109.46,
    "end": 115.84
   },
   {
    "speaker": "Narrator",
    "en": "A hobby can also offer you different types of challenges.",
    "my": "ဝါသနာတစ်ခုသည် သင့်အား မတူညီသော စိန်ခေါ်မှုပုံစံများကိုလည်း ပေးစွမ်းနိုင်ပါသည်။",
    "start": 115.84,
    "end": 120.2
   },
   {
    "speaker": "Narrator",
    "en": "While you may spend your days at work being challenged mentally, you can take up a hobby that can challenge you physically.",
    "my": "အလုပ်ခွင်တွင် စိတ်ပိုင်းဆိုင်ရာ စိန်ခေါ်မှုများဖြင့် နေ့ရက်များကို ဖြတ်သန်းရနိုင်သော်လည်း ကိုယ်ကာယပိုင်းဆိုင်ရာ စိန်ခေါ်မှုပေးနိုင်သော ဝါသနာတစ်ခုကို သင်ရွေးချယ်လုပ်ဆောင်နိုင်ပါသည်။",
    "start": 120.2,
    "end": 130.57
   },
   {
    "speaker": "Narrator",
    "en": "Four.",
    "my": "နံပါတ် လေး။",
    "start": 130.57,
    "end": 134.61
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies allow you to explore yourself and your talents.",
    "my": "ဝါသနာများသည် သင့်ကိုယ်သင်နှင့် သင့်ပါရမီစွမ်းရည်များကို ရှာဖွေဖော်ထုတ်ခွင့်ပေးပါသည်။",
    "start": 134.61,
    "end": 136.5
   },
   {
    "speaker": "Narrator",
    "en": "You never really know what you're capable of unless you try something.",
    "my": "အရာတစ်ခုခုကို မစမ်းသပ်မချင်း သင်ဘာတွေ လုပ်နိုင်စွမ်းရှိသည်ကို သင်အမှန်တကယ် ဘယ်တော့မှ သိနိုင်မည်မဟုတ်ပါ။",
    "start": 136.5,
    "end": 141.38
   },
   {
    "speaker": "Narrator",
    "en": "For example, you might assume that you would never take up cooking, but if you try it, you may discover that you love cooking and that you have a certain talent.",
    "my": "ဥပမာအားဖြင့် သင်သည် ချက်ပြုတ်ခြင်းကို မည်သည့်အခါမျှ ပြုလုပ်မည်မဟုတ်ဟု ထင်မှတ်နိုင်သော်လည်း စမ်းကြည့်ပါက ချက်ပြုတ်ခြင်းကို နှစ်သက်ပြီး သီးခြားပါရမီတစ်ခု ရှိနေသည်ကို ရှာဖွေတွေ့ရှိနိုင်ပါသည်။",
    "start": 141.38,
    "end": 159.72
   },
   {
    "speaker": "Narrator",
    "en": "Hobbies help you discover the things that you're good at and might surprise you.",
    "my": "ဝါသနာများသည် သင်ကျွမ်းကျင်သောအရာများကို ရှာဖွေတွေ့ရှိရန် ကူညီပေးပြီး သင့်ကို အံ့အားသင့်စေနိုင်ပါသည်။",
    "start": 159.72,
    "end": 165.31
   }
  ]
 },
 "5": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 5. Trains.",
    "my": "သင်ခန်းစာ (၅)။ ရထားများ။",
    "start": 0.0,
    "end": 1.39
   },
   {
    "speaker": "Narrator",
    "en": "People travel for various reasons.",
    "my": "လူတွေဟာ အကြောင်းအမျိုးမျိုးကြောင့် ခရီးသွားကြပါတယ်။",
    "start": 1.39,
    "end": 3.22
   },
   {
    "speaker": "Narrator",
    "en": "Some go on a business trip, some on a pilgrimage, some on vacation, while some others just to do some sightseeing.",
    "my": "တချို့က စီးပွားရေးခရီးစဉ်၊ တချို့က ဘုရားဖူးခရီးစဉ်၊ တချို့က အားလပ်ရက်ခရီးစဉ် သွားကြပြီး တချို့ကျပြန်တော့လည်း အလည်အပတ် လေ့လာရေးသက်သက် သွားကြတာပါ။",
    "start": 3.22,
    "end": 13.33
   },
   {
    "speaker": "Narrator",
    "en": "No matter what your reason is, it is always wise to have a neat travel plan.",
    "my": "မင်းရဲ့ အကြောင်းပြချက် ဘာပဲဖြစ်ဖြစ် သပ်ရပ်သေချာတဲ့ ခရီးသွားအစီအစဉ်တစ်ခု ရှိထားတာက အမြဲတမ်း ပညာရှိရာရောက်ပါတယ်။",
    "start": 13.33,
    "end": 19.7
   },
   {
    "speaker": "Narrator",
    "en": "Here are four travel tips.",
    "my": "ခရီးသွား အကြံပြုချက် ၄ ချက်ကို အောက်မှာ ဖော်ပြပေးထားပါတယ်။",
    "start": 19.7,
    "end": 21.46
   },
   {
    "speaker": "Narrator",
    "en": "Tip number one. Purpose.",
    "my": "အကြံပြုချက် (၁)။ ရည်ရွယ်ချက်။",
    "start": 21.46,
    "end": 24.21
   },
   {
    "speaker": "Narrator",
    "en": "You must be very clear of the purpose of your travel, because your purpose will help you decide the right choice of transportation.",
    "my": "မင်းရဲ့ ခရီးသွားရည်ရွယ်ချက်ကို ရှင်းရှင်းလင်းလင်း သိထားရပါမယ်၊ ဘာကြောင့်လဲဆိုတော့ မင်းရဲ့ ရည်ရွယ်ချက်က သင့်တော်တဲ့ သယ်ယူပို့ဆောင်ရေးယာဉ်ကို ရွေးချယ်ဆုံးဖြတ်ဖို့ အထောက်အကူဖြစ်စေလို့ပါ။",
    "start": 24.21,
    "end": 34.91
   },
   {
    "speaker": "Narrator",
    "en": "For example, if you plan to see a lot within a short span of time, then a fast means of transport will suit you.",
    "my": "ဥပမာအားဖြင့် အချိန်တိုအတွင်းမှာ နေရာများများ လည်ပတ်ဖို့ စီစဉ်ထားရင် မြန်ဆန်တဲ့ သယ်ယူပို့ဆောင်ရေးယာဉ်က မင်းအတွက် သင့်လျော်ပါလိမ့်မယ်။",
    "start": 34.91,
    "end": 43.97
   },
   {
    "speaker": "Narrator",
    "en": "But if your purpose is to broaden your horizons, then a bit slower means of transport should be fine.",
    "my": "ဒါပေမဲ့ မင်းရဲ့ ရည်ရွယ်ချက်က ဗဟုသုတအမြင်ကျယ်ဖို့ဆိုရင်တော့ နည်းနည်း ပိုနှေးတဲ့ သယ်ယူပို့ဆောင်ရေးယာဉ်က အဆင်ပြေနိုင်ပါတယ်။",
    "start": 43.97,
    "end": 53.68
   },
   {
    "speaker": "Narrator",
    "en": "Tip number two. Budget.",
    "my": "အကြံပြုချက် (၂)။ အသုံးစရိတ်။",
    "start": 53.68,
    "end": 57.69
   },
   {
    "speaker": "Narrator",
    "en": "How much money are you prepared to spend?",
    "my": "မင်း ငွေဘယ်လောက် သုံးစွဲဖို့ ပြင်ဆင်ထားသလဲ။",
    "start": 57.69,
    "end": 59.84
   },
   {
    "speaker": "Narrator",
    "en": "This will help you decide the type of transport you should take.",
    "my": "ဒါက မင်းစီးနင်းသင့်တဲ့ သယ်ယူပို့ဆောင်ရေးယာဉ် အမျိုးအစားကို ဆုံးဖြတ်ဖို့ ကူညီပေးပါလိမ့်မယ်။",
    "start": 59.84,
    "end": 63.79
   },
   {
    "speaker": "Narrator",
    "en": "For instance, with a small budget and plenty of time, coach should be your choice.",
    "my": "ဥပမာအားဖြင့် အသုံးစရိတ် နည်းနည်းနဲ့ အချိန်အများကြီးရှိရင် အဝေးပြေးဘတ်စ်ကားက မင်းရဲ့ ရွေးချယ်မှု ဖြစ်သင့်ပါတယ်။",
    "start": 63.79,
    "end": 72.19
   },
   {
    "speaker": "Narrator",
    "en": "On the other hand, with a fat budget and lots of time, an expensive cruise or train trip would certainly suit you.",
    "my": "အခြားတစ်ဖက်မှာလည်း အသုံးစရိတ် များများစားစားနဲ့ အချိန်အများကြီးရှိရင် စျေးကြီးတဲ့ အပျော်စီးသင်္ဘော ဒါမှမဟုတ် ရထားခရီးစဉ်က မင်းနဲ့ အမှန်တကယ် သင့်လျော်ပါလိမ့်မယ်။",
    "start": 72.19,
    "end": 78.59
   },
   {
    "speaker": "Narrator",
    "en": "Tip number three. Length of your stay.",
    "my": "အကြံပြုချက် (၃)။ တည်းခိုနေထိုင်မည့် ကာလ။",
    "start": 78.59,
    "end": 83.96
   },
   {
    "speaker": "Narrator",
    "en": "The more time you have, the slower your travel can be.",
    "my": "မင်းမှာ အချိန်ပိုရလေလေ မင်းရဲ့ ခရီးစဉ်က ပိုပြီး အေးအေးလူလူ ဖြစ်နိုင်လေလေပါပဲ။",
    "start": 83.96,
    "end": 87.73
   },
   {
    "speaker": "Narrator",
    "en": "For instance, if you are visiting Europe and seeing five cities in ten days, high-speed trains should be your choice.",
    "my": "ဥပမာအားဖြင့် မင်းက ဥရောပကို လည်ပတ်ပြီး ဆယ်ရက်အတွင်း မြို့ ၅ မြို့ကို သွားရောက်မယ်ဆိုရင် အမြန်ရထားတွေက မင်းရဲ့ ရွေးချယ်မှု ဖြစ်သင့်ပါတယ်။",
    "start": 87.73,
    "end": 97.9
   },
   {
    "speaker": "Narrator",
    "en": "However, if your plan is to visit those same five cities in a month, then you could save money by taking the coach or renting a car.",
    "my": "ဒါပေမဲ့ မင်းရဲ့ အစီအစဉ်က အဲဒီမြို့ ၅ မြို့ကိုပဲ တစ်လအတွင်း လည်ပတ်ဖို့ဆိုရင် အဝေးပြေးဘတ်စ်ကား စီးတာ ဒါမှမဟုတ် ကားငှားစီးတာမျိုးနဲ့ ငွေကုန်ကြေးကျ သက်သာစေနိုင်ပါတယ်။",
    "start": 97.9,
    "end": 106.75
   },
   {
    "speaker": "Narrator",
    "en": "Tip number four. Traveling companions and luggage.",
    "my": "အကြံပြုချက် (၄)။ ခရီးသွားဖော်များနှင့် ခရီးဆောင်အိတ်များ။",
    "start": 106.75,
    "end": 112.97
   },
   {
    "speaker": "Narrator",
    "en": "The more companions, the more pieces of luggage you will have.",
    "my": "အဖော်ပိုများလေ မင်းမှာ ခရီးဆောင်အိတ် ပိုများလေ ဖြစ်ပါလိမ့်မယ်။",
    "start": 112.97,
    "end": 118.98
   },
   {
    "speaker": "Narrator",
    "en": "And if there are going to be kids traveling along with you, their comfort and endurance will need to be considered.",
    "my": "ပြီးတော့ မင်းနဲ့အတူ ကလေးတွေ လိုက်ပါမယ်ဆိုရင် သူတို့ရဲ့ သက်တောင့်သက်သာရှိမှုနဲ့ ခံနိုင်ရည်ကို ထည့်သွင်းစဉ်းစားဖို့ လိုပါလိမ့်မယ်။",
    "start": 118.98,
    "end": 128.98
   },
   {
    "speaker": "Narrator",
    "en": "And this, in turn, will help you make the right choice of transport.",
    "my": "ဒါကလည်း သင့်တော်မှန်ကန်တဲ့ သယ်ယူပို့ဆောင်ရေးယာဉ်ကို ရွေးချယ်ရာမှာ အထောက်အကူ ပြုပါလိမ့်မယ်။",
    "start": 128.98,
    "end": 134.42
   },
   {
    "speaker": "Narrator",
    "en": "In such a case, a rental car or a caravan should be your choice.",
    "my": "ဒီလိုအခြေအနေမျိုးမှာ ငှားထားတဲ့ကား သို့မဟုတ် အိပ်ခန်းပါ ခရီးသွားကားကြီးက မင်းရဲ့ ရွေးချယ်မှု ဖြစ်သင့်ပါတယ်။",
    "start": 134.42,
    "end": 139.02
   }
  ]
 },
 "6": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 6.",
    "my": "ယူနစ် ၆။",
    "start": 0.97,
    "end": 2.24
   },
   {
    "speaker": "Narrator",
    "en": "The Prodigal Son.",
    "my": "ဖြုန်းတီးသော သားမိုက်။",
    "start": 2.24,
    "end": 4.77
   },
   {
    "speaker": "Narrator",
    "en": "Once in England, there was a very wealthy noble family.",
    "my": "တစ်ခါက အင်္ဂလန်နိုင်ငံတွင် အလွန်ချမ်းသာသော မှူးမတ်မျိုးနွယ် မိသားစုတစ်စု ရှိခဲ့သည်။",
    "start": 4.77,
    "end": 6.3
   },
   {
    "speaker": "Narrator",
    "en": "One summer, the family decided to spend the weekend on their estate in the countryside.",
    "my": "နွေရာသီတစ်ခုတွင် ထိုမိသားစုသည် ကျေးလက်ရှိ ၎င်းတို့၏ ခြံဝင်းကြီးထဲ၌ စနေ၊ တနင်္ဂနွေ အားလပ်ရက်ကို ကုန်ဆုံးရန် ဆုံးဖြတ်ခဲ့ကြသည်။",
    "start": 6.3,
    "end": 15.11
   },
   {
    "speaker": "Narrator",
    "en": "While the parents were taking a stroll across a meadow, the children, all young boys, just ran about in the huge garden and went swimming in a pool.",
    "my": "မိဘများသည် မြက်ခင်းပြင်ကိုဖြတ်၍ လမ်းလျှောက်ထွက်နေစဉ် ယောက်ျားလေးများဖြစ်ကြသော ကလေးများသည် ကြီးမားသော ဥယျာဉ်ထဲတွင် ဟိုဟိုဒီဒီ ပြေးလွှားဆော့ကစားကာ ရေကူးကန်ထဲတွင် ရေကူးခဲ့ကြသည်။",
    "start": 15.11,
    "end": 27.42
   },
   {
    "speaker": "Narrator",
    "en": "One of the boys began to drown, and the son of the gardener jumped into the pool and rescued him.",
    "my": "ထိုကောင်လေးများအနက် တစ်ဦးမှာ ရေနစ်စပြုလာပြီး ဥယျာဉ်မှူး၏သားက ရေကူးကန်ထဲသို့ ခုန်ဆင်းကာ သူ့ကို ကယ်တင်ခဲ့သည်။",
    "start": 27.42,
    "end": 32.8
   },
   {
    "speaker": "Narrator",
    "en": "When the parents came back from their stroll and heard about the accident, they were so grateful to the boy who had saved their son.",
    "my": "မိဘများ လမ်းလျှောက်ရာမှ ပြန်ရောက်လာပြီး မတော်တဆမှုအကြောင်း ကြားသိရသောအခါ ၎င်းတို့၏သားကို ကယ်တင်ပေးခဲ့သော ကောင်လေးအား အလွန်ကျေးဇူးတင်ခဲ့ကြသည်။",
    "start": 32.8,
    "end": 46.22
   },
   {
    "speaker": "Narrator",
    "en": "About sixty years or so later, Winston Churchill, the Prime Minister of Britain, suffered from pneumonia.",
    "my": "အနှစ် ၆၀ ခန့်အကြာတွင် ဗြိတိန်ဝန်ကြီးချုပ် ဝင်စတန်ချာချီသည် အဆုတ်ရောင်ရောဂါ ဝေဒနာကို ခံစားခဲ့ရသည်။",
    "start": 46.22,
    "end": 52.69
   },
   {
    "speaker": "Narrator",
    "en": "The King of England instructed the cabinet to get the best doctor in their country to save Winston Churchill.",
    "my": "အင်္ဂလန်ဘုရင်က ဝင်စတန်ချာချီကို ကယ်တင်ရန် သူတို့နိုင်ငံရှိ အတော်ဆုံးဆရာဝန်ကို ခေါ်ယူရန် အစိုးရအဖွဲ့အား ညွှန်ကြားခဲ့သည်။",
    "start": 52.69,
    "end": 62.46
   },
   {
    "speaker": "Narrator",
    "en": "The best doctor at that time was Alexander Fleming, the doctor who developed penicillin.",
    "my": "ထိုအချိန်က အတော်ဆုံးဆရာဝန်မှာ ပင်နီဆလင်ဆေးကို ရှာဖွေဖော်ထုတ်ခဲ့သော ဆရာဝန် အလက်ဇန္ဒားဖလန်းမင်း ဖြစ်သည်။",
    "start": 62.46,
    "end": 70.01
   },
   {
    "speaker": "Narrator",
    "en": "Churchill recovered, and when Dr. Alexander came to see him, Churchill, shaking the doctor's hand, said, Rarely has one man owed his life twice to the same rescuer.",
    "my": "ချာချီသည် ရောဂါသက်သာပျောက်ကင်းသွားပြီး ဒေါက်တာအလက်ဇန္ဒား လာရောက်တွေ့ဆုံသောအခါ ချာချီက ဆရာဝန်၏လက်ကိုဆွဲနှုတ်ဆက်ရင်း \"လူတစ်ဦးဟာ ကယ်တင်ရှင်တစ်ဦးတည်းအပေါ်မှာ မိမိအသက်ကို နှစ်ကြိမ်တိုင်တိုင် ကျေးဇူးကြွေးတင်ဖူးတယ်ဆိုတာ ရှားပါးလှပါတယ်\" ဟု ပြောကြားခဲ့သည်။",
    "start": 70.01,
    "end": 83.64
   },
   {
    "speaker": "Narrator",
    "en": "The boy who nearly drowned sixty years or so before was Winston Churchill, and the youthful hero who saved him was Alexander Fleming, the gardener's son and developer of the antibiotic penicillin.",
    "my": "လွန်ခဲ့သော နှစ် ၆၀ ခန့်က ရေနစ်လုနီးပါးဖြစ်ခဲ့သော ကောင်လေးမှာ ဝင်စတန်ချာချီဖြစ်ပြီး သူ့ကိုကယ်တင်ခဲ့သော ငယ်ရွယ်သည့်သူရဲကောင်းမှာ ပဋိဇီဝဆေး ပင်နီဆလင်ကို ဖော်ထုတ်သူ ဥယျာဉ်မှူး၏သား အလက်ဇန္ဒားဖလန်းမင်း ဖြစ်ပေသည်။",
    "start": 83.64,
    "end": 97.99
   }
  ]
 },
 "7": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 7.",
    "my": "ယူနစ် ၇။",
    "start": 1.08,
    "end": 2.91
   },
   {
    "speaker": "Narrator",
    "en": "Typical Myanmar snacks.",
    "my": "မြန်မာ့ရိုးရာ သရေစာများ။",
    "start": 2.91,
    "end": 5.75
   },
   {
    "speaker": "Narrator",
    "en": "Some people eat snacks when they are stressed.",
    "my": "အချို့လူများသည် စိတ်ဖိစီးမှုများသောအခါ သရေစာ စားတတ်ကြသည်။",
    "start": 5.75,
    "end": 9.36
   },
   {
    "speaker": "Narrator",
    "en": "Eating snacks can help them soothe and comfort themselves when they experience an unpleasant situation.",
    "my": "မနှစ်မြို့ဖွယ် အခြေအနေတစ်ခုခု ကြုံတွေ့ရသောအခါ သရေစာစားခြင်းက သူတို့ကို စိတ်သက်သာရာရစေပြီး နှစ်သိမ့်မှုပေးနိုင်သည်။",
    "start": 9.36,
    "end": 17.63
   },
   {
    "speaker": "Narrator",
    "en": "In addition, some people eat snacks when they are sad.",
    "my": "ထို့အပြင် အချို့လူများသည် ဝမ်းနည်းသောအခါတွင်လည်း သရေစာ စားတတ်ကြသည်။",
    "start": 17.63,
    "end": 21.78
   },
   {
    "speaker": "Narrator",
    "en": "I've seen some people have a piece of cake after an unsuccessful job interview.",
    "my": "အလုပ်အင်တာဗျူး မအောင်မြင်ပြီးနောက် ကိတ်မုန့်တစ်တုံး စားနေကြသည့် အချို့လူများကို ကျွန်ုပ် တွေ့ဖူးပါသည်။",
    "start": 21.78,
    "end": 28.51
   },
   {
    "speaker": "Narrator",
    "en": "Another reason for having snacks is to celebrate.",
    "my": "သရေစာစားရသည့် အခြားအကြောင်းရင်းတစ်ခုမှာ အောင်ပွဲခံရန် ဖြစ်သည်။",
    "start": 28.51,
    "end": 32.89
   },
   {
    "speaker": "Narrator",
    "en": "Some people have snacks to honor small victories, like getting a promotion or passing a test.",
    "my": "အချို့လူများသည် ရာထူးတိုးခြင်း သို့မဟုတ် စာမေးပွဲအောင်ခြင်းကဲ့သို့သော အောင်မြင်မှု သေးသေးလေးများကို ဂုဏ်ပြုရန် သရေစာ စားကြသည်။",
    "start": 32.89,
    "end": 40.97
   },
   {
    "speaker": "Narrator",
    "en": "One simple reason for having snacks is because we're bored.",
    "my": "သရေစာစားရသည့် ရိုးရှင်းသော အကြောင်းရင်းတစ်ခုမှာ ကျွန်ုပ်တို့ ပျင်းနေ၍ ဖြစ်သည်။",
    "start": 40.97,
    "end": 44.43
   },
   {
    "speaker": "Narrator",
    "en": "Therefore, many people turn to food to break up the monotony of their day-to-day lives.",
    "my": "ထို့ကြောင့် လူအများအပြားသည် သူတို့၏ နေ့စဉ်ဘဝ ငြီးငွေ့ဖွယ်ကောင်းမှုကို ဖြတ်တောက်ရန် အစားအစာဘက်သို့ မျက်နှာမူကြသည်။",
    "start": 44.43,
    "end": 53.33
   },
   {
    "speaker": "Narrator",
    "en": "One funny reason for having snacks is that we want to delay doing things we should do.",
    "my": "သရေစာစားရသည့် ရယ်စရာကောင်းသော အကြောင်းရင်းတစ်ခုမှာ ကျွန်ုပ်တို့ လုပ်သင့်သည့်အရာများကို အချိန်ဆွဲလို၍ ဖြစ်သည်။",
    "start": 53.33,
    "end": 59.67
   },
   {
    "speaker": "Narrator",
    "en": "I will finish this report right after I go grab a cookie from the coffee shop down the street.",
    "my": "လမ်းထောင့်ရှိ ကော်ဖီဆိုင်မှ ကွတ်ကီးသွားယူပြီးသည်နှင့် ဤအစီရင်ခံစာကို ကျွန်ုပ် အပြီးသတ်ပါမည်။",
    "start": 59.67,
    "end": 66.95
   },
   {
    "speaker": "Narrator",
    "en": "In fact, eating snacks is an easily accessible pastime for those who usually put things off until the very last minute.",
    "my": "အမှန်တကယ်တော့ သရေစာစားခြင်းသည် အရာရာကို နောက်ဆုံးမိနစ်အထိ အချိန်ဆွဲတတ်သူများအတွက် အလွယ်တကူ ပြုလုပ်နိုင်သော အချိန်ဖြုန်းနည်းတစ်ခု ဖြစ်သည်။",
    "start": 66.95,
    "end": 76.82
   },
   {
    "speaker": "Narrator",
    "en": "Snacking can be influenced by social culture and food culture.",
    "my": "သရေစာစားခြင်းသည် လူမှုရေးယဉ်ကျေးမှုနှင့် အစားအသောက်ယဉ်ကျေးမှုတို့၏ လွှမ်းမိုးမှုကို ခံရနိုင်သည်။",
    "start": 76.82,
    "end": 82.49
   },
   {
    "speaker": "Narrator",
    "en": "In some countries, like France, Mexico, and the Philippines, a fourth meal or snack is part of the traditional meal pattern.",
    "my": "ပြင်သစ်၊ မက္ကဆီကိုနှင့် ဖိလစ်ပိုင်တို့ကဲ့သို့ အချို့နိုင်ငံများတွင် စတုတ္ထမြောက် အစာ သို့မဟုတ် သရေစာသည် ရိုးရာအစားအသောက်ပုံစံ၏ အစိတ်အပိုင်းတစ်ခု ဖြစ်သည်။",
    "start": 82.49,
    "end": 92.09
   }
  ]
 },
 "8": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Food chain.",
    "my": "အစာကွင်းဆက်။",
    "start": 0.0,
    "end": 1.32
   },
   {
    "speaker": "Narrator",
    "en": "Let us enter the animal world and see how some animals eat their food.",
    "my": "တိရစ္ဆာန်လောကထဲကို ဝင်ရောက်ပြီး တချို့တိရစ္ဆာန်တွေ သူတို့ရဲ့အစာကို ဘယ်လိုစားကြသလဲဆိုတာ ကြည့်ကြရအောင်။",
    "start": 1.32,
    "end": 8.8
   },
   {
    "speaker": "Narrator",
    "en": "Animals like squirrels, rabbits, and rats feed on hard grains and nuts.",
    "my": "ရှဉ့်၊ ယုန်နဲ့ ကြွက်လို တိရစ္ဆာန်တွေဟာ မာကျောတဲ့ ကောက်နှံတွေနဲ့ အစေ့အဆန်တွေကို စားကြပါတယ်။",
    "start": 8.8,
    "end": 15.78
   },
   {
    "speaker": "Narrator",
    "en": "They bite these hard nuts with very sharp front cutting teeth.",
    "my": "သူတို့ဟာ အလွန်ထက်တဲ့ ရှေ့သွားတွေနဲ့ ဒီမာကျောတဲ့ အစေ့အဆန်တွေကို ကိုက်ဖြတ်ကြပါတယ်။",
    "start": 15.78,
    "end": 21.97
   },
   {
    "speaker": "Narrator",
    "en": "This is called gnawing.",
    "my": "ဒါကို ကိုက်ဖြတ်ဝါးစားခြင်း (gnawing) လို့ ခေါ်ပါတယ်။",
    "start": 21.97,
    "end": 24.94
   },
   {
    "speaker": "Narrator",
    "en": "Animals like snakes do not have chewing teeth.",
    "my": "မြွေလို တိရစ္ဆာန်တွေမှာ ဝါးစားဖို့ သွားမရှိကြပါဘူး။",
    "start": 24.94,
    "end": 29.12
   },
   {
    "speaker": "Narrator",
    "en": "They do not chew their food.",
    "my": "သူတို့ဟာ အစာကို မဝါးကြပါဘူး။",
    "start": 29.12,
    "end": 31.41
   },
   {
    "speaker": "Narrator",
    "en": "Instead, they swallow their food whole.",
    "my": "အဲဒီအစား သူတို့ရဲ့ အစာကို တစ်ကောင်လုံး (အကောင်လိုက်) မျိုချကြပါတယ်။",
    "start": 31.41,
    "end": 36.38
   },
   {
    "speaker": "Narrator",
    "en": "Animals like frogs have a long, sticky tongue to catch their prey.",
    "my": "ဖားလို တိရစ္ဆာန်တွေမှာတော့ သားကောင်ကို ဖမ်းဖို့ ရှည်လျားပြီး စေးကပ်တဲ့ လျှာ ရှိကြပါတယ်။",
    "start": 36.38,
    "end": 42.79
   },
   {
    "speaker": "Narrator",
    "en": "When a frog spots an insect, it sticks out its tongue and catches its prey.",
    "my": "ဖားတစ်ကောင်ဟာ အင်းဆက်ပိုးမွှားကို တွေ့တဲ့အခါ လျှာကို ထုတ်ပြီး သားကောင်ကို ဖမ်းယူလိုက်ပါတယ်။",
    "start": 42.79,
    "end": 49.71
   },
   {
    "speaker": "Narrator",
    "en": "Then it rolls back its tongue back into its mouth.",
    "my": "ပြီးနောက် လျှာကို ပါးစပ်ထဲ ပြန်လိပ်သွင်းလိုက်ပါတယ်။",
    "start": 49.71,
    "end": 55.01
   },
   {
    "speaker": "Narrator",
    "en": "Insects like bees and butterflies have a long tube to suck nectar from plants.",
    "my": "ပျားနဲ့ လိပ်ပြာလို အင်းဆက်တွေမှာ အပင်တွေဆီက ဝတ်ရည်စုပ်ယူဖို့ ရှည်လျားတဲ့ ပြွန်ချောင်း ပါရှိပါတယ်။",
    "start": 55.01,
    "end": 63.58
   },
   {
    "speaker": "Narrator",
    "en": "Animals like cows and buffaloes have a special way of eating their food.",
    "my": "နွားနဲ့ ကျွဲလို တိရစ္ဆာန်တွေမှာတော့ အစာစားတဲ့ ထူးခြားတဲ့နည်းလမ်း ရှိပါတယ်။",
    "start": 63.58,
    "end": 71.06
   },
   {
    "speaker": "Narrator",
    "en": "They first swallow their food whole and fill their stomach.",
    "my": "သူတို့ဟာ အစပိုင်းမှာ အစာကို မဝါးဘဲ အကုန်မျိုချပြီး အစာအိမ်ထဲ ဖြည့်ထားကြပါတယ်။",
    "start": 71.06,
    "end": 75.93
   },
   {
    "speaker": "Narrator",
    "en": "Later, they bring it back into their mouth and keep chewing it for hours.",
    "my": "နောက်ပိုင်းမှာ အဲဒီအစာကို ပါးစပ်ထဲ ပြန်ထုတ်ပြီး နာရီပေါင်းများစွာ ဆက်တိုက် ဝါးနေကြပါတယ်။",
    "start": 75.93,
    "end": 82.77
   },
   {
    "speaker": "Narrator",
    "en": "This is known as ruminating or chewing the cud.",
    "my": "ဒါကို မြုံ့ပြန်ခြင်း (ruminating သို့မဟုတ် chewing the cud) လို့ ခေါ်ပါတယ်။",
    "start": 82.77,
    "end": 87.51
   },
   {
    "speaker": "Narrator",
    "en": "Dogs and cats use their tongue to lap up their food.",
    "my": "ခွေးနဲ့ ကြောင်တွေကတော့ သူတို့ရဲ့အစာကို လျှာနဲ့ ရက်ပြီး စားကြပါတယ်။",
    "start": 87.51,
    "end": 93.84
   },
   {
    "speaker": "Narrator",
    "en": "The long necks of giraffes allow them to reach leaves, seeds, fruits, and branches high up in trees.",
    "my": "သစ်ကုလားအုတ်တွေရဲ့ ရှည်လျားတဲ့လည်ပင်းတွေက သစ်ပင်အမြင့်က သစ်ရွက်များ၊ အစေ့များ၊ အသီးများနှင့် သစ်ကိုင်းများကို လှမ်းမီစေပါတယ်။",
    "start": 93.84,
    "end": 103.47
   },
   {
    "speaker": "Narrator",
    "en": "The elephant uses its trunk to take in food.",
    "my": "ဆင်ကတော့ အစာစားဖို့ သူ့ရဲ့နှာမောင်းကို အသုံးပြုပါတယ်။",
    "start": 103.47,
    "end": 107.64
   }
  ]
 },
 "9": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 9.",
    "my": "ယူနစ် ၉။",
    "start": 2.33,
    "end": 4.3
   },
   {
    "speaker": "Narrator",
    "en": "Climate Change.",
    "my": "ရာသီဥတုပြောင်းလဲမှု။",
    "start": 4.3,
    "end": 6.57
   },
   {
    "speaker": "Narrator",
    "en": "Forests are key to all life forms.",
    "my": "သစ်တောများသည် သက်ရှိပုံစံအားလုံးအတွက် အဓိကအရေးပါပါသည်။",
    "start": 6.57,
    "end": 8.29
   },
   {
    "speaker": "Narrator",
    "en": "Here are the three most important benefits we get from forests.",
    "my": "သစ်တောများမှ ကျွန်ုပ်တို့ရရှိသော အရေးအကြီးဆုံး အကျိုးကျေးဇူး သုံးခုမှာ အောက်ပါအတိုင်းဖြစ်ပါသည်။",
    "start": 8.29,
    "end": 14.97
   },
   {
    "speaker": "Narrator",
    "en": "Habitat and ecosystems.",
    "my": "နေထိုင်ရာပတ်ဝန်းကျင်နှင့် ဂေဟစနစ်များ။",
    "start": 14.97,
    "end": 17.87
   },
   {
    "speaker": "Narrator",
    "en": "First, forests serve as a home to millions of animals, many types of snakes and lizards, wild animals, butterflies and insects, birds, and treetop animals as well.",
    "my": "ပထမအချက်အနေဖြင့် သစ်တောများသည် သန်းပေါင်းများစွာသော တိရစ္ဆာန်များ၊ မြွေနှင့် ပုတ်သင်ညို အမျိုးအစားများစွာ၊ တောရိုင်းတိရစ္ဆာန်များ၊ လိပ်ပြာနှင့် အင်းဆက်ပိုးမွှားများ၊ ငှက်များနှင့် သစ်ပင်ထိပ်ဖျားနေ တိရစ္ဆာန်များအတွက် နေအိမ်အဖြစ် အသုံးတော်ခံပါသည်။",
    "start": 17.87,
    "end": 35.76
   },
   {
    "speaker": "Narrator",
    "en": "All those live in the forests, streams, and rivers.",
    "my": "ထိုသတ္တဝါအားလုံးတို့သည် သစ်တောများ၊ စမ်းချောင်းများနှင့် မြစ်များတွင် နေထိုင်ကြသည်။",
    "start": 35.76,
    "end": 44.07
   },
   {
    "speaker": "Narrator",
    "en": "Economic benefits.",
    "my": "စီးပွားရေးဆိုင်ရာ အကျိုးကျေးဇူးများ။",
    "start": 44.07,
    "end": 42.97
   },
   {
    "speaker": "Narrator",
    "en": "Second, forests are of immense economic importance to us.",
    "my": "ဒုတိယအချက်အနေဖြင့် သစ်တောများသည် ကျွန်ုပ်တို့အတွက် စီးပွားရေးအရ အလွန်အရေးပါပါသည်။",
    "start": 42.97,
    "end": 48.23
   },
   {
    "speaker": "Narrator",
    "en": "For example, plantation forests provide humans with timber and wood, which is exported and used in all parts of the world.",
    "my": "ဥပမာအားဖြင့် စိုက်ခင်းသစ်တောများသည် လူသားတို့အား သစ်လုံးနှင့် သစ်သားများကို ထောက်ပံ့ပေးပြီး ယင်းတို့ကို ကမ္ဘာအနှံ့အပြားသို့ တင်ပို့ရောင်းချကာ အသုံးပြုကြသည်။",
    "start": 48.23,
    "end": 63.08
   },
   {
    "speaker": "Narrator",
    "en": "They also provide tourism income to people living in or close to forests when people visit to see the best of nature.",
    "my": "လူအများ သဘာဝအလှတရားကို ကြည့်ရှုလေ့လာရန် လာရောက်လည်ပတ်ကြသောအခါ သစ်တောအတွင်း သို့မဟုတ် သစ်တောအနီးတွင် နေထိုင်သူများအတွက် ခရီးသွားလုပ်ငန်းဆိုင်ရာ ဝင်ငွေကိုလည်း ရရှိစေသည်။",
    "start": 63.08,
    "end": 78.23
   },
   {
    "speaker": "Narrator",
    "en": "Climate control.",
    "my": "ရာသီဥတု ထိန်းညှိခြင်း။",
    "start": 78.23,
    "end": 76.86
   },
   {
    "speaker": "Narrator",
    "en": "Third, trees and soils help regulate atmospheric temperatures through a process called evapotranspiration.",
    "my": "တတိယအချက်အနေဖြင့် သစ်ပင်များနှင့် မြေဆီလွှာများသည် ရေငွေ့ပျံထွက်ခြင်းဟုခေါ်သော လုပ်ငန်းစဉ်မှတစ်ဆင့် လေထုအပူချိန်ကို ထိန်းညှိပေးရန် ကူညီပေးသည်။",
    "start": 76.86,
    "end": 86.97
   },
   {
    "speaker": "Narrator",
    "en": "This helps to stabilize the climate.",
    "my": "ဤအရာက ရာသီဥတုကို တည်ငြိမ်စေရန် အထောက်အကူပြုသည်။",
    "start": 86.97,
    "end": 91.45
   },
   {
    "speaker": "Narrator",
    "en": "In addition, they enrich the atmosphere by absorbing bad gases like carbon dioxide and other greenhouse gases and producing oxygen.",
    "my": "ထို့အပြင် ၎င်းတို့သည် ကာဗွန်ဒိုင်အောက်ဆိုဒ်နှင့် အခြားဖန်လုံအိမ်ဓာတ်ငွေ့များကဲ့သို့သော မကောင်းသောဓာတ်ငွေ့များကို စုပ်ယူပြီး အောက်ဆီဂျင်ကို ထုတ်လုပ်ပေးခြင်းဖြင့် လေထုကို ပိုမိုကောင်းမွန်စေပါသည်။",
    "start": 91.45,
    "end": 106.53
   }
  ]
 },
 "10": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Food safety.",
    "my": "အစားအသောက် ဘေးကင်းလုံခြုံရေး။",
    "start": 0.0,
    "end": 1.89
   },
   {
    "speaker": "Narrator",
    "en": "There have been great advances in food preparation in the last century.",
    "my": "ပြီးခဲ့သည့် ရာစုနှစ်အတွင်း အစားအစာ ပြုပြင်စီမံမှုအပိုင်းတွင် ကြီးမားသော တိုးတက်မှုများ ရှိခဲ့ပါသည်။",
    "start": 1.89,
    "end": 9.34
   },
   {
    "speaker": "Narrator",
    "en": "These days, a lot of the foods that we can buy in supermarkets are pre-packaged or pre-prepared.",
    "my": "ယနေ့ခေတ်တွင် စူပါမားကတ်များမှ ကျွန်ုပ်တို့ ဝယ်ယူနိုင်သော အစားအစာ အများအပြားသည် ကြိုတင်ထုပ်ပိုးထားခြင်း သို့မဟုတ် ကြိုတင်ချက်ပြုတ်ပြင်ဆင်ထားခြင်းများ ဖြစ်ကြသည်။",
    "start": 9.34,
    "end": 17.99
   },
   {
    "speaker": "Narrator",
    "en": "They need either little or no preparation before being ready to eat.",
    "my": "၎င်းတို့သည် စားသုံးရန် အဆင်သင့်မဖြစ်မီ အနည်းငယ်သာ ပြင်ဆင်ရန် လိုအပ်သည် (သို့မဟုတ်) လုံးဝ ပြင်ဆင်ရန် မလိုပါ။",
    "start": 17.99,
    "end": 24.58
   },
   {
    "speaker": "Narrator",
    "en": "Therefore, they save a lot of our time.",
    "my": "ထို့ကြောင့် ၎င်းတို့သည် ကျွန်ုပ်တို့၏ အချိန်များကို များစွာ သက်သာစေပါသည်။",
    "start": 24.58,
    "end": 28.22
   },
   {
    "speaker": "Narrator",
    "en": "This is very convenient for customers, but there are some harmful effects.",
    "my": "ဤအချက်သည် စားသုံးသူများအတွက် အလွန်အဆင်ပြေစေသော်လည်း အန္တရာယ်ရှိသော ဆိုးကျိုးအချို့လည်း ရှိပါသည်။",
    "start": 28.22,
    "end": 35.31
   },
   {
    "speaker": "Narrator",
    "en": "Most of the foods on the shelves contain chemicals and additives that are known to harm both humans and animals.",
    "my": "စင်ပေါ်ရှိ အစားအစာ အများစုတွင် လူနှင့် တိရစ္ဆာန် နှစ်မျိုးလုံးကို အန္တရာယ်ဖြစ်စေနိုင်သည်ဟု သိထားကြသော ဓာတုပစ္စည်းများနှင့် ဖြည့်စွက်ပစ္စည်းများ ပါဝင်နေပါသည်။",
    "start": 35.31,
    "end": 44.98
   },
   {
    "speaker": "Narrator",
    "en": "There are three harmful ingredients in food.",
    "my": "အစားအစာတွင် အန္တရာယ်ရှိသော ပါဝင်ပစ္စည်း သုံးမျိုး ရှိပါသည်။",
    "start": 44.98,
    "end": 49.49
   },
   {
    "speaker": "Narrator",
    "en": "They are food additives, artificial sweeteners, and artificial colors.",
    "my": "၎င်းတို့မှာ အစားအသောက် ဖြည့်စွက်ပစ္စည်းများ၊ ဓာတုအချိုဓာတ်ပြုပစ္စည်းများနှင့် ဓာတုဆိုးဆေးများ ဖြစ်ကြပါသည်။",
    "start": 49.49,
    "end": 56.39
   },
   {
    "speaker": "Narrator",
    "en": "Experts warn us to avoid as many chemicals in our foods as possible.",
    "my": "ကျွမ်းကျင်သူများက ကျွန်ုပ်တို့၏ အစားအစာများထဲရှိ ဓာတုပစ္စည်းများကို တတ်နိုင်သမျှ ရှောင်ကြဉ်ကြရန် သတိပေးထားပါသည်။",
    "start": 56.39,
    "end": 63.37
   },
   {
    "speaker": "Narrator",
    "en": "All of us need to be careful and cautious because some of these ingredients are used in meats, dairy products, and even farm produce.",
    "my": "အဆိုပါ ပါဝင်ပစ္စည်းအချို့ကို အသားများ၊ နို့ထွက်ပစ္စည်းများနှင့် စိုက်ပျိုးရေးထွက်ကုန်များတွင်ပင် အသုံးပြုထားသောကြောင့် ကျွန်ုပ်တို့အားလုံး သတိထားပြီး စိစစ်ဝယ်ယူရန် လိုအပ်ပါသည်။",
    "start": 63.37,
    "end": 75.17
   },
   {
    "speaker": "Narrator",
    "en": "The health of our country is determined by the foods we eat.",
    "my": "ကျွန်ုပ်တို့နိုင်ငံ၏ ကျန်းမာရေးသည် ကျွန်ုပ်တို့ စားသုံးသော အစားအစာများပေါ်တွင် မူတည်နေပါသည်။",
    "start": 75.17,
    "end": 80.46
   },
   {
    "speaker": "Narrator",
    "en": "Eating unsafe food can make us ill, and this in turn will add great costs to our healthcare system.",
    "my": "မလုံခြုံစိတ်ချရသော အစားအစာများကို စားသုံးခြင်းသည် ကျွန်ုပ်တို့ကို ဖျားနာစေနိုင်ပြီး၊ ၎င်းကတစ်ဖန် ကျွန်ုပ်တို့၏ ကျန်းမာရေးစောင့်ရှောက်မှုစနစ်အတွက် ကုန်ကျစရိတ်များကို များစွာ ပိုမိုစေမည်ဖြစ်ပါသည်။",
    "start": 80.46,
    "end": 89.47
   }
  ]
 },
 "11": {
  "multiSpeaker": true,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 11. Thanaka. Uniquely Myanmar.",
    "my": "ယူနစ် ၁၁။ သနပ်ခါး။ မြန်မာ့သီးသန့်လက်ရာ။",
    "start": 1.41,
    "end": 4.6
   },
   {
    "speaker": "Mary",
    "en": "Sandar, may I ask a question about Myanmar customs and practices?",
    "my": "စန္ဒာ၊ မြန်မာ့ရိုးရာ ဓလေ့ထုံးတမ်းတွေနဲ့ ပတ်သက်ပြီး မေးခွန်းတစ်ခုလောက် မေးလို့ရမလား။",
    "start": 4.6,
    "end": 14.51
   },
   {
    "speaker": "Sandar",
    "en": "Of course you can. Please do.",
    "my": "ရတာပေါ့။ မေးပါရှင်။",
    "start": 14.51,
    "end": 15.35
   },
   {
    "speaker": "Mary",
    "en": "I am not being impolite, but I am very curious.",
    "my": "ရိုင်းတာတော့ မဟုတ်ပါဘူး၊ ဒါပေမဲ့ အရမ်းသိချင်လို့ပါ။",
    "start": 15.35,
    "end": 19.63
   },
   {
    "speaker": "Sandar",
    "en": "Please feel free to ask.",
    "my": "အားမနာတမ်း မေးလို့ရပါတယ်နော်။",
    "start": 19.63,
    "end": 23.5
   },
   {
    "speaker": "Mary",
    "en": "Why do Myanmar people paint their faces yellow?",
    "my": "မြန်မာလူမျိုးတွေက ဘာဖြစ်လို့ သူတို့မျက်နှာမှာ အဝါရောင်တွေ သုတ်လိမ်းထားကြတာလဲ။",
    "start": 23.5,
    "end": 27.47
   },
   {
    "speaker": "Sandar",
    "en": "What do you mean?",
    "my": "ဘာကို ဆိုလိုတာလဲဟင်။",
    "start": 27.47,
    "end": 28.86
   },
   {
    "speaker": "Mary",
    "en": "Everywhere I go, I see children, men, women of all ages with yellow paint on their cheeks and foreheads.",
    "my": "ငါသွားလေရာ နေရာတိုင်းမှာ ပါးနဲ့ နဖူးတွေပေါ် အဝါရောင်ဆေးတွေ သုတ်ထားတဲ့ ကလေးတွေ၊ အမျိုးသားတွေ၊ အသက်အရွယ်စုံ အမျိုးသမီးတွေကို တွေ့ရလို့ပါ။",
    "start": 28.86,
    "end": 41.02
   },
   {
    "speaker": "Mary",
    "en": "Who are they trying to hide from?",
    "my": "သူတို့က ဘယ်သူ့ဆီကနေ ပုန်းကွယ်ဖို့ ကြိုးစားနေကြတာလဲ။",
    "start": 41.02,
    "end": 45.41
   },
   {
    "speaker": "Sandar",
    "en": "Mary, no. They are not trying to hide from anyone or anything.",
    "my": "မေရီရယ် မဟုတ်ပါဘူး။ သူတို့က ဘယ်သူ့ဆီကမှ ဒါမှမဟုတ် ဘာတစ်ခုဆီကမှ ပုန်းနေတာ မဟုတ်ပါဘူး။",
    "start": 45.41,
    "end": 50.65
   },
   {
    "speaker": "Mary",
    "en": "Do they wear it for religious reasons?",
    "my": "ဘာသာရေးဆိုင်ရာ အကြောင်းပြချက်ကြောင့် လိမ်းကြတာလား။",
    "start": 50.65,
    "end": 52.96
   },
   {
    "speaker": "Mary",
    "en": "Is the paint sacred?",
    "my": "ဒီဆေးက အထွတ်အမြတ်ထားရတာလား။",
    "start": 52.96,
    "end": 56.13
   },
   {
    "speaker": "Mary",
    "en": "Does it come in other colors?",
    "my": "တခြားအရောင်တွေရော ရှိလား။",
    "start": 56.13,
    "end": 59.55
   },
   {
    "speaker": "Mary",
    "en": "Is the paint imported from China?",
    "my": "ဒီဆေးကို တရုတ်ကနေ တင်သွင်းတာလား။",
    "start": 59.55,
    "end": 63.48
   },
   {
    "speaker": "Sandar",
    "en": "Oh, Mary, you have many questions.",
    "my": "အို၊ မေရီရယ်၊ မေးခွန်းတွေ အများကြီးပါလား။",
    "start": 63.48,
    "end": 67.96
   },
   {
    "speaker": "Sandar",
    "en": "First of all, it is not paint. It is thanaka.",
    "my": "ပထမဆုံးအနေနဲ့ ဒါက ဆေးမဟုတ်ပါဘူး။ ဒါဟာ သနပ်ခါးပါ။",
    "start": 67.96,
    "end": 71.39
   },
   {
    "speaker": "Mary",
    "en": "Thanaka?",
    "my": "သနပ်ခါးလား။",
    "start": 71.39,
    "end": 71.79
   },
   {
    "speaker": "Sandar",
    "en": "Would you like to know more?",
    "my": "အကြောင်းအရာတွေကို ထပ်သိချင်လား။",
    "start": 71.79,
    "end": 75.98
   },
   {
    "speaker": "Mary",
    "en": "Thanks, I'd love to.",
    "my": "ကျေးဇူးပဲ၊ သိချင်တာပေါ့။",
    "start": 75.98,
    "end": 77.3
   },
   {
    "speaker": "Sandar",
    "en": "Thanaka is a tree.",
    "my": "သနပ်ခါးဆိုတာ သစ်ပင်တစ်မျိုးပါ။",
    "start": 77.3,
    "end": 78.74
   },
   {
    "speaker": "Sandar",
    "en": "The bark is ground on a flat, circular stone with water to get a paste.",
    "my": "အခေါက်ကို ရေနဲ့အတူ ကျောက်ပျဉ်ဝိုင်း ပြားပြားပေါ်မှာ သွေးပြီး အနှစ်ရအောင် လုပ်ရတယ်။",
    "start": 78.74,
    "end": 87.75
   },
   {
    "speaker": "Sandar",
    "en": "It is used as a beauty treatment and sometimes medicine.",
    "my": "အဲဒါကို အလှအပဆိုင်ရာ ထိန်းသိမ်းဖို့နဲ့ တစ်ခါတလေမှာ ဆေးဝါးအဖြစ် သုံးကြတယ်။",
    "start": 87.75,
    "end": 93.31
   },
   {
    "speaker": "Mary",
    "en": "This is very interesting.",
    "my": "ဒါ အရမ်းစိတ်ဝင်စားစရာ ကောင်းတာပဲ။",
    "start": 93.31,
    "end": 94.98
   },
   {
    "speaker": "Mary",
    "en": "Do you know that I am a beauty and cosmetics specialist?",
    "my": "ငါက အလှအပနဲ့ အလှကုန် အထူးကုတစ်ယောက်ဆိုတာ နင်သိလား။",
    "start": 94.98,
    "end": 100.99
   },
   {
    "speaker": "Sandar",
    "en": "My mother, who is an expert on traditional medicine, taught me that thanaka helps protect the skin from the sun.",
    "my": "တိုင်းရင်းဆေးပညာရှင်တစ်ဦးဖြစ်တဲ့ ငါ့အမေက သနပ်ခါးဟာ အသားအရေကို နေလောင်ဒဏ်ကနေ ကာကွယ်ပေးတယ်လို့ ငါ့ကို သင်ပေးထားတယ်။",
    "start": 100.99,
    "end": 113.65
   },
   {
    "speaker": "Sandar",
    "en": "Myanmar people who work in the sun smear thanaka on their faces.",
    "my": "နေပူထဲမှာ အလုပ်လုပ်ရတဲ့ မြန်မာလူမျိုးတွေက သူတို့မျက်နှာပေါ်မှာ သနပ်ခါး လိမ်းကျံထားကြတယ်။",
    "start": 113.65,
    "end": 119.07
   },
   {
    "speaker": "Mary",
    "en": "I have also seen young women who do not work outside in the sun with thin, creamy thanaka spread on their faces.",
    "my": "နေပူထဲ အပြင်မှာ အလုပ်မလုပ်ရတဲ့ မိန်းမပျိုလေးတွေလည်း မျက်နှာပေါ်မှာ သနပ်ခါးနှစ် ပါးပါးလေး လိမ်းထားတာ ငါတွေ့ဖူးတယ်။",
    "start": 119.07,
    "end": 130.56
   },
   {
    "speaker": "Mary",
    "en": "What do you think about women of our age putting thanaka on their faces?",
    "my": "ငါတို့အရွယ် အမျိုးသမီးတွေ မျက်နှာပေါ် သနပ်ခါးလိမ်းတာနဲ့ ပတ်သက်ပြီး နင်ဘယ်လိုထင်လဲ။",
    "start": 130.56,
    "end": 138.49
   },
   {
    "speaker": "Sandar",
    "en": "I think it is a good practice. They are taking care of their skin.",
    "my": "ဒါဟာ ကောင်းမွန်တဲ့ အလေ့အထတစ်ခုလို့ ငါထင်တယ်။ သူတို့က သူတို့ရဲ့ အသားအရေကို ဂရုစိုက်နေကြတာလေ။",
    "start": 138.49,
    "end": 146.76
   },
   {
    "speaker": "Mary",
    "en": "Why do parents put it on the faces of their children?",
    "my": "မိဘတွေက ကလေးတွေရဲ့ မျက်နှာပေါ်မှာ ဘာကြောင့် သနပ်ခါးလိမ်းပေးကြတာလဲ။",
    "start": 146.76,
    "end": 151.13
   },
   {
    "speaker": "Sandar",
    "en": "Thanaka helps protect the children's faces from the sun.",
    "my": "သနပ်ခါးက ကလေးတွေရဲ့ မျက်နှာကို နေလောင်ဒဏ်ကနေ ကာကွယ်ပေးတယ်။",
    "start": 151.13,
    "end": 157.02
   },
   {
    "speaker": "Sandar",
    "en": "It is also soothing to the skin and smells nice.",
    "my": "ဒါ့အပြင် အသားအရေကို အေးမြစေပြီး မွှေးလည်းမွှေးတယ်။",
    "start": 157.02,
    "end": 162.31
   },
   {
    "speaker": "Sandar",
    "en": "Parents who have children also do this to show their love.",
    "my": "ကလေးရှိတဲ့ မိဘတွေက သူတို့ရဲ့ ချစ်ခြင်းမေတ္တာကို ပြသဖို့အတွက်လည်း ဒီလိုလုပ်ကြတာပါ။",
    "start": 162.31,
    "end": 169.24
   },
   {
    "speaker": "Mary",
    "en": "Is thanaka expensive?",
    "my": "သနပ်ခါးက ဈေးကြီးလား။",
    "start": 169.24,
    "end": 172.2
   },
   {
    "speaker": "Sandar",
    "en": "The price depends on which product is used.",
    "my": "ဈေးနှုန်းက ဘယ်ထုတ်ကုန်ကို သုံးသလဲဆိုတဲ့အပေါ် မူတည်ပါတယ်။",
    "start": 172.2,
    "end": 175.84
   },
   {
    "speaker": "Sandar",
    "en": "It can be bought as pieces of wood or ready-made in the form of creams, lotions, cakes, or powders.",
    "my": "အဲဒါကို သစ်တုံးအဖြစ် ဒါမှမဟုတ် ခရင်မ်၊ လိုးရှင်း၊ သနပ်ခါးခဲ ဒါမှမဟုတ် အမှုန့်ပုံစံ အသင့်သုံးပစ္စည်းတွေအနေနဲ့ ဝယ်ယူနိုင်ပါတယ်။",
    "start": 175.84,
    "end": 185.04
   }
  ]
 },
 "12": {
  "multiSpeaker": false,
  "lines": [
   {
    "speaker": "Narrator",
    "en": "Unit 12.",
    "my": "ယူနစ် ၁၂။",
    "start": 0.51,
    "end": 2.3
   },
   {
    "speaker": "Narrator",
    "en": "Urbanization.",
    "my": "မြို့ပြဖြစ်ထွန်းလာခြင်း။",
    "start": 2.3,
    "end": 4.17
   },
   {
    "speaker": "Narrator",
    "en": "Life in urban areas is fast and complicated, whereas rural life is simple and relaxed.",
    "my": "ကျေးလက်ဘဝသည် ရိုးရှင်းပြီး အေးချမ်းသော်လည်း မြို့ပြဒေသများရှိ ဘဝသည် လျင်မြန်ပြီး ရှုပ်ထွေးလှပါသည်။",
    "start": 4.17,
    "end": 15.79
   },
   {
    "speaker": "Narrator",
    "en": "The urban settlement includes cities and towns.",
    "my": "မြို့ပြအခြေချနေထိုင်မှုတွင် မြို့ကြီးများနှင့် မြို့ငယ်များ ပါဝင်ပါသည်။",
    "start": 15.79,
    "end": 19.54
   },
   {
    "speaker": "Narrator",
    "en": "On the other hand, the rural settlement includes villages and groups of houses.",
    "my": "အခြားတစ်ဖက်တွင်မူ ကျေးလက်အခြေချနေထိုင်မှုတွင် ကျေးရွာများနှင့် အိမ်စုကလေးများ ပါဝင်ပါသည်။",
    "start": 19.54,
    "end": 27.47
   },
   {
    "speaker": "Narrator",
    "en": "Urban areas are separated from nature, but rural areas are in direct contact with nature.",
    "my": "မြို့ပြဒေသများသည် သဘာဝတရားနှင့် ကင်းကွာနေသော်လည်း ကျေးလက်ဒေသများသည် သဘာဝတရားနှင့် တိုက်ရိုက်ထိတွေ့နေပါသည်။",
    "start": 27.47,
    "end": 36.8
   },
   {
    "speaker": "Narrator",
    "en": "Urban people are engaged in non-agricultural work.",
    "my": "မြို့ပြလူထုသည် စိုက်ပျိုးရေးမဟုတ်သော လုပ်ငန်းများတွင် လုပ်ကိုင်ကြပါသည်။",
    "start": 36.8,
    "end": 46.59
   },
   {
    "speaker": "Narrator",
    "en": "In contrast, the primary occupation of rural people is farming.",
    "my": "ဆန့်ကျင်ဘက်အားဖြင့် ကျေးလက်လူထု၏ အဓိကအလုပ်အကိုင်မှာ လယ်ယာစိုက်ပျိုးရေး ဖြစ်ပါသည်။",
    "start": 46.59,
    "end": 51.7
   },
   {
    "speaker": "Narrator",
    "en": "Population-wise, urban areas are densely populated.",
    "my": "လူဦးရေအရ မြို့ပြဒေသများသည် လူဦးရေ ထူထပ်ပါသည်။",
    "start": 51.7,
    "end": 56.31
   },
   {
    "speaker": "Narrator",
    "en": "On the contrary, rural areas are sparsely populated.",
    "my": "ဆန့်ကျင်ဘက်အားဖြင့် ကျေးလက်ဒေသများသည် လူဦးရေ ကျဲပါးပါသည်။",
    "start": 56.31,
    "end": 62.11
   },
   {
    "speaker": "Narrator",
    "en": "When it comes to jobs, urban people often change their jobs, looking for better opportunities.",
    "my": "အလုပ်အကိုင်နှင့် ပတ်သက်လာလျှင် မြို့ပြလူထုသည် ပိုမိုကောင်းမွန်သော အခွင့်အလမ်းများကို ရှာဖွေရင်း အလုပ်မကြာခဏ ပြောင်းလဲတတ်ကြပါသည်။",
    "start": 62.11,
    "end": 75.96
   },
   {
    "speaker": "Narrator",
    "en": "However, in rural areas, people do not usually change their jobs.",
    "my": "သို့သော် ကျေးလက်ဒေသများတွင် လူများသည် အလုပ်ကို များသောအားဖြင့် မပြောင်းလဲတတ်ကြပါ။",
    "start": 75.96,
    "end": 81.74
   }
  ]
 }
};
