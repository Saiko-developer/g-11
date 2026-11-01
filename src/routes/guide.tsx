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
  ["AI Tutor မေးခွန်း (နေ့စဉ် အခမဲ့)", "၂၀ ကြိမ်", "၁၀ ကြိမ်"],
  ["စာမေးပွဲ (နေ့စဉ် အခမဲ့)", "၁ ကြိမ်", "AI ထုတ် ၄ ကြိမ်"],
  ["ကိုယ်ပိုင် Paper တင်ခြင်း", "—", "အကန့်အသတ်မဲ့"],
  ["အတန်းဖွင့်ခြင်း", "—", "အကန့်အသတ်မဲ့"],
];

type Step = { t: string; d: string[]; link?: { to: "/classrooms" | "/progress"; label: string } };

const STUDENT_STEPS: Step[] = [
  { t: "Google ဖြင့် အကောင့်ဝင်ပါ", d: ["ညာဘက်အပေါ်ရှိ Sign in ခလုတ်ကို နှိပ်ပြီး Google အကောင့်ဖြင့် ဝင်ပါ။", "Welcome Gift AI မေးခွန်း ၅ ကြိမ် ချက်ချင်းရမည်။"] },
  { t: "AI Tutor (Sayar Owl) ကို မေးပါ", d: ["စာရိုက်၍၊ မိုက်ခရိုဖုန်းဖြင့် အသံဖြင့်၊ သို့မဟုတ် စာအုပ်ကို ဓာတ်ပုံရိုက်၍ မေးနိုင်သည်။", "မြန်မာ/အင်္ဂလိပ် နှစ်ဘာသာလုံး ရှင်းပြပေးမည်။", "ဘယ်စာမျက်နှာမှာမဆို Sayar Owl ခလုတ်ကို ဖိဆွဲပြီး ကြိုက်တဲ့နေရာ ရွှေ့ထားနိုင်သည်။"] },
  { t: "Listening & Speaking လေ့ကျင့်ပါ", d: ["Unit ၁–၁၂ မူရင်းအသံဖိုင်များကို စာသားနှင့်တွဲ၍ နားထောင်နိုင်သည်။", "နားထောင်နေစဉ် လက်ရှိဖတ်နေသော စာကြောင်းကို အရောင်ပြပေးမည်။"] },
  { t: "အတန်းဝင်ပါ", d: ["ဆရာပေးသော Class Code ကို ထည့်၍ အတန်းဝင်ပါ။"], link: { to: "/classrooms", label: "Classrooms သို့ သွားရန်" } },
  { t: "စာမေးပွဲဖြေပြီး အဖြေလွှာတင်ပါ", d: ["\"Start Exam\" နှိပ်ပြီး အချိန်အတွင်း ဖြေဆိုပါ။", "လက်ရေးအဖြေလွှာ ဓာတ်ပုံ ၁–၆ ပုံ တင်ပြီး Submit နှိပ်ပါ။", "Home စာမျက်နှာမှ အပြင်စာမေးပွဲစာရွက် တင်ပြီး Sayar Owl ကို ရှင်းပြခိုင်းနိုင်သည်။"] },
  { t: "ရလဒ် ကြည့်ပါ", d: ["ဆရာ Confirm ပြီးမှ ရမှတ်နှင့် အမှား/အမှန် အသေးစိတ် ပေါ်လာပါမည်။"], link: { to: "/progress", label: "My Progress သို့ သွားရန်" } },
];

const TEACHER_STEPS: Step[] = [
  { t: "Teacher Role တောင်းခံပါ", d: ["My Progress မှ \"Request Teacher Role\" လျှောက်ပါ (သို့) Admin ထံ ဆက်သွယ်ပါ။"], link: { to: "/progress", label: "လျှောက်ထားရန်" } },
  { t: "အတန်းဖွင့်ပါ", d: ["Classrooms တွင် အတန်းဖွင့်ပြီး Class Code ကို ကျောင်းသားများထံ ပေးပါ။"], link: { to: "/classrooms", label: "Classrooms သို့ သွားရန်" } },
  { t: "စာမေးပွဲ ထုတ်ပါ", d: ["Unit နှင့် Section ရွေးပြီး AI ဖြင့် မေးခွန်းထုတ်ခြင်း — နေ့စဉ် ၄ ကြိမ် အခမဲ့။", "ကိုယ်ပိုင် Paper (PDF / Word / ဓာတ်ပုံ) အကန့်အသတ်မဲ့ တင်နိုင်သည်။", "အဖြေလွှာ / Answer Key ကို Download ယူနိုင်သည်။"] },
  { t: "AI ဖြင့် အမှတ်ခြစ်ပါ", d: ["Student Submissions တွင် \"Grade with AI\" နှိပ်ပါ — AI က မေးခွန်းအလိုက် Draft အမှတ်ပေးမည်။", "အမှတ်နှင့် Feedback ကို ပြင်ပြီး \"Confirm & Send\" နှိပ်မှ ကျောင်းသားထံ ရောက်မည်။"] },
  { t: "Class Feed နှင့် Chat သုံးပါ", d: ["အတန်းတစ်ခုလုံးသို့ ကြေညာချက် တင်နိုင်သည်။", "ကျောင်းသားတစ်ဦးချင်းစီနှင့် သီးသန့် Chat ပြောနိုင်သည်။"] },
  { t: "Gradebook ကြည့်ပါ", d: ["အတန်းတစ်ခုလုံး၏ စာမေးပွဲရမှတ်များကို ဇယားတစ်ခုတည်းတွင် ကြည့်နိုင်သည်။", "မဖြေရသေးသော ကျောင်းသားများကို ခွဲခြားပြပေးမည်။"] },
];

const STUDENT_BENEFITS = ["၂၄ နာရီ AI ဆရာ — မြန်မာလို ရှင်းပြ", "အသံဖြင့် မေး၊ အသံဖြင့် နားထောင်", "အမှား/အမှန် အသေးစိတ် ပြန်လေ့လာနိုင်", "Listening & Speaking Unit ၁–၁၂ အသံဖိုင်များ", "ဓာတ်ပုံရိုက်ရုံဖြင့် မေးခွန်းမေးနိုင်", "ကိုယ့်တိုးတက်မှုကို My Progress တွင် ခြေရာခံနိုင်"];
const TEACHER_BENEFITS = ["စာမေးပွဲ မိနစ်ပိုင်းအတွင်း ထုတ်နိုင်", "AI Draft အမှတ်ကြောင့် အမှတ်ခြစ်ချိန် အများကြီး သက်သာ", "ဖုန်းဖြင့်ပင် အမှတ်ခြစ်နိုင်", "အတန်းနှင့် ကျောင်းသား တိုးတက်မှု တစ်နေရာတည်း", "ကျောင်းသားနှင့် တိုက်ရိုက် Chat", "Answer Key / Paper Download ယူနိုင်"];

const STUDENT_FAQ: [string, string][] = [
  ["ဖြေပြီးတာ အမှတ် ဘာလို့ ချက်ချင်း မပေါ်တာလဲ?", "ဆရာ စစ်ဆေးပြီး Confirm နှိပ်မှ အမှတ်နှင့် အဖြေမှန်များ ပေါ်လာပါမည်။"],
  ["အင်တာနက် နှေးရင် ဓာတ်ပုံတင်လို့ ရပါ့မလား?", "ရပါသည်။ ပုံ ၆ ပုံအထိ (စုစုပေါင်း 40 MB) တင်နိုင်ပါသည်။"],
  ["နေ့စဉ် မေးခွန်း ၂၀ ကုန်သွားရင်?", "\"Credit & Payment\" မှ AI Tutor Credit ဝယ်နိုင်ပါသည် (သို့) နောက်နေ့ ပြန်ပြည့်သည်အထိ စောင့်ပါ။"],
  ["Sayar Owl ခလုတ်က စာကို ကွယ်နေရင်?", "ခလုတ်ကို ဖိပြီး ဆွဲကာ ကြိုက်တဲ့နေရာ ရွှေ့ထားနိုင်ပါသည်။ နောက်တစ်ကြိမ်လည်း ထိုနေရာတွင်ပင် ရှိနေပါမည်။"],
  ["အသံ မထွက်ရင် ဘာလုပ်ရမလဲ?", "ဖုန်း Silent Mode ပိတ်ပြီး အသံချဲ့ပါ။ Browser ကို Refresh လုပ်ကြည့်ပါ။"],
];
const TEACHER_FAQ: [string, string][] = [
  ["နေ့စဉ် ၄ ကြိမ်ထက် ပိုထုတ်ချင်ရင်?", "\"Credit & Payment\" မှ Exam Credit ဝယ်ယူနိုင်ပါသည်။"],
  ["AI အမှတ်ကို ပြင်လို့ရလား?", "ရပါသည်။ Confirm မနှိပ်မီ မေးခွန်းအလိုက် ပြင်နိုင်ပါသည်။ AI အမှတ်သည် အကြမ်းသာဖြစ်၍ ဆရာ စစ်ဆေးရန် လိုပါသည်။"],
  ["Teacher Role ဘယ်လောက်ကြာမှ ရမလဲ?", "Admin စစ်ဆေးပြီးနောက် အတည်ပြုပေးပါမည်။ မြန်စေလိုပါက Admin ထံ ဆက်သွယ်ပါ။"],
  ["ကျောင်းသားအဖြေလွှာ ဓာတ်ပုံများကို ဘယ်သူ မြင်ရလဲ?", "သက်ဆိုင်ရာ ကျောင်းသားနှင့် ထိုအတန်း၏ ဆရာ/မသာ မြင်ရပါသည်။"],
];
const GENERAL_FAQ: [string, string][] = [
  ["အခမဲ့ Limit ဘယ်အချိန် ပြန်ပြည့်လဲ?", "မြန်မာစံတော်ချိန် ည ၁၂ နာရီတိုင်း အလိုအလျောက် ပြန်ပြည့်ပါသည်။"],
  ["AI Tutor Credit နှင့် Exam Credit တူလား?", "မတူပါ။ AI Tutor Credit က မေးခွန်းမေးရန်၊ Exam Credit က စာမေးပွဲထုတ်ရန်ဖြစ်ပြီး အခမဲ့ကုန်မှသာ ဝယ်ထားသော Credit ကို နှုတ်ပါမည်။"],
  ["ဘယ်လို အကောင့်ဝင်ရမလဲ?", "Google အကောင့်ဖြင့်သာ ဝင်ရောက်နိုင်ပါသည်။"],
  ["ဝယ်ထားသော Credit ဘယ်လောက်ကြာမှ ရောက်လဲ?", "ငွေလွှဲ Txn နံပါတ် တင်ပြီးနောက် Admin အတည်ပြုသည်နှင့် ချက်ချင်း ထည့်ပေးပါမည်။"],
];

const CREDIT_STEPS: Step[] = [
  { t: "Package ရွေးပါ", d: ["AI Tutor Credit (မေးခွန်း) သို့မဟုတ် Exam Credit (စာမေးပွဲထုတ်) ကို ရွေးပါ။"] },
  { t: "ငွေလွှဲပါ", d: ["ပြထားသော KPay / Wave အကောင့်သို့ Package ဈေးနှုန်းအတိုင်း လွှဲပါ။"] },
  { t: "Txn နံပါတ် တင်ပါ", d: ["ငွေလွှဲ Transaction နံပါတ်ကို ဖြည့်ပြီး Submit နှိပ်ပါ။"] },
  { t: "အတည်ပြုချက် စောင့်ပါ", d: ["Admin အတည်ပြုသည်နှင့် Credit အလိုအလျောက် ထည့်ပေးပါမည်။"] },
];

const HELP_PHONE = "09666144978";

function FaqList({ title, items, card }: { title: string; items: [string, string][]; card: string }) {
  return (
    <section className={card}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="space-y-2">
        {items.map(([q, a]) => (
          <details key={q} className="rounded-lg bg-muted p-3 text-sm">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Bullets({ title, items, card }: { title: string; items: string[]; card: string }) {
  return (
    <section className={card}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((x) => <li key={x} className="rounded-lg bg-muted p-3 text-sm">✅ {x}</li>)}
      </ul>
    </section>
  );
}

function HelpCard({ card }: { card: string }) {
  return (
    <section className={card}>
      <h2 className="font-semibold">🙋 အကူအညီ လိုအပ်ပါသလား?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Admin ထံ တိုက်ရိုက် ဆက်သွယ်နိုင်ပါသည် — {HELP_PHONE}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="https://t.me/+959666144978" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">✈️ Telegram ဖြင့် Chat</a>
        <a href={`tel:${HELP_PHONE}`} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">📞 ဖုန်းခေါ်ရန်</a>
      </div>
    </section>
  );
}

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


type Tab = "student" | "teacher" | "system" | "credits";
const TABS: [Tab, string][] = [["student", "🎓 ကျောင်းသား"], ["teacher", "👩‍🏫 ဆရာ/မ"], ["system", "📊 စနစ်"], ["credits", "💳 Credit"]];

function GuidePage() {
  const [tab, setTab] = useState<Tab>("student");
  const { session } = useAuth();
  const card = "rounded-xl border border-border bg-card p-4 shadow-sm";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-bold">📖 လမ်းညွှန် & Credits</h1>
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-md py-2 text-xs font-medium sm:text-sm ${tab === k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>

        {tab === "student" && (
          <>
            <StepGuide title="🎓 ကျောင်းသား အသုံးပြုပုံ" steps={STUDENT_STEPS} card={card} />
            <Bullets title="🌟 ကျောင်းသားများ ရရှိမည့် အကျိုးကျေးဇူး" items={STUDENT_BENEFITS} card={card} />
            <Bullets title="📏 ကျောင်းသား ကန့်သတ်ချက်များ" items={["ကြိုဆိုလက်ဆောင် AI မေးခွန်း ၅ ကြိမ်", "နေ့စဉ် အခမဲ့ AI မေးခွန်း ၂၀", "နေ့စဉ် အခမဲ့ စာမေးပွဲ ၁ ကြိမ်"]} card={card} />
            <FaqList title="❓ ကျောင်းသား FAQs" items={STUDENT_FAQ} card={card} />
            <HelpCard card={card} />
          </>
        )}
        {tab === "teacher" && (
          <>
            <StepGuide title="👩‍🏫 ဆရာ/မ အသုံးပြုပုံ" steps={TEACHER_STEPS} card={card} />
            <Bullets title="🌟 ဆရာ/မများ ရရှိမည့် အကျိုးကျေးဇူး" items={TEACHER_BENEFITS} card={card} />
            <Bullets title="📏 ဆရာ/မ ကန့်သတ်ချက်များ" items={["နေ့စဉ် AI စာမေးပွဲထုတ်ခွင့် ၄ ကြိမ်", "ကိုယ်ပိုင်စာရွက်တင်ခွင့် အကန့်အသတ်မဲ့", "အတန်းဖွင့်ခွင့် အကန့်အသတ်မဲ့"]} card={card} />
            <FaqList title="❓ ဆရာ/မ FAQs" items={TEACHER_FAQ} card={card} />
            <HelpCard card={card} />
          </>
        )}
        {tab === "system" && (
          <>
            <section className={card}>
              <h2 className="mb-2 font-semibold">📊 Student နှင့် Teacher နှိုင်းယှဉ်ချက်</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="py-1 pr-2"></th><th className="pr-2">ကျောင်းသား</th><th className="pr-2">ဆရာ</th></tr></thead>
                  <tbody>{LIMITS.map((r) => <tr key={r[0]} className="border-t border-border">{r.map((c, i) => <td key={i} className={`py-1.5 pr-2 ${i === 0 ? "font-medium" : ""}`}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </section>
            <section className={card}>
              <h2 className="mb-2 font-semibold">🕛 နေ့စဉ် Quota ပြန်ပြည့်ပုံ</h2>
              <p className="text-sm text-muted-foreground">နေ့စဉ် အခမဲ့ Quota များသည် မြန်မာစံတော်ချိန် ည ၁၂ နာရီတွင် အလိုအလျောက် ပြန်ပြည့်ပါသည်။ အခမဲ့ကုန်မှသာ ဝယ်ထားသော Credit ကို နှုတ်ပါမည်။</p>
            </section>
            <FaqList title="❓ အထွေထွေ မေးခွန်းများ" items={GENERAL_FAQ} card={card} />
            <HelpCard card={card} />
          </>
        )}
        {tab === "credits" && (
          <>
            <StepGuide title="💳 Credit ဝယ်ယူနည်း" steps={CREDIT_STEPS} card={card} />
            {session ? (
              <TopupPanel showTabs />
            ) : (
              <p className={card}>Credit ဝယ်ယူရန် <Link to="/classrooms" className="text-primary underline">Login</Link> ဝင်ပါ။</p>
            )}
            <HelpCard card={card} />
          </>
        )}
      </main>
    </div>
  );
}
