import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

type Attempt = { answer: string; correct: boolean };
type Ctx = {
  attempts: Record<string, Attempt>;
  save: (key: string, answer: string, correct: boolean) => void;
};

const PracticeProgressContext = createContext<Ctx | null>(null);

/** Saves each "Check Answer" for the signed-in student, per unit + skill. */
export function PracticeProgressProvider({ unit, skill, children }: { unit: number; skill: string; children: ReactNode }) {
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});

  useEffect(() => {
    let alive = true;
    void supabase
      .from("practice_attempts")
      .select("question_key, answer, correct")
      .eq("unit", unit)
      .eq("skill", skill)
      .then(({ data }) => {
        if (!alive || !data) return;
        const map: Record<string, Attempt> = {};
        for (const r of data) map[r.question_key] = { answer: r.answer, correct: r.correct };
        setAttempts(map);
      });
    return () => {
      alive = false;
    };
  }, [unit, skill]);

  const save = useCallback(
    (key: string, answer: string, correct: boolean) => {
      setAttempts((a) => ({ ...a, [key]: { answer, correct } }));
      void (async () => {
        const { data } = await supabase.auth.getSession();
        const uid = data.session?.user.id;
        if (!uid) return;
        await supabase.from("practice_attempts").upsert(
          { user_id: uid, unit, skill, question_key: key.slice(0, 500), answer, correct, updated_at: new Date().toISOString() },
          { onConflict: "user_id,unit,skill,question_key" },
        );
      })();
    },
    [unit, skill],
  );

  return <PracticeProgressContext.Provider value={{ attempts, save }}>{children}</PracticeProgressContext.Provider>;
}

export function usePracticeProgress() {
  return useContext(PracticeProgressContext);
}
