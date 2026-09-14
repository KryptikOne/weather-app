"use client";
import { useState } from "react";
import { CATALOG } from "@/cards/registry";
import type { AnyCardDefinition, Breakpoint, CardInstance, Span } from "@/cards/types";
import { addCard, defaultLayoutFor, moveCard, removeCard, setCardSpan, updateCardOptions } from "@/lib/layout/edit";
import { useAppState } from "@/lib/store/StoreProvider";

type Draft = { breakpoint: Breakpoint; cards: CardInstance[] };

/** Draft/commit editing of the layout for one breakpoint. A breakpoint change abandons the draft. */
export function useLayoutEditor(breakpoint: Breakpoint) {
  const { state, dispatch } = useAppState();
  const [draft, setDraft] = useState<Draft | null>(null);
  const active = draft && draft.breakpoint === breakpoint ? draft : null;

  const update = (fn: (cards: CardInstance[]) => CardInstance[]) =>
    setDraft((d) => (d && d.breakpoint === breakpoint ? { ...d, cards: fn(d.cards) } : d));

  return {
    editing: active !== null,
    draft: active?.cards ?? null,
    start: () => setDraft({ breakpoint, cards: state.layouts[breakpoint] }),
    cancel: () => setDraft(null),
    done: () => {
      if (active) dispatch({ type: "replaceLayout", breakpoint, cards: active.cards });
      setDraft(null);
    },
    reset: () => setDraft({ breakpoint, cards: defaultLayoutFor(breakpoint, CATALOG) }),
    move: (activeId: string, overId: string) => update((c) => moveCard(c, activeId, overId)),
    remove: (id: string) => update((c) => removeCard(c, id)),
    add: (def: AnyCardDefinition) => update((c) => addCard(c, def, breakpoint)),
    setSpan: (id: string, span: Span) => update((c) => setCardSpan(c, id, span)),
    setOptions: (id: string, options: Record<string, unknown>) => update((c) => updateCardOptions(c, id, options)),
  };
}
