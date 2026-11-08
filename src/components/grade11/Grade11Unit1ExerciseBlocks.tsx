import { ToggleReveal } from "@/components/lesson/ExerciseKit";
import type { ReactNode } from "react";
import type { Unit1Block } from "@/lib/grade11Unit1";

/** The PDF's listening table and A/B dialogue use the same existing answer controls. */
export function Grade11Unit1ExerciseBlocks({
  blocks,
  layout,
  renderBlock,
}: {
  blocks: Unit1Block[];
  layout?: "listening" | "dialogue";
  renderBlock: (block: Unit1Block) => ReactNode;
}) {
  if (!layout) return <div className="mt-3 space-y-3">{blocks.map(renderBlock)}</div>;
  if (layout === "listening") {
    const rows: { label: Unit1Block; questions: Unit1Block[] }[] = [];
    for (const block of blocks) {
      if (block.t === "line") rows.push({ label: block, questions: [] });
      else if (block.t === "q") rows.at(-1)?.questions.push(block);
    }
    return (
      <table className="mt-3 w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Wildlife Conservation listening table</caption>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col />
        </colgroup>
        <tbody>
          {rows.map(({ label, questions }) => (
            <tr key={label.id}>
              <th
                scope="row"
                className="w-[30%] break-words border border-border bg-muted/40 p-2 text-left align-top font-medium"
              >
                <p>{label.x}</p>
                <ToggleReveal label="Translate">{label.my}</ToggleReveal>
              </th>
              <td className="space-y-3 border border-border p-2 align-top">
                {questions.map(renderBlock)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const options = blocks.filter((block) => /^\([a-e]\)/.test(block.x));
  const dialogue = blocks.filter((block) => !options.includes(block));
  return (
    <div className="mt-3 space-y-3">
      {options.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border p-3">
          {options.map(renderBlock)}
        </div>
      )}
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Exercise B dialogue</caption>
        <colgroup>
          <col style={{ width: "36px" }} />
          <col />
        </colgroup>
        <tbody>
          {dialogue.map((block) => (
            <tr key={block.id}>
              <th scope="row" className="w-9 border border-border bg-muted/40 p-2 align-top">
                {block.x.match(/^([AB]):/)?.[1]}
              </th>
              <td className="border border-border p-2 align-top">
                {renderBlock({
                  ...block,
                  x: block.x.replace(/^[AB]:\s*/, ""),
                  my: block.my.replace(/^[AB]:\s*/, ""),
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
