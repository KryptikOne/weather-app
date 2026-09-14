"use client";
import { ArrowDown, ArrowUp, Check, LocateFixed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/store/StoreProvider";
import { cn } from "@/lib/utils";

export function LocationsForm() {
  const { state, dispatch } = useAppState();
  const { saved, active } = state.locations;
  const rowClass = (on: boolean) => cn("flex items-center gap-1 rounded-xl px-2 py-1", on && "bg-secondary");

  return (
    <div className="flex flex-col gap-1">
      <div className={rowClass(active === "current")}>
        <LocateFixed className="size-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-bold">Current location</span>
        {active === "current" ? <Check className="size-4 text-weather-accent" /> : (
          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-bold" aria-label="Use current location" onClick={() => dispatch({ type: "setActiveLocation", active: "current" })}>Use</Button>
        )}
      </div>
      {saved.map((l, i) => (
        <div key={l.id} className={rowClass(active === l.id)}>
          <span className="flex-1 truncate text-sm font-bold">{l.name}</span>
          {active === l.id ? <Check className="size-4 text-weather-accent" /> : (
            <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-bold" aria-label={`Use ${l.name}`} onClick={() => dispatch({ type: "setActiveLocation", active: l.id })}>Use</Button>
          )}
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${l.name} up`} disabled={i === 0} onClick={() => dispatch({ type: "moveSavedLocation", id: l.id, direction: -1 })}><ArrowUp className="size-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${l.name} down`} disabled={i === saved.length - 1} onClick={() => dispatch({ type: "moveSavedLocation", id: l.id, direction: 1 })}><ArrowDown className="size-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" aria-label={`Remove ${l.name}`} onClick={() => dispatch({ type: "removeSavedLocation", id: l.id })}><X className="size-4" /></Button>
        </div>
      ))}
      {saved.length < 2 && (
        <p className="px-2 pt-1 text-xs text-muted-foreground">Add cities from the location switcher in the top bar.</p>
      )}
    </div>
  );
}
