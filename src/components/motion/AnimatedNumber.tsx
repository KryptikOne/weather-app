"use client";
import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";

type Props = {
  value: number;
  format: (v: number) => string;
  duration?: number;
  className?: string;
  testId?: string;
};

/** Renders a number that tweens to each new value. The text is driven by a motion value, so no React state updates per frame. */
export function AnimatedNumber({ value, format, duration = 0.6, className, testId }: Props) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));

  useEffect(() => {
    const controls = animate(mv, value, { duration: reduced ? 0 : duration, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, value, reduced, duration]);

  return <m.span className={className} data-testid={testId}>{text}</m.span>;
}
