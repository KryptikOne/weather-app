"use client";
import type { AnyCardDefinition, CardInstance } from "@/cards/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OptionFieldInput } from "./OptionFieldInput";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: CardInstance | null;
  def: AnyCardDefinition | null;
  onChange: (id: string, options: Record<string, unknown>) => void;
};

export function OptionsSheet({ open, onOpenChange, instance, def, onChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>{def ? `${def.title} options` : "Options"}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
        {instance && def && (
          def.fields.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">This card has no options.</p>
          ) : (
            <div className="mt-2 divide-y divide-border">
              {def.fields.map((field) => (
                <OptionFieldInput
                  key={field.key}
                  field={field}
                  value={instance.options[field.key] ?? field.default}
                  onChange={(v) => onChange(instance.id, { ...instance.options, [field.key]: v })}
                />
              ))}
            </div>
          )
        )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
