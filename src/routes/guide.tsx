import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { TopupPanel } from "@/components/Topup";
import { useAuth } from "@/components/AuthGate";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "လမ်းညွှန် & Credits — Sayar Owl Academy" },
      { name: "description", content: "Student and teacher guide, daily free limits, and how to buy AI Tutor or exam credits." },
      { property: "og:title", content: "User Guide & Credits — Sayar Owl Academy" },
      { property: "og:description", content: "How to use Sayar Owl Academy and buy AI Tutor or exam-generation credits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuidePage,
});

const LIMITS = [
  ["Welcome Gift (အကောင့်သစ်)", "၅ ကြိမ်", "၅ ကြိမ်"],
  ["AI Tutor (နေ့စဉ် အခမဲ့)", "၂၀ ကြိမ်", "၁၀ ကြိမ်"],
  ["စာမေးပွဲထုတ်ခြင်း (နေ့စဉ် အခမဲ့)", "၂ ကြိမ်", "၄ ကြိမ်"],
  ["ကိုယ်ပိုင် Paper တင်ခြင်း", "—", "အကန့်အသတ်မဲ့"],
];

const FLOW: [string, string][] = [
  ["ဆရာ", "အတန်းဖွင့်ပြီး မေးခွန်းထုတ် (သို့) ကိုယ်ပိုင် Paper တင်"],
  ["ကျောင်းသား", "Class Code ဖြင့် ဝင်၊ ဖြေဆိုပြီး အဖြေလွှာ ဓာတ်ပုံတင်"],
  ["AI + ဆရာ", "AI က Draft အမှတ်ပေး၊ ဆရာ စစ်ပြီး Confirm"],
  ["ရလဒ်", "ကျောင်းသား အမှတ်နှင့် အမှား/အမှန် အသေးစိတ် ကြည့်"],
];

type Step = { t: string; d: string[]; link?: { to: "/classrooms" | "/progress"; label: string } };

const STUDENT_STEPS: Step[] = [
  { t: "အကောင့်ဝင်ပါ (Google Sign-In)", d: ["Welcome Gift AI မေးခွန်း ၅ ကြိမ် ချက်ချင်းရမည်။", "AI Tutor နေ့စဉ် ၂၀ ကြိမ် အခမဲ့ (ည ၁၂ နာရီ ပြန်ပြည့်)။"] },
  { t: "အတန်းဝင်ပါ", d: ["ဆရာပေးသော Class Code ကို ထည့်၍ အတန်းဝင်ပါ။"], link: { to: "/classrooms", label: "Classrooms သို့ သွားရန်" } },
  { t: "စာမေးပွဲဖြေပြီး အဖြေလွှာတင်ပါ", d: ["\"Start Exam\" နှိပ်ပြီး အချိန်အတွင်း ဖြေဆိုပါ။", "လက်ရေးအဖြေလွှာ ဓာတ်ပုံ ၁–၆ ပုံ ရိုက်တင်ပြီး Submit နှိပ်ပါ။"] },
  { t: "ရလဒ်နှင့် ရှင်းလင်းချက် ကြည့်ပါ", d: ["ဆရာ Confirm ပြီးမှ ရမှတ် ပေါ်လာပါမည်။", "\"View Details\" ဖြင့် မေးခွန်းအလိုက် အမှား/အမှန် လေ့လာနိုင်သည်။"], link: { to: "/progress", label: "My Progress သို့ သွားရန်" } },
];

const TEACHER_STEPS: Step[] = [
  { t: "ဆရာ Role ရယူပါ", d: ["My Progress မှ \"Request Teacher Role\" လျှောက်ပါ (သို့) Admin ထံ ဆက်သွယ်ပါ။"], link: { to: "/progress", label: "လျှောက်ထားရန်" } },
  { t: "အတန်းသစ်ဖွင့်ပါ", d: ["Classrooms တွင် အတန်းဖွင့်ပြီး Class Code ကို ကျောင်းသားများထံ ပေးပါ။"], link: { to: "/classrooms", label: "Classrooms သို့ သွားရန်" } },
  { t: "စာမေးပွဲ ထုတ်ပါ", d: ["AI ဖြင့် မေးခွန်းထုတ်ခြင်း — နေ့စဉ် ၄ ကြိမ် အခမဲ့။", "ကိုယ်ပိုင် Paper (PDF / Word / ဓာတ်ပုံ) အကန့်အသတ်မဲ့ တင်နိုင်သည်။"] },
  { t: "အမှတ် စစ်ဆေး အတည်ပြုပါ", d: ["ကျောင်းသားတင်ပြီးတာနဲ့ AI က မေးခွန်းအလိုက် Draft အမှတ်ပေးမည်။", "လိုသလိုပြင်ပြီး Confirm နှိပ်မှ ကျောင်းသားထံ ရောက်မည်။"] },
];

const FAQ: [string, string][] = [
  ["ဖြေပြီးတာ အမှတ် ဘာလို့ ချက်ချင်း မပေါ်တာလဲ?", "AI က ဆရာ့အတွက် Draft အမှတ်သာ ပေးထားပါသည်။ ဆရာ စစ်ဆေးပြီး Confirm နှိပ်မှ အမှတ်နှင့် အဖြေမှန်များ ပေါ်လာပါမည်။"],
  ["အင်တာနက် နှေးရင် ဓာတ်ပုံတင်လို့ ရပါ့မလား?", "ရပါသည်။ ပုံ ၆ ပုံအထိ (စုစုပေါင်း 40 MB) တင်နိုင်ပါသည်။ စာရွက်ကို အလင်းကောင်းကောင်းဖြင့် ရှင်းလင်းစွာ ရိုက်ပါ။"],
  ["ဆရာက နေ့စဉ် ၄ ကြိမ်ထက် ပိုထုတ်ချင်ရင်?", "\"Credit & Payment\" တက်ဘ်မှ Exam Credit ဝယ်ယူနိုင်သလို Admin ထံ ဆက်သွယ်၍လည်း တောင်းဆိုနိုင်ပါသည်။"],
  ["အခမဲ့ Limit ဘယ်အချိန် ပြန်ပြည့်လဲ?", "မြန်မာစံတော်ချိန် ည ၁၂ နာရီတိုင်း ပြန်ပြည့်ပါသည်။"],
];

function StepGuide({ title, steps, card }: { title: string; steps: Step[]; card: string }) {
  return (
    <section className={card}>
      <h2 className="mb-3 font-semibold">{title}</h2>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={s.t} className="flex gap-3 rounded-lg border border-border p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
            <div className="text-sm">
              <div className="font-semibold">{s.t}</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">{s.d.map((x) => <li key={x}>{x}</li>)}</ul>
              {s.link && <Link to={s.link.to} className="mt-1 inline-block font-medium text-primary underline">{s.link.label} ➔</Link>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function GuidePage() {
  const [tab, setTab] = useState<"guide" | "credits">("guide");
  const { session } = useAuth();
  const card = "rounded-xl border border-border bg-card p-4 shadow-sm";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-bold">📖 လမ်းညွှန် & Credits</h1>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button onClick={() => setTab("guide")} className={`flex-1 rounded-md py-2 text-sm font-medium ${tab === "guide" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>လမ်းညွှန် (Guide)</button>
          <button onClick={() => setTab("credits")} className={`flex-1 rounded-md py-2 text-sm font-medium ${tab === "credits" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>💳 Credit & Payment</button>
        </div>

        {tab === "guide" ? (
          <>
            <section className={card}>
              <h2 className="mb-3 font-semibold">🔄 စာမေးပွဲစနစ် လည်ပတ်ပုံ</h2>
              <div className="grid gap-2 sm:grid-cols-4">
                {FLOW.map(([t, d], i) => (
                  <div key={t} className="rounded-lg bg-muted p-3 text-sm">
                    <div className="font-semibold text-primary">{i + 1}။ {t}</div>
                    <div className="mt-1 text-muted-foreground">{d}</div>
                  </div>
                ))}
              </div>
            </section>
            <StepGuide title="🎓 ကျောင်းသားလမ်းညွှန်" steps={STUDENT_STEPS} card={card} />
            <StepGuide title="👩‍🏫 ဆရာ/ဆရာမ လမ်းညွှန်" steps={TEACHER_STEPS} card={card} />
            <section className={card}>
              <h2 className="mb-2 font-semibold">📊 အသုံးပြုခွင့် ကန့်သတ်ချက်များ</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="py-1 pr-2"></th><th className="pr-2">ကျောင်းသား</th><th className="pr-2">ဆရာ</th></tr></thead>
                  <tbody>{LIMITS.map((r) => <tr key={r[0]} className="border-t border-border">{r.map((c, i) => <td key={i} className={`py-1.5 pr-2 ${i === 0 ? "font-medium" : ""}`}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">နေ့စဉ် မြန်မာစံတော်ချိန် ည ၁၂ နာရီတွင် အခမဲ့ Limit ပြန်ပြည့်ပါမည်။ AI Tutor Credit နှင့် Exam Credit သည် သီးခြားစီ ဖြစ်ပြီး အခမဲ့ ကုန်မှသာ ဝယ်ထားသော Credit ကို နှုတ်ပါမည်။</p>
            </section>
            <section className={card}>
              <h2 className="mb-2 font-semibold">❓ အမေးများသော မေးခွန်းများ</h2>
              <div className="space-y-2">
                {FAQ.map(([q, a]) => (
                  <details key={q} className="rounded-lg bg-muted p-3 text-sm">
                    <summary className="cursor-pointer font-medium">{q}</summary>
                    <p className="mt-2 text-muted-foreground">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        ) : session ? (
          <TopupPanel showTabs />
        ) : (
          <p className={card}>Credit ဝယ်ယူရန် <Link to="/classrooms" className="text-primary underline">Login</Link> ဝင်ပါ။</p>
        )}
      </main>
    </div>
  );
}
