import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  FileUp,
  GraduationCap,
  Languages,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useRef } from "react";

import heroOwl from "@/assets/hero-owl.jpg";
import { CurriculumExplorer } from "@/components/CurriculumExplorer";
import { SayaOwlHome } from "@/components/SayaOwlHome";
import { SiteHeader } from "@/components/SiteHeader";
import { HowItWorks } from "@/components/HowItWorks";
import { EXAM_UPLOAD_ACCEPT, emitExamUpload } from "@/lib/examUpload";
import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sayar Owl Academy — Modern English Learning for Grade 10 Myanmar" },
      {
        name: "description",
        content:
          "A modern learning platform with Sayar Owl, your patient AI English tutor. Grammar lessons, sentence breakdowns, and Myanmar translations built for Grade 10 students.",
      },
      { property: "og:title", content: "Sayar Owl Academy — English Learning Platform" },
      {
        property: "og:description",
        content:
          "Learn English with Sayar Owl — patient, simple explanations with Myanmar translation context.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: MessageCircle, key: "ask" },
  { icon: Languages, key: "mm" },
  { icon: BookOpen, key: "g10" },
  { icon: Trophy, key: "practice" },
] as const;


function Landing() {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.95_0.05_190)_0%,_transparent_60%)]" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:gap-10 md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t("hero.title.a")} <span className="text-primary">{t("hero.title.b")}</span> {t("hero.title.c")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                to="/tutor"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                {t("hero.cta.chat")}
              </Link>
              <input
                ref={fileInputRef}
                type="file"
                accept={EXAM_UPLOAD_ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) emitExamUpload(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                <FileUp className="h-4 w-4" />
                {t("hero.cta.browse")}
              </button>
            </div>
            <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {t("hero.tag.syllabus")}</div>
              <div className="flex items-center gap-1.5"><Languages className="h-4 w-4" /> {t("hero.tag.langs")}</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/30 to-primary/20 blur-2xl" />
            <img
              src={heroOwl}
              alt="Sayar Owl, the friendly English tutor mascot"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card shadow-xl"
            />
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Features */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("features.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("features.subtitle")}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.key} className="rounded-2xl border border-border bg-background p-5 transition hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{t(`feature.${f.key}.title`)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(`feature.${f.key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus Curriculum Explorer */}
      <section id="lessons" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Syllabus Curriculum Explorer
              </h2>
              <p className="mt-2 text-muted-foreground">
                Grade 10 English — Units 1 to 12. Open a unit and tap any skill card to start
                learning.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <CurriculumExplorer />
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="border-t border-border/60 bg-primary/5">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
          <Link
            to="/tutor"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            {t("cta.button")}
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        {t("footer", { year: new Date().getFullYear() })}
      </footer>

      <SayaOwlHome lessonContext="Grade 10 English — exam paper review with Sayar Owl" />
    </div>
  );
}
