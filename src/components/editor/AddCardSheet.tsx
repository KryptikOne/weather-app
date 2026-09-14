"use client";
import { REGISTRY } from "@/cards/registry";
import type { AnyCardDefinition, Breakpoint } from "@/cards/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakpoint: Breakpoint;
  onAdd: (def: AnyCardDefinition) => void;
};

export function AddCardSheet({ open, onOpenChange, breakpoint, onAdd }: Props) {
  const defs = Object.values(REGISTRY).filter((d) => d.breakpoints.includes(breakpoint));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Add a card</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {defs.map((def) => (
            <li key={def.type}>
              <button
                type="button"
                data-testid="add-card"
                onClick={() => { onAdd(def); onOpenChange(false); }}
                className="flex w-full items-center gap-2 rounded-xl bg-secondary px-3 py-3 text-left text-sm font-bold hover:bg-accent"
              >
                <def.icon aria-hidden="true" className="size-4 text-muted-foreground" />
                {def.title}
              </button>
            </li>
          ))}
        </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
