"use client";
import { Moon } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { formatShortDate, formatTime } from "@/lib/format/time";
import type { Units } from "@/lib/format/units";
import type { MoonOptions } from "./definition";
import { moonLitPath, PRINCIPAL_PHASE_VALUE } from "./math";

const DARK = "#1f2a44";
const LIT = "#eef3fa";
const RIM = "#94a3b8";

function MoonDisc({ phase, r, testId }: { phase: number; r: number; testId?: string }) {
  return (
    <svg data-testid={testId} width={r * 2 + 4} height={r * 2 + 4} viewBox={`${-r - 2} ${-r - 2} ${r * 2 + 4} ${r * 2 + 4}`} aria-hidden="true">
      <circle r={r} fill={DARK} />
      <path d={moonLitPath(phase, r)} fill={LIT} />
      <circle r={r} fill="none" stroke={RIM} strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

const riseSet = (d: Date | null, tz: string, units: Units) => (d ? formatTime(d, tz, units) : "--");

export function MoonCard({ options, astro, location, units, status }: CardProps<MoonOptions>) {
  const moon = astro?.moon;
  const tz = location.timezone;

  return (
    <CardFrame title="Moon" icon={Moon} status={moon ? status : "loading"}>
      {moon && (
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col items-center text-center">
            <MoonDisc phase={moon.phase} r={44} testId="moon-disc" />
            <div className="mt-3 text-xl font-black leading-tight">{moon.phaseName}</div>
            <div className="text-sm font-semibold text-muted-foreground">Illumination {Math.round(moon.illumination * 100)}%</div>
            {options.showRiseSet && (
              <div className="mt-3 text-sm font-semibold text-muted-foreground">
                <div>Moonrise {riseSet(moon.rise, tz, units)}</div>
                <div>Moonset {riseSet(moon.set, tz, units)}</div>
              </div>
            )}
          </div>
          {options.upcomingPhases > 0 && (
            <ul className="flex flex-col gap-3">
              {moon.next.slice(0, options.upcomingPhases).map((n) => (
                <li key={n.name} data-testid="upcoming-phase" className="flex items-center gap-3">
                  <MoonDisc phase={PRINCIPAL_PHASE_VALUE[n.name]} r={10} />
                  <div>
                    <div className="text-sm font-extrabold leading-tight">{n.name}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{formatShortDate(n.date, tz)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </CardFrame>
  );
}
