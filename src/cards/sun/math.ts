export const ARC = { cx: 160, cy: 160, r: 140 } as const;

/** 0 at sunrise, 1 at sunset, clamped. */
export function sunProgress(now: Date, sunrise: Date, sunset: Date): number {
  const span = sunset.getTime() - sunrise.getTime();
  if (span <= 0) return 0;
  const t = (now.getTime() - sunrise.getTime()) / span;
  return Math.min(1, Math.max(0, t));
}

/** Point on a half circle: t=0 left horizon, t=0.5 top, t=1 right horizon. */
export function arcPoint(t: number, cx: number, cy: number, r: number): { x: number; y: number } {
  return { x: cx - r * Math.cos(Math.PI * t), y: cy - r * Math.sin(Math.PI * t) };
}

export function arcPath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

export const arcLength = (r: number) => Math.PI * r;
