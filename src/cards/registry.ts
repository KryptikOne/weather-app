import type { Catalog } from "@/lib/store/persist";
import { airCard } from "./air/definition";
import { alertsCard } from "./alerts/definition";
import { currentCard } from "./current/definition";
import { dailyCard } from "./daily/definition";
import { detailsCard } from "./details/definition";
import { heroCard } from "./hero/definition";
import { hourlyCard } from "./hourly/definition";
import { moonCard } from "./moon/definition";
import { precipCard } from "./precip/definition";
import { sunCard } from "./sun/definition";
import type { AnyCardDefinition } from "./types";

const ALL: AnyCardDefinition[] = [
  heroCard, currentCard, hourlyCard, dailyCard, precipCard,
  sunCard, moonCard, detailsCard, alertsCard, airCard,
];

export const REGISTRY: Record<string, AnyCardDefinition> = Object.fromEntries(ALL.map((d) => [d.type, d]));

export const CATALOG: Catalog = Object.fromEntries(
  Object.entries(REGISTRY).map(([type, def]) => [type, { defaultOptions: def.defaultOptions }]),
);

export const cardDefinition = (type: string): AnyCardDefinition | undefined => REGISTRY[type];
