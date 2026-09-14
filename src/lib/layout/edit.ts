import type { AnyCardDefinition, Breakpoint, CardInstance, Span } from "@/cards/types";
import { DEFAULT_DESKTOP_LAYOUT, DEFAULT_PHONE_LAYOUT } from "@/config/defaults";
import { sanitizeLayout, type Catalog } from "@/lib/store/persist";

export function newCardId(type: string): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${type}-${rand}`;
}

export function defaultLayoutFor(breakpoint: Breakpoint, catalog: Catalog): CardInstance[] {
  return sanitizeLayout(breakpoint === "phone" ? DEFAULT_PHONE_LAYOUT : DEFAULT_DESKTOP_LAYOUT, catalog);
}

/** Moves the card with activeId into the slot of the card with overId (dnd-kit's arrayMove semantics). */
export function moveCard(cards: CardInstance[], activeId: string, overId: string): CardInstance[] {
  const from = cards.findIndex((c) => c.id === activeId);
  const to = cards.findIndex((c) => c.id === overId);
  if (from < 0 || to < 0 || from === to) return cards;
  const next = cards.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export const removeCard = (cards: CardInstance[], id: string): CardInstance[] => cards.filter((c) => c.id !== id);

export function addCard(cards: CardInstance[], def: AnyCardDefinition, breakpoint: Breakpoint): CardInstance[] {
  const instance: CardInstance = {
    id: newCardId(def.type),
    type: def.type,
    options: { ...def.defaultOptions },
    ...(breakpoint === "desktop" ? { span: def.defaultSpan } : {}),
  };
  return [...cards, instance];
}

export const updateCardOptions = (cards: CardInstance[], id: string, options: Record<string, unknown>): CardInstance[] =>
  cards.map((c) => (c.id === id ? { ...c, options } : c));

export const setCardSpan = (cards: CardInstance[], id: string, span: Span): CardInstance[] =>
  cards.map((c) => (c.id === id ? { ...c, span } : c));
