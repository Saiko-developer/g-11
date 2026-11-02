/**
 * Grade 10 grammar video lessons (YouTube), keyed by unit number.
 * Static data committed to Git so it survives remix / repo push.
 * Unit 1 keeps its own synced-subtitle video in unit1Supplement.ts.
 * Unit 8 "Omission of Verbs" intentionally has no video (text explanation only).
 */
export type GrammarVideo = { id: string; title: string };

export const UNIT_VIDEOS: Record<number, GrammarVideo[]> = {
  1: [{ id: "eWDrDo1Vnc0", title: "Nouns in Apposition" }],
  2: [
    { id: "W3HdjN3cLiM", title: "Present Simple & Present Continuous" },
    { id: "z5DDa4vBvfA", title: "Adjectival Phrases (Preposition)" },
    { id: "I9tEYgpOQiA", title: "Adjectival Phrases (-ed / -ing)" },
  ],
  3: [
    { id: "VuXBh78Jkik", title: "Subject & Predicate" },
    { id: "LToct5dVXDA", title: "Either...or / Neither...nor" },
  ],
  4: [
    { id: "ASsT90H2fVE", title: "Past Simple & Past Continuous" },
    { id: "o_9GTVFvL2s", title: "Participial Phrases" },
  ],
  5: [
    { id: "TCeKn62j-zA", title: "Used to" },
    { id: "rRJLzSJbolg", title: "Present Perfect & Present Perfect Continuous" },
  ],
  6: [{ id: "wQIoo8OivsA", title: "Reported Speech" }],
  7: [{ id: "fDnXWxXZekw", title: "Active & Passive Voice" }],
  8: [{ id: "p0CH3PMQxuE", title: "Passive Voice without Agent" }],
  9: [
    { id: "4Ae7O57Itu8", title: "The Future Tense" },
    { id: "DlyQltLpX24", title: "Conditional Clauses" },
  ],
  10: [
    { id: "iKRdFB2PJPM", title: "Not only...but also" },
    { id: "3XAOixcl7bk", title: "The more/less... the more/less..." },
  ],
  11: [{ id: "bash3DXnyWU", title: "Relative Pronouns (who, whom, whose)" }],
  12: [
    { id: "j25CFx-4g0I", title: "Relative Pronouns (that, which)" },
    { id: "So6sMv--440", title: "as...as / not as...as" },
  ],
};
