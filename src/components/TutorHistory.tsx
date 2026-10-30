import { useEffect, useState } from "react";
import { History, MessageSquare, MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type ChatRow = { id: string; title: string; updated_at: string };

function groupLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const t = d.getTime();
  if (t >= start) return "ယနေ့";
  if (t >= start - 86400000) return "မနေ့က";
  if (t >= start - 7 * 86400000) return "ပြီးခဲ့သော ၇ ရက်";
  return "အရင်က";
}

export function TutorHistory({
  activeId,
  refreshKey,
  onSelect,
  onNew,
}: {
  activeId?: string;
  refreshKey: number;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    supabase
      .from("tutor_chats")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("[history]", error);
        setChats(data ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, refreshKey]);

  const remove = async (id: string) => {
    if (!confirm("ဒီစကားဝိုင်းကို ဖျက်မှာ သေချာပါသလား?")) return;
    const { error } = await supabase.from("tutor_chats").delete().eq("id", id);
    if (error) {
      console.error("[history] delete", error);
      return;
    }
    setChats((c) => c.filter((x) => x.id !== id));
    if (id === activeId) onNew();
  };

  const q = query.trim().toLowerCase();
  const shown = q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats;

  let lastGroup = "";
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" title="Chat history">
          <History className="h-4 w-4" />
          <span className="ml-1.5 hidden sm:inline">မှတ်တမ်း</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-80 flex-col gap-0 bg-muted/40 p-0">
        <SheetHeader className="px-4 pb-2 pt-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" /> စကားဝိုင်း မှတ်တမ်း
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-2 px-3 pb-3">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-xl bg-background"
            onClick={() => {
              onNew();
              setOpen(false);
            }}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="ml-1.5">စကားဝိုင်းအသစ်</span>
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="မှတ်တမ်း ရှာဖွေရန်..."
              className="rounded-xl bg-background pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {loading && chats.length === 0 ? (
            <p className="px-3 text-sm text-muted-foreground">Loading…</p>
          ) : shown.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {q ? "ရှာဖွေမှု မတွေ့ပါ။" : "မှတ်တမ်း မရှိသေးပါ။"}
            </p>
          ) : (
            shown.map((c) => {
              const g = groupLabel(c.updated_at);
              const showGroup = g !== lastGroup;
              lastGroup = g;
              const active = c.id === activeId;
              return (
                <div key={c.id}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
                  )}
                  <div
                    className={`group flex items-center gap-1 rounded-lg transition-colors ${active ? "bg-background shadow-sm ring-1 ring-border" : "hover:bg-background/70"}`}
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm"
                      onClick={() => {
                        onSelect(c.id);
                        setOpen(false);
                      }}
                    >
                      <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`truncate ${active ? "font-medium" : ""}`}>{c.title}</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete chat"
                      className="mr-1 rounded p-1.5 text-muted-foreground opacity-60 transition hover:text-destructive group-hover:opacity-100"
                      onClick={() => void remove(c.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
