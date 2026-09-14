"use client";
import { LayoutGrid, Navigation } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import { currentChips } from "@/cards/current/math";
import type { CardProps } from "@/cards/types";
import { compassLabel } from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { DetailsOptions } from "./definition";

export function DetailsCard({ options, snapshot, units, status, breakpoint }: CardProps<DetailsOptions>) {
  const current = snapshot?.current;
  const cols = breakpoint === "desktop" ? 4 : 2;

  return (
    <CardFrame title="Details" icon={LayoutGrid} status={current ? status : "loading"}>
      {current && (
        <ul data-testid="detail-grid" data-cols={cols} className={cn("grid gap-2", cols === 4 ? "grid-cols-4" : "grid-cols-2")}>
          {currentChips(current, options.metrics, units).map((chip) => (
            <li key={chip.key} data-testid="detail-chip" className="rounded-lg bg-secondary px-3 py-2">
              <div data-label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{chip.label}</div>
              <div className="flex items-center gap-1.5 text-base font-extrabold">
                {chip.value}
                {chip.key === "windSpeed" && (
                  <>
                    {/* wind_deg is where the wind comes from; the arrow points where it blows. */}
                    <Navigation
                      data-testid="wind-arrow"
                      aria-hidden="true"
                      className="size-3.5 text-muted-foreground"
                      style={{ transform: `rotate(${(current.windDeg + 180) % 360}deg)` }}
                    />
                    <span data-testid="wind-compass" className="text-xs font-bold text-muted-foreground">{compassLabel(current.windDeg)}</span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}
