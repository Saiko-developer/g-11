import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, FileText, Home, Users } from "lucide-react";
import tutorLogo from "@/assets/tutor-logo.png";

/** Pages where the bar is hidden so it never covers inputs or exam buttons. */
const HIDE_ON = ["/admin", "/tutor", "/mock-exam", "/class-exam"];

/** Thumb-friendly bottom bar on phones; hides on scroll down, reappears on scroll up (Facebook-style). */
export function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [shown, setShown] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    setShown(true);
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 8;
      const dy = y - lastY.current;
      if (y < 40 || atBottom || dy < -6) setShown(true);
      else if (dy > 6) setShown(false);
      if (Math.abs(dy) > 6) lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  if (HIDE_ON.some((p) => path.startsWith(p))) return null;
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium";
  const tone = (on: boolean) => (on ? "text-primary" : "text-muted-foreground");
  return (
    <nav
      aria-label="Main"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur transition-transform duration-300 md:hidden ${shown ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-md items-end">
        <Link to="/" className={`${item} ${tone(path === "/")}`}>
          <Home className="h-5 w-5" /> Home
        </Link>
        <Link to="/" hash="lessons" className={`${item} ${tone(path.startsWith("/practice") || path.startsWith("/section"))}`}>
          <BookOpen className="h-5 w-5" /> Lessons
        </Link>
        <Link to="/tutor" className={`${item} text-muted-foreground`}>
          <span className="-mt-5 grid h-12 w-12 place-items-center rounded-full border-2 border-border bg-card shadow-md">
            <img src={tutorLogo} alt="" className="h-9 w-9" />
          </span>
          Ask Owl
        </Link>
        <Link to="/exam-builder" className={`${item} ${tone(path.startsWith("/exam-builder"))}`}>
          <FileText className="h-5 w-5" /> Exam
        </Link>
        <Link to="/classrooms" className={`${item} ${tone(path.startsWith("/classrooms"))}`}>
          <Users className="h-5 w-5" /> Classes
        </Link>
      </div>
    </nav>
  );
}
