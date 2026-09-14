"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { OptionField } from "@/cards/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Props = { field: OptionField; value: unknown; onChange: (value: unknown) => void };

export function OptionFieldInput({ field, value, onChange }: Props) {
  const id = `opt-${field.key}`;
  switch (field.kind) {
    case "toggle":
      return (
        <div className="flex items-center justify-between py-2">
          <label htmlFor={id} className="text-sm font-bold">{field.label}</label>
          <Switch id={id} checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />
        </div>
      );
    case "select":
      return (
        <div className="flex items-center justify-between gap-4 py-2">
          <label htmlFor={id} className="text-sm font-bold">{field.label}</label>
          <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-full bg-secondary px-3 text-sm font-semibold">
            {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    case "number":
      return (
        <div className="py-2">
          <div className="flex items-center justify-between">
            <label htmlFor={id} className="text-sm font-bold">{field.label}</label>
            <span data-testid={`${id}-value`} className="text-sm font-semibold text-muted-foreground">{String(value)}</span>
          </div>
          <input
            id={id}
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-1 w-full accent-(--weather-accent)"
          />
        </div>
      );
    case "ordered-multi": {
      const selected = Array.isArray(value) ? (value as string[]) : field.default;
      const rest = field.options.filter((o) => !selected.includes(o.value));
      const min = field.min ?? 0;
      const labelOf = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
      const toggle = (v: string) => {
        if (selected.includes(v)) {
          if (selected.length > min) onChange(selected.filter((s) => s !== v));
        } else {
          onChange([...selected, v]);
        }
      };
      const move = (v: string, dir: -1 | 1) => {
        const i = selected.indexOf(v);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= selected.length) return;
        const next = selected.slice();
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
      };
      return (
        <fieldset className="py-2">
          <legend className="text-sm font-bold">{field.label}</legend>
          <ul className="mt-2 flex flex-col gap-1">
            {selected.map((v, i) => (
              <li key={v} data-testid="multi-selected" className="flex items-center gap-2 rounded-lg bg-secondary px-2 py-1">
                <input type="checkbox" checked onChange={() => toggle(v)} aria-label={labelOf(v)} />
                <span className="flex-1 text-sm font-semibold">{labelOf(v)}</span>
                <Button type="button" variant="ghost" size="icon" aria-label={`Move ${labelOf(v)} up`} disabled={i === 0} onClick={() => move(v, -1)}>
                  <ArrowUp className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Move ${labelOf(v)} down`} disabled={i === selected.length - 1} onClick={() => move(v, 1)}>
                  <ArrowDown className="size-4" />
                </Button>
              </li>
            ))}
            {rest.map((o) => (
              <li key={o.value} data-testid="multi-unselected" className="flex items-center gap-2 px-2 py-1">
                <input type="checkbox" checked={false} onChange={() => toggle(o.value)} aria-label={o.label} />
                <span className="flex-1 text-sm text-muted-foreground">{o.label}</span>
              </li>
            ))}
          </ul>
        </fieldset>
      );
    }
  }
}
