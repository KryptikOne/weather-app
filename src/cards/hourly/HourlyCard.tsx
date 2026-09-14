"use client";
import { Clock, Navigation } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { WeatherIcon } from "@/components/icons/WeatherIcon";
import { formatHourLabel } from "@/lib/format/time";
import { METRICS, type MetricKey } from "@/lib/metrics";
import { tempColor } from "@/lib/theme/tempColor";
import { cn } from "@/lib/utils";
import type { HourlyOptions } from "./definition";
import { barLayout, curveLayout, formatStripValue, hourlySeries, isBarMetric } from "./math";

const STRIP_HEIGHT = 96;

export function HourlyCard({ instance, options, snapshot, location, units, status, breakpoint }: CardProps<HourlyOptions>) {
  const metrics = options.metrics.filter((k) => METRICS[k as MetricKey]?.fromHourly);
  const [picked, setPicked] = useState(options.defaultMetric);
  const active = metrics.includes(picked) ? picked : metrics[0] ?? "temp";
  const count = Number(options.hours);
  const colW = breakpoint === "desktop" ? 64 : 56;
  const hourly = snapshot?.hourly;

  const series = hourly ? hourlySeries(hourly, active, count) : [];
  const values = series.map((s) => s.value);
  const width = Math.max(1, series.length) * colW;
  const bars = isBarMetric(active);
  const box = { width, height: STRIP_HEIGHT, top: 18, bottom: 14 };
  const curve = bars ? null : curveLayout(values, box);
  const rects = bars ? barLayout(values, box, active === "precipChance" ? 1 : undefined) : null;
  const isTemp = METRICS[active as MetricKey]?.unit === "temp";
  const defined = values.filter((v): v is number => v != null);
  const mean = defined.length ? defined.reduce((a, b) => a + b, 0) / defined.length : 0;
  const stroke = isTemp ? tempColor(mean) : "var(--weather-accent)";
  const showWind = active === "windSpeed" || active === "windGust";

  const reduced = useReducedMotion();
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 32 };
  const ease = reduced ? { duration: 0 } : { duration: 0.45, ease: "easeInOut" as const };

  return (
    <CardFrame title="Hourly Forecast" icon={Clock} status={hourly ? status : "loading"}>
      {hourly && (
        <div className="flex flex-col gap-3">
          <div className="-mx-2 overflow-x-auto px-2">
            <div style={{ width }}>
              <div className="flex">
                {series.map((s) => (
                  <div key={s.time} data-testid="hour-label" style={{ width: colW }} className="text-center text-xs font-bold text-muted-foreground">
                    {formatHourLabel(s.time, location.timezone, units)}
                  </div>
                ))}
              </div>
              <div className="mt-1 flex">
                {series.map((s) => (
                  <div key={s.time} style={{ width: colW }} className="flex justify-center">
                    <WeatherIcon condition={s.condition} size={32} />
                  </div>
                ))}
              </div>
              {showWind && (
                <div className="mt-1 flex">
                  {series.map((s) => (
                    <div key={s.time} style={{ width: colW }} className="flex justify-center">
                      {/* windDeg is where the wind comes from; the arrow points where it blows, as on the details card. */}
                      <Navigation data-testid="wind-arrow" aria-hidden="true" className="size-3.5 text-muted-foreground" style={{ transform: `rotate(${(s.windDeg + 180) % 360}deg)` }} />
                    </div>
                  ))}
                </div>
              )}
              <svg width={width} height={STRIP_HEIGHT} viewBox={`0 0 ${width} ${STRIP_HEIGHT}`} className="block">
                {curve && <m.path initial={false} animate={{ d: curve.path }} transition={ease} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />}
                {rects?.map((r, i) => (
                  <m.rect key={series[i].time} data-testid="strip-bar" initial={false} animate={{ attrY: r.y, height: r.h }} transition={ease} x={r.x} width={r.w} rx="3" fill="var(--weather-accent)" />
                ))}
                {series.map((s, i) => {
                  const label = formatStripValue(active, s.value, units);
                  if (!label) return null;
                  const x = curve ? curve.points[i].x : rects![i].x + rects![i].w / 2;
                  const y = curve ? curve.points[i].y ?? STRIP_HEIGHT / 2 : Math.max(12, rects![i].y - 6);
                  return (
                    <m.text
                      key={s.time}
                      data-testid="strip-value"
                      initial={false}
                      animate={{ attrX: x, attrY: y }}
                      transition={ease}
                      dy={curve ? 4.5 : 0}
                      textAnchor="middle"
                      className="fill-foreground text-[16px] font-black"
                      style={{ paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 7, strokeLinejoin: "round" }}
                    >
                      {label}
                    </m.text>
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
            {metrics.map((k) => {
              const on = k === active;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(k)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors",
                    on ? "border-transparent text-weather-accent-foreground" : "border-weather-accent/50 text-weather-accent hover:bg-weather-accent/10",
                  )}
                >
                  {on && <m.span layoutId={`chip-${instance.id}`} data-testid="chip-pill" transition={spring} className="absolute inset-0 rounded-full bg-weather-accent" />}
                  <span className="relative">{METRICS[k as MetricKey].label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
