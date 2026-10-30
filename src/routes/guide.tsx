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
  ["AI Tutor (နေ့စဉ် အခမဲ့)", "၁၀ ကြိမ်", "၁၀ ကြိမ်"],
  ["စာမေးပွဲထုတ်ခြင်း (နေ့စဉ် အခမဲ့)", "၁ ကြိမ်", "၂ ကြိမ်"],
  ["ကိုယ်ပိုင် Paper တင်ခြင်း", "—", "အကန့်အသတ်မဲ့"],
];

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
              <h2 className="mb-2 font-semibold">🎓 ကျောင်းသားလမ်းညွှန်</h2>
              <ol className="ml-5 list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Google ဖြင့် Login ဝင်ပါ — Welcome Gift မေးခွန်း ၅ ကြိမ် ချက်ချင်းရမည်။</li>
                <li>AI Tutor ကို နေ့စဉ် ၁၀ ကြိမ် အခမဲ့ မေးနိုင် (မြန်မာစံတော်ချိန် ည ၁၂ နာရီ ပြန်ပြည့်)။</li>
                <li>Classrooms တွင် ဆရာပေးသော Class Code ထည့်၍ အတန်းဝင်ပါ။</li>
                <li>"Start Exam" နှိပ်ပြီး အချိန်အတွင်း ဖြေဆိုကာ အဖြေလွှာ ဓာတ်ပုံ ၁–၆ ပုံ တင်ပါ။</li>
                <li>ဆရာ အတည်ပြုပြီးပါက "View Details" ဖြင့် အမှား/အမှန်နှင့် ရှင်းလင်းချက် ကြည့်နိုင်သည်။ My Progress တွင် မှတ်တမ်းရှိသည်။</li>
              </ol>
            </section>
            <section className={card}>
              <h2 className="mb-2 font-semibold">👩‍🏫 ဆရာ/ဆရာမ လမ်းညွှန်</h2>
              <ol className="ml-5 list-decimal space-y-1 text-sm text-muted-foreground">
                <li>ဆရာ Role ရယူရန် My Progress မှ "Request Teacher Role" လျှောက်ပါ (သို့) Admin ထံ ဆက်သွယ်ပါ။</li>
                <li>Classrooms တွင် အတန်းဖွင့်ပြီး Class Code ကို ကျောင်းသားများထံ ပေးပါ။</li>
                <li>စာမေးပွဲ မေးခွန်းထုတ်ခြင်း — နေ့စဉ် ၂ ကြိမ် အခမဲ့။ ထပ်ထုတ်လိုပါက Exam Credit ဝယ်ယူပါ (သို့) Admin ထံ တောင်းဆိုပါ။</li>
                <li>ကိုယ်ပိုင် မေးခွန်းလွှာ (PDF / Word / ဓာတ်ပုံ) ကို အကန့်အသတ်မဲ့ တင်နိုင်သည်။</li>
                <li>ကျောင်းသား တင်ပြီးသည်နှင့် AI က အမှတ် Draft ပေးမည် — မေးခွန်းအလိုက် ပြင်ပြီး Confirm နှိပ်မှ ကျောင်းသားထံ ရောက်မည်။</li>
              </ol>
            </section>
            <section className={card}>
              <h2 className="mb-2 font-semibold">📊 အသုံးပြုခွင့် ကန့်သတ်ချက်များ</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="py-1 pr-2"></th><th className="pr-2">ကျောင်းသား</th><th className="pr-2">ဆရာ</th></tr></thead>
                  <tbody>{LIMITS.map((r) => <tr key={r[0]} className="border-t border-border">{r.map((c, i) => <td key={i} className={`py-1.5 pr-2 ${i === 0 ? "font-medium" : ""}`}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">AI Tutor Credit နှင့် Exam Credit သည် သီးခြားစီ ဖြစ်ပါသည်။ နေ့စဉ် အခမဲ့ ကုန်မှသာ ဝယ်ထားသော Credit ကို နှုတ်ပါမည်။</p>
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
