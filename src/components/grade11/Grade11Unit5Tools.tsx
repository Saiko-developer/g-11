import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Grade11RequireSignIn as RequireSignIn } from "./Grade11RequireSignIn";
import { Grade11RolePlay } from "./Grade11RolePlay";
import type { Unit1Block } from "@/lib/grade11Unit1";

export function Grade11Unit5Map() {
  const map = (
    <svg
      viewBox="120 620 1120 535"
      role="img"
      aria-label="ASEAN countries textbook map"
      className="h-auto w-full"
    >
      <image href="/grade11/unit5/page-51.jpg" width="1273" height="1800" />
    </svg>
  );
  return (
    <div className="space-y-2 rounded-xl border border-border p-2">
      {map}
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            မြေပုံ ချဲ့ကြည့်မည်
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">
          <DialogTitle>ASEAN countries · Textbook map</DialogTitle>
          <div className="min-w-[650px]">{map}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function Grade11Unit5Speaking({
  exercise,
  notes,
  answers,
  setAnswer,
  open,
  onToggle,
}: {
  exercise: "5D-14" | "5D-21";
  notes: Unit1Block[];
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-4">
      {exercise === "5D-14" && (
        <div className="relative overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="mb-2 text-left font-semibold">Trip planner</caption>
            <thead>
              <tr>
                <th className="w-1/2 border border-border p-2">အကြောင်းအရာ</th>
                <th className="border border-border p-2">Your trip</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <th scope="row" className="border border-border p-2 text-left font-normal">
                    <p lang="en">{n.x}</p>
                    <p lang="my" className="mt-1 text-muted-foreground">
                      {n.my}
                    </p>
                  </th>
                  <td className="border border-border p-2">
                    <Textarea
                      aria-label={`Trip planner: ${n.x}`}
                      rows={2}
                      value={answers[n.id] ?? ""}
                      onChange={(e) => setAnswer(n.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button type="button" variant="outline" aria-expanded={open} onClick={onToggle}>
        Practise with AI
      </Button>
      {open && (
        <RequireSignIn>
          <Grade11RolePlay unit={5} exercise={exercise} />
        </RequireSignIn>
      )}
    </div>
  );
}
