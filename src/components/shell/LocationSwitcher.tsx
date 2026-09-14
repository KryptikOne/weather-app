"use client";
import { Check, LocateFixed, Search, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { GeocodeResult } from "@/lib/api/geocode";
import { useAppState } from "@/lib/store/StoreProvider";
import { cn } from "@/lib/utils";

const labelOf = (r: { name: string; region?: string; country: string }) =>
  [r.name, r.region ?? r.country].join(", ");

export function LocationSwitcher({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { state, dispatch } = useAppState();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saved, active } = state.locations;

  const choose = (id: "current" | string) => {
    dispatch({ type: "setActiveLocation", active: id });
    onOpenChange(false);
  };

  const add = (r: GeocodeResult) => {
    const id = `${r.lat.toFixed(3)},${r.lon.toFixed(3)}`;
    dispatch({ type: "addSavedLocation", location: { id, name: r.name, region: r.region, country: r.country, lat: r.lat, lon: r.lon } });
    setQuery("");
    setResults([]);
    choose(id);
  };

  const search = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error("search failed");
      setResults((await res.json()) as GeocodeResult[]);
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Locations</SheetTitle>
        </SheetHeader>
        <ul className="mt-2 flex flex-col gap-1">
          <li>
            <Row active={active === "current"} onClick={() => choose("current")} icon={<LocateFixed className="size-4" />}>
              Current location
            </Row>
          </li>
          {saved.map((l) => (
            <li key={l.id} className="flex items-center gap-1">
              <Row active={active === l.id} onClick={() => choose(l.id)}>{l.name}</Row>
              <Button variant="ghost" size="icon" aria-label={`Remove ${l.name}`} onClick={() => dispatch({ type: "removeSavedLocation", id: l.id })}>
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={search} className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city"
            className="h-10 flex-1 rounded-full bg-secondary px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" size="icon" aria-label="Search" disabled={searching} className="rounded-full">
            <Search className="size-4" />
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {results.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {results.map((r) => (
              <li key={`${r.lat},${r.lon}`}>
                <Row onClick={() => add(r)}>{labelOf(r)}</Row>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ active, onClick, icon, children }: { active?: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-bold hover:bg-secondary", active && "bg-secondary")}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {active && <Check className="size-4 text-weather-accent" />}
    </button>
  );
}
