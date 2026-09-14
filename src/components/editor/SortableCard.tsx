"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import type { AnyCardDefinition, Breakpoint, CardInstance, Span } from "@/cards/types";
import { cn } from "@/lib/utils";
import { CardControls } from "./CardControls";

type Props = {
  instance: CardInstance;
  def: AnyCardDefinition;
  breakpoint: Breakpoint;
  onRemove: () => void;
  onOptions: () => void;
  onSpan: (span: Span) => void;
  children: ReactNode;
};

export function SortableCard({ instance, def, breakpoint, onRemove, onOptions, onSpan, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: instance.id });
  return (
    <div
      ref={setNodeRef}
      data-testid={`sortable-${instance.id}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative h-full", isDragging && "z-30 opacity-80")}
    >
      <CardControls
        def={def}
        instance={instance}
        breakpoint={breakpoint}
        dragHandleProps={{ ...attributes, ...listeners }}
        onRemove={onRemove}
        onOptions={onOptions}
        onSpan={onSpan}
      />
      <div className="pointer-events-none">{children}</div>
    </div>
  );
}
