import { useState } from "react";
import { Play } from "lucide-react";
import { UNIT_VIDEOS } from "@/data/unitVideos";
import { UNIT2_VIDEO_SUBTITLES } from "@/data/unit2VideoSubtitles";
import { SyncedVideoPlayer } from "@/components/lesson/SyncedVideoPlayer";

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
      {UNIT2_VIDEO_SUBTITLES[v.id] ? (
        <SyncedVideoPlayer key={v.id} youtubeId={v.id} title={v.title} subtitles={UNIT2_VIDEO_SUBTITLES[v.id]} burmeseOnly />
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
