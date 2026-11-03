import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { answerKeyHtml, downloadAnswerKey, type DownloadFormat } from "@/lib/examPrint";
import type { MockExamPaper } from "@/lib/mockExam";

const FORMATS: { f: DownloadFormat; label: string }[] = [
  { f: "pdf", label: "PDF (.pdf)" },
  { f: "doc", label: "Word (.doc)" },
  { f: "png", label: "Image (.png)" },
  { f: "jpeg", label: "Image (.jpg)" },
];

export function AnswerKeyDialog({
  paper,
  open,
  onOpenChange,
}: {
  paper: MockExamPaper | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col gap-3 p-4">
        <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pr-8">
          <DialogTitle>Answer Key</DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={!paper}>
                <FileDown className="h-4 w-4" /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FORMATS.map(({ f, label }) => (
                <DropdownMenuItem key={f} onSelect={() => paper && downloadAnswerKey(paper, f)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>
        {paper && (
          <iframe
            title="Answer key preview"
            srcDoc={answerKeyHtml(paper).replace("<body>", '<body style="padding:24px 32px;background:#fff">')}
            className="w-full flex-1 rounded-md border border-border bg-card"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
