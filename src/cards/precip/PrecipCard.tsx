"use client";
import { CloudRain } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import type { PrecipOptions } from "./definition";
import { isDry, precipBars } from "./math";

const H = 56;
const BAR_W = 3;
const GAP = 1;

export function PrecipCard({ snapshot, status }: CardProps<PrecipOptions>) {
  const minutely = snapshot?.minutely;
  const width = minutely ? minutely.length * (BAR_W + GAP) : 0;
  const bars = minutely ? precipBars(minutely, H) : null;

  return (
    <CardFrame title="Next Hour" icon={CloudRain} status={minutely ? status : "loading"}>
      {minutely && bars && (
        minutely.length === 0 ? (
          <p className="text-sm text-muted-foreground">Minute-by-minute data isn&apos;t available for this location.</p>
        ) : isDry(minutely) ? (
          <p className="text-sm font-semibold text-muted-foreground">No precipitation expected in the next hour.</p>
        ) : (
          <div className="flex flex-col gap-1">
            <svg viewBox={`0 0 ${width} ${H}`} className="h-14 w-full" preserveAspectRatio="none" role="img" aria-label="Precipitation over the next hour">
              {bars.heights.map((h, i) => (
                <rect key={minutely[i].time} data-testid="minute-bar" x={i * (BAR_W + GAP)} y={H - h} width={BAR_W} height={h} fill="var(--weather-accent)" />
              ))}
            </svg>
            <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
              <span>Now</span><span>15 min</span><span>30 min</span><span>45 min</span><span>60 min</span>
            </div>
          </div>
        )
      )}
    </CardFrame>
  );
}
