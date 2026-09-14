"use client";
import { useMemo, useState } from "react";
import { LayoutRenderer } from "@/components/layout/LayoutRenderer";
import { LocationSwitcher } from "@/components/shell/LocationSwitcher";
import { TopBar } from "@/components/shell/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAstro } from "@/lib/hooks/useAstro";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { useLocation } from "@/lib/hooks/useLocation";
import { useWeather } from "@/lib/hooks/useWeather";
import { useAppState } from "@/lib/store/StoreProvider";
import { dayPhase, palette } from "@/lib/theme/palette";
import { useWeatherTheme } from "@/lib/theme/useWeatherTheme";

export function App() {
  const { state, dispatch, hydrated } = useAppState();
  const breakpoint = useBreakpoint();
  const { location, status: locationStatus, requestCurrent } = useLocation();
  const coords = useMemo(() => (location ? { lat: location.lat, lon: location.lon } : null), [location]);
  const { snapshot, status: weatherStatus, refetch } = useWeather(coords);
  const astro = useAstro(coords);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const themePalette = useMemo(
    () => (snapshot && astro ? palette(dayPhase(new Date(), astro.sun), snapshot.current.condition.group) : null),
    [snapshot, astro],
  );
  useWeatherTheme(themePalette);

  const cardLocation = location
    ? { ...location, timezone: snapshot?.location.timezone ?? location.timezone }
    : null;

  const useCurrent = () => {
    dispatch({ type: "setActiveLocation", active: "current" });
    requestCurrent();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-3 pb-8 sm:px-5">
      <TopBar
        locationName={location?.name ?? null}
        status={locationStatus}
        onOpenSwitcher={() => setSwitcherOpen(true)}
        onUseCurrent={useCurrent}
        onRefresh={refetch}
      />
      <main className="mt-2">
        {hydrated && cardLocation ? (
          <LayoutRenderer
            cards={state.layouts[breakpoint]}
            breakpoint={breakpoint}
            data={{ snapshot, weatherStatus, astro, location: cardLocation, units: state.units }}
          />
        ) : locationStatus === "denied" ? (
          <EmptyState onChoose={() => setSwitcherOpen(true)} />
        ) : (
          <LoadingSkeleton />
        )}
      </main>
      <LocationSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
    </div>
  );
}

function EmptyState({ onChoose }: { onChoose: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-4 text-center">
      <p className="text-lg font-extrabold">Location access is off.</p>
      <p className="max-w-xs text-sm text-muted-foreground">Pick a city to get started. You can add more later.</p>
      <Button onClick={onChoose} className="rounded-full font-bold">Choose a location</Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}
