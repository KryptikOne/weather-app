"use client";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Breakpoint, CardInstance, Span } from "@/cards/types";
import { LayoutRenderer, type LayoutData } from "@/components/layout/LayoutRenderer";
import { SortableCard } from "./SortableCard";

type Props = {
  draft: CardInstance[];
  breakpoint: Breakpoint;
  data: LayoutData;
  onMove: (activeId: string, overId: string) => void;
  onRemove: (id: string) => void;
  onOptions: (id: string) => void;
  onSpan: (id: string, span: Span) => void;
};

export function EditableLayout({ draft, breakpoint, data, onMove, onRemove, onOptions, onSpan }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) onMove(String(active.id), String(over.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={draft.map((c) => c.id)} strategy={breakpoint === "phone" ? verticalListSortingStrategy : rectSortingStrategy}>
        <LayoutRenderer
          cards={draft}
          breakpoint={breakpoint}
          data={data}
          editing
          wrap={({ instance, def }, node) => (
            <SortableCard
              instance={instance}
              def={def}
              breakpoint={breakpoint}
              onRemove={() => onRemove(instance.id)}
              onOptions={() => onOptions(instance.id)}
              onSpan={(span) => onSpan(instance.id, span)}
            >
              {node}
            </SortableCard>
          )}
        />
      </SortableContext>
    </DndContext>
  );
}
