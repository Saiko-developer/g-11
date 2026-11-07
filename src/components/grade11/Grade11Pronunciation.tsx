import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Same browser pronunciation method as Grade 10 VocabCard. */
export function Grade11Pronunciation({ text }: { text: string }) {
  const word = text.replace(/^(?:\d+|[a-z])\.\s*/i, "");
  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 shrink-0"
      onClick={speak}
      aria-label={`Speak ${word}`}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );
}
