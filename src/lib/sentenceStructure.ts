// Lightweight client-side sentence-structure analyzer for English questions.
// Used by Saya Owl to break down a question's grammatical pieces on demand,
// rendered visually as an "Inline Train" by the lesson UI.

export type Token = { text: string; role: string; roleMy: string; tag: string };

const WH: Record<string, { role: string; roleMy: string; tag: string }> = {
  what: { role: "asking for a thing / object", roleMy: "အရာ/ အကြောင်းအရာ မေးခြင်း", tag: "WH-Question Word" },
  when: { role: "asking for time", roleMy: "အချိန် မေးခြင်း", tag: "WH-Question Word" },
  where: { role: "asking for a place", roleMy: "နေရာ မေးခြင်း", tag: "WH-Question Word" },
  why: { role: "asking for a reason", roleMy: "အကြောင်းရင်း မေးခြင်း", tag: "WH-Question Word" },
  who: { role: "asking for a person", roleMy: "လူ မေးခြင်း", tag: "WH-Question Word" },
  whom: { role: "asking for a person (object)", roleMy: "လူ (ကံ) မေးခြင်း", tag: "WH-Question Word" },
  whose: { role: "asking for ownership", roleMy: "ပိုင်ဆိုင်မှု မေးခြင်း", tag: "WH-Question Word" },
  which: { role: "asking to choose", roleMy: "ရွေးချယ်ရန် မေးခြင်း", tag: "WH-Question Word" },
  how: { role: "asking for the way / manner", roleMy: "နည်းလမ်း မေးခြင်း", tag: "WH-Question Word" },
};

const AUX = new Set([
  "do", "does", "did",
  "is", "are", "am", "was", "were",
  "has", "have", "had",
  "can", "could", "will", "would", "should", "may", "might", "must", "shall",
]);

const BE = new Set(["is", "are", "am", "was", "were"]);
const ARTICLES = new Set(["a", "an", "the"]);
const PREPS = new Set([
  "of", "in", "on", "at", "to", "for", "with", "from", "by", "about",
  "into", "onto", "over", "under", "between", "through", "during", "before", "after",
]);

// Common adjectives in the Grade 10 textbook vocabulary.
const ADJ = new Set([
  "productive", "receptive", "active", "passive", "good", "bad", "big", "small",
  "important", "different", "same", "new", "old", "young", "happy", "sad",
  "beautiful", "easy", "hard", "difficult", "simple", "useful", "main", "basic",
  "english", "burmese", "myanmar", "daily", "best", "favourite", "favorite",
  "kind", "great", "long", "short", "high", "low", "fast", "slow",
]);

const AUX_MY: Record<string, string> = {
  do: "helping verb", does: "helping verb", did: "helping verb (past)",
  has: "helping verb", have: "helping verb", had: "helping verb (past)",
  can: "modal", could: "modal (past)", will: "modal (future)",
  would: "modal", should: "modal (should)", may: "modal (may)",
  might: "modal (might)", must: "modal (must)", shall: "modal",
};

function isNounish(w: string): boolean {
  const lw = w.toLowerCase();
  return !ARTICLES.has(lw) && !ADJ.has(lw) && !PREPS.has(lw) && !AUX.has(lw) && !WH[lw];
}

// Consume a noun phrase: optional article + adjectives + 1–3 nouns.
// Returns [endIndex, hadAdjective].
function consumeNounPhrase(words: string[], start: number): { end: number; hasAdj: boolean } {
  let i = start;
  let hasAdj = false;
  if (i < words.length && ARTICLES.has(words[i].toLowerCase())) i++;
  while (i < words.length && ADJ.has(words[i].toLowerCase())) {
    hasAdj = true;
    i++;
  }
  const nounStart = i;
  while (i < words.length && i < nounStart + 3 && isNounish(words[i])) {
    i++;
    if (i < words.length && (PREPS.has(words[i].toLowerCase()) || AUX.has(words[i].toLowerCase()))) break;
  }
  return { end: i, hasAdj };
}

export function analyzeQuestion(raw: string): { sentence: string; intro: string; introMy: string; tokens: Token[]; noteMy: string } {
  const cleaned = raw.trim().replace(/[?.!]+$/, "");
  const sentence = raw.trim();
  const isQuestion = /\?\s*$/.test(raw.trim());
  const words = cleaned.split(/\s+/);
  if (words.length === 0) {
    return { sentence, intro: "", introMy: "", tokens: [], noteMy: "" };
  }

  const first = words[0].toLowerCase();
  const tokens: Token[] = [];

  // ---------- WH-question ----------
  if (WH[first] && isQuestion) {
    const info = WH[first];
    tokens.push({ text: words[0], role: `WH-word — ${info.role}`, roleMy: `WH စကားလုံး — ${info.roleMy}`, tag: info.tag });

    let i = 1;
    let isBe = false;
    // helping / linking verb
    if (i < words.length && AUX.has(words[i].toLowerCase())) {
      const w = words[i].toLowerCase();
      isBe = BE.has(w);
      tokens.push({
        text: words[i],
        role: isBe ? "linking verb (be-form)" : "helping (auxiliary) verb",
        roleMy: isBe ? "ဆက်စပ်ကြိယာ" : AUX_MY[w] ?? "အကူကြိယာ",
        tag: isBe ? "Linking Verb" : "Helping Verb",
      });
      i++;
    }

    // Subject noun phrase
    const np = consumeNounPhrase(words, i);
    if (np.end > i) {
      const chunk = words.slice(i, np.end).join(" ");
      tokens.push({
        text: chunk,
        role: "Subject (who/what the question is about)",
        roleMy: "ကံတ္တား (ဘယ်သူ/ဘာအကြောင်းလဲ)",
        tag: "Noun Subject",
      });
      i = np.end;
    }

    // Prepositional phrase short-circuit
    if (i < words.length && PREPS.has(words[i].toLowerCase())) {
      tokens.push({
        text: words.slice(i).join(" "),
        role: "Prepositional phrase (adds detail)",
        roleMy: "ဝိဘတ်စကားစု (နောက်ထပ် အချက်အလက်)",
        tag: "Prepositional Phrase",
      });
      i = words.length;
    } else if (i < words.length) {
      if (isBe) {
        // After a be-verb: remainder is a Complement, never an Object.
        tokens.push({
          text: words.slice(i).join(" "),
          role: "Complement (completes the meaning of the be-verb)",
          roleMy: "ဖြည့်စွက်စာ (be-ကြိယာ၏ အဓိပ္ပါယ်ကို ဖြည့်ပေး)",
          tag: "Complement",
        });
      } else {
        // Find the first verb-like word (skip articles/adjectives — they fold into the next noun).
        let v = i;
        while (v < words.length && (ARTICLES.has(words[v].toLowerCase()) || ADJ.has(words[v].toLowerCase()))) v++;
        if (v < words.length) {
          tokens.push({
            text: words[v],
            role: "Main verb (the action)",
            roleMy: "မူရင်းကြိယာ (လုပ်ဆောင်ချက်)",
            tag: "Main Verb",
          });
          const rest = words.slice(v + 1).join(" ").trim();
          // If we skipped articles/adjectives before the verb, glue them onto the rest as object.
          const skipped = words.slice(i, v).join(" ").trim();
          const objText = [skipped, rest].filter(Boolean).join(" ").trim();
          if (objText) {
            tokens.push({
              text: objText,
              role: "Object / Complement (the rest)",
              roleMy: "ကံ / ဖြည့်စွက်အပိုင်း",
              tag: "Noun Object",
            });
          }
        } else {
          // No verb found — treat remainder as complement.
          tokens.push({
            text: words.slice(i).join(" "),
            role: "Complement (the rest)",
            roleMy: "ဖြည့်စွက်အပိုင်း",
            tag: "Complement",
          });
        }
      }
    }

    return {
      sentence,
      intro: `This is a Wh-question starting with "${words[0]}".`,
      introMy: `ဒီမေးခွန်းက "${words[0]}" နဲ့ စတဲ့ Wh-question မေးခွန်းပါ။`,
      tokens,
      noteMy: isBe
        ? "ပုံစံ: WH-word → be-ကြိယာ → ကံတ္တား → ဖြည့်စွက်စာ ။"
        : "ပုံစံ: WH-word → အကူကြိယာ → ကံတ္တား → မူရင်းကြိယာ → ကံ ။",
    };
  }

  // ---------- Yes/No question ----------
  if (AUX.has(first) && isQuestion) {
    const w = first;
    const isBe = BE.has(w);
    tokens.push({
      text: words[0],
      role: isBe ? "Linking verb (be-form) at start = Yes/No question" : "Auxiliary at start = Yes/No question",
      roleMy: isBe ? "ဝါကျရှေ့ be-ကြိယာ → ဟုတ်/မဟုတ် မေးခွန်း" : "ဝါကျရှေ့ အကူကြိယာ → ဟုတ်/မဟုတ် မေးခွန်း",
      tag: isBe ? "Linking Verb" : "Helping Verb",
    });
    let i = 1;
    const np = consumeNounPhrase(words, i);
    if (np.end > i) {
      tokens.push({ text: words.slice(i, np.end).join(" "), role: "Subject", roleMy: "ကံတ္တား", tag: "Noun Subject" });
      i = np.end;
    }
    if (i < words.length) {
      tokens.push({
        text: words.slice(i).join(" "),
        role: isBe ? "Complement" : "Predicate (main verb + rest)",
        roleMy: isBe ? "ဖြည့်စွက်စာ" : "ကြိယာပိုင်း",
        tag: isBe ? "Complement" : "Predicate",
      });
    }
    return {
      sentence,
      intro: "This is a Yes/No question.",
      introMy: "ဒီမေးခွန်းက ဟုတ်/မဟုတ် မေးခွန်းပါ။",
      tokens,
      noteMy: "ပုံစံ: အကူ/be-ကြိယာ → ကံတ္တား → ကြိယာပိုင်း ။",
    };
  }

  // ---------- Declarative / fill-in sentence ----------
  // Subject noun phrase
  let i = 0;
  const subj = consumeNounPhrase(words, i);
  if (subj.end > i) {
    tokens.push({
      text: words.slice(i, subj.end).join(" "),
      role: "Subject",
      roleMy: "ကံတ္တား",
      tag: "Noun Subject",
    });
    i = subj.end;
  }

  // Verb
  if (i < words.length && AUX.has(words[i].toLowerCase())) {
    const w = words[i].toLowerCase();
    const isBe = BE.has(w);
    tokens.push({
      text: words[i],
      role: isBe ? "Linking verb (be-form)" : "Helping verb",
      roleMy: isBe ? "ဆက်စပ်ကြိယာ" : AUX_MY[w] ?? "အကူကြိယာ",
      tag: isBe ? "Linking Verb" : "Helping Verb",
    });
    i++;
    if (i < words.length) {
      tokens.push({
        text: words.slice(i).join(" "),
        role: isBe ? "Complement (completes the be-verb)" : "Predicate (rest of the sentence)",
        roleMy: isBe ? "ဖြည့်စွက်စာ (be-ကြိယာ၏ အဓိပ္ပါယ်ကို ဖြည့်)" : "ကြိယာပိုင်း",
        tag: isBe ? "Complement" : "Predicate",
      });
    }
    return {
      sentence,
      intro: isBe ? "This is a declarative sentence with a linking (be) verb." : "This is a declarative sentence.",
      introMy: isBe ? "ဒါက be-ကြိယာသုံး ပြောကြားချက် ဝါကျပါ။" : "ဒါက ပြောကြားချက် ဝါကျ ဖြစ်ပါတယ်။",
      tokens,
      noteMy: isBe
        ? "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Verb) → ဖြည့်စွက်စာ (Complement) ။"
        : "ပုံစံ: ကံတ္တား → အကူကြိယာ → ကြိယာပိုင်း ။",
    };
  }

  if (i < words.length) {
    // No be/aux verb found — treat next word as main verb.
    tokens.push({
      text: words[i],
      role: "Main verb",
      roleMy: "မူရင်းကြိယာ",
      tag: "Main Verb",
    });
    i++;
    if (i < words.length) {
      tokens.push({
        text: words.slice(i).join(" "),
        role: "Object / Complement",
        roleMy: "ကံ / ဖြည့်စွက်အပိုင်း",
        tag: "Noun Object",
      });
    }
  }

  if (tokens.length === 0) {
    tokens.push({ text: cleaned, role: "Sentence", roleMy: "ဝါကျ", tag: "Sentence" });
  }

  return {
    sentence,
    intro: "This looks like a statement to complete.",
    introMy: "ဒါက ဖြည့်စွက်ရမယ့် ဝါကျ ဖြစ်ပါတယ်။",
    tokens,
    noteMy: "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Verb) → ကံ/ဖြည့်စွက်စာ ။",
  };
}

// ---------- Burmese phrase + word hints ----------

// Whole-chunk overrides (matched case-insensitively, punctuation stripped).
const PHRASE_MY: Record<string, string> = {
  "the productive": "စွမ်းရည်ပြည့်ဝသော",
  "the receptive": "လက်ခံစုပ်ယူသော",
  "productive skills": "ထုတ်လုပ်နိုင်တဲ့ ကျွမ်းကျင်မှုများ",
  "receptive skills": "လက်ခံစုပ်ယူတဲ့ ကျွမ်းကျင်မှုများ",
  "of language": "ဘာသာစကား၏",
  "of english": "အင်္ဂလိပ်ဘာသာ၏",
  "your name": "သင့်နာမည်",
  "your country": "သင့်နိုင်ငံ",
  "in english": "အင်္ဂလိပ်လို",
  // Add this exact block below for the dynamic question phrase:
  "to learn any other foreign language apart from English? Why": "သို့မဟုတ် အင်္ဂလိပ်ဘာသာစကားမှလွဲ၍ အခြားနိုင်ငံခြားဘာသာစကားကို သင်ယူလိုပါသလား။ ဘာကြောင့်လဲ။",
  "to learn any other foreign language apart from english why": "သို့မဟုတ် အင်္ဂလိပ်ဘာသာစကားမှလွဲ၍ အခြားနိုင်ငံခြားဘာသာစကားကို သင်ယူလိုပါသလား။ ဘာကြောင့်လဲ။",
  // ---- Unit 2 (Literature) reading exercises ----
  "the difference": "ကွာခြားချက်",
  "between a painter and a writer": "ပန်းချီဆရာနှင့် စာရေးဆရာ အကြား",
  "between a comedy and a tragedy": "ဟာသဇာတ်နှင့် ဝမ်းနည်းဖွယ်ဇာတ် အကြား",
};

const WORD_MY: Record<string, string> = {
  i: "ငါ", you: "သင်", he: "သူ", she: "သူမ", it: "ဒါ", we: "ကျွန်တော်တို့", they: "သူတို့",
  my: "ငါ့ရဲ့", your: "သင့်ရဲ့", his: "သူ့ရဲ့", her: "သူမရဲ့", our: "ကျွန်တော်တို့ရဲ့", their: "သူတို့ရဲ့",
  a: "တစ်ခု", an: "တစ်ခု", the: "ထို",
  is: "ဖြစ်သည်", are: "ဖြစ်ကြသည်", am: "ဖြစ်သည်", was: "ဖြစ်ခဲ့သည်", were: "ဖြစ်ခဲ့ကြသည်",
  do: "လုပ်", does: "လုပ်", did: "လုပ်ခဲ့", have: "ရှိ", has: "ရှိ", had: "ရှိခဲ့",
  can: "နိုင်", will: "မည်", would: "မည်", should: "သင့်", may: "ဖြစ်နိုင်", might: "ဖြစ်နိုင်", must: "မဖြစ်မနေ",
  what: "ဘာ", when: "ဘယ်အချိန်", where: "ဘယ်မှာ", why: "ဘာကြောင့်", who: "ဘယ်သူ", how: "ဘယ်လို", which: "ဘယ်ဟာ", whose: "ဘယ်သူ့",
  not: "မ", and: "နှင့်", or: "သို့မဟုတ်", but: "ဒါပေမယ့်",
  to: "သို့", in: "ထဲမှာ", on: "အပေါ်မှာ", at: "မှာ", of: "၏", for: "အတွက်", with: "နှင့်အတူ", from: "မှ", by: "ဖြင့်", about: "အကြောင်း",
  name: "နာမည်", country: "နိုင်ငံ", language: "ဘာသာစကား", school: "ကျောင်း",
  teacher: "ဆရာ", student: "ကျောင်းသား", book: "စာအုပ်", day: "နေ့", time: "အချိန်", year: "နှစ်",
  skill: "ကျွမ်းကျင်မှု", skills: "ကျွမ်းကျင်မှုများ",
  productive: "စွမ်းရည်ပြည့်ဝသော", receptive: "လက်ခံစုပ်ယူသော",
  active: "တက်ကြွသော", passive: "ငြိမ်သက်သော",
  english: "အင်္ဂလိပ်", burmese: "မြန်မာ", myanmar: "မြန်မာ",
  this: "ဒါ", that: "ဟိုဟာ", these: "ဒါတွေ", those: "ဟိုဟာတွေ",
  go: "သွား", come: "လာ", make: "လုပ်", take: "ယူ", give: "ပေး", see: "မြင်",
  say: "ပြော", get: "ရ", know: "သိ", think: "ထင်", want: "လို", like: "ကြိုက်",
  live: "နေ", work: "လုပ်ငန်း", speak: "ပြော", read: "ဖတ်", write: "ရေး", listen: "နားထောင်",
  // ---- Unit 2 (Literature) reading exercises ----
  there: "အဲဒီမှာ", line: "စာကြောင်း", lines: "စာကြောင်းများ",
  sonnet: "ဆွန်နက် ကဗျာ", limerick: "လင်မရစ် ကဗျာ", tragicomedy: "နှစ်မျိုးရောနှောဇာတ်",
  classics: "ဂန္တဝင် စာပေများ", difference: "ကွာခြားချက်", between: "အကြားရှိ",
  painter: "ပန်းချီဆရာ", writer: "စာရေးဆရာ", comedy: "ဟာသဇာတ်", tragedy: "ဝမ်းနည်းဖွယ်ဇာတ်",
};

export function translateChunkMy(chunk: string): string {
  const norm = chunk.toLowerCase().replace(/[.,!?;:"'`']/g, "").trim();
  if (!norm) return "—";
  if (PHRASE_MY[norm]) return PHRASE_MY[norm];

  const parts = norm.split(/\s+/).filter(Boolean);
  const mapped = parts.map((p) => WORD_MY[p] ?? p);
  return mapped.join(" ");
}

// Structured "train car" data for the visual sentence-structure breakdown.
export type TrainCar = {
  word: string;
  translation: string;
  tag: string;
};

export function buildTrainCars(sentence: string): { sentence: string; cars: TrainCar[]; introMy: string; noteMy: string } {
  // Hardcoded overrides for sentences the generic parser cannot split cleanly
  // (e.g. infinitive "to" inside the subject or predicate). Keys are normalized:
  // lowercased, blanks collapsed to "_", trailing punctuation removed.
  const override = SENTENCE_OVERRIDES[normalizeSentenceKey(sentence)];
  if (override) {
    return {
      sentence: sentence.trim(),
      cars: override.cars,
      introMy: override.introMy,
      noteMy: override.noteMy,
    };
  }

  const result = analyzeQuestion(sentence);
  const cars: TrainCar[] = result.tokens.map((t) => ({
    word: t.text,
    translation: translateChunkMy(t.text),
    tag: t.tag,
  }));
  return { sentence: result.sentence, cars, introMy: result.introMy, noteMy: result.noteMy };
}

function normalizeSentenceKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/_+/g, "_")
    .replace(/\s+/g, " ")
    .replace(/[.?!]+$/, "")
    .trim();
}

type Override = { cars: TrainCar[]; introMy: string; noteMy: string };

const SENTENCE_OVERRIDES: Record<string, Override> = {
  "the first language skill to develop is _": {
    cars: [
      {
        word: "The first language skill to develop",
        translation: "ဘာသာစကားစွမ်းရည် တိုးတက်အောင် ပထမဆုံး လုပ်ဆောင်ရမည့်အရာမှာ",
        tag: "Noun Subject",
      },
      { word: "is", translation: "ဖြစ်သည်", tag: "Main Verb" },
      { word: "_______", translation: "_______", tag: "Complement" },
    ],
    introMy: "ဒါက Subject → Verb → Complement ပုံစံ ပြောကြားချက် ဝါကျပါ။",
    noteMy: "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Verb \"is\") → ဖြည့်စွက်စာ (Complement) ။",
  },
  "a baby begins to speak at the age of _": {
    cars: [
      { word: "A baby", translation: "ကလေးငယ်တစ်ဦးသည်", tag: "Noun Subject" },
      { word: "begins", translation: "စတင်သည်", tag: "Main Verb" },
      {
        word: "to speak at the age of _______",
        translation: "_______ အသက်အရွယ်တွင် စကားပြောရန်",
        tag: "Noun Object",
      },
    ],
    introMy:
      "ဒါက Subject → Verb → Object ပုံစံ ပြောကြားချက် ဝါကျပါ။ \"begins to speak\" သည် ပေါင်းစပ်ကြိယာဖြစ်ပြီး \"begins\" သာ Main Verb ဖြစ်သည်။",
    noteMy:
      "ပုံစံ: ကံတ္တား (Subject) → ကြိယာ (Verb \"begins\") → ကံ (Object) ။ \"to\" ကို တစ်ခုတည်း Main Verb အဖြစ် မထုတ်ပါ။",
  },

  /* -------------------- Unit 2 (Literature) reading -------------------- */

  "a painter uses colours. a writer uses _": {
    cars: [
      { word: "A painter uses colours.", translation: "ပန်းချီဆရာတစ်ဦးသည် အရောင်များကို အသုံးပြုသည်။", tag: "Sentence" },
      { word: "A writer", translation: "စာရေးဆရာတစ်ဦးသည်", tag: "Noun Subject" },
      { word: "uses", translation: "အသုံးပြုသည်", tag: "Main Verb" },
      { word: "_______", translation: "_______", tag: "Noun Object" },
    ],
    introMy: "ဒါက ဝါကျနှစ်ခုပါတဲ့ ဖြည့်စွက်ရမယ့် စာကြောင်းပါ။ ပထမဝါကျက နမူနာဖြစ်ပြီး ဒုတိယဝါကျရဲ့ ကံ (Object) နေရာကို ဖြည့်ရမှာပါ။",
    noteMy: "ပုံစံ: ကံတ္တား (A writer) → ကြိယာ (uses) → ကံ (______) ။ ပထမဝါကျက \"painter ↔ writer\" နှိုင်းယှဉ်ချက်ကို ပြထားတာပါ။",
  },
  "the three subjects under literature are: _": {
    cars: [
      { word: "The three subjects under literature", translation: "စာပေ၏အောက်ရှိ အခန်းကဏ္ဍ သုံးခုမှာ", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "_______", translation: "_______", tag: "Complement" },
    ],
    introMy: "ဒါက be-ကြိယာသုံး ပြောကြားချက် ဝါကျပါ။ \"under literature\" သည် ဝိဘတ်စကားစုဖြစ်ပြီး ကံတ္တားထဲမှာ ပါဝင်နေပါတယ်။",
    noteMy: "ပုံစံ: ကံတ္တား (The three subjects under literature) → be-ကြိယာ (are) → ဖြည့်စွက်စာ (______) ။",
  },
  "the author or writer of pride and prejudice was _": {
    cars: [
      { word: "The author or writer of Pride and Prejudice", translation: "Pride and Prejudice ၏ စာရေးဆရာ (သို့မဟုတ်) ရေးသားသူမှာ", tag: "Noun Subject" },
      { word: "was", translation: "ဖြစ်ခဲ့သည်", tag: "Linking Verb" },
      { word: "_______", translation: "_______", tag: "Complement" },
    ],
    introMy: "ဒါက be-ကြိယာသုံး ပြောကြားချက် ဝါကျပါ။ \"of Pride and Prejudice\" သည် \"author\" ကို ဖော်ပြတဲ့ ဝိဘတ်စကားစုပါ။",
    noteMy: "ပုံစံ: ကံတ္တား → be-ကြိယာ (was) → ဖြည့်စွက်စာ (______) ။ \"Pride and Prejudice\" သည် ဝတ္ထုခေါင်းစဉ်ဖြစ်လို့ ဘာသာမပြန်ပါ။",
  },
  "for whom the bell tolls was written by _": {
    cars: [
      { word: "For Whom the Bell Tolls", translation: "For Whom the Bell Tolls (ဝတ္ထုခေါင်းစဉ်) သည်", tag: "Noun Subject" },
      { word: "was written", translation: "ရေးသားခံခဲ့ရသည် (passive)", tag: "Main Verb" },
      { word: "by _______", translation: "______ က", tag: "Prepositional Phrase" },
    ],
    introMy: "ဒါက passive voice (ကံပြုပုံစံ) ဝါကျပါ။ \"by ______\" က လုပ်ဆောင်သူ (agent) ကို ပြပါတယ်။",
    noteMy: "ပုံစံ: ကံ (ဝတ္ထုခေါင်းစဉ်) → passive ကြိယာ (was written) → by + လုပ်ဆောင်သူ ။",
  },
  "the three kinds of drama are: _": {
    cars: [
      { word: "The three kinds of drama", translation: "ပြဇာတ် အမျိုးအစား သုံးမျိုးမှာ", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "_______", translation: "_______", tag: "Complement" },
    ],
    introMy: "ဒါက be-ကြိယာသုံး ပြောကြားချက် ဝါကျပါ။ \"of drama\" သည် \"kinds\" ကို ဖော်ပြတဲ့ ဝိဘတ်စကားစုပါ။",
    noteMy: "ပုံစံ: ကံတ္တား (The three kinds of drama) → be-ကြိယာ (are) → ဖြည့်စွက်စာ (______) ။",
  },
  "a play that has a sad ending is a _": {
    cars: [
      { word: "A play that has a sad ending", translation: "ဝမ်းနည်းဖွယ် အဆုံးသတ်ရှိသော ပြဇာတ်တစ်ပုဒ်သည်", tag: "Noun Subject" },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "a _______", translation: "______ တစ်မျိုး", tag: "Complement" },
    ],
    introMy: "\"that has a sad ending\" သည် \"play\" ကို ပြန်ဖော်ပြတဲ့ relative clause (ဆက်စပ်အခန်း) ဖြစ်ပြီး ကံတ္တားထဲမှာ ပါဝင်နေပါတယ်။",
    noteMy: "ပုံစံ: ကံတ္တား (A play + that has a sad ending) → be-ကြိယာ (is) → ဖြည့်စွက်စာ (a ______) ။",
  },
  "yatu., yagan, aye-gyin:, and baw-lai are different kinds of myanmar _": {
    cars: [
      { word: "Yatu., yagan, aye-gyin:, and baw-lai", translation: "ရတု၊ ရကန်၊ အေးချင်း နှင့် ဘောလယ် တို့သည်", tag: "Noun Subject" },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "different kinds of Myanmar _______", translation: "မြန်မာ ______ ၏ မတူညီသော အမျိုးအစားများ", tag: "Complement" },
    ],
    introMy: "\"Yatu, yagan, aye-gyin, baw-lai\" တို့သည် မြန်မာရိုးရာ ကဗျာအမျိုးအစားများ ဖြစ်ပြီး အဲဒါတွေအကုန်လုံးက ကံတ္တားပါ။",
    noteMy: "ပုံစံ: ကံတ္တား (ကဗျာအမည် လေးမျိုး) → be-ကြိယာ (are) → ဖြည့်စွက်စာ ။",
  },
  "who wrote wuthering heights": {
    cars: [
      { word: "Who", translation: "ဘယ်သူ", tag: "WH-Question Word" },
      { word: "wrote", translation: "ရေးသားခဲ့သနည်း", tag: "Main Verb" },
      { word: "Wuthering Heights", translation: "Wuthering Heights (ဝတ္ထုခေါင်းစဉ်) ကို", tag: "Noun Object" },
    ],
    introMy: "\"Who\" က ဒီမှာ ကံတ္တားအဖြစ် သုံးထားလို့ \"do/does/did\" လို အကူကြိယာ မလိုအပ်ပါဘူး။",
    noteMy: "ပုံစံ: Who (ကံတ္တား) → ကြိယာ (wrote) → ကံ (Wuthering Heights) ။",
  },
  "who wrote the play as you like it": {
    cars: [
      { word: "Who", translation: "ဘယ်သူ", tag: "WH-Question Word" },
      { word: "wrote", translation: "ရေးသားခဲ့သနည်း", tag: "Main Verb" },
      { word: "the play As You Like It", translation: "As You Like It ပြဇာတ်ကို", tag: "Noun Object" },
    ],
    introMy: "\"As You Like It\" သည် ပြဇာတ်ခေါင်းစဉ်ဖြစ်လို့ တစ်လုံးချင်း ဘာသာမပြန်ရပါ — တစ်ခုလုံးကို ခေါင်းစဉ်အဖြစ် ကိုင်တွယ်ပါ။",
    noteMy: "ပုံစံ: Who (ကံတ္တား) → ကြိယာ (wrote) → ကံ (the play As You Like It) ။",
  },
  "can a news article be regarded as literature? why": {
    cars: [
      { word: "Can", translation: "…နိုင်ပါသလား", tag: "Helping Verb" },
      { word: "a news article", translation: "သတင်းဆောင်းပါးတစ်ပုဒ်ကို", tag: "Noun Subject" },
      { word: "be regarded as literature", translation: "စာပေအဖြစ် သတ်မှတ်ခံရ", tag: "Predicate" },
      { word: "Why?", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
    introMy: "မေးခွန်းနှစ်ခု တွဲထားပါတယ် — ပထမတစ်ခုက passive ပုံစံ \"be regarded as\" သုံး ဟုတ်/မဟုတ် မေးခွန်း၊ ဒုတိယတစ်ခုက \"Why\" အကြောင်းရင်း မေးခွန်းပါ။",
    noteMy: "ပုံစံ: အကူကြိယာ (Can) → ကံတ္တား → ကြိယာပိုင်း (be regarded as …) + Why? ။ \"be regarded as\" = …အဖြစ် သတ်မှတ်ခံရသည်။",
  },
  "when can a piece of writing be recognized as literature": {
    cars: [
      { word: "When", translation: "ဘယ်အချိန်တွင်", tag: "WH-Question Word" },
      { word: "can", translation: "နိုင်", tag: "Helping Verb" },
      { word: "a piece of writing", translation: "အရေးအသားတစ်ခုကို", tag: "Noun Subject" },
      { word: "be recognized as literature", translation: "စာပေအဖြစ် အသိအမှတ်ပြုခံရ", tag: "Predicate" },
    ],
    introMy: "\"be recognized as\" သည် passive ကြိယာဖြစ်ပြီး \"…အဖြစ် အသိအမှတ်ပြုခံရသည်\" ဟု အဓိပ္ပာယ်ရပါတယ်။",
    noteMy: "ပုံစံ: WH-word (When) → အကူကြိယာ (can) → ကံတ္တား → passive ကြိယာပိုင်း (be recognized as …) ။",
  },
  "what is drama meant for": {
    cars: [
      { word: "What … for", translation: "ဘာအတွက် … လဲ", tag: "WH-Question Word" },
      { word: "is drama meant", translation: "ပြဇာတ်ကို ရည်ရွယ် ရေးသားခြင်း ဖြစ်သနည်း", tag: "Predicate" },
    ],
    introMy: "\"What is … meant for?\" ဆိုတာက \"… ကို ဘာအတွက် ရည်ရွယ်တာလဲ\" လို့ မေးတဲ့ ပုံစံပါ။ \"for\" က \"What\" နဲ့ တွဲလုပ်နေတာပါ။",
    noteMy: "ပုံစံ: What … for + be-ကြိယာ + ကံတ္တား + meant ။ \"be meant for\" = ရည်ရွယ်ထားခြင်း ဖြစ်သည်။",
  },
  "which do you like: comedy, tragedy or tragicomedy? explain why you like it": {
    cars: [
      { word: "Which", translation: "ဘယ်တစ်ခုကို", tag: "WH-Question Word" },
      { word: "do you like", translation: "သင်ှစ်သက်သနည်း", tag: "Main Verb" },
      { word: "comedy, tragedy or tragicomedy", translation: "ဟာသဇာတ်၊ ဝမ်းနည်းဖွယ်ဇာတ် သို့မဟုတ် နှစ်မျိုးရောနှောဇာတ်", tag: "Noun Object" },
      { word: "Explain why you like it", translation: "သင် နှစ်သက်ရသည့် အကြောင်းရင်းကို ရှင်းပြပါ", tag: "Sentence" },
    ],
    introMy: "ဝါကျနှစ်ခုပါဝင်ပါတယ် — ပထမတစ်ခုက ရွေးချယ်ခိုင်း မေးခွန်း (Which do you like …)၊ ဒုတိယတစ်ခုက ရှင်းပြခိုင်းတဲ့ command ဝါကျ (Explain …) ပါ။",
    noteMy: "ပုံစံ: Which → အကူကြိယာ (do) → ကံတ္တား (you) → ကြိယာ (like) → ရွေးစရာများ ။",
  },
  "do you wish to be a famous author? why or why not": {
    cars: [
      { word: "Do", translation: "…ပါသလား", tag: "Helping Verb" },
      { word: "you", translation: "သင်", tag: "Noun Subject" },
      { word: "wish to be a famous author", translation: "နာမည်ကျော် စာရေးဆရာတစ်ဦး ဖြစ်လိုသည်", tag: "Predicate" },
      { word: "Why or why not?", translation: "ဘာကြောင့် ဖြစ်လို (သို့မဟုတ်) မဖြစ်လိုသနည်း", tag: "WH-Question Word" },
    ],
    introMy: "ဟုတ်/မဟုတ် မေးခွန်း (Do you wish …) နဲ့ အကြောင်းရင်း မေးခွန်း (Why or why not?) တွဲထားပါတယ်။",
    noteMy: "ပုံစံ: အကူကြိယာ (Do) → ကံတ္တား (you) → ကြိယာပိုင်း (wish to be …) ။ \"wish to be\" = …ဖြစ်လိုသည်။",
  },

  /* ---------------------- Unit 3 (Zero) reading — Part A ---------------------- */

  'the word "those" in line 3 refers to _': {
    cars: [
      {
        word: 'The word "those" in line 3',
        translation: "စာကြောင်းရေ ၃ တွင်ပါရှိသော “ထိုအရာများ” ဟူသည့် စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refers to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy:
      "ဒါက ကတ္တား → ကြိယာ → ဖြည့်စွက်စာ ပုံစံ ဖြည့်စွက်ရမည့် ဝါကျပါ။ “in line 3” သည် ကတ္တားကို ဖော်ပြပေးသည့် စကားစုဖြစ်ပြီး ကတ္တားအတွင်း ပါဝင်နေပါတယ်။",
    noteMy:
      "ပုံစံ: ကတ္တား (စကားလုံးအမည်နှင့် စာကြောင်းအမှတ်) → ကြိယာ (refers to) → ဖြည့်စွက်စာ ။ ဝိဘတ်ကို တစ်လုံးတည်း ခွဲမထုတ်ပါ။",
  },
  "one word in line 10 which means the same as plain, or simple, is _": {
    cars: [
      {
        word: "One word in line 10 which means the same as plain, or simple,",
        translation:
          "စာကြောင်းရေ ၁၀ တွင်ပါရှိပြီး “ရိုးရှင်းသော” သို့မဟုတ် “လွယ်ကူသော” နှင့် အဓိပ္ပာယ်တူသော စကားလုံးတစ်လုံးမှာ",
        tag: "Noun Subject",
      },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy:
      "“which means the same as …” သည် “one word” ကို ပြန်ဖော်ပြသည့် ဆက်စပ်အခန်း (relative clause) ဖြစ်ပြီး ကတ္တားအတွင်းသာ ပါဝင်သည်။ အဓိကကြိယာမှာ “is” သာ ဖြစ်ပါတယ်။",
    noteMy: "ပုံစံ: ကတ္တား (စကားလုံး + ဆက်စပ်အခန်း) → be-ကြိယာ (is) → ဖြည့်စွက်စာ ။",
  },
  "the two kinds of numerals are _": {
    cars: [
      {
        word: "The two kinds of numerals",
        translation: "ဂဏန်းအမျိုးအစား နှစ်မျိုးမှာ",
        tag: "Noun Subject",
      },
      { word: "are", translation: "ဖြစ်ကြသည်", tag: "Linking Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy: "ဒါက be-ကြိယာသုံး ပြောကြားချက် ဝါကျပါ။ “of numerals” သည် “kinds” ကို ဖော်ပြသည့် စကားစုဖြစ်ပြီး ကတ္တားအတွင်း ပါဝင်သည်။",
    noteMy: "ပုံစံ: ကတ္တား (ဂဏန်းအမျိုးအစား နှစ်မျိုး) → be-ကြိယာ (are) → ဖြည့်စွက်စာ ။",
  },
  'the word "this" in line 18 refers to _': {
    cars: [
      {
        word: 'The word "This" in line 18',
        translation: "စာကြောင်းရေ ၁၈ တွင်ပါရှိသော “ဤအရာ” ဟူသည့် စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refers to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy: "ဒါက ကတ္တား → ကြိယာ → ဖြည့်စွက်စာ ပုံစံ ဝါကျပါ။ အဓိကကြိယာမှာ “refers to” ဖြစ်သည်။",
    noteMy: "ပုံစံ: ကတ္တား → ကြိယာ (refers to) → ဖြည့်စွက်စာ ။ စာကြောင်းအမှတ်ကို ကတ္တားနှင့် တွဲဖတ်ပါ။",
  },
  'the word "it" in line 27 refers to _': {
    cars: [
      {
        word: 'The word "it" in line 27',
        translation: "စာကြောင်းရေ ၂၇ တွင်ပါရှိသော “ထိုအရာ” ဟူသည့် စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refers to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy: "ဒါက ကတ္တား → ကြိယာ → ဖြည့်စွက်စာ ပုံစံ ဝါကျပါ။ နာမ်စားက ဘာကို ရည်ညွှန်းသလဲ ရှာရမည်။",
    noteMy: "ပုံစံ: ကတ္တား → ကြိယာ (refers to) → ဖြည့်စွက်စာ ။",
  },
  "it was the hindu mathematicians who _": {
    cars: [
      { word: "It was", translation: "…သာ ဖြစ်ခဲ့သည်", tag: "Linking Verb" },
      {
        word: "the Hindu mathematicians",
        translation: "ဟိန္ဒူ သင်္ချာပညာရှင်များ",
        tag: "Complement",
      },
      { word: "who ________", translation: "________ ခဲ့သူများမှာ", tag: "Relative Clause" },
    ],
    introMy:
      "ဒါက အလေးထားပြောသည့် (cleft) ဝါကျပုံစံပါ — “It was … who …” ဖြင့် လုပ်ဆောင်သူကို ထင်ရှားစွာ ဖော်ပြပါတယ်။",
    noteMy: "ပုံစံ: It + be-ကြိယာ (was) → အလေးထားခံ အပိုင်း → who + ကြိယာပိုင်း ။",
  },
  "the arabic word for zero is _": {
    cars: [
      {
        word: "The Arabic word for zero",
        translation: "သုညကို ဆိုလိုသည့် အာရေဗီ စကားလုံးမှာ",
        tag: "Noun Subject",
      },
      { word: "is", translation: "ဖြစ်သည်", tag: "Linking Verb" },
      { word: "________", translation: "________", tag: "Complement" },
    ],
    introMy: "“for zero” သည် စကားလုံးကို ဖော်ပြသည့် စကားစုဖြစ်ပြီး ကတ္တားအတွင်း ပါဝင်သည်။",
    noteMy: "ပုံစံ: ကတ္တား → be-ကြိယာ (is) → ဖြည့်စွက်စာ ။",
  },

  /* ---------------------- Unit 3 (Zero) reading — Part B ---------------------- */

  "what is the passage about": {
    cars: [
      { word: "What … about", translation: "ဘာအကြောင်း … လဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "the passage", translation: "ဤစာပိုဒ်သည်", tag: "Noun Subject" },
    ],
    introMy:
      "“What … about?” သည် “ဘာအကြောင်း ရေးထားတာလဲ” ဟု မေးသည့် ပုံစံပါ။ “about” က “What” နှင့် တွဲဖက်နေသဖြင့် တစ်လုံးတည်း ခွဲမထုတ်ပါ။",
    noteMy: "ပုံစံ: What … about + be-ကြိယာ (is) + ကတ္တား (the passage) ။",
  },
  "what is the main difference between the two kinds of numerals": {
    cars: [
      { word: "What", translation: "ဘာလဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the main difference between the two kinds of numerals",
        translation: "ဂဏန်းအမျိုးအစား နှစ်မျိုးအကြား အဓိက ကွာခြားချက်မှာ",
        tag: "Noun Subject",
      },
    ],
    introMy:
      "ဒါက be-ကြိယာသုံး WH-မေးခွန်းပါ။ “between the two kinds of numerals” သည် “difference” ကို ဖော်ပြသဖြင့် ကတ္တားနှင့် တွဲဖတ်ရသည်။",
    noteMy: "ပုံစံ: What → be-ကြိယာ (is) → ကတ္တား (ကွာခြားချက်) ။",
  },
  "which of the two kinds of numerals is easy to use? why": {
    cars: [
      {
        word: "Which of the two kinds of numerals",
        translation: "ဂဏန်းအမျိုးအစား နှစ်မျိုးအနက် မည်သည့်အမျိုးအစားသည်",
        tag: "Noun Subject",
      },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "easy to use", translation: "အသုံးပြုရ လွယ်ကူသည်", tag: "Complement" },
      { word: "Why?", translation: "အဘယ်ကြောင့်နည်း", tag: "WH-Question Word" },
    ],
    introMy:
      "မေးခွန်းနှစ်ခု တွဲထားပါတယ် — ပထမတစ်ခုက ရွေးချယ်ခိုင်းသည့် မေးခွန်း၊ ဒုတိယတစ်ခုက အကြောင်းရင်း မေးသည့် မေးခွန်းပါ။",
    noteMy: "ပုံစံ: Which + ကတ္တား → be-ကြိယာ (is) → ဖြည့်စွက်စာ (easy to use) + Why? ။",
  },
  "what does the hindu word for zero mean": {
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "does", translation: "…သနည်း", tag: "Helping Verb" },
      {
        word: "the Hindu word for zero",
        translation: "သုညကို ဆိုလိုသည့် ဟိန္ဒူ စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "mean", translation: "အဓိပ္ပာယ်ရသည်", tag: "Main Verb" },
    ],
    introMy: "“does” သည် အကူကြိယာဖြစ်ပြီး အဓိကကြိယာမှာ “mean” ဖြစ်သည်။",
    noteMy: "ပုံစံ: What → အကူကြိယာ (does) → ကတ္တား → အဓိကကြိယာ (mean) ။",
  },
  'what does "0" represent in scales and coordinate axes': {
    cars: [
      { word: "What", translation: "ဘာကို", tag: "WH-Question Word" },
      { word: "does", translation: "…သနည်း", tag: "Helping Verb" },
      { word: '"0"', translation: "“၀” သည်", tag: "Noun Subject" },
      { word: "represent", translation: "ကိုယ်စားပြုသည်", tag: "Main Verb" },
      {
        word: "in scales and coordinate axes",
        translation: "အတိုင်းအတာ စကေးများနှင့် ဝင်ရိုးများပေါ်တွင်",
        tag: "Prepositional Phrase",
      },
    ],
    introMy:
      "အဓိကကြိယာမှာ “represent” ဖြစ်သည်။ “in” သည် ဝိဘတ်သာဖြစ်ပြီး ကြိယာ မဟုတ်ပါ — နောက်ရှိ စကားစုနှင့် တွဲဖတ်ရသည်။",
    noteMy: "ပုံစံ: What → အကူကြိယာ (does) → ကတ္တား → အဓိကကြိယာ (represent) → ဝိဘတ်စကားစု ။",
  },
  "when did the hindu mathematicians discover zero": {
    cars: [
      { word: "When", translation: "ဘယ်အချိန်တွင်", tag: "WH-Question Word" },
      { word: "did", translation: "…ခဲ့သနည်း", tag: "Helping Verb" },
      {
        word: "the Hindu mathematicians",
        translation: "ဟိန္ဒူ သင်္ချာပညာရှင်များသည်",
        tag: "Noun Subject",
      },
      { word: "discover", translation: "ရှာဖွေတွေ့ရှိသည်", tag: "Main Verb" },
      { word: "zero", translation: "သုညကို", tag: "Noun Object" },
    ],
    introMy: "အကူကြိယာ “did” ရှိသဖြင့် အဓိကကြိယာကို အခြေပုံစံ (discover) အတိုင်း ရေးရသည်။",
    noteMy: "ပုံစံ: When → အကူကြိယာ (did) → ကတ္တား → အဓိကကြိယာ (discover) → ကံ (zero) ။",
  },
  "what is the other english word for zero": {
    cars: [
      { word: "What", translation: "ဘာလဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the other English word for zero",
        translation: "သုညကို ဆိုလိုသည့် အခြား အင်္ဂလိပ် စကားလုံးမှာ",
        tag: "Noun Subject",
      },
    ],
    introMy: "ဒါက be-ကြိယာသုံး WH-မေးခွန်းပါ။ “for zero” က စကားလုံးကို ဖော်ပြသည့် အပိုင်းပါ။",
    noteMy: "ပုံစံ: What → be-ကြိယာ (is) → ကတ္တား ။",
  },
  'how do we use "0" today': {
    cars: [
      { word: "How", translation: "ဘယ်လို", tag: "WH-Question Word" },
      { word: "do", translation: "…သနည်း", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "use", translation: "အသုံးပြုသည်", tag: "Main Verb" },
      { word: '"0"', translation: "“၀” ကို", tag: "Noun Object" },
      { word: "today", translation: "ယနေ့အချိန်တွင်", tag: "Adverb" },
    ],
    introMy: "အဓိကကြိယာမှာ “use” ဖြစ်ပြီး “do” သည် မေးခွန်းပြုလုပ်ရန် အကူကြိယာသာ ဖြစ်သည်။",
    noteMy: "ပုံစံ: How → အကူကြိယာ (do) → ကတ္တား (we) → အဓိကကြိယာ (use) → ကံ → ကာလပြ စကားလုံး ။",
  },

  /* ------------- Unit 10 (Food Safety) — 10A Reading / 10B Vocabulary ------------- */

  "what are living things": {
    cars: [
      { word: "What", translation: "ဘာတွေလဲ", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်ကြသနည်း", tag: "Linking Verb" },
      { word: "living things", translation: "သက်ရှိသတ္တဝါများ", tag: "Noun Subject" },
    ],
    introMy: "ဒါက be-ကြိယာ “are” သုံးထားတဲ့ WH-မေးခွန်းပါ။ အဖြေမှာ ကတ္တားကို ပြန်ရှင်းပြရမည်။",
    noteMy: "ပုံစံ: WH-စကားလုံး → be-ကြိယာ (are) → ကတ္တား ။",
  },
  "name three kinds of food you eat almost every day": {
    cars: [
      { word: "Name", translation: "အမည်ဖော်ပြပါ", tag: "Main Verb" },
      { word: "three kinds of food", translation: "အစားအစာ သုံးမျိုးကို", tag: "Noun Object" },
      {
        word: "you eat almost every day",
        translation: "သင် နေ့စဉ်လိုလို စားသုံးသော",
        tag: "Relative Clause",
      },
    ],
    introMy:
      "ဒါက အမိန့်ပြု (imperative) ဝါကျပါ။ ကတ္တား (you) ကို ဖော်ပြထားခြင်း မရှိဘဲ ကြိယာ “Name” နဲ့ တိုက်ရိုက် စပါတယ်။",
    noteMy: "ပုံစံ: ကြိယာ (Name) → ကံ (three kinds of food) → ကံကို ဖော်ပြသည့် ဆက်စပ်အခန်း ။",
  },
  "why are fresh fruits and vegetables good for us": {
    cars: [
      { word: "Why", translation: "ဘာကြောင့်လဲ", tag: "WH-Question Word" },
      { word: "are", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "fresh fruits and vegetables",
        translation: "လတ်လတ်ဆတ်ဆတ် သစ်သီးများနှင့် ဟင်းသီးဟင်းရွက်များသည်",
        tag: "Noun Subject",
      },
      { word: "good for us", translation: "ကျွန်ုပ်တို့အတွက် ကောင်းမွန်သော", tag: "Complement" },
    ],
    introMy:
      "အကြောင်းရင်း မေးသည့် မေးခွန်းဖြစ်လို့ အဖြေမှာ “because …” ဖြင့် ရှင်းပြရမည်။",
    noteMy: "ပုံစံ: Why → be-ကြိယာ (are) → ကတ္တား → ဖြည့်စွက်စာ ။",
  },
  "what is a balanced diet": {
    cars: [
      { word: "What", translation: "ဘာလဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      { word: "a balanced diet", translation: "မျှတသော အစားအစာ ဆိုသည်မှာ", tag: "Noun Subject" },
    ],
    introMy: "အဓိပ္ပာယ် သတ်မှတ်ချက် မေးသည့် မေးခွန်းပါ။ အဖြေကို “A balanced diet is …” ဖြင့် စရေးရမည်။",
    noteMy: "ပုံစံ: What → be-ကြိယာ (is) → ကတ္တား ။",
  },
  "what can happen to us when we have a wrong combination of food": {
    cars: [
      { word: "What", translation: "ဘာဖြစ်နိုင်သလဲ", tag: "WH-Question Word" },
      { word: "can happen", translation: "ဖြစ်ပေါ်နိုင်သည်", tag: "Main Verb" },
      { word: "to us", translation: "ကျွန်ုပ်တို့အပေါ်", tag: "Prepositional Phrase" },
      {
        word: "when we have a wrong combination of food",
        translation: "အစားအစာ မှားယွင်းစွာ ပေါင်းစပ်စားသုံးသည့်အခါ",
        tag: "Adverb Clause",
      },
    ],
    introMy:
      "“What” သည် ကတ္တားနေရာမှာ ရှိသည်။ “can happen” သည် modal + အဓိကကြိယာ တစ်စုံဖြစ်ပြီး ခွဲထုတ်လို့ မရပါ။",
    noteMy: "ပုံစံ: What (ကတ္တား) → modal + ကြိယာ (can happen) → ဝိဘတ်စကားစု → အချိန်ပြ အခန်း ။",
  },
  "what examples of preserved food are given in the passage": {
    cars: [
      { word: "What examples of preserved food", translation: "ထိန်းသိမ်းထားသော အစားအစာ နမူနာများ", tag: "Noun Subject" },
      { word: "are given", translation: "ဖော်ပြထားသနည်း", tag: "Main Verb" },
      { word: "in the passage", translation: "စာပိုဒ်အတွင်း", tag: "Prepositional Phrase" },
    ],
    introMy:
      "ဒါက passive voice (ကံပြု) မေးခွန်းပါ။ “are given” ကို တစ်စုံအဖြစ် ဖတ်ရမည်။",
    noteMy: "ပုံစံ: မေးခွန်း ကတ္တား → passive ကြိယာ (are given) → ဝိဘတ်စကားစု ။",
  },
  "what kind of fruits and vegetables should we eat": {
    cars: [
      {
        word: "What kind of fruits and vegetables",
        translation: "မည်သည့် သစ်သီးနှင့် ဟင်းသီးဟင်းရွက် အမျိုးအစားကို",
        tag: "Noun Object",
      },
      { word: "should", translation: "သင့်သနည်း", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "eat", translation: "စားသုံးရန်", tag: "Main Verb" },
    ],
    introMy:
      "“What kind of …” တစ်စုံလုံးသည် ကံဖြစ်ပြီး ဝါကျအစသို့ ရွှေ့ထားသည်။ ကတ္တားမှာ “we” ဖြစ်သည်။",
    noteMy: "ပုံစံ: ကံ (What kind of …) → modal (should) → ကတ္တား (we) → အဓိကကြိယာ (eat) ။",
  },
  "what is the food and drug administration (fda) responsible for": {
    cars: [
      { word: "What", translation: "ဘာအတွက်လဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the Food and Drug Administration (FDA)",
        translation: "အစားအသောက်နှင့် ဆေးဝါး ကွပ်ကဲရေး ဌာန (FDA) သည်",
        tag: "Noun Subject",
      },
      { word: "responsible for", translation: "တာဝန်ရှိသော", tag: "Complement" },
    ],
    introMy:
      "“responsible for” သည် ဝိဘတ်ပါဝင်သော နာမဝိသေသန စကားစုဖြစ်ပြီး “for” သည် မေးခွန်း၏ အဆုံးမှာ ကျန်ရှိသည်။",
    noteMy: "ပုံစံ: What → be-ကြိယာ (is) → ကတ္တား → ဖြည့်စွက်စာ (responsible for) ။",
  },
  "what do we need food for": {
    cars: [
      { word: "What", translation: "ဘာအတွက်လဲ", tag: "WH-Question Word" },
      { word: "do", translation: "…သနည်း", tag: "Helping Verb" },
      { word: "we", translation: "ကျွန်ုပ်တို့သည်", tag: "Noun Subject" },
      { word: "need", translation: "လိုအပ်သည်", tag: "Main Verb" },
      { word: "food", translation: "အစားအစာကို", tag: "Noun Object" },
      { word: "for", translation: "အတွက်", tag: "Prepositional Phrase" },
    ],
    introMy:
      "ရည်ရွယ်ချက် မေးသည့် မေးခွန်းပါ။ “for” သည် “What” နှင့် တွဲဖက်ပြီး ဝါကျအဆုံးမှာ ကျန်ရှိသည်။",
    noteMy: "ပုံစံ: What → အကူကြိယာ (do) → ကတ္တား → အဓိကကြိယာ (need) → ကံ → ဝိဘတ် (for) ။",
  },
  "what does the underlined word 'those' in line 10 refer to": {
    cars: [
      { word: "What", translation: "ဘာကိုလဲ", tag: "WH-Question Word" },
      { word: "does", translation: "…သနည်း", tag: "Helping Verb" },
      {
        word: "the underlined word 'those' in line 10",
        translation: "စာကြောင်း ၁၀ တွင် မျဉ်းသားထားသော “those” စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refer to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
    ],
    introMy:
      "“refer to” သည် ဝိဘတ်ပါ ကြိယာ (phrasal verb) ဖြစ်လို့ တစ်စုံလုံးကို အဓိကကြိယာအဖြစ် သတ်မှတ်ရမည်။",
    noteMy: "ပုံစံ: What → အကူကြိယာ (does) → ကတ္တား → ဝိဘတ်ပါကြိယာ (refer to) ။",
  },
  "what is the advantage of having a balanced diet": {
    cars: [
      { word: "What", translation: "ဘာလဲ", tag: "WH-Question Word" },
      { word: "is", translation: "ဖြစ်သနည်း", tag: "Linking Verb" },
      {
        word: "the advantage of having a balanced diet",
        translation: "မျှတသော အစားအစာ စားသုံးခြင်း၏ အကျိုးကျေးဇူးမှာ",
        tag: "Noun Subject",
      },
    ],
    introMy:
      "“of having …” သည် “advantage” ကို ဖော်ပြသည့် အပိုင်းဖြစ်ပြီး ကတ္တားအတွင်း ပါဝင်နေသည်။",
    noteMy: "ပုံစံ: What → be-ကြိယာ (is) → ကတ္တား (advantage + of having …) ။",
  },
  "when we have food allergy, what can happen to us": {
    cars: [
      {
        word: "When we have food allergy",
        translation: "အစားအစာ ဓာတ်မတည့်မှု ဖြစ်သည့်အခါ",
        tag: "Adverb Clause",
      },
      { word: "what", translation: "ဘာဖြစ်နိုင်သလဲ", tag: "WH-Question Word" },
      { word: "can happen", translation: "ဖြစ်ပေါ်နိုင်သည်", tag: "Main Verb" },
      { word: "to us", translation: "ကျွန်ုပ်တို့အပေါ်", tag: "Prepositional Phrase" },
    ],
    introMy:
      "အချိန်ပြ အခန်း (When …) ကို ဝါကျအစမှာ ထားထားပြီး ပင်မမေးခွန်းက နောက်မှာ လာသည်။ ကော်မာက အခန်းနှစ်ခုကို ခွဲထားသည်။",
    noteMy: "ပုံစံ: အချိန်ပြ အခန်း → မေးခွန်း ကတ္တား (what) → modal + ကြိယာ (can happen) → ဝိဘတ်စကားစု ။",
  },
  "why can canned fish or meat and flavoured fruit juices be harmful to our health": {
    cars: [
      { word: "Why", translation: "ဘာကြောင့်လဲ", tag: "WH-Question Word" },
      { word: "can", translation: "နိုင်သနည်း", tag: "Helping Verb" },
      {
        word: "canned fish or meat and flavoured fruit juices",
        translation: "စည်သွတ်ငါး သို့မဟုတ် အသားနှင့် အရသာထည့် သစ်သီးရည်များသည်",
        tag: "Noun Subject",
      },
      { word: "be harmful", translation: "အဆိပ်အတောက် ဖြစ်သည်", tag: "Main Verb" },
      { word: "to our health", translation: "ကျွန်ုပ်တို့၏ ကျန်းမာရေးအတွက်", tag: "Prepositional Phrase" },
    ],
    introMy:
      "ကတ္တားမှာ အစားအစာ သုံးမျိုးကို “or” နှင့် “and” ဖြင့် တွဲထားသော စကားစု တစ်စုံလုံး ဖြစ်သည်။",
    noteMy: "ပုံစံ: Why → modal (can) → ကတ္တား → be + နာမဝိသေသန (be harmful) → ဝိဘတ်စကားစု ။",
  },
  "what does the underlined word 'which' in line 30 refer to": {
    cars: [
      { word: "What", translation: "ဘာကိုလဲ", tag: "WH-Question Word" },
      { word: "does", translation: "…သနည်း", tag: "Helping Verb" },
      {
        word: "the underlined word 'which' in line 30",
        translation: "စာကြောင်း ၃၀ တွင် မျဉ်းသားထားသော “which” စကားလုံးသည်",
        tag: "Noun Subject",
      },
      { word: "refer to", translation: "ရည်ညွှန်းသည်", tag: "Main Verb" },
    ],
    introMy:
      "“which” သည် စာပိုဒ်အတွင်း အရင်ဖော်ပြခဲ့သော နာမ်ကို ပြန်ရည်ညွှန်းသည့် ဆက်စပ်နာမ်စား ဖြစ်သည်။",
    noteMy: "ပုံစံ: What → အကူကြိယာ (does) → ကတ္တား → ဝိဘတ်ပါကြိယာ (refer to) ။",
  },
  "why do you think farmers use fertilizers and pesticides": {
    cars: [
      { word: "Why", translation: "ဘာကြောင့်လဲ", tag: "WH-Question Word" },
      { word: "do", translation: "…သနည်း", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "think", translation: "ထင်မြင်သည်", tag: "Main Verb" },
      {
        word: "farmers use fertilizers and pesticides",
        translation: "လယ်သမားများသည် ဓာတ်မြေဇာနှင့် ပိုးသတ်ဆေးများ အသုံးပြုကြသည်",
        tag: "Noun Object",
      },
    ],
    introMy:
      "“do you think” နောက်မှာ ဝါကျအပြည့် တစ်ခု လာသည်။ ထိုဝါကျတစ်ခုလုံးသည် “think” ၏ ကံ ဖြစ်သည်။",
    noteMy: "ပုံစံ: Why → အကူကြိယာ (do) → ကတ္တား (you) → ကြိယာ (think) → ကံ ဝါကျ ။",
  },
  "how should food be handled": {
    cars: [
      { word: "How", translation: "ဘယ်လိုလဲ", tag: "WH-Question Word" },
      { word: "should", translation: "သင့်သနည်း", tag: "Helping Verb" },
      { word: "food", translation: "အစားအစာကို", tag: "Noun Subject" },
      { word: "be handled", translation: "ကိုင်တွယ်ရန်", tag: "Main Verb" },
    ],
    introMy:
      "ဒါက modal passive မေးခွန်းပါ။ “food” သည် ပုံစံအရ ကတ္တားဖြစ်ပြီး အဓိပ္ပာယ်အရ ကံ ဖြစ်သည်။",
    noteMy: "ပုံစံ: How → modal (should) → ကတ္တား (food) → passive ကြိယာ (be handled) ။",
  },
  "give an example of what the food and drug administration (fda) does in myanmar": {
    cars: [
      { word: "Give", translation: "ဖော်ပြပါ", tag: "Main Verb" },
      { word: "an example", translation: "နမူနာတစ်ခုကို", tag: "Noun Object" },
      {
        word: "of what the Food and Drug Administration (FDA) does in Myanmar",
        translation:
          "မြန်မာနိုင်ငံတွင် အစားအသောက်နှင့် ဆေးဝါး ကွပ်ကဲရေး ဌာန (FDA) လုပ်ဆောင်သည့် အလုပ်များ၏",
        tag: "Prepositional Phrase",
      },
    ],
    introMy:
      "ဒါက အမိန့်ပြု ဝါကျပါ။ “of what …” သည် “an example” ကို ဖော်ပြသည့် အပိုင်း ဖြစ်သည်။",
    noteMy: "ပုံစံ: ကြိယာ (Give) → ကံ (an example) → ဖော်ပြသည့် ဝိဘတ်စကားစု ။",
  },
  "do you think you have a balanced diet? why or why not": {
    cars: [
      { word: "Do", translation: "…သလား", tag: "Helping Verb" },
      { word: "you", translation: "သင်သည်", tag: "Noun Subject" },
      { word: "think", translation: "ထင်မြင်သည်", tag: "Main Verb" },
      {
        word: "you have a balanced diet",
        translation: "သင်သည် မျှတသော အစားအစာ စားသုံးနေသည်",
        tag: "Noun Object",
      },
      { word: "Why or why not", translation: "အဘယ်ကြောင့် ဟုတ်သည် သို့မဟုတ် မဟုတ်သနည်း", tag: "Sentence" },
    ],
    introMy:
      "ပထမပိုင်းက ဟုတ်/မဟုတ် မေးခွန်းဖြစ်ပြီး ဒုတိယပိုင်းက အကြောင်းရင်း ရှင်းပြရန် တောင်းဆိုသည်။",
    noteMy: "ပုံစံ: အကူကြိယာ (Do) → ကတ္တား → ကြိယာ (think) → ကံ ဝါကျ → ထပ်ဆင့် မေးခွန်း ။",
  },
  "match the words: 1. responsible, 2. balanced, 3. vital, 4. supply, 5. artificially": {
    cars: [
      { word: "Match the words", translation: "စကားလုံးများကို တွဲဖက်ပါ", tag: "Main Verb" },
      { word: "responsible", translation: "တာဝန်ရှိသော", tag: "Noun Object" },
      { word: "balanced", translation: "မျှတသော", tag: "Noun Object" },
      { word: "vital", translation: "အလွန်အရေးကြီးသော", tag: "Noun Object" },
      { word: "supply", translation: "ထောက်ပံ့မှု၊ ပမာဏ", tag: "Noun Object" },
      { word: "artificially", translation: "သဘာဝမဟုတ်ဘဲ ဖန်တီးမှုနည်းဖြင့်", tag: "Adverb" },
    ],
    introMy: "ဒါက အမိန့်ပြု လေ့ကျင့်ခန်း ညွှန်ကြားချက်ပါ။ စကားလုံးတစ်လုံးချင်းစီကို အဓိပ္ပာယ်နှင့် တွဲဖက်ရမည်။",
    noteMy: "ပုံစံ: ကြိယာ (Match) → တွဲဖက်ရမည့် စကားလုံးများ ။",
  },
  "match the words: 6. allergy, 7. additive, 8. colourants, 9. pesticides, 10. hygienically": {
    cars: [
      { word: "Match the words", translation: "စကားလုံးများကို တွဲဖက်ပါ", tag: "Main Verb" },
      { word: "allergy", translation: "ဓာတ်မတည့်မှု", tag: "Noun Object" },
      { word: "additive", translation: "ပေါင်းထည့် ပစ္စည်း", tag: "Noun Object" },
      { word: "colourants", translation: "အရောင်ထည့် ပစ္စည်းများ", tag: "Noun Object" },
      { word: "pesticides", translation: "ပိုးသတ်ဆေးများ", tag: "Noun Object" },
      { word: "hygienically", translation: "သန့်ရှင်းစွာ", tag: "Adverb" },
    ],
    introMy: "ဒါက အမိန့်ပြု လေ့ကျင့်ခန်း ညွှန်ကြားချက်ပါ။ နာမ် လေးလုံးနှင့် ကြိယာဝိသေသန တစ်လုံး ပါဝင်သည်။",
    noteMy: "ပုံစံ: ကြိယာ (Match) → တွဲဖက်ရမည့် စကားလုံးများ ။",
  },
  "fill blanks 1-5: (1) picked and _ ripened, (2) a _ daily programme, (3) am _ for doing, (4) prepare their food _, (5) enough _ of water": {
    cars: [
      { word: "Fill blanks 1-5", translation: "အလွတ်နေရာ ၁ မှ ၅ ကို ဖြည့်ပါ", tag: "Main Verb" },
      { word: "picked and ______ ripened", translation: "ခူးယူပြီး ______ မှည့်အောင် လုပ်ထားသော", tag: "Noun Object" },
      { word: "a ______ daily programme", translation: "______ နေ့စဉ် အစီအစဉ်တစ်ခု", tag: "Noun Object" },
      { word: "am ______ for doing", translation: "လုပ်ဆောင်ရန် ______ ဖြစ်သည်", tag: "Complement" },
      { word: "prepare their food ______", translation: "သူတို့၏ အစားအစာကို ______ ပြင်ဆင်သည်", tag: "Predicate" },
      { word: "enough ______ of water", translation: "လုံလောက်သော ရေ ______", tag: "Noun Object" },
    ],
    introMy:
      "ဒါက ဝေါဟာရ ဖြည့်စွက်ခန်းပါ။ အလွတ်နေရာတိုင်းအတွက် စကားလုံးအမျိုးအစား (နာမ်၊ နာမဝိသေသန သို့မဟုတ် ကြိယာဝိသေသန) ကို အရင် ဆုံးဖြတ်ရမည်။",
    noteMy: "ပုံစံ: ညွှန်ကြားချက် ကြိယာ (Fill) → ဖြည့်ရမည့် စကားစု တစ်ခုချင်းစီ ။",
  },
  "fill blanks 6-10: (6) use _ to kill insects, (7) avoiding foods containing _, (8) develop an _ to the fur, (9) it is _ that you follow, (10) food colouring is often an _": {
    cars: [
      { word: "Fill blanks 6-10", translation: "အလွတ်နေရာ ၆ မှ ၁၀ ကို ဖြည့်ပါ", tag: "Main Verb" },
      { word: "use ______ to kill insects", translation: "ပိုးမွားများကို သတ်ရန် ______ အသုံးပြုသည်", tag: "Predicate" },
      { word: "avoiding foods containing ______", translation: "______ ပါဝင်သော အစားအစာများကို ရှောင်ကြဉ်ခြင်း", tag: "Noun Object" },
      { word: "develop an ______ to the fur", translation: "အနုအမွေးအပေါ် ______ ဖြစ်ပေါ်လာသည်", tag: "Predicate" },
      { word: "It is ______ that you follow", translation: "သင် လိုက်နာရန် ______ ဖြစ်သည်", tag: "Complement" },
      { word: "food colouring is often an ______", translation: "အစားအစာ အရောင်ဆိုးမှုသည် အများအားဖြင့် ______ ဖြစ်သည်", tag: "Sentence" },
    ],
    introMy:
      "ဒါက ဝေါဟာရ ဖြည့်စွက်ခန်း ဒုတိယအပိုင်းပါ။ ဝါကျအတွင်း အလွတ်နေရာ၏ တည်ရာအလိုက် နာမ်၊ နာမဝိသေသန သို့မဟုတ် ကြိယာဝိသေသန ရွေးရမည်။",
    noteMy: "ပုံစံ: ညွှန်ကြားချက် ကြိယာ (Fill) → ဖြည့်ရမည့် စကားစု တစ်ခုချင်းစီ ။",
  },
};

export const TAG_INFO: Record<string, { titleMy: string; bodyMy: string; example?: string }> = {
  "WH-Question Word": {
    titleMy: "WH-မေးခွန်းစကားလုံး (WH-Question Word)",
    bodyMy: "မေးခွန်းရဲ့ အစမှာ သုံးတဲ့ စကားလုံးပါ — what, when, where, why, who, how စသည်။ ဘာအကြောင်း မေးနေတယ်ဆိုတာကို ဖော်ပြပါတယ်။",
    example: "What is your name?",
  },
  "WH-Word": {
    titleMy: "WH-စကားလုံး (WH-Word)",
    bodyMy: "မေးခွန်းရဲ့ အစမှာ သုံးတဲ့ စကားလုံးပါ — what, when, where, why, who, how စသည်။",
    example: "Where do you live?",
  },
  "Helping Verb": {
    titleMy: "အကူကြိယာ (Helping / Auxiliary Verb)",
    bodyMy: "မူရင်းကြိယာကို ကူညီပေးတဲ့ ကြိယာ — do, does, did, have, has, had, will, can စသည်။ မေးခွန်းပြုလုပ်ရာ၊ အငြင်းပြုလုပ်ရာမှာ သုံးတယ်။",
    example: "Do you like tea?",
  },
  "Linking Verb": {
    titleMy: "ဆက်စပ်ကြိယာ (Linking / Be Verb)",
    bodyMy: "ကံတ္တားနဲ့ ဖြည့်စွက်စာကို ဆက်စပ်ပေးတဲ့ ကြိယာ — is, am, are, was, were။",
    example: "She is a doctor.",
  },
  "Adjective Phrase": {
    titleMy: "နာမဝိသေသန စကားစု (Adjective Phrase)",
    bodyMy: "နာမ်ကို ဖော်ပြတဲ့ စကားစု — အညွှန်း (a/an/the) + နာမဝိသေသန တစ်လုံး သို့မဟုတ် နှစ်လုံး။",
    example: "the productive (skills)",
  },
  "Adjective": {
    titleMy: "နာမဝိသေသန (Adjective)",
    bodyMy: "နာမ်ကို ဖော်ပြတဲ့ စကားလုံး — big, small, productive, beautiful စသည်။",
  },
  "Article": {
    titleMy: "အညွှန်း (Article)",
    bodyMy: "နာမ်ရှေ့မှာ သုံးတဲ့ စကားလုံး — a, an, the။",
    example: "the book, a pen",
  },
  "Noun Subject": {
    titleMy: "ကံတ္တား (Noun Subject)",
    bodyMy: "ဝါကျရဲ့ အဓိက ပုဂ္ဂိုလ်/အရာ — ဘယ်သူ ဒါမှမဟုတ် ဘာအကြောင်းပြောနေတယ် ဆိုတာကို ဖော်ပြတယ်။",
    example: "The students study English.",
  },
  "Main Verb": {
    titleMy: "မူရင်းကြိယာ (Main Verb)",
    bodyMy: "ဝါကျရဲ့ အဓိက လုပ်ဆောင်ချက်ကို ပြောတဲ့ ကြိယာ — run, eat, study, read စသည်။",
    example: "They play football.",
  },
  "Noun Object": {
    titleMy: "ကံ (Noun Object)",
    bodyMy: "ကြိယာရဲ့ လုပ်ဆောင်ချက်ကို ခံရတဲ့ နာမ်/နာမ်စား — ဘာကို၊ ဘယ်သူ့ကို ဆိုတဲ့အပိုင်း။",
    example: "She reads a book.",
  },
  "Prepositional Phrase": {
    titleMy: "ဝိဘတ်စကားစု (Prepositional Phrase)",
    bodyMy: "of, in, on, at, with, from, by စတဲ့ ဝိဘတ်နဲ့ စတဲ့ စကားစု — ဆက်နွယ်မှု၊ နေရာ၊ အချိန် ပြောတယ်။",
    example: "of language, in the morning, on the table",
  },
  "Predicate": {
    titleMy: "ကြိယာပိုင်း (Predicate)",
    bodyMy: "ကံတ္တားအကြောင်း ပြောတဲ့ ဝါကျ၏ ကျန်အပိုင်း — ကြိယာနဲ့ ကံ/ဖြည့်စွက်စာ ပေါင်းထားတယ်။",
    example: "The boy [is running fast].",
  },
  "Complement": {
    titleMy: "ဖြည့်စွက်စာ (Complement)",
    bodyMy: "be-ကြိယာ (is/am/are/was/were) နောက်မှာ လာတဲ့ အပိုင်း — ကံတ္တားကို ပြန်ဖော်ပြ၊ ဖြည့်စွက်ပေးတယ်။ ('Object' မဟုတ်ပါ)",
    example: "She is a teacher. → 'a teacher' က Complement။",
  },
  "Adverb Clause": {
    titleMy: "ကြိယာဝိသေသန အခန်း (Adverb Clause)",
    bodyMy: "ကြိယာကို ဖြည့်စွက်ဖော်ပြတဲ့ အခန်း — when / where / because / if စတဲ့ စကားလုံးနဲ့ စတယ်။ 'ဘယ်အချိန်၊ ဘယ်နေရာ၊ ဘယ်လိုအခြေအနေမှာ' လုပ်ဆောင်ခဲ့လဲ ဆိုတာ ပြောပါတယ်။",
    example: "We use gestures when we speak.",
  },
  "Purpose Clause": {
    titleMy: "ရည်ရွယ်ချက် အခန်း (Purpose Clause)",
    bodyMy: "'to + verb' နဲ့ စတဲ့ အခန်း — 'ဘာအတွက် / ဘာရည်ရွယ်ချက်နဲ့' လုပ်တာလဲ ဆိုတာ ဖော်ပြပါတယ်။",
    example: "We use graphics to help the reader understand better.",
  },
  "Relative Clause": {
    titleMy: "ဆက်စပ်အခန်း (Relative Clause)",
    bodyMy: "who, which, that စတဲ့ စကားလုံးနဲ့ စပြီး နာမ်ကို ပြန်ဖော်ပြတဲ့ အခန်းပါ။ ကတ္တားထဲမှာ ပါဝင်နိုင်ပြီး အဓိကကြိယာ မဟုတ်ပါ။",
    example: "It was the Hindu mathematicians who discovered zero.",
  },
  "Adverb": {
    titleMy: "ကြိယာဝိသေသန (Adverb)",
    bodyMy: "ကြိယာကို ဖြည့်စွက်ဖော်ပြတဲ့ စကားလုံး — today, now, quickly, often စသည်။ ဘယ်အချိန်၊ ဘယ်လို လုပ်တာလဲ ဆိုတာ ပြပါတယ်။",
    example: "We use \"0\" today.",
  },
  "Sentence": {
    titleMy: "ဝါကျ (Sentence)",
    bodyMy: "အပြည့်အစုံ အဓိပ္ပာယ်ရှိတဲ့ စကားစု — ကံတ္တား + ကြိယာ ပါဝင်တယ်။",
  },
};
