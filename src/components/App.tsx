"use client";
import { useMemo, useState } from "react";
import { cardDefinition } from "@/cards/registry";
import { AddCardSheet } from "@/components/editor/AddCardSheet";
import { EditableLayout } from "@/components/editor/EditableLayout";
import { EditToolbar } from "@/components/editor/EditToolbar";
import { OptionsSheet } from "@/components/editor/OptionsSheet";
import { useLayoutEditor } from "@/components/editor/useLayoutEditor";
import { LayoutRenderer, type LayoutData } from "@/components/layout/LayoutRenderer";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
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
import { cn } from "@/lib/utils";

export function App() {
  const { state, dispatch, hydrated } = useAppState();
  const breakpoint = useBreakpoint();
  const { location, status: locationStatus, requestCurrent } = useLocation();
  const coords = useMemo(() => (location ? { lat: location.lat, lon: location.lon } : null), [location]);
  const { snapshot, status: weatherStatus, refetch } = useWeather(coords);
  const astro = useAstro(coords);
  const editor = useLayoutEditor(breakpoint);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [optionsFor, setOptionsFor] = useState<string | null>(null);

  const themePalette = useMemo(
    () => (snapshot && astro ? palette(dayPhase(new Date(), astro.sun), snapshot.current.condition.group) : null),
    [snapshot, astro],
  );
  useWeatherTheme(themePalette);

  const cardLocation = location ? { ...location, timezone: snapshot?.location.timezone ?? location.timezone } : null;
  const data: LayoutData | null = cardLocation ? { snapshot, weatherStatus, astro, location: cardLocation, units: state.units } : null;
  const optionsInstance = optionsFor ? editor.draft?.find((c) => c.id === optionsFor) ?? null : null;

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
        onEdit={editor.start}
        onSettings={() => setSettingsOpen(true)}
      />
      <main className={cn("mt-2", editor.editing && "pb-24")}>
        {hydrated && data ? (
          editor.editing && editor.draft ? (
            <EditableLayout
              draft={editor.draft}
              breakpoint={breakpoint}
              data={data}
              onMove={editor.move}
              onRemove={editor.remove}
              onOptions={setOptionsFor}
              onSpan={editor.setSpan}
            />
          ) : (
            <LayoutRenderer cards={state.layouts[breakpoint]} breakpoint={breakpoint} data={data} />
          )
        ) : locationStatus === "denied" ? (
          <EmptyState onChoose={() => setSwitcherOpen(true)} />
        ) : (
          <LoadingSkeleton />
        )}
      </main>
      {editor.editing && (
        <EditToolbar breakpoint={breakpoint} onAdd={() => setAddOpen(true)} onReset={editor.reset} onCancel={editor.cancel} onDone={editor.done} />
      )}
      <AddCardSheet open={addOpen} onOpenChange={setAddOpen} breakpoint={breakpoint} onAdd={editor.add} />
      <OptionsSheet
        open={optionsInstance !== null}
        onOpenChange={(open) => { if (!open) setOptionsFor(null); }}
        instance={optionsInstance}
        def={optionsInstance ? cardDefinition(optionsInstance.type) ?? null : null}
        onChange={editor.setOptions}
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
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
