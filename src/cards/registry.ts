import type { Catalog } from "@/lib/store/persist";
import { currentCard } from "./current/definition";
import { sunCard } from "./sun/definition";
import type { AnyCardDefinition } from "./types";

export const REGISTRY: Record<string, AnyCardDefinition> = {
  [currentCard.type]: currentCard,
  [sunCard.type]: sunCard,
};

export const CATALOG: Catalog = Object.fromEntries(
  Object.entries(REGISTRY).map(([type, def]) => [type, { defaultOptions: def.defaultOptions }]),
);

export const cardDefinition = (type: string): AnyCardDefinition | undefined => REGISTRY[type];
