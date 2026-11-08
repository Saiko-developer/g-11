import { useRef, useState } from "react";
import { buildTrainCars } from "@/lib/sentenceStructure";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Grammar help stays separate from the textbook's English and Burmese text.
const ROLES: Record<string, { title: string; description: string }> = {
  "WH-Question Word": {
    title: "မေးခွန်းစကားလုံး",
    description: "မေးခွန်းက မည်သည့်အကြောင်းအရာကို မေးထားကြောင်း ဖော်ပြသည်။",
  },
  "WH-Word": { title: "မေးခွန်းစကားလုံး", description: "မေးလိုသော အကြောင်းအရာကို ဖော်ပြသည်။" },
  "Helping Verb": {
    title: "အကူကြိယာ",
    description: "အဓိကကြိယာကို ကူညီ၍ မေးခွန်း၊ အငြင်းနှင့် ကာလတို့ကို ဖော်ပြသည်။",
  },
  "Linking Verb": {
    title: "ဆက်စပ်ကြိယာ",
    description: "ကတ္တားနှင့် ၎င်းကို ဖြည့်စွက်ဖော်ပြသော အပိုင်းကို ဆက်သွယ်ပေးသည်။",
  },
  "Adjective Phrase": {
    title: "နာမဝိသေသနစကားစု",
    description: "နာမ်၏ အရည်အသွေး သို့မဟုတ် အခြေအနေကို ဖော်ပြသော စကားစုဖြစ်သည်။",
  },
  Adjective: { title: "နာမဝိသေသန", description: "နာမ်၏ အရည်အသွေး သို့မဟုတ် အခြေအနေကို ဖော်ပြသည်။" },
  Article: {
    title: "နာမ်ညွှန်းစကားလုံး",
    description: "နာမ်ရှေ့တွင် အသုံးပြု၍ ရည်ညွှန်းသောအရာကို ဖော်ပြပေးသည်။",
  },
  "Noun Subject": {
    title: "ကတ္တား",
    description: "ဝါကျတွင် အဓိကပြောဆိုထားသော လူ၊ အရာ သို့မဟုတ် အကြောင်းအရာဖြစ်သည်။",
  },
  "Main Verb": {
    title: "အဓိကကြိယာ",
    description: "ဝါကျ၏ အဓိကလုပ်ဆောင်ချက် သို့မဟုတ် အခြေအနေကို ဖော်ပြသည်။",
  },
  "Noun Object": {
    title: "ကံ",
    description: "ကြိယာ၏ လုပ်ဆောင်မှုကို ခံရသော လူ သို့မဟုတ် အရာကို ဖော်ပြသည်။",
  },
  "Prepositional Phrase": {
    title: "ဝိဘတ်စကားစု",
    description: "နေရာ၊ အချိန် သို့မဟုတ် အရာများကြား ဆက်နွယ်မှုကို ဖော်ပြသည်။",
  },
  Predicate: {
    title: "ကြိယာပိုင်း",
    description: "ကတ္တားအကြောင်းကို ရှင်းလင်းဖော်ပြသော ဝါကျ၏အပိုင်းဖြစ်သည်။",
  },
  Complement: {
    title: "ဖြည့်စွက်ပိုင်း",
    description: "ဝါကျ၏ အဓိပ္ပာယ်ပြည့်စုံစေရန် ဖြည့်စွက်ဖော်ပြသော အပိုင်းဖြစ်သည်။",
  },
  "Adverb Clause": {
    title: "ကြိယာဝိသေသနဝါကျခွဲ",
    description: "လုပ်ဆောင်မှု၏ အချိန်၊ နေရာ၊ အကြောင်းရင်း သို့မဟုတ် အခြေအနေကို ဖော်ပြသည်။",
  },
  "Purpose Clause": {
    title: "ရည်ရွယ်ချက်ဖော်ပြသောအပိုင်း",
    description: "လုပ်ဆောင်မှု၏ ရည်ရွယ်ချက်ကို ဖော်ပြသည်။",
  },
  "Relative Clause": {
    title: "နာမ်ကိုအထူးပြုသောဝါကျခွဲ",
    description: "ရှေ့တွင်ပါသော နာမ်နှင့်ပတ်သက်၍ အချက်အလက်ထပ်မံ ဖော်ပြသည်။",
  },
  Adverb: {
    title: "ကြိယာဝိသေသန",
    description: "လုပ်ဆောင်မှု၏ အချိန်၊ နေရာ သို့မဟုတ် ပြုလုပ်ပုံကို ဖြည့်စွက်ဖော်ပြသည်။",
  },
  Sentence: { title: "ဝါကျ", description: "အဓိပ္ပာယ်ပြည့်စုံစွာ ဖော်ပြထားသော စကားလုံးအစုဖြစ်သည်။" },
};

const BURMESE_NAMES: Record<string, string> = {
  "Jame’ Asr Hassanal Bolkiah": "ဂျာမီ အက်ဆာ ဟတ်ဆနယ် ဘိုကီယာ",
  "Komodo National Park": "ကိုမိုဒို အမျိုးသားဥယျာဉ်",
  "Kuang Si": "ကွမ်စီ",
  UNESCO: "ယူနက်စကို",
  Boracay: "ဘိုရာကိုင်",
  "S.E.A.": "အက်စ် အီး အေ",
  Sentosa: "စင်တိုဆာ",
  "Gardens by the Bay": "ဂါးဒင်းစ် ဘိုင် သ ဘေး",
  "Flower Dome": "ဖလားဝါး ဒုမ်း",
  "Sam Phan Bok": "ဆမ်ဖန်ဘုတ်",
  "Grand Canyon": "ဂရန်းကန်ညွန်",
  "(a)": "(က)",
  "(b)": "(ခ)",
};

export function Grade11SourceStructure({
  questionText,
  sentenceMy,
  breakdown,
}: {
  questionText: string;
  sentenceMy: string;
  breakdown?: { word: string; tag: string }[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const cars = breakdown ?? buildTrainCars(questionText).cars;
  const translation = Object.entries(BURMESE_NAMES).reduce(
    (text, [name, burmese]) => text.replaceAll(name, burmese),
    sentenceMy,
  );
  const info = activeTag ? ROLES[activeTag] : undefined;
  return (
    <div className="space-y-3">
      <div lang="en" aria-label="Sentence structure words" className="flex flex-wrap gap-2">
        {cars.map((car, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Explain ${car.word}`}
            aria-haspopup="dialog"
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setActiveTag(car.tag);
            }}
            className="min-w-0 rounded-xl border border-border bg-background p-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="block break-words font-semibold">{car.word}</span>
            <span className="mt-1 block text-xs text-primary">[{car.tag}]</span>
          </button>
        ))}
      </div>
      <p lang="my" className="rounded-xl bg-muted p-3 leading-relaxed">
        {translation.replace(/^\d+\.\s*/, "")}
      </p>
      <Sheet open={activeTag !== null} onOpenChange={(open) => !open && setActiveTag(null)}>
        <SheetContent
          className="w-[88vw] overflow-y-auto sm:max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
        >
          <SheetHeader>
            <SheetTitle lang="my">{info?.title ?? "ဝါကျအစိတ်အပိုင်း"}</SheetTitle>
            <SheetDescription lang="en">{activeTag}</SheetDescription>
          </SheetHeader>
          <p lang="my" className="mt-5 leading-relaxed">
            {info?.description ?? "ဝါကျအတွင်းရှိ ဆက်နွယ်မှုကို မူရင်းစာကြောင်းနှင့် တွဲဖတ်ပါ။"}
          </p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
