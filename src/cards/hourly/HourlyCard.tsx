"use client";
import { Clock } from "lucide-react";
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

export function HourlyCard({ options, snapshot, location, units, status, breakpoint }: CardProps<HourlyOptions>) {
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
              <svg width={width} height={STRIP_HEIGHT} viewBox={`0 0 ${width} ${STRIP_HEIGHT}`} className="block">
                {curve && <path d={curve.path} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />}
                {rects?.map((r, i) => (
                  <rect key={series[i].time} data-testid="strip-bar" x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill="var(--weather-accent)" />
                ))}
                {series.map((s, i) => {
                  const label = formatStripValue(active, s.value, units);
                  if (!label) return null;
                  const x = curve ? curve.points[i].x : rects![i].x + rects![i].w / 2;
                  const y = curve ? curve.points[i].y ?? STRIP_HEIGHT / 2 : Math.max(12, rects![i].y - 6);
                  return (
                    <text
                      key={s.time}
                      data-testid="strip-value"
                      x={x}
                      y={y}
                      dy={curve ? 4.5 : 0}
                      textAnchor="middle"
                      className="fill-foreground text-[13px] font-extrabold"
                      style={{ paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 6, strokeLinejoin: "round" }}
                    >
                      {label}
                    </text>
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
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors",
                    on ? "border-transparent bg-weather-accent text-weather-accent-foreground" : "border-weather-accent/50 text-weather-accent hover:bg-weather-accent/10",
                  )}
                >
                  {METRICS[k as MetricKey].label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
