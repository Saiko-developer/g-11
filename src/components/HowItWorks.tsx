import { Camera, CheckCircle2, MessageCircle, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STEPS = [
  {
    icon: Camera,
    title: "ဓာတ်ပုံရိုက်ပါ",
    en: "Snap your answer sheet",
    body: "လက်ရေးနဲ့ ဖြေထားတဲ့ စာရွက်ကို ဖုန်းကင်မရာနဲ့ ရိုက်ပြီး တင်လိုက်ပါ။",
  },
  {
    icon: Sparkles,
    title: "AI က ချက်ချင်း စစ်ပေးမယ်",
    en: "Instant AI grading",
    body: "အမှတ်၊ အမှားနဲ့ မှန်ကန်တဲ့ အဖြေကို မြန်မာလို ရှင်းပြပေးပါမယ်။",
  },
  {
    icon: MessageCircle,
    title: "ဆရာဇီးကွက်ကို မေးပါ",
    en: "Ask Sayar Owl",
    body: "မရှင်းတာရှိရင် Sayar Owl ကို အချိန်မရွေး မေးမြန်းနိုင်ပါတယ်။",
  },
];

const SAMPLE = [
  { q: "1. She ___ to school every day. (go)", a: "goes", ok: true, note: "Present simple, 3rd person → goes ✔" },
  { q: "2. They ___ football yesterday. (play)", a: "play", ok: false, fix: "played", note: "'yesterday' ပါလို့ Past tense သုံးရပါမယ်။" },
  { q: "3. I have ___ this book. (read)", a: "read", ok: true, note: "Present perfect → have + V3 ✔" },
  { q: "4. He is good ___ maths.", a: "in", ok: false, fix: "at", note: "'good at' က ပုံသေ စကားစုဖြစ်ပါတယ်။" },
];

export function HowItWorks() {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">အဆင့် ၃ ဆင့်နဲ့ စမ်းကြည့်ပါ</h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">How it works — 3 simple steps</p>
        </div>
        <ol className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {STEPS.map((s, i) => (
            <li key={s.en} className="relative flex gap-4 rounded-2xl border border-border bg-card p-5 md:flex-col">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <s.icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.en}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <CheckCircle2 className="h-4 w-4" />
            စစ်ပြီးသား နမူနာ ကြည့်ရန် · See sample result
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sample result · Unit 3 Grammar</DialogTitle>
            <DialogDescription>ကျောင်းသားတစ်ယောက်ရဲ့ စာရွက်ကို AI စစ်ပေးထားတဲ့ နမူနာ</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-primary">2 / 4</p>
            </div>
            <p className="max-w-[60%] text-right text-sm text-muted-foreground">
              Tense တွေ ပိုလေ့ကျင့်ဖို့ လိုပါတယ်။ ကြိုးစားထားတာ ကောင်းပါတယ်! 🦉
            </p>
          </div>
          <ul className="space-y-2">
            {SAMPLE.map((r) => (
              <li key={r.q} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{r.q}</p>
                <div className="mt-1.5 flex items-center gap-2 text-sm">
                  {r.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <span className={r.ok ? "" : "line-through text-muted-foreground"}>{r.a}</span>
                  {r.fix && <span className="font-semibold text-primary">→ {r.fix}</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.note}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </section>
  );
}
