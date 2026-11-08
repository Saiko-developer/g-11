import { useEffect, useState, type RefObject } from "react";
import { grade11CaptionAt, type Grade11Caption } from "@/lib/grade11Captions";

/** Derive subtitles from the media clock, including seeks, rate changes and paused playback. */
export function useGrade11CaptionClock(
  audioRef: RefObject<HTMLAudioElement | null>,
  cues: Grade11Caption[],
  stopAt?: RefObject<number | null>,
) {
  const [active, setActive] = useState({ cueIndex: -1, wordIndex: -1 });
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let frame = 0;
    const update = () => {
      if (stopAt && stopAt.current !== null && audio.currentTime >= stopAt.current) {
        stopAt.current = null;
        audio.pause();
      }
      const next = grade11CaptionAt(cues, audio.currentTime);
      setActive((old) =>
        old.cueIndex === next.cueIndex && old.wordIndex === next.wordIndex ? old : next,
      );
    };
    const tick = () => {
      update();
      if (!audio.paused) frame = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      tick();
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      update();
    };
    audio.addEventListener("play", play);
    audio.addEventListener("pause", pause);
    audio.addEventListener("ended", pause);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("seeked", update);
    audio.addEventListener("loadedmetadata", update);
    update();
    if (!audio.paused) play();
    return () => {
      cancelAnimationFrame(frame);
      audio.removeEventListener("play", play);
      audio.removeEventListener("pause", pause);
      audio.removeEventListener("ended", pause);
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("seeked", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, [audioRef, cues, stopAt]);
  return active;
}
