"use client";
import { Sun } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { formatDuration, formatTime } from "@/lib/format/time";
import { useMinute } from "@/lib/hooks/useAstro";
import type { SunOptions } from "./definition";
import { ARC, arcPath, arcPoint, sunProgress } from "./math";

/** A value with its label, stacked, centered inside the arc. */
function Stat({ y, value, label, testId }: { y: number; value: string; label: string; testId?: string }) {
  return (
    <>
      <text data-testid={testId} x="160" y={y} textAnchor="middle" className="fill-foreground text-[15px] font-extrabold">
        {value}
      </text>
      <text x="160" y={y + 16} textAnchor="middle" className="fill-muted-foreground text-[12px] font-semibold">
        {label}
      </text>
    </>
  );
}

export function SunCard({ options, astro, location, units, status }: CardProps<SunOptions>) {
  const minute = useMinute();
  const sun = astro?.sun;
  const tz = location.timezone;
  const t = sun ? sunProgress(new Date(minute * 60000), sun.sunrise, sun.sunset) : 0;
  const marker = arcPoint(t, ARC.cx, ARC.cy, ARC.r);
  const reduced = useReducedMotion();
  const draw = reduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut" as const };
  const glide = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 60, damping: 16 };

  // Stack the enabled stats from the top of the arc down, 40px per pair.
  const stats = sun
    ? [
        options.showSolarNoon && { value: formatTime(sun.solarNoon, tz, units), label: "Solar Noon" },
        { value: formatDuration(sun.daylightMinutes), label: "Total Daylight", testId: "daylight" },
        options.showVisibleSun && { value: formatDuration(sun.sunUpMinutes), label: "Visible Sun", testId: "visible-sun" },
      ].filter((s): s is { value: string; label: string; testId?: string } => Boolean(s))
    : [];
  const firstY = 158 - (stats.length - 1) * 40;

  return (
    <CardFrame title="Sun" icon={Sun} status={sun ? status : "loading"}>
      {sun && (
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 320 176" className="w-full max-w-sm" role="img" aria-label="Sun position today">
            <path d={arcPath(ARC.cx, ARC.cy, ARC.r)} fill="none" stroke="#7a5a2f" strokeWidth="3" />
            <m.path
              d={arcPath(ARC.cx, ARC.cy, ARC.r)}
              fill="none"
              stroke="#e0a34a"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: t }}
              transition={draw}
            />
            <circle cx={ARC.cx - ARC.r} cy={ARC.cy} r="5" fill="#7a5a2f" />
            <m.g data-testid="sun-marker" initial={false} animate={{ x: marker.x, y: marker.y }} transition={glide}>
              <circle r="14" fill="#f2c14e" opacity="0.25" />
              <circle r="8" fill="#f2c14e" />
            </m.g>
            {stats.map((s, i) => (
              <Stat key={s.label} y={firstY + i * 40} value={s.value} label={s.label} testId={s.testId} />
            ))}
          </svg>
          <div className="mt-1 flex w-full items-end justify-between">
            <div>
              <div className="text-xl font-black">{formatTime(sun.sunrise, tz, units)}</div>
              <div className="text-sm font-semibold text-muted-foreground">Sunrise</div>
            </div>
            {options.showTwilight && (
              <div className="pb-1 text-center">
                <div className="text-sm font-bold text-muted-foreground">
                  {formatTime(sun.dawn, tz, units)} - {formatTime(sun.dusk, tz, units)}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">First to Last Light</div>
              </div>
            )}
            <div className="text-right">
              <div className="text-xl font-black">{formatTime(sun.sunset, tz, units)}</div>
              <div className="text-sm font-semibold text-muted-foreground">Sunset</div>
            </div>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
