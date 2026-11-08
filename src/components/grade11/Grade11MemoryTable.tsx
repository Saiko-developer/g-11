/** Text transcription of the diagram on printed page 24; the original sequence is retained. */
export function Grade11MemoryTable() {
  const rows = [
    ["Information", "Incoming information", "ဝင်ရောက်လာသော အချက်အလက်များ"],
    [
      "Sensory memory",
      "Fleeting ‘snapshots’ of sights and sounds",
      "မြင်ကွင်းနှင့် အသံများကို ခဏတာ ဖမ်းယူထားခြင်း",
    ],
    ["Attention", "↓", "အာရုံစိုက်ခြင်း"],
    [
      "Working memory = Short-term memory",
      "Temporary storage and processing of information",
      "အချက်အလက်များကို ယာယီသိုလှောင်၍ စီမံလုပ်ဆောင်ခြင်း",
    ],
    ["Encoding", "↓", "မှတ်သားသိုလှောင်နိုင်ရန် အချက်အလက်ကို ပြောင်းလဲစီစဉ်ခြင်း"],
    [
      "Long-term memory",
      "Long-term and permanent storage of information",
      "အချက်အလက်များကို ရေရှည်နှင့် အမြဲတမ်း သိုလှောင်ခြင်း",
    ],
    [
      "Retrieval",
      "Long-term memory → Working memory",
      "ရေရှည်မှတ်ဉာဏ်မှ လက်ရှိအသုံးပြုရန် ပြန်လည်ထုတ်ယူခြင်း",
    ],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-3 text-left font-semibold">Memory — information flow</caption>
        <thead>
          <tr>
            {["Stage", "Textbook description", "မြန်မာအဓိပ္ပာယ်"].map((h) => (
              <th key={h} className="border border-border p-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((text, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="border border-border p-3 text-left font-medium"
                  >
                    {text}
                  </th>
                ) : (
                  <td
                    key={i}
                    lang={i === 2 ? "my" : "en"}
                    className="border border-border p-3 leading-relaxed"
                  >
                    {text}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
