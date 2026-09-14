import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { CardStatus } from "@/cards/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  icon: LucideIcon;
  status: CardStatus;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function CardFrame({ title, icon: Icon, status, actions, className, children }: Props) {
  return (
    <section className={cn("flex h-full flex-col rounded-xl bg-card p-5 text-card-foreground", className)}>
      <header className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        <h2 className="text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">{title}</h2>
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="flex-1">
        {status === "loading" && <Skeleton data-testid="card-skeleton" className="h-32 w-full rounded-lg" />}
        {status === "error" && <p className="text-sm text-muted-foreground">Couldn&apos;t load this card. It will retry.</p>}
        {(status === "ready" || status === "stale") && children}
      </div>
      {status === "stale" && (
        <p className="mt-3 w-fit rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Last update failed, showing older data
        </p>
      )}
    </section>
  );
}
