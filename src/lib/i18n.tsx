import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export type Lang = "en" | "my";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.lessons": "Lessons",
  "nav.ask": "Ask Sayar Owl",
  "site.title": "Sayar Owl Academy",
  "site.tagline": "English for Grade 10 Myanmar",
  "lang.toggle": "မြန်မာ",

  // Landing
  "hero.badge": "For Grade 10 students in Myanmar",
  "hero.title.a": "Learn English with",
  "hero.title.b": "Sayar Owl",
  "hero.title.c": "— your patient AI tutor.",
  "hero.subtitle":
    "Paste any sentence or grammar question. Sayar Owl explains the rule, the structure, and the Myanmar meaning — kindly and clearly, every time.",
  "hero.cta.chat": "Start chatting with Sayar Owl",
  "hero.cta.browse": "Upload Exam Paper",
  "hero.tag.syllabus": "Grade 10 syllabus",
  "hero.tag.langs": "English + မြန်မာ",

  "features.title": "Why students love Sayar Owl",
  "features.subtitle":
    "A modern learning experience built for the way Myanmar students actually study English.",
  "feature.ask.title": "Ask Sayar Owl anything",
  "feature.ask.body":
    "A patient AI tutor that breaks down any sentence and explains the 'why' behind every grammar rule.",
  "feature.mm.title": "Myanmar translation context",
  "feature.mm.body":
    "Tricky words and phrases explained in Burmese (မြန်မာ) so the meaning truly clicks.",
  "feature.g10.title": "Grade 10 aligned",
  "feature.g10.body":
    "Lessons and examples tuned to the Myanmar Grade 10 syllabus and matriculation exam style.",
  "feature.practice.title": "Practice that sticks",
  "feature.practice.body":
    "Every answer ends with a tiny practice question so you actually remember what you learned.",

  "lessons.popular": "Popular lessons",
  "lessons.popular.sub": "Quick, focused topics straight from the Grade 10 syllabus.",
  "lessons.viewall": "View all →",
  "lessons.askToExplain": "Ask Sayar Owl to explain this",

  "cta.title": "Ready to ask your first question?",
  "cta.subtitle":
    "Sayar Owl is online now — patient, encouraging, and happy to explain anything in English or မြန်မာ.",
  "cta.button": "Chat with Sayar Owl",
  "footer": "© {year} Sayar Owl Academy · Built with care for Myanmar students",

  // Lessons page
  "lessons.crumb": "Lessons",
  "lessons.title": "Grade 10 English lessons",
  "lessons.subtitle":
    "Pick any lesson and ask Sayar Owl to explain it your way — with Myanmar translation when you need it.",
  "lessons.cant.title": "Can't find your topic?",
  "lessons.cant.sub": "Just ask Sayar Owl directly — any sentence, any rule.",
  "lessons.cant.btn": "Ask Sayar Owl",
  "cat.Grammar": "Grammar",
  "cat.Vocabulary": "Vocabulary",
  "cat.Writing": "Writing",
  "cat.Reading & Speaking": "Reading & Speaking",

  // Tutor
  "tutor.subtitle": "English tutor for Grade 10 students in Myanmar",
  "tutor.voiceOn": "Voice on",
  "tutor.voice": "Voice",
  "tutor.greet.title": "Mingalaba! I'm Sayar Owl 🦉",
  "tutor.greet.desc":
    "Ask me about any English sentence, grammar rule, or word. I'll explain the why — and add Myanmar translation when it helps.",
  "tutor.thinking": "Sayar Owl is thinking…",
  "tutor.error.title": "Sayar Owl couldn't reply.",
  "tutor.error.gatewayKey": "Lovable AI Gateway isn't configured for this environment. Add LOVABLE_API_KEY to .env.local, then restart the dev server.",
  "tutor.error.generic": "The AI response was interrupted. Check your connection and try again.",
  "tutor.error.retry": "Retry",
  "tutor.placeholder": "Ask about a sentence, grammar rule, or English word…",
  "tutor.footer": 'Sayar Owl explains the "why" — answers may need a teacher\'s check.',
  "tutor.listening": "Listening…",
  "starter.explain.title": "Explain a sentence",
  "starter.grammar.title": "Grammar topic",
  "starter.mm.title": "Myanmar meaning",
};

const my: Dict = {
  "nav.home": "ပင်မ",
  "nav.lessons": "သင်ခန်းစာများ",
  "nav.ask": "ဆရာဇီးကွက်ကို မေးပါ",
  "site.title": "ဆရာ ဇီးကွက် အကယ်ဒမီ",
  "site.tagline": "မြန်မာ Grade 10 အတွက် အင်္ဂလိပ်ဘာသာ",
  "lang.toggle": "English",

  "hero.badge": "မြန်မာနိုင်ငံ Grade 10 ကျောင်းသားများအတွက်",
  "hero.title.a": "အင်္ဂလိပ်စာကို",
  "hero.title.b": "ဆရာဇီးကွက်",
  "hero.title.c": "နှင့်အတူ စိတ်ရှည်စွာ သင်ယူပါ။",
  "hero.subtitle":
    "မည်သည့်ဝါကျ၊ မည်သည့်သဒ္ဒါမေးခွန်းကိုမဆို ပေးပါ။ ဆရာဇီးကွက်က စည်းမျဉ်း၊ ဖွဲ့စည်းပုံနှင့် မြန်မာအဓိပ္ပာယ်ကို ကြင်နာရှင်းလင်းစွာ ရှင်းပြပေးပါမည်။",
  "hero.cta.chat": "ဆရာဇီးကွက်နှင့် စတင်စကားပြောမည်",
  "hero.cta.browse": "စာမေးပွဲ မေးခွန်းလွှာ တင်မည်",
  "hero.tag.syllabus": "Grade 10 သင်ရိုး",
  "hero.tag.langs": "English + မြန်မာ",

  "features.title": "ကျောင်းသားများ ဆရာဇီးကွက်ကို ဘာကြောင့်နှစ်သက်ကြသလဲ",
  "features.subtitle":
    "မြန်မာကျောင်းသားများ အင်္ဂလိပ်စာ လေ့လာပုံအတွက် အထူးဒီဇိုင်းပြုလုပ်ထားသော သင်ယူမှုစနစ်။",
  "feature.ask.title": "ဆရာဇီးကွက်ကို ဘာမဆို မေးပါ",
  "feature.ask.body":
    "မည်သည့်ဝါကျကိုမဆို ခွဲခြမ်းပြီး သဒ္ဒါစည်းမျဉ်းတိုင်း၏ \"အကြောင်းရင်း\" ကို ရှင်းပြပေးသော စိတ်ရှည်သည့် AI ဆရာ။",
  "feature.mm.title": "မြန်မာဘာသာပြန် အကြောင်းအရာ",
  "feature.mm.body":
    "ခက်ခဲသော စကားလုံးများကို မြန်မာဘာသာဖြင့် ရှင်းပြသဖြင့် အဓိပ္ပာယ်ကို ပိုနားလည်လွယ်စေသည်။",
  "feature.g10.title": "Grade 10 နှင့် ကိုက်ညီ",
  "feature.g10.body":
    "မြန်မာ Grade 10 သင်ရိုးနှင့် တက္ကသိုလ်ဝင်စာမေးပွဲပုံစံအတိုင်း ပြုစုထားသော သင်ခန်းစာများ။",
  "feature.practice.title": "မှတ်မိစေသော လေ့ကျင့်ခန်း",
  "feature.practice.body":
    "အဖြေတိုင်း၏ အဆုံးတွင် သေးငယ်သော လေ့ကျင့်ခန်းမေးခွန်းပါသဖြင့် သင်ယူသမျှကို မှတ်မိစေသည်။",

  "lessons.popular": "လူကြိုက်များသော သင်ခန်းစာများ",
  "lessons.popular.sub": "Grade 10 သင်ရိုးမှ မြန်ဆန်ပြတ်သားသော ခေါင်းစဉ်များ။",
  "lessons.viewall": "အားလုံးကြည့်ရန် →",
  "lessons.askToExplain": "ဆရာဇီးကွက်ကို ရှင်းပြခိုင်းပါ",

  "cta.title": "ပထမဆုံးမေးခွန်းမေးရန် အသင့်ဖြစ်ပြီလား?",
  "cta.subtitle":
    "ဆရာဇီးကွက်က ယခု online ရှိနေပါသည် — စိတ်ရှည်ပြီး English သို့မဟုတ် မြန်မာဖြင့် မည်သည့်အရာကိုမဆို ရှင်းပြရန် ပျော်ရွှင်ပါသည်။",
  "cta.button": "ဆရာဇီးကွက်နှင့် စကားပြောမည်",
  "footer": "© {year} ဆရာဇီးကွက် အကယ်ဒမီ · မြန်မာကျောင်းသားများအတွက် ဂရုစိုက်စွာ ဖန်တီးထားသည်",

  "lessons.crumb": "သင်ခန်းစာများ",
  "lessons.title": "Grade 10 အင်္ဂလိပ်စာ သင်ခန်းစာများ",
  "lessons.subtitle":
    "သင်ခန်းစာတစ်ခုကိုရွေး၍ ဆရာဇီးကွက်ကို သင်နှစ်သက်သလို ရှင်းပြခိုင်းပါ — လိုအပ်လျှင် မြန်မာဘာသာပြန်နှင့်တကွ။",
  "lessons.cant.title": "ခေါင်းစဉ်ကို ရှာမတွေ့ဘူးလား?",
  "lessons.cant.sub": "ဆရာဇီးကွက်ကို တိုက်ရိုက်မေးပါ — မည်သည့်ဝါကျ၊ မည်သည့်စည်းမျဉ်းမဆို။",
  "lessons.cant.btn": "ဆရာဇီးကွက်ကို မေးပါ",
  "cat.Grammar": "သဒ္ဒါ",
  "cat.Vocabulary": "ဝေါဟာရ",
  "cat.Writing": "အရေးအသား",
  "cat.Reading & Speaking": "အဖတ်နှင့်အပြော",

  "tutor.subtitle": "မြန်မာ Grade 10 ကျောင်းသားများအတွက် အင်္ဂလိပ်ဆရာ",
  "tutor.voiceOn": "အသံဖွင့်ထား",
  "tutor.voice": "အသံ",
  "tutor.greet.title": "မင်္ဂလာပါ! ကျွန်တော် ဆရာဇီးကွက် 🦉",
  "tutor.greet.desc":
    "မည်သည့်အင်္ဂလိပ်ဝါကျ၊ သဒ္ဒါစည်းမျဉ်း သို့မဟုတ် စကားလုံးကိုမဆို မေးနိုင်ပါသည်။ အကြောင်းရင်းကို ရှင်းပြပြီး လိုအပ်လျှင် မြန်မာဘာသာပြန်ထည့်ပေးပါမည်။",
  "tutor.thinking": "ဆရာဇီးကွက် တွေးနေပါသည်…",
  "tutor.error.title": "ဆရာဇီးကွက် ပြန်မဖြေနိုင်ခဲ့ပါ။",
  "tutor.error.gatewayKey": "ဤပတ်ဝန်းကျင်တွင် Lovable AI Gateway ကို မသတ်မှတ်ရသေးပါ။ .env.local ဖိုင်တွင် LOVABLE_API_KEY ကို ထည့်ပြီး dev server ကို ပြန်စပါ။",
  "tutor.error.generic": "AI အဖြေ ထုတ်ပေးရာတွင် အနှောင့်အယှက်ဖြစ်သွားသည်။ အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "tutor.error.retry": "ထပ်ကြိုးစားပါ",
  "tutor.placeholder": "ဝါကျ၊ သဒ္ဒါစည်းမျဉ်း သို့မဟုတ် စကားလုံးအကြောင်း မေးပါ…",
  "tutor.footer": "ဆရာဇီးကွက်က \"အကြောင်းရင်း\" ကို ရှင်းပြသည် — အဖြေများကို ဆရာ၏ စစ်ဆေးမှု လိုနိုင်သည်။",
  "tutor.listening": "နားထောင်နေသည်…",
  "starter.explain.title": "ဝါကျတစ်ခုကို ရှင်းပြပါ",
  "starter.grammar.title": "သဒ္ဒါအကြောင်းအရာ",
  "starter.mm.title": "မြန်မာအဓိပ္ပာယ်",
};

const dicts: Record<Lang, Dict> = { en, my };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Record<string, string | number>) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored === "en" || stored === "my") setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang === "my" ? "my" : "en";
      }
    } catch {}
  }, [lang]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = dicts[lang][key] ?? dicts.en[key] ?? key;
    if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, String(vars[k]));
    return s;
  };

  return <LangCtx.Provider value={{ lang, setLang: setLangState, t }}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setLang(lang === "en" ? "my" : "en")}
      title={lang === "en" ? "Switch to Burmese" : "Switch to English"}
      className={className}
    >
      <Languages className="h-4 w-4" />
      <span className="ml-1.5">{t("lang.toggle")}</span>
    </Button>
  );
}
