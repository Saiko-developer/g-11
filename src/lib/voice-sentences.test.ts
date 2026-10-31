import { describe, expect, it } from "vitest";
import { takeSpeakableChunks } from "./voice-sentences";

describe("takeSpeakableChunks", () => {
  it("speaks the first complete sentence before the reply finishes", () => {
    const text = "ဟုတ်ပြီ ကျောင်းသား၊ ဒီ Exercise A မေးခွန်း ၃ လေးကို အတူတူ ကြည့်ရအောင်။ ဒုတိယ";
    const r = takeSpeakableChunks(text, 0, false, 10);
    expect(r.chunks).toEqual(["ဟုတ်ပြီ ကျောင်းသား၊ ဒီ Exercise A မေးခွန်း ၃ လေးကို အတူတူ ကြည့်ရအောင်။"]);
    expect(text.slice(r.next).trim()).toBe("ဒုတိယ");
  });

  it("holds back an unfinished sentence until the stream ends, then speaks it", () => {
    const partial = takeSpeakableChunks("Present Perfect ကို သုံးရ", 0, false, 5);
    expect(partial.chunks).toEqual([]);
    const done = takeSpeakableChunks("Present Perfect ကို သုံးရ", 0, true, 5);
    expect(done.chunks).toEqual(["Present Perfect ကို သုံးရ"]);
  });
});

import { cleanForSpeech } from "./voice-sentences";
describe("cleanForSpeech", () => {
  it("drops robotic English headers", () => {
    expect(cleanForSpeech("**[The Correct Answer]** အဖြေမှန်ကတော့ begins ပါ။")).toBe("အဖြေမှန်ကတော့ begins ပါ။");
  });
});
