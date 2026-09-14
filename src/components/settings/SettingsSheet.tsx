"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LocationsForm } from "./LocationsForm";
import { UnitsForm } from "./UnitsForm";

export function SettingsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
        <section className="mt-2">
          <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">Units</h3>
          <UnitsForm />
        </section>
        <section className="mt-6">
          <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">Locations</h3>
          <LocationsForm />
        </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
