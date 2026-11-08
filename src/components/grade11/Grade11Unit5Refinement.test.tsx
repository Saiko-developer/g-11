import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { Grade11TextLesson } from "./Grade11TextLesson";
import { Grade11Unit5Lesson } from "./Grade11TravelLesson";
import keys from "@/data/grade11/listeningExerciseKeys.json";
vi.mock("@/components/AuthGate", () => ({
  useAuth: () => ({ session: { access_token: "test" }, ready: true }),
}));
vi.mock("./Grade11RolePlay", () => ({
  Grade11RolePlay: ({ exercise }: { exercise: string }) => <p>AI task {exercise}</p>,
}));
vi.mock("@/components/lesson/GrammarExerciseGenerator", () => ({
  GrammarExerciseGenerator: () => null,
}));
beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ correct: true, feedback: "ကောင်းပါတယ်။" })),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const group = (id: string) =>
  within(document.querySelector(`[data-exercise="${id}"]`) as HTMLElement);
describe("Unit 5 textbook-based exercises", () => {
  it("keeps the zoomable ASEAN map, direct translations and grouped controls", () => {
    render(<Grade11Unit5Lesson kind="reading" />);
    expect(screen.getByRole("img", { name: "ASEAN countries textbook map" })).toBeVisible();
    expect(screen.getByRole("button", { name: "မြေပုံ ချဲ့ကြည့်မည်" })).toBeEnabled();
    expect(group("5A-4").getAllByRole("combobox")).toHaveLength(10);
    expect(group("5A-44").getAllByRole("button", { name: "Check Answer" })).toHaveLength(1);
    expect(group("5A-44").queryByRole("button", { name: "Translate Question" })).toBeNull();
    expect(group("5A-62").getByRole("columnheader", { name: "Capital city" })).toBeVisible();
    expect(screen.getAllByText("Tips")).toHaveLength(1);
    expect(group("5A-82").getByRole("button", { name: "Check Answer with AI" })).toBeDisabled();
  });
  it("uses a noun-pair table and checks an exercise together", () => {
    render(<Grade11Unit5Lesson kind="vocabulary" />);
    expect(group("5B-4").getByRole("columnheader", { name: "Noun as modifier" })).toBeVisible();
    expect(group("5B-13").getAllByRole("button", { name: "Check Answer" })).toHaveLength(1);
  });
  it("retains individual grammar controls and adds the existing text/oral explanation view", () => {
    render(<Grade11Unit5Lesson kind="grammar" />);
    expect(screen.getAllByRole("button", { name: "Text Explanation" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Oral Explanation" })).toHaveLength(3);
    expect(document.querySelectorAll("[data-grammar-question]")).toHaveLength(29);
  });
  it("checks all eleven listening responses against supplied audio evidence", () => {
    render(<Grade11TextLesson unit={5} kind="listening" />);
    for (const [id, key] of Object.entries(keys).filter(([id]) => id.startsWith("5D-"))) {
      const field = document.getElementById(`response-${id}`)!;
      fireEvent.change(field, { target: { value: key.answer } });
    }
    for (const id of ["5D-0", "5D-6"]) {
      fireEvent.click(group(id).getByRole("button", { name: "Check Answer" }));
    }
    expect(screen.getAllByText("✓ မှန်ပါတယ်။")).toHaveLength(11);
    expect(screen.getByLabelText("Unit 5 listening track")).toHaveAttribute(
      "src",
      "/grade11/audio/unit5.mp3",
    );
  });
  it("has a bilingual six-point planner and task-specific AI conversations", () => {
    render(<Grade11Unit5Lesson kind="speaking" />);
    expect(group("5D-14").getByRole("table", { name: "Trip planner" })).toBeVisible();
    expect(group("5D-14").getAllByRole("textbox")).toHaveLength(6);
    for (const id of ["5D-14", "5D-21"]) {
      fireEvent.click(group(id).getByRole("button", { name: "Practise with AI" }));
      expect(group(id).getByText(`AI task ${id}`)).toBeVisible();
    }
  });
  it("orders the original travelogue paragraphs and reviews the complete free-writing draft", async () => {
    render(<Grade11Unit5Lesson kind="writing" />);
    const order = group("5E-17");
    ["D", "A", "E", "C", "B"].forEach((value, i) =>
      fireEvent.change(order.getByRole("combobox", { name: `Paragraph position ${i + 1}` }), {
        target: { value },
      }),
    );
    fireEvent.click(order.getByRole("button", { name: "Check Answer" }));
    expect(order.getByText("1 / 1 correct")).toBeVisible();
    const field = document.getElementById("unit5-writing-free-response")!;
    fireEvent.change(field, {
      target: { value: "I visited Dawei. ".repeat(80) + "END OF MY TRAVELOGUE" },
    });
    const card = within(field.parentElement!);
    fireEvent.click(card.getByRole("button", { name: "Check Answer with AI" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string).studentAnswer).toContain(
      "END OF MY TRAVELOGUE",
    );
  });
});
