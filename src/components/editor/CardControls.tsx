"use client";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, GripVertical, Settings2, X } from "lucide-react";
import type { HTMLAttributes } from "react";
import { clampSpan, MAX_COLS, MAX_ROWS, type AnyCardDefinition, type Breakpoint, type CardInstance, type Span } from "@/cards/types";
import { Button } from "@/components/ui/button";

type Props = {
  def: AnyCardDefinition;
  instance: CardInstance;
  breakpoint: Breakpoint;
  dragHandleProps: HTMLAttributes<HTMLButtonElement> & Record<string, unknown>;
  onRemove: () => void;
  onOptions: () => void;
  onSpan: (span: Span) => void;
};

function Step({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" variant="ghost" size="icon" className="size-7 rounded-full" aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

export function CardControls({ def, instance, breakpoint, dragHandleProps, onRemove, onOptions, onSpan }: Props) {
  const span = clampSpan(instance.span ?? def.defaultSpan, def.minCols);
  const resize = (dc: number, dr: number) => onSpan(clampSpan({ cols: span.cols + dc, rows: span.rows + dr }, def.minCols));

  return (
    <div className="mb-1 flex items-center gap-1 rounded-full bg-secondary/80 px-1 py-0.5 backdrop-blur">
      <button
        type="button"
        aria-label={`Drag ${def.title}`}
        className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...dragHandleProps}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 truncate text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{def.title}</span>
      {breakpoint === "desktop" && (
        <div className="flex items-center gap-0.5 rounded-full bg-background px-1">
          <Step label={`Narrower ${def.title}`} disabled={span.cols <= def.minCols} onClick={() => resize(-1, 0)}><ChevronLeft className="size-3.5" /></Step>
          <Step label={`Wider ${def.title}`} disabled={span.cols >= MAX_COLS} onClick={() => resize(1, 0)}><ChevronRight className="size-3.5" /></Step>
          <span data-testid="span-readout" className="min-w-10 text-center text-[11px] font-bold tabular-nums text-muted-foreground">
            {span.cols} × {span.rows}
          </span>
          <Step label={`Shorter ${def.title}`} disabled={span.rows <= 1} onClick={() => resize(0, -1)}><ChevronUp className="size-3.5" /></Step>
          <Step label={`Taller ${def.title}`} disabled={span.rows >= MAX_ROWS} onClick={() => resize(0, 1)}><ChevronDown className="size-3.5" /></Step>
        </div>
      )}
      {def.fields.length > 0 && (
        <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full" aria-label={`Options for ${def.title}`} onClick={onOptions}>
          <Settings2 className="size-4" />
        </Button>
      )}
      <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full text-destructive" aria-label={`Remove ${def.title}`} onClick={onRemove}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
