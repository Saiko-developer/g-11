import { useCallback, useEffect, useState } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; author_id: string; author_name: string; is_teacher: boolean; body: string; created_at: string };

export function ClassFeed({ cid, teacher }: { cid: string; teacher: boolean }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [me, setMe] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("class_feed", { _cid: cid });
    if (error) toast.error(error.message);
    setPosts((data as Post[]) ?? []);
  }, [cid]);
  useEffect(() => {
    void load();
    void supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
  }, [load]);

  const post = async () => {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    const { error } = await supabase.from("class_posts").insert({ classroom_id: cid, body: text });
    setBusy(false);
    if (error) return toast.error(error.message);
    setBody("");
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("ဤ Post ကို ဖျက်မှာလား?")) return;
    const { error } = await supabase.from("class_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border p-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={4000}
          placeholder={teacher ? "ကြေညာချက် / သတိပေးချက် ရေးပါ…" : "ဆရာ့ကို မေးခွန်း မေးပါ…"}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={post}
            disabled={busy || !body.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post
          </button>
        </div>
      </div>
      {!posts ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-xs text-muted-foreground">Post မရှိသေးပါ။</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className={`rounded-lg border p-2.5 text-sm ${p.is_teacher ? "border-primary/40 bg-primary/5" : "border-border"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{p.author_name}</span>
                  {p.is_teacher && <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">ဆရာ</span>}
                  <span className="ml-1.5">{new Date(p.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
                {(teacher || p.author_id === me) && (
                  <button onClick={() => remove(p.id)} aria-label="Delete post" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap">{p.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
