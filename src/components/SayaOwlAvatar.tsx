import tutorLogo from "@/assets/tutor-logo.png";

export type OwlState = "idle" | "listening" | "thinking" | "speaking" | "muted";

/** Sayar Owl logo whose decoration shows what the voice tutor is doing. */
export function SayaOwlAvatar({ state, size = 56 }: { state: OwlState; size?: number }) {
  const ring =
    state === "listening" ? "ring-primary" : state === "speaking" ? "ring-accent" : state === "thinking" ? "ring-secondary" : "ring-border";
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {state === "listening" && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <span className="absolute -inset-1.5 animate-pulse rounded-full border-2 border-primary/50" />
        </>
      )}
      {state === "speaking" && (
        <>
          <span className="absolute -inset-1 animate-ping rounded-full bg-accent/40" style={{ animationDuration: "1.2s" }} />
          <span className="absolute -inset-2 animate-pulse rounded-full border-2 border-accent/60" />
        </>
      )}
      {state === "thinking" && <span className="absolute -inset-1 animate-pulse rounded-full bg-secondary/70" />}
      <img
        src={tutorLogo}
        alt="Sayar Owl"
        draggable={false}
        className={`relative h-full w-full rounded-full bg-card object-cover shadow-lg ring-2 transition ${ring} ${
          state === "thinking" ? "-rotate-6" : ""
        } ${state === "muted" ? "opacity-60 grayscale" : ""}`}
      />
      {state === "idle" && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
          ?
        </span>
      )}
      {state === "thinking" && (
        <span className="absolute -right-2 -top-3 flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 text-xs shadow">
          <span className="animate-pulse">💭</span>
          <span className="animate-spin" style={{ animationDuration: "2s" }}>✨</span>
        </span>
      )}
      {state === "muted" && (
        <span className="absolute -right-1 -top-1 rounded-full bg-muted px-1 text-[10px] shadow">🔇</span>
      )}
    </span>
  );
}
