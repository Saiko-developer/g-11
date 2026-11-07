import {
  UNIT2_READING_WORDS,
  UNIT2_READING_ROLES,
  UNIT2_ROLE_INFO,
} from "@/data/grade11/unit2ReadingStructure";
import { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/** Grade 11-only cards; clicking anywhere on a word explains its grammatical role. */
export function Grade11Unit2Structure({ questionId }: { questionId: string }) {
  const activeButton = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const words = UNIT2_READING_WORDS[questionId];
  const roles = UNIT2_READING_ROLES[questionId];
  const active = activeIndex === null ? null : words[activeIndex];
  const info = activeIndex === null ? null : UNIT2_ROLE_INFO[roles[activeIndex]];
  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-3"
        aria-label="Sentence structure words"
      >
        {words.map(([word, meaning], index) => (
          <button
            key={index}
            type="button"
            onClick={(event) => {
              activeButton.current = event.currentTarget;
              setActiveIndex(index);
            }}
            aria-label={`Explain ${word}, word ${index + 1}`}
            aria-haspopup="dialog"
            className="flex min-w-0 flex-[1_1_140px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-5 text-center transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-slate-700 dark:bg-slate-900"
          >
            <span
              lang="en"
              className="max-w-full break-words text-lg font-bold text-slate-900 dark:text-slate-50"
            >
              {word}
            </span>
            <span
              lang="my"
              className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              ({meaning})
            </span>
            <span
              lang="en"
              className="mt-2 max-w-full rounded-full bg-teal-700/10 px-2 py-1 text-xs font-semibold text-teal-800 dark:text-teal-200"
            >
              [{UNIT2_ROLE_INFO[roles[index]].tag}]
            </span>
          </button>
        ))}
      </div>
      <Sheet open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <SheetContent
          side="right"
          className="w-[88vw] overflow-y-auto sm:max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            activeButton.current?.focus();
          }}
        >
          <SheetHeader>
            <SheetTitle lang="my">{info?.titleMy}</SheetTitle>
            <SheetDescription lang="en">
              {active?.[0]} · [{info?.tag}]
            </SheetDescription>
          </SheetHeader>
          {active && info && (
            <div className="mt-5 space-y-4 text-sm leading-relaxed" lang="my">
              <p className="rounded-xl bg-primary/5 p-3">{active[1]}</p>
              <p>{info.explanationMy}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
