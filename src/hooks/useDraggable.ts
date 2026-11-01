import { useCallback, useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };
const MARGIN = 8;

/**
 * Free-drag offset (translate) for a fixed floating widget.
 * Clamps inside the viewport (above the mobile bottom nav), remembers the
 * position in localStorage, and lets callers ignore the click after a drag.
 */
export function useDraggable(storageKey: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const posRef = useRef(pos);
  posRef.current = pos;
  const moved = useRef(false);

  const clamp = useCallback((p: Pos): Pos => {
    const el = ref.current;
    if (!el) return p;
    const r = el.getBoundingClientRect();
    const baseL = r.left - posRef.current.x;
    const baseT = r.top - posRef.current.y;
    const bottomGap = window.innerWidth < 768 ? 72 : MARGIN;
    const minX = MARGIN - baseL;
    const maxX = window.innerWidth - MARGIN - r.width - baseL;
    const minY = MARGIN - baseT;
    const maxY = window.innerHeight - bottomGap - r.height - baseT;
    return { x: Math.min(maxX, Math.max(minX, p.x)), y: Math.min(maxY, Math.max(minY, p.y)) };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Pos | null;
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
        requestAnimationFrame(() => setPos(clamp(saved)));
      }
    } catch { /* ignore */ }
    const onResize = () => setPos((p) => clamp(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [storageKey, clamp]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY;
    const start = posRef.current;
    moved.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved.current && Math.hypot(dx, dy) < 6) return;
      moved.current = true;
      setPos(clamp({ x: start.x + dx, y: start.y + dy }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (moved.current) {
        try { localStorage.setItem(storageKey, JSON.stringify(posRef.current)); } catch { /* ignore */ }
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, [clamp, storageKey]);

  /** Swallow the click that ends a drag so it doesn't open the pop-up. */
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  }, []);

  return {
    ref,
    style: { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` } as React.CSSProperties,
    handleProps: { onPointerDown, onClickCapture, style: { touchAction: "none" as const } },
  };
}
