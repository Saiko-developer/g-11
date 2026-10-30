import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Shows full answer-sheet photos (never cropped); tap one to view it large. */
export function PhotoGallery({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  if (!photos.length) return null;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <button key={i} type="button" onClick={() => setIdx(i)} className="rounded-md border border-border bg-muted p-1">
            <img src={src} alt={`Page ${i + 1}`} className="aspect-[3/4] w-full object-contain" />
            <span className="text-xs text-muted-foreground">Page {i + 1} · နှိပ်၍ ချဲ့ကြည့်ပါ</span>
          </button>
        ))}
      </div>
      <Dialog open={idx !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="px-2 text-sm">Page {(idx ?? 0) + 1} / {photos.length}</DialogTitle>
          {idx !== null && (
            <div className="max-h-[80vh] overflow-auto">
              <img src={photos[idx]} alt={`Page ${idx + 1}`} className="w-full object-contain" />
            </div>
          )}
          {photos.length > 1 && (
            <div className="flex justify-between">
              <Button variant="outline" size="sm" disabled={!idx} onClick={() => setIdx((i) => (i ?? 1) - 1)}><ChevronLeft className="h-4 w-4" /> ရှေ့</Button>
              <Button variant="outline" size="sm" disabled={idx === photos.length - 1} onClick={() => setIdx((i) => (i ?? 0) + 1)}>နောက် <ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
