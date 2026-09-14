import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { AstroData } from "@/lib/astro";
import type { Units } from "@/lib/format/units";
import type { WeatherSnapshot } from "@/lib/weather/types";

export type Breakpoint = "phone" | "desktop";
export type Span = { cols: 4 | 6 | 8 | 12; rows: 1 | 2 };
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
  spans: Span[];          // first entry is the default desktop span
  needs: DataNeed[];
  isHidden?: (props: CardProps<O>) => boolean;
};

/** Registry entries with the option type erased. */
export type AnyCardDefinition = CardDefinition<Record<string, unknown>>;

/** Erases the option type so definitions with different option shapes can share one registry. */
export function defineCard<O extends Record<string, unknown>>(def: CardDefinition<O>): AnyCardDefinition {
  return def as unknown as AnyCardDefinition;
}
