"use client";
import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/** Loads only the animation features we use. `strict` throws on any `motion.*` element so the bundle stays lazy. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
