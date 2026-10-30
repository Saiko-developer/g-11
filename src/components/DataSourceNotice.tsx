import { AlertTriangle } from "lucide-react";

import type { Curriculum } from "@/lib/curriculum";

/**
 * Lesson content now ships with the app (src/data), so there is no "offline
 * fallback" state to warn about. The notice only renders if an explicit
 * fallback reason is ever supplied.
 */
export function DataSourceNotice({ curriculum }: { curriculum: Curriculum }) {
  if (!curriculum.fallbackReason) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-semibold">Local lesson data</p>
        <p className="text-xs opacity-90">{curriculum.fallbackReason}</p>
      </div>
    </div>
  );
}
