import { useState } from "react";
import { Play } from "lucide-react";
import { UNIT_VIDEOS } from "@/data/unitVideos";
import { SyncedVideoPlayer } from "@/components/lesson/SyncedVideoPlayer";
import { UNIT1_GRAMMAR_SUBTITLES } from "@/data/unit1GrammarSubtitles";
import { UNIT2_GRAMMAR_SUBTITLES } from "@/data/unit2GrammarSubtitles";
import { UNIT2_ADJ_PREP_SUBTITLES } from "@/data/unit2AdjPrepSubtitles";
import { UNIT2_ADJ_EDING_SUBTITLES } from "@/data/unit2AdjEdIngSubtitles";
import { UNIT3_SUBJ_PRED_SUBTITLES } from "@/data/unit3SubjectPredicateSubtitles";
import { UNIT3_EITHER_NEITHER_SUBTITLES } from "@/data/unit3EitherNeitherSubtitles";
import { UNIT4_PAST_SUBTITLES } from "@/data/unit4PastSimpleContSubtitles";
import { UNIT4_PARTICIPIAL_SUBTITLES } from "@/data/unit4ParticipialSubtitles";
import { UNIT5_USED_TO_SUBTITLES } from "@/data/unit5UsedToSubtitles";
import { UNIT5_PRESENT_PERFECT_SUBTITLES } from "@/data/unit5PresentPerfectSubtitles";
import { UNIT6_REPORTED_SPEECH_SUBTITLES } from "@/data/unit6ReportedSpeechSubtitles";
import { UNIT7_ACTIVE_PASSIVE_SUBTITLES } from "@/data/unit7ActivePassiveSubtitles";
import { UNIT8_PASSIVE_NO_AGENT_SUBTITLES } from "@/data/unit8PassiveWithoutAgentSubtitles";
import { UNIT9_FUTURE_SUBTITLES } from "@/data/unit9FutureTenseSubtitles";
import { UNIT9_CONDITIONAL_SUBTITLES } from "@/data/unit9ConditionalClausesSubtitles";
import { UNIT10_NOT_ONLY_SUBTITLES } from "@/data/unit10NotOnlyButAlsoSubtitles";
import { UNIT11_RELATIVE_PRONOUNS_SUBTITLES } from "@/data/unit11RelativePronounsSubtitles";
import type { SubtitleLine } from "@/data/unit1VideoSubtitles";

const SUBTITLES: Record<string, SubtitleLine[]> = { eWDrDo1Vnc0: UNIT1_GRAMMAR_SUBTITLES, W3HdjN3cLiM: UNIT2_GRAMMAR_SUBTITLES, z5DDa4vBvfA: UNIT2_ADJ_PREP_SUBTITLES, I9tEYgpOQiA: UNIT2_ADJ_EDING_SUBTITLES, VuXBh78Jkik: UNIT3_SUBJ_PRED_SUBTITLES, LToct5dVXDA: UNIT3_EITHER_NEITHER_SUBTITLES, ASsT90H2fVE: UNIT4_PAST_SUBTITLES, o_9GTVFvL2s: UNIT4_PARTICIPIAL_SUBTITLES, "TCeKn62j-zA": UNIT5_USED_TO_SUBTITLES, _ZR2POcCBDc: UNIT5_PRESENT_PERFECT_SUBTITLES, wQIoo8OivsA: UNIT6_REPORTED_SPEECH_SUBTITLES, fDnXWxXZekw: UNIT7_ACTIVE_PASSIVE_SUBTITLES, p0CH3PMQxuE: UNIT8_PASSIVE_NO_AGENT_SUBTITLES, "4Ae7O57Itu8": UNIT9_FUTURE_SUBTITLES, DlyQltLpX24: UNIT9_CONDITIONAL_SUBTITLES, hC8BbRGz3ho: UNIT10_NOT_ONLY_SUBTITLES, bash3DXnyWU: UNIT11_RELATIVE_PRONOUNS_SUBTITLES };

export function GrammarVideos({ unit }: { unit: number }) {
  const videos = UNIT_VIDEOS[unit] ?? [];
  const [active, setActive] = useState(0);
  if (!videos.length) return null;
  const v = videos[Math.min(active, videos.length - 1)];

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Play className="h-3.5 w-3.5" /> Video Lesson
      </div>
      {videos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {videos.map((x, i) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                i === active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {x.title}
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-sm font-semibold">{v.title}</p>
      {SUBTITLES[v.id] ? (
        <SyncedVideoPlayer key={v.id} youtubeId={v.id} title={v.title} subtitles={SUBTITLES[v.id]} burmeseOnly />
      ) : (
      <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <iframe
            key={v.id}
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}
