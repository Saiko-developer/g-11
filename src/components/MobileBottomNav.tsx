import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpen, FileText, Home } from "lucide-react";
import tutorLogo from "@/assets/tutor-logo.png";

/** Thumb-friendly bottom bar shown only on phones (hidden from md up). */
export function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/admin")) return null;
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium";
  const tone = (on: boolean) => (on ? "text-primary" : "text-muted-foreground");
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-md items-end">
        <Link to="/" className={`${item} ${tone(path === "/")}`}>
          <Home className="h-5 w-5" /> Home
        </Link>
        <Link to="/" hash="lessons" className={`${item} ${tone(path.startsWith("/practice") || path.startsWith("/section"))}`}>
          <BookOpen className="h-5 w-5" /> Lessons
        </Link>
        <Link to="/tutor" className={`${item} ${tone(path.startsWith("/tutor"))}`}>
          <span className={`-mt-5 grid h-12 w-12 place-items-center rounded-full border-2 bg-card shadow-md ${path.startsWith("/tutor") ? "border-primary" : "border-border"}`}>
            <img src={tutorLogo} alt="" className="h-9 w-9" />
          </span>
          Ask Owl
        </Link>
        <Link to="/exam-builder" className={`${item} ${tone(path.startsWith("/exam-builder") || path.startsWith("/mock-exam"))}`}>
          <FileText className="h-5 w-5" /> Exam
        </Link>
        <Link to="/progress" className={`${item} ${tone(path.startsWith("/progress"))}`}>
          <BarChart3 className="h-5 w-5" /> Progress
        </Link>
      </div>
    </nav>
  );
}
