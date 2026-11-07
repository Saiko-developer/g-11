import { useState } from "react";
import { Play } from "lucide-react";
import videosByUnit from "@/data/grade11/grammarVideos.json";

type Video = { title: string; url: string };
const catalog = videosByUnit as Record<string, Video[]>;

function youtubeId(value: string) {
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "www.youtube.com", "www.youtube-nocookie.com"].includes(url.hostname)
          ? (url.searchParams.get("v") ??
            url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})/)?.[1])
          : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Same video section pattern as Grade 10, with a separate Grade 11 catalog. */
export function Grade11GrammarVideos({ unit }: { unit: number }) {
  const [active, setActive] = useState(0);
  const videos = catalog[String(unit)] ?? [];
  if (!videos.length) return null;
  const video = videos[Math.min(active, videos.length - 1)];
  const id = youtubeId(video.url);
  return (
    <section
      className="mt-5 rounded-2xl border border-border bg-card p-5"
      aria-label="Grammar video explanation"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Play className="h-3.5 w-3.5" /> Video Lesson
      </div>
      {videos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {videos.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${active === index ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-sm font-semibold">{video.title}</p>
      {id ? (
        <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <iframe
            key={id}
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <p lang="my" className="mt-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          ဗီဒီယို မထည့်ရသေးပါ။
        </p>
      )}
    </section>
  );
}
