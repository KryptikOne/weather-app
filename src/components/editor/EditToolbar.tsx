"use client";
import { Plus, RotateCcw } from "lucide-react";
import type { Breakpoint } from "@/cards/types";
import { Button } from "@/components/ui/button";

type Props = { breakpoint: Breakpoint; onAdd: () => void; onReset: () => void; onCancel: () => void; onDone: () => void };

export function EditToolbar({ breakpoint, onAdd, onReset, onCancel, onDone }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <span className="hidden text-xs font-extrabold uppercase tracking-wider text-muted-foreground sm:block">
          Editing {breakpoint} layout
        </span>
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground sm:hidden">Editing</span>
        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="secondary" className="rounded-full font-bold" onClick={onAdd}><Plus className="size-4" /> Add card</Button>
          <Button type="button" variant="ghost" className="rounded-full font-bold" onClick={onReset}><RotateCcw className="size-4" /> Reset</Button>
          <Button type="button" variant="ghost" className="rounded-full font-bold" onClick={onCancel}>Cancel</Button>
          <Button type="button" className="rounded-full font-bold" onClick={onDone}>Done</Button>
        </div>
      </div>
    </div>
  );
}
