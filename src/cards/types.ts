import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { AstroData } from "@/lib/astro";
import type { Units } from "@/lib/format/units";
import type { WeatherSnapshot } from "@/lib/weather/types";

export type Breakpoint = "phone" | "desktop";
export type Span = { cols: number; rows: number };
export const MAX_COLS = 12;
export const MAX_ROWS = 3;

/** Keeps a span inside the grid and above the card's minimum width. */
export function clampSpan(span: Span, minCols: number): Span {
  return {
    cols: Math.min(MAX_COLS, Math.max(minCols, Math.round(span.cols))),
    rows: Math.min(MAX_ROWS, Math.max(1, Math.round(span.rows))),
  };
}
export type CardStatus = "loading" | "ready" | "stale" | "error";
export type DataNeed = "weather" | "astro" | "air";

export type OptionField =
  | { kind: "toggle"; key: string; label: string; default: boolean }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[]; default: string }
  | { kind: "ordered-multi"; key: string; label: string; options: { value: string; label: string }[]; default: string[]; min?: number }
  | { kind: "number"; key: string; label: string; min: number; max: number; step: number; default: number };

export type CardInstance = {
  id: string;
  type: string;
  options: Record<string, unknown>;
  span?: Span;
};

export type CardLocation = { name: string; lat: number; lon: number; timezone: string };

export type CardProps<O extends Record<string, unknown> = Record<string, unknown>> = {
  instance: CardInstance;
  options: O;
  snapshot?: WeatherSnapshot;
  astro?: AstroData;
  location: CardLocation;
  units: Units;
  status: CardStatus;
  breakpoint: Breakpoint;
  span?: Span;
};

export type CardDefinition<O extends Record<string, unknown> = Record<string, unknown>> = {
  type: string;
  title: string;
  icon: LucideIcon;
  component: ComponentType<CardProps<O>>;
  defaultOptions: O;
  fields: OptionField[];
  breakpoints: Breakpoint[];
  defaultSpan: Span;      // desktop size when added or when the instance has none
  minCols: number;        // narrowest width the card stays readable at (1..12)
  needs: DataNeed[];
  isHidden?: (props: CardProps<O>) => boolean;
};

/** Registry entries with the option type erased. */
export type AnyCardDefinition = CardDefinition<Record<string, unknown>>;

/** Erases the option type so definitions with different option shapes can share one registry. */
export function defineCard<O extends Record<string, unknown>>(def: CardDefinition<O>): AnyCardDefinition {
  return def as unknown as AnyCardDefinition;
}
