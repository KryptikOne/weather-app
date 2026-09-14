import type { ReactNode } from "react";
import type { Span } from "@/cards/types";

export function DesktopGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-12 auto-rows-[minmax(14rem,auto)] gap-5">{children}</div>;
}

export function DesktopCell({ span, children, testId }: { span: Span; children: ReactNode; testId?: string }) {
  return (
    <div data-testid={testId} style={{ gridColumn: `span ${span.cols}`, gridRow: `span ${span.rows}` }} className="min-w-0">
      {children}
    </div>
  );
}
