"use client";
import { Sun } from "lucide-react";
import { useMemo } from "react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { WeatherIcon } from "@/components/icons/WeatherIcon";
import { formatTemp } from "@/lib/format/units";
import type { HeroOptions } from "./definition";
import { starField } from "./math";

export function HeroCard({ options, snapshot, location, units, status }: CardProps<HeroOptions>) {
  const current = snapshot?.current;
  const night = current?.condition.isNight ?? false;
  const stars = useMemo(() => starField(48, 7), []);

  return (
    <CardFrame title="Now" icon={Sun} status={current ? status : "loading"} hideHeader className="overflow-hidden p-0">
      {current && (
        <div
          data-testid="hero"
          data-night={night}
          className="relative flex h-full min-h-56 items-center gap-8 bg-linear-to-b from-sky-top to-sky-bottom px-10 py-8"
        >
          {night && (
            <svg data-testid="stars" aria-hidden="true" className="absolute inset-0 h-full w-full">
              {stars.map((s, i) => (
                <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
              ))}
            </svg>
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
          <WeatherIcon condition={current.condition} size={128} className="relative" />
          <div className="relative text-white">
            <div data-testid="hero-temp" className="text-7xl font-black leading-none drop-shadow-md">{formatTemp(current.temp, units)}</div>
            {options.showFeelsLike && <div className="mt-2 text-lg font-bold text-white/85">Feels {formatTemp(current.feelsLike, units)}</div>}
            {options.showConditionText && <div className="text-2xl font-extrabold">{current.condition.label}</div>}
            <div className="mt-1 text-sm font-semibold text-white/75">{location.name}</div>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
