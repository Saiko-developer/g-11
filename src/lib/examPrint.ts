/**
 * Client-side print/download helpers for the Sayar Owl mock exam paper.
 * Builds a clean, self-contained HTML document and prints it through a hidden
 * iframe so none of the app chrome (timer, buttons, header) is captured.
 * Used ONLY by src/routes/mock-exam.$unit.tsx.
 */
import type { ExamSection, MockExamPaper } from "@/lib/mockExam";

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const bold = (text: string) => esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const STYLES = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; font-size: 12pt; line-height: 1.6; margin: 0; }
  .doc-head { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 22px; }
  .doc-head h1 { font-size: 19pt; margin: 0 0 4px; letter-spacing: .01em; }
  .doc-head .sub { font-size: 10.5pt; letter-spacing: .12em; text-transform: uppercase; color: #444; }
  .doc-head .meta { font-size: 10.5pt; margin-top: 8px; color: #222; }
  section { margin: 0 0 26px; page-break-inside: avoid; }
  h2 { font-size: 13pt; margin: 0 0 2px; border-bottom: 1px solid #999; padding-bottom: 4px;
       display: flex; justify-content: space-between; gap: 12px; }
  h2 .marks { font-size: 10pt; font-weight: normal; text-transform: uppercase; letter-spacing: .1em; color: #555; }
  .instructions { font-style: italic; color: #333; margin: 8px 0 12px; font-size: 11pt; }
  .part { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: .1em; margin: 14px 0 6px; }
  ol.items { list-style: none; padding: 0; margin: 0; }
  ol.items > li { margin: 0 0 10px; }
  .options { color: #333; margin: 3px 0 0 18px; }
  .options span { margin-right: 22px; }
  .passage { border: 1px solid #bbb; padding: 12px 14px; margin: 8px 0 4px; text-align: justify; }
  .bank { border: 1px dashed #666; padding: 8px 12px; margin: 8px 0; }
  .bank b { display: block; font-size: 9.5pt; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 4px; }
  .bank span { margin-right: 20px; }
  .prompt { border-left: 3px solid #888; padding: 4px 12px; margin: 0 0 8px; }
  .note { font-size: 10pt; color: #444; }
  .ans { font-weight: bold; }
  .key-banner { border: 2px solid #111; padding: 8px; margin-bottom: 18px; text-align: center;
                text-transform: uppercase; letter-spacing: .18em; font-size: 10pt; font-weight: bold; }
  .sample-box { border: 1px solid #999; background: #fafafa; padding: 10px 12px; margin: 8px 0 12px; }
  .sample-label { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: .1em; color: #555; margin-bottom: 6px; }
  .sample-text { font-size: 11pt; line-height: 1.55; }
`;

function questionBody(s: ExamSection): string {
  const fill = (items: { number: number; sentence: string; hint?: string }[]) =>
    `<ol class="items">${items
      .map(
        (i) =>
          `<li>${i.number}. ${esc(i.sentence)}${i.hint ? ` <em>(${esc(i.hint)}…)</em>` : ""}</li>`,
      )
      .join("")}</ol>`;
  const qa = (items: { number: number; question: string }[]) =>
    `<ol class="items">${items.map((q) => `<li>${q.number}. ${esc(q.question)}</li>`).join("")}</ol>`;
  const bank = (title: string, words: string[]) =>
    `<div class="bank"><b>${title}</b>${words.map((w) => `<span>${esc(w)}</span>`).join("")}</div>`;

  switch (s.type) {
    case "fill":
      return fill(s.items);
    case "mcq":
      return `<ol class="items">${s.items
        .map(
          (i) =>
            `<li>${i.number}. ${esc(i.sentence)}<div class="options">${i.options
              .map((o) => `<span>(${esc(o.label)}) ${esc(o.text)}</span>`)
              .join("")}</div></li>`,
        )
        .join("")}</ol>`;
    case "transformation":
      return `<ol class="items">${s.items
        .map((i) => `<li>${i.number}. ${esc(i.sentence)} <strong>[${esc(i.instruction)}]</strong></li>`)
        .join("")}</ol>`;
    case "poetry":
      return `<p><strong>${esc(s.poemTitle)}</strong></p><div class="part">Part A</div>${fill(
        s.partA,
      )}<div class="part">Part B</div>${qa(s.partB)}`;
    case "passage":
      return `<div class="passage">${esc(s.passage)}</div><div class="part">Part A</div>${fill(
        s.partA,
      )}<div class="part">Part B</div>${qa(s.partB)}`;
    case "passage_extended":
      return `<div class="passage">${bold(s.passage)}</div><div class="part">Part A — match each definition with a boldfaced word</div><ol class="items">${s.definitions
        .map((d) => `<li>${d.number}. ${esc(d.definition)}</li>`)
        .join("")}</ol><div class="part">Part B</div>${qa(s.partB)}`;
    case "functional":
      return `${bank("Word bank", s.wordBank)}<div class="part">Part A</div><ol class="items">${s.dialogue
        .map((t) => `<li><strong>${esc(t.speaker)}:</strong> ${esc(t.text)}</li>`)
        .join("")}</ol>${bank("Phrase bank", s.phraseBank)}<div class="part">Part B</div>${qa(
        s.matches,
      )}`;
    case "writing":
      return `${s.prompts
        .map((p, i) => `<div class="prompt">(${String.fromCharCode(97 + i)}) ${esc(p)}</div>`)
        .join("")}<p class="note">Maximum ${s.maxWords} words.</p>`;
    default:
      return "";
  }
}

function answerBody(s: ExamSection): string {
  const list = (rows: { n: number | string; a: string }[]) =>
    `<ol class="items">${rows
      .map((r) => `<li>${r.n}. <span class="ans">${esc(r.a)}</span></li>`)
      .join("")}</ol>`;

  switch (s.type) {
    case "fill":
    case "mcq":
    case "transformation":
      return list(s.items.map((i) => ({ n: i.number, a: i.answer })));
    case "poetry":
    case "passage":
      return `<div class="part">Part A</div>${list(
        s.partA.map((i) => ({ n: i.number, a: i.answer })),
      )}<div class="part">Part B</div>${list(s.partB.map((q) => ({ n: q.number, a: q.answer })))}`;
    case "passage_extended":
      return `<div class="part">Part A</div>${list(
        s.definitions.map((d) => ({ n: d.number, a: d.answer })),
      )}<div class="part">Part B</div>${list(s.partB.map((q) => ({ n: q.number, a: q.answer })))}`;
    case "functional":
      return `<div class="part">Part A</div>${list(
        s.dialogue.filter((t) => t.answer).map((t) => ({ n: t.number, a: t.answer as string })),
      )}<div class="part">Part B</div>${list(s.matches.map((q) => ({ n: q.number, a: q.answer })))}`;
    case "writing": {
      const samples = s.sampleAnswers?.filter((a): a is string => typeof a === "string" && a.trim().length > 0);
      if (samples && samples.length > 0) {
        return `${samples
          .map(
            (ans, i) =>
              `<div class="sample-box"><div class="sample-label">Sample answer (${String.fromCharCode(
                97 + i,
              )}) — max ${s.maxWords} words</div><div class="sample-text">${esc(ans)}</div></div>`,
          )
          .join("")}`;
      }
      return `<p class="note">Open response — marked against content, organisation, grammar and range of vocabulary (max ${s.maxWords} words).</p>`;
    }
    default:
      return "";
  }
}

function wrap(title: string, head: string, sections: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(
    title,
  )}</title><style>${STYLES}</style></head><body>${head}${sections}</body></html>`;
}

function printHtml(html: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  const run = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => frame.remove(), 1000);
  };
  if (doc.readyState === "complete") window.setTimeout(run, 150);
  else frame.onload = () => window.setTimeout(run, 150);
}

export type DownloadFormat = "pdf" | "doc" | "png" | "jpeg";

function deliver(html: string, title: string, format: DownloadFormat) {
  if (format === "pdf") return printHtml(html);
  const safe = title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "exam";
  if (format === "doc") {
    const docHtml = html.replace(
      "<html>",
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">',
    );
    return saveBlob(new Blob(["\ufeff", docHtml], { type: "application/msword" }), `${safe}.doc`);
  }
  return void renderImage(html, format).then((blob) =>
    saveBlob(blob, `${safe}.${format === "png" ? "png" : "jpg"}`),
  );
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

async function renderImage(html: string, format: "png" | "jpeg"): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas-pro");
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;";
  document.body.appendChild(frame);
  try {
    const doc = frame.contentDocument!;
    doc.open();
    doc.write(html);
    doc.close();
    doc.body.style.padding = "48px 56px";
    doc.body.style.background = "#ffffff";
    await new Promise((r) => setTimeout(r, 200));
    frame.style.height = `${doc.body.scrollHeight + 20}px`;
    const canvas = await html2canvas(doc.body, { backgroundColor: "#ffffff", scale: 2 });
    return await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), format === "png" ? "image/png" : "image/jpeg", 0.92),
    );
  } finally {
    frame.remove();
  }
}

export function downloadExamPaper(paper: MockExamPaper, format: DownloadFormat = "pdf") {
  const head = `<div class="doc-head"><div class="sub">Sayar Owl Academy · Grade 10 English</div>
    <h1>${esc(paper.title)}</h1>
    <div class="meta">Unit ${esc(paper.unit)} · Total marks: ${esc(
      paper.totalMarks,
    )} · Time allowed: ${esc(paper.durationMinutes)} minutes</div>
    <div class="meta">Name: _________________________&nbsp;&nbsp;&nbsp;Class: ____________&nbsp;&nbsp;&nbsp;Date: ____________</div></div>`;
  const body = paper.sections
    .map(
      (s) =>
        `<section><h2><span>Section ${esc(s.id)}. ${esc(s.title)}</span><span class="marks">${esc(
          s.marks,
        )} marks</span></h2><p class="instructions">${esc(
          s.instructions,
        )}</p>${questionBody(s)}</section>`,
    )
    .join("");
  deliver(wrap(`${paper.title} — Question Paper`, head, body), `${paper.title} Question Paper`, format);
}

export function answerKeyHtml(paper: MockExamPaper): string {
  const head = `<div class="doc-head"><div class="sub">Sayar Owl Academy · Grade 10 English</div>
    <h1>${esc(paper.title)}</h1>
    <div class="meta">Unit ${esc(paper.unit)} · Total marks: ${esc(paper.totalMarks)}</div></div>
    <div class="key-banner">Answer Key — Teacher&rsquo;s Guide</div>`;
  const body = paper.sections
    .map(
      (s) =>
        `<section><h2><span>Section ${esc(s.id)}. ${esc(s.title)}</span><span class="marks">${esc(
          s.marks,
        )} marks</span></h2>${answerBody(s)}</section>`,
    )
    .join("");
  return wrap(`${paper.title} — Answer Key`, head, body);
}

export function downloadAnswerKey(paper: MockExamPaper, format: DownloadFormat = "pdf") {
  deliver(answerKeyHtml(paper), `${paper.title} Answer Key`, format);
}
