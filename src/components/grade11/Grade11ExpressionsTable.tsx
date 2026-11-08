import type { Unit1Block } from "@/lib/grade11Unit1";

export function Grade11ExpressionsTable({ blocks }: { blocks: Unit1Block[] }) {
  const agreeing = blocks.filter((b) => b.t === "line" && Number(b.id.split("-")[1]) < 19);
  const disagreeing = blocks.filter((b) => b.t === "line" && Number(b.id.split("-")[1]) >= 19);
  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <caption className="sr-only">Agreeing and disagreeing expressions</caption>
      <thead>
        <tr>
          <th className="border border-border p-3">Agreeing — သဘောတူခြင်း</th>
          <th className="border border-border p-3">Disagreeing — သဘောမတူခြင်း</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: Math.max(agreeing.length, disagreeing.length) }, (_, i) => (
          <tr key={i}>
            {[agreeing[i], disagreeing[i]].map((b, col) => (
              <td key={col} className="border border-border p-3 align-top">
                {b ? (
                  <>
                    <p lang="en">{b.x}</p>
                    <p lang="my" className="mt-2 leading-relaxed text-muted-foreground">
                      {b.my}
                    </p>
                  </>
                ) : (
                  "—"
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
