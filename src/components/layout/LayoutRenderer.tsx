"use client";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { REGISTRY } from "@/cards/registry";
import { clampSpan, type AnyCardDefinition, type Breakpoint, type CardInstance, type CardLocation, type CardProps, type CardStatus } from "@/cards/types";
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
  /** Decorates each rendered card (the editor uses it for drag handles and controls). */
  wrap?: (item: { instance: CardInstance; def: AnyCardDefinition }, node: ReactNode) => ReactNode;
  /** While editing, auto-hiding cards stay visible so they can be moved or removed. */
  editing?: boolean;
};

export function LayoutRenderer({ cards, breakpoint, data, registry = REGISTRY, wrap, editing = false }: Props) {
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 };
  // dnd-kit owns transforms while editing, so layout animation is off then; enter and exit stay on.
  const motionProps = (id: string) => ({
    layout: !editing && !reduced,
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
    transition,
    "data-testid": `card-motion-${id}`,
    className: "h-full",
  });

  const items: { instance: CardInstance; def: AnyCardDefinition; props: CardProps }[] = [];
  for (const instance of cards) {
    const def = registry[instance.type];
    if (!def || !def.breakpoints.includes(breakpoint)) continue;
    const span = breakpoint === "desktop" ? clampSpan(instance.span ?? def.defaultSpan, def.minCols) : undefined;
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
    if (!editing && def.isHidden?.(props)) continue;
    items.push({ instance, def, props });
  }

  const decorate = (instance: CardInstance, def: AnyCardDefinition, node: ReactNode) =>
    wrap ? wrap({ instance, def }, node) : node;

  if (breakpoint === "phone") {
    return (
      <PhoneStack>
        <AnimatePresence initial={false}>
          {items.map(({ instance, def, props }) => (
            <m.div key={instance.id} {...motionProps(instance.id)}>
              {decorate(instance, def, <def.component {...props} />)}
            </m.div>
          ))}
        </AnimatePresence>
      </PhoneStack>
    );
  }
  return (
    <DesktopGrid>
      <AnimatePresence initial={false}>
        {items.map(({ instance, def, props }) => (
          <DesktopCell key={instance.id} span={props.span ?? def.defaultSpan} testId={`cell-${instance.id}`}>
            <m.div {...motionProps(instance.id)}>
              {decorate(instance, def, <def.component {...props} />)}
            </m.div>
          </DesktopCell>
        ))}
      </AnimatePresence>
    </DesktopGrid>
  );
}
