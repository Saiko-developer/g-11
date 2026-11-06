import { Link } from "@tanstack/react-router";

export function GradeSwitcher({ current }: { current: 10 | 11 }) {
  const base = "rounded-full px-4 py-1.5 text-sm font-medium transition";
  const on = "bg-primary text-primary-foreground shadow-sm";
  const off = "text-muted-foreground hover:text-foreground";
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1">
      <Link to="/" className={`${base} ${current === 10 ? on : off}`}>Grade 10</Link>
      <Link to="/grade-11" className={`${base} ${current === 11 ? on : off}`}>Grade 11</Link>
    </div>
  );
}
