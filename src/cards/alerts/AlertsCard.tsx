"use client";
import { TriangleAlert } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { formatShortDate, formatTime } from "@/lib/format/time";
import type { AlertsOptions } from "./definition";

export function AlertsCard({ snapshot, location, units, status }: CardProps<AlertsOptions>) {
  const alerts = snapshot?.alerts;
  const tz = location.timezone;
  const when = (iso: string) => `${formatShortDate(iso, tz)}, ${formatTime(iso, tz, units)}`;

  return (
    <CardFrame title="Alerts" icon={TriangleAlert} status={alerts ? status : "loading"}>
      {alerts && (
        alerts.length === 0 ? (
          <p className="text-sm font-semibold text-muted-foreground">No active alerts.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {alerts.map((a) => (
              <li key={`${a.event}-${a.start}`} data-testid="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                <details>
                  <summary className="cursor-pointer list-none">
                    <div className="text-base font-extrabold">{a.event}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{a.sender}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{when(a.start)} to {when(a.end)}</div>
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-sm">{a.description}</p>
                </details>
              </li>
            ))}
          </ul>
        )
      )}
    </CardFrame>
  );
}
