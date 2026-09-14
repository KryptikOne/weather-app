"use client";
import { REGISTRY } from "@/cards/registry";
import type { AnyCardDefinition, Breakpoint, CardInstance, CardLocation, CardProps, CardStatus } from "@/cards/types";
import type { AstroData } from "@/lib/astro";
import type { Units } from "@/lib/format/units";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { DesktopCell, DesktopGrid } from "./DesktopGrid";
import { PhoneStack } from "./PhoneStack";
import { statusFor } from "./statusFor";

export type LayoutData = {
  snapshot?: WeatherSnapshot;
  weatherStatus: CardStatus;
  astro?: AstroData;
  location: CardLocation;
  units: Units;
};

type Props = {
  cards: CardInstance[];
  breakpoint: Breakpoint;
  data: LayoutData;
  registry?: Record<string, AnyCardDefinition>;
};

export function LayoutRenderer({ cards, breakpoint, data, registry = REGISTRY }: Props) {
  const items: { instance: CardInstance; def: AnyCardDefinition; props: CardProps }[] = [];
  for (const instance of cards) {
    const def = registry[instance.type];
    if (!def || !def.breakpoints.includes(breakpoint)) continue;
    const span = breakpoint === "desktop" ? instance.span ?? def.spans[0] : undefined;
    const props: CardProps = {
      instance,
      options: { ...def.defaultOptions, ...instance.options },
      snapshot: data.snapshot,
      astro: data.astro,
      location: data.location,
      units: data.units,
      status: statusFor(def.needs, { weatherStatus: data.weatherStatus, hasAstro: Boolean(data.astro) }),
      breakpoint,
      span,
    };
    if (def.isHidden?.(props)) continue;
    items.push({ instance, def, props });
  }

  if (breakpoint === "phone") {
    return (
      <PhoneStack>
        {items.map(({ instance, def, props }) => <def.component key={instance.id} {...props} />)}
      </PhoneStack>
    );
  }
  return (
    <DesktopGrid>
      {items.map(({ instance, def, props }) => (
        <DesktopCell key={instance.id} span={props.span ?? def.spans[0]} testId={`cell-${instance.id}`}>
          <def.component {...props} />
        </DesktopCell>
      ))}
    </DesktopGrid>
  );
}
