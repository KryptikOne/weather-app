"use client";
import { ChevronDown, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationStatus } from "@/lib/hooks/useLocation";
import { AppMenu } from "./AppMenu";

type Props = {
  locationName: string | null;
  status: LocationStatus;
  onOpenSwitcher: () => void;
  onUseCurrent: () => void;
  onRefresh: () => void;
};

export function TopBar({ locationName, status, onOpenSwitcher, onUseCurrent, onRefresh }: Props) {
  const label = locationName ?? (status === "denied" ? "Choose a location" : "Finding you");
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-background/80 px-2 backdrop-blur">
      <Button variant="ghost" size="icon" aria-label="Use current location" className="rounded-full" onClick={onUseCurrent}>
        <LocateFixed className="size-5" />
      </Button>
      <Button variant="ghost" className="rounded-full text-base font-extrabold" onClick={onOpenSwitcher}>
        {label}
        <ChevronDown className="size-4 opacity-60" />
      </Button>
      <AppMenu onRefresh={onRefresh} />
    </header>
  );
}
