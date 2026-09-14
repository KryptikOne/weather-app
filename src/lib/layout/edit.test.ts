import { describe, expect, it } from "vitest";
import { REGISTRY } from "@/cards/registry";
import type { CardInstance } from "@/cards/types";
import { addCard, defaultLayoutFor, moveCard, newCardId, removeCard, setCardSpan, updateCardOptions } from "./edit";

const cards: CardInstance[] = [
  { id: "a", type: "current", options: { showIcon: true } },
  { id: "b", type: "sun", options: {} },
  { id: "c", type: "moon", options: {} },
];

describe("draft operations", () => {
  it("moves a card to another card's position without mutating the input", () => {
    const out = moveCard(cards, "a", "c");
    expect(out.map((c) => c.id)).toEqual(["b", "c", "a"]);
    expect(moveCard(cards, "c", "a").map((c) => c.id)).toEqual(["c", "a", "b"]);
    expect(cards.map((c) => c.id)).toEqual(["a", "b", "c"]);
    expect(moveCard(cards, "a", "zzz")).toEqual(cards);
  });

  it("removes by id", () => {
    expect(removeCard(cards, "b").map((c) => c.id)).toEqual(["a", "c"]);
  });

  it("adds a card with default options, a fresh id, and a default span on desktop", () => {
    const out = addCard(cards, REGISTRY.hourly, "desktop");
    const added = out[out.length - 1];
    expect(added.type).toBe("hourly");
    expect(added.id).toMatch(/^hourly-/);
    expect(added.options).toEqual(REGISTRY.hourly.defaultOptions);
    expect(added.span).toEqual(REGISTRY.hourly.defaultSpan);
    expect(addCard(cards, REGISTRY.hourly, "phone").at(-1)?.span).toBeUndefined();
  });

  it("updates options and span for one card only", () => {
    const withOpts = updateCardOptions(cards, "a", { showIcon: false });
    expect(withOpts[0].options).toEqual({ showIcon: false });
    expect(withOpts[1]).toBe(cards[1]);
    const withSpan = setCardSpan(cards, "b", { cols: 6, rows: 1 });
    expect(withSpan[1].span).toEqual({ cols: 6, rows: 1 });
    expect(withSpan[0]).toBe(cards[0]);
  });

  it("builds default layouts through the catalog and makes unique ids", () => {
    expect(defaultLayoutFor("phone", { current: { defaultOptions: {} } }).map((c) => c.type)).toEqual(["current"]);
    expect(defaultLayoutFor("desktop", { hero: { defaultOptions: {} } })[0].span).toEqual({ cols: 12, rows: 1 });
    expect(newCardId("sun")).not.toBe(newCardId("sun"));
  });
});
