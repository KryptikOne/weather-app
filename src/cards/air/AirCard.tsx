"use client";
import { Wind } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import type { AirQuality } from "@/lib/weather/types";
import type { AirOptions } from "./definition";
import { aqiBand, COMPONENT_LABELS } from "./math";

const ORDER: (keyof AirQuality["components"])[] = ["pm2_5", "pm10", "o3", "no2", "so2", "co", "nh3", "no"];

export function AirCard({ options, snapshot, status }: CardProps<AirOptions>) {
  const air = snapshot ? snapshot.air : undefined;   // undefined = no snapshot yet, null = snapshot without air data

  return (
    <CardFrame title="Air Quality" icon={Wind} status={snapshot ? status : "loading"}>
      {snapshot && (
        air === null ? (
          <p className="text-sm text-muted-foreground">Air quality isn&apos;t available for this location.</p>
        ) : air ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="size-4 rounded-full" style={{ background: aqiBand(air.aqi).color }} />
              <div>
                <div data-testid="aqi-label" className="text-2xl font-black leading-tight">{aqiBand(air.aqi).label}</div>
                <div className="text-xs font-semibold text-muted-foreground">Index {air.aqi} of 5</div>
              </div>
            </div>
            {options.showComponents && (
              <ul className="grid grid-cols-4 gap-2">
                {ORDER.map((k) => (
                  <li key={k} data-testid="aqi-component" className="rounded-lg bg-secondary px-2 py-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{COMPONENT_LABELS[k]}</div>
                    <div className="text-sm font-extrabold">{air.components[k].toFixed(1)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null
      )}
    </CardFrame>
  );
}
