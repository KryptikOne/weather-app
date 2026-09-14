"use client";
import { CalendarDays } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { WeatherIcon } from "@/components/icons/WeatherIcon";
import { formatWeekday } from "@/lib/format/time";
import { formatTemp } from "@/lib/format/units";
import { tempColor } from "@/lib/theme/tempColor";
import type { DailyOptions } from "./definition";
import { dailyScale, markerPosition, rangeBar } from "./math";

export function DailyCard({ options, snapshot, location, units, status }: CardProps<DailyOptions>) {
  const days = snapshot?.daily.slice(0, Number(options.days));
  const scale = days && days.length ? dailyScale(days) : null;
  const tz = location.timezone;

  return (
    <CardFrame title="Daily Forecast" icon={CalendarDays} status={days ? status : "loading"}>
      {days && scale && snapshot && (
        <ul className="flex flex-col gap-3">
          {days.map((d, i) => {
            const bar = rangeBar(d, scale);
            const likely = options.showPrecipChance && d.precipChance >= 0.2;
            return (
              <li key={d.date} data-testid="daily-row" className="grid grid-cols-[3rem_2.75rem_3rem_1fr_3rem] items-center gap-2">
                <span className="text-base font-bold">{formatWeekday(d.date, tz)}</span>
                <div className="flex flex-col items-center leading-none">
                  <WeatherIcon condition={d.condition} size={28} />
                  {likely && (
                    <span data-testid="precip-chance" className="text-[10px] font-bold text-sky-300">
                      {Math.round(d.precipChance * 100)}%
                    </span>
                  )}
                </div>
                <span data-testid="daily-low" className="text-right text-base font-bold text-muted-foreground">{formatTemp(d.tempMin, units)}</span>
                <div className="relative h-1.5 rounded-full bg-secondary">
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: `${bar.left}%`,
                      width: `${bar.width}%`,
                      background: `linear-gradient(90deg, ${tempColor(d.tempMin)}, ${tempColor(d.tempMax)})`,
                    }}
                  />
                  {options.showTodayMarker && i === 0 && (
                    <span
                      data-testid="today-marker"
                      className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-card"
                      style={{ left: `${markerPosition(snapshot.current.temp, scale)}%` }}
                    />
                  )}
                </div>
                <span data-testid="daily-high" className="text-base font-black">{formatTemp(d.tempMax, units)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </CardFrame>
  );
}
