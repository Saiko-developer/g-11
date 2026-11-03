import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type Pkg = { credits: number; price: number };

/** Explains the free/credit plan and how to become a teacher (contact admin). */
export function CreditPlanInfo({ teacher }: { teacher: boolean }) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState<string | null>(null);
  const [pkgs, setPkgs] = useState<Pkg[]>([]);

  useEffect(() => {
    void (supabase as any)
      .from("payment_settings")
      .select("contact,packages")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }: { data: { contact: string | null; packages: Pkg[] | null } | null }) => {
        setContact(data?.contact ?? null);
        setPkgs(data?.packages ?? []);
      });
  }, []);

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left font-semibold">
        💳 Credits & Plans — ဘယ်လို အသုံးပြုရမလဲ
        <span className="text-sm text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <p className="font-medium">🎓 ကျောင်းသားများ</p>
            <ul className="ml-5 list-disc text-muted-foreground">
              <li>အကောင့်သစ် Welcome Gift ၅ ကြိမ် + AI Tutor နေ့စဉ် ၂၀ ကြိမ် အခမဲ့ (မြန်မာစံတော်ချိန် ည ၁၂ နာရီ ပြန်ပြည့်)</li>
              <li>Mock Exam ထုတ်ခြင်း နေ့စဉ် ၂ ကြိမ် အခမဲ့</li>
              <li>အတန်းစာမေးပွဲ ဖြေဆိုခြင်း၊ အဖြေလွှာတင်ခြင်း၊ ရလဒ်ကြည့်ခြင်း — အခမဲ့</li>
              <li>ထပ်မေးလိုပါက KPay ဖြင့် မေးခွင့် ဝယ်ယူနိုင် (သို့) ပညာသင်ဆု လျှောက်နိုင်</li>
            </ul>
            {pkgs.length > 0 && (
              <p className="mt-1 text-muted-foreground">
                ဈေးနှုန်း: {pkgs.map((p) => `${p.credits} ကြိမ် = ${p.price.toLocaleString()} ကျပ်`).join(" · ")}
              </p>
            )}
          </div>
          <div>
            <p className="font-medium">👩‍🏫 ဆရာ/ဆရာမများ</p>
            <ul className="ml-5 list-disc text-muted-foreground">
              <li>AI Tutor နေ့စဉ် ၁၀ ကြိမ် · စာမေးပွဲထုတ်ခြင်း နေ့စဉ် ၄ ကြိမ် အခမဲ့</li>
              <li>ထပ်ထုတ်လိုပါက Exam Credit ဝယ်ယူ (သို့) Admin ထံ ဆက်သွယ်ပါ</li>
              <li>အတန်းဖွင့်ခြင်း၊ Class Code ဖြင့် ကျောင်းသားလက်ခံခြင်း</li>
              <li>စနစ်မှ မေးခွန်းထုတ်ခြင်း သို့မဟုတ် ကိုယ်ပိုင် Paper (PDF/Word/Photo) တင်ခြင်း</li>
              <li>AI က အဖြေလွှာ စစ်ပြီး အမှတ်/Feedback Draft ပေး — ဆရာ ပြင်ပြီးမှ ပို့</li>
            </ul>
          </div>
          <Link to="/guide" className="inline-block rounded-lg bg-primary px-3 py-1.5 text-primary-foreground">📖 လမ်းညွှန် & Credit ဝယ်ယူရန် ➜</Link>
          {!teacher && (
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
              <p className="font-medium">👩‍🏫 ဆရာအကောင့် ရယူလိုပါသလား?</p>
              <p className="text-muted-foreground">
                ဆရာ Role ရယူရန် Admin ထံ ဆက်သွယ်ပါ{contact ? <>: <b className="text-foreground">{contact}</b></> : "။"} My Progress စာမျက်နှာမှ "Request Teacher Role" ဖြင့်လည်း လျှောက်ထားနိုင်ပါသည်။
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
