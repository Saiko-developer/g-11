import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { paperMime, type PaperFile } from "@/lib/uploaded-paper";

export function UploadedPaperFiles({ files }: { files: PaperFile[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void supabase.storage.from("class-papers").createSignedUrls(files.map((file) => file.path), 3600).then(({ data, error: failure }) => {
      if (!active) return;
      if (failure) return setError(failure.message);
      const next: Record<string, string> = {};
      for (const item of data ?? []) if (item.path && item.signedUrl) next[item.path] = item.signedUrl;
      setUrls(next);
      if (Object.keys(next).length !== files.length) setError("Some paper files could not be opened.");
    });
    return () => { active = false; };
  }, [files]);
  return <div className="space-y-5">
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {files.map((file) => <section key={file.path} className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-semibold">{file.name}</h3>
        {urls[file.path] && <Button asChild size="sm" variant="outline"><a href={urls[file.path]} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> Open / Download</a></Button>}
      </div>
      {!urls[file.path] ? !error && <Loader2 className="h-5 w-5 animate-spin" /> : paperMime(file).startsWith("image/") ? <img src={urls[file.path]} alt={file.name} className="max-h-[75vh] w-full object-contain" /> : paperMime(file) === "application/pdf" ? <iframe title={file.name} src={urls[file.path]} className="h-[65vh] w-full border border-border" /> : null}
    </section>)}
  </div>;
}