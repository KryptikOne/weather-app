"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Units } from "@/lib/format/units";
import { useAppState } from "@/lib/store/StoreProvider";

const GROUPS: { key: keyof Units; label: string; options: { value: string; label: string }[] }[] = [
  { key: "temp", label: "Temperature", options: [{ value: "F", label: "°F" }, { value: "C", label: "°C" }] },
  { key: "speed", label: "Wind", options: [{ value: "mph", label: "mph" }, { value: "kmh", label: "km/h" }, { value: "ms", label: "m/s" }] },
  { key: "pressure", label: "Pressure", options: [{ value: "inHg", label: "inHg" }, { value: "hPa", label: "hPa" }] },
  { key: "distance", label: "Distance", options: [{ value: "mi", label: "mi" }, { value: "km", label: "km" }] },
  { key: "time", label: "Time", options: [{ value: "12h", label: "12h" }, { value: "24h", label: "24h" }] },
];

export function UnitsForm() {
  const { state, dispatch } = useAppState();
  return (
    <div className="flex flex-col gap-3">
      {GROUPS.map((g) => (
        <div key={g.key} className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold">{g.label}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <ToggleGroup
            type="single"
            aria-label={g.label}
            value={state.units[g.key]}
            onValueChange={(v) => { if (v) dispatch({ type: "setUnits", units: { [g.key]: v } as Partial<Units> }); }}
            className="rounded-full bg-secondary p-0.5"
          >
            {g.options.map((o) => (
              <ToggleGroupItem key={o.value} value={o.value} aria-label={o.label} className="rounded-full px-3 text-xs font-bold data-[state=on]:bg-weather-accent data-[state=on]:text-weather-accent-foreground">
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
    </div>
  );
}
