/**
 * Curriculum data service.
 *
 * All lesson content is read from the bundled local data files in `src/data`.
 * Nothing here touches the database — the backend integration stays in place
 * for student accounts/progress only.
 */
import localUnit from "@/data/textbookUnit1.json";
import {
  grammar1C,
  partA1A_breakdowns,
  partA1A_translations,
  partA1C_translations,
  partB1C_translations,
  partB1A_breakdowns,
  partB1A_translations,
  partB1B_translations,
  partC1A_translations,
  vocab1B,
  type SentenceBreakdown,
  type VocabItem,
} from "@/data/unit1Supplement";

export type CurriculumSource = "local";

export type Supplement = {
  partA1A_translations: Record<number, string>;
  partB1A_translations: Record<number, string>;
  partC1A_translations: Record<number, string>;
  partB1B_translations: Record<number, string>;
  partA1C_translations: Record<number, string>;
  partB1C_translations: Record<number, string>;
  partA1A_breakdowns: Record<number, SentenceBreakdown>;
  partB1A_breakdowns: Record<number, SentenceBreakdown>;
  grammar1C: typeof grammar1C;
  vocab1B: VocabItem[];
};

export type Curriculum = {
  unit: {
    unit: string;
    unitTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lessons: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: any[];
  };
  supplement: Supplement;
  source: CurriculumSource;
  /** Kept for backwards compatibility with the data-source notice. */
  fallbackReason?: string;
};

const LOCAL_SUPPLEMENT: Supplement = {
  partA1A_translations,
  partB1A_translations,
  partC1A_translations,
  partB1B_translations,
  partA1C_translations,
  partB1C_translations,
  partA1A_breakdowns,
  partB1A_breakdowns,
  grammar1C,
  vocab1B,
};

export const LOCAL_CURRICULUM: Curriculum = {
  unit: localUnit as unknown as Curriculum["unit"],
  supplement: LOCAL_SUPPLEMENT,
  source: "local",
};
