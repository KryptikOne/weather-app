export type Star = { x: number; y: number; r: number; o: number; dur: number; delay: number };

/** Deterministic pseudo-random stars (linear congruential generator) so the sky doesn't reshuffle on every render. */
export function starField(count: number, seed: number): Star[] {
  let state = (seed * 2654435761) >>> 0 || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: next() * 100, y: next() * 100, r: 0.6 + next() * 1.2, o: 0.35 + next() * 0.65,
      dur: 2.5 + next() * 2.5, delay: next() * 4,
    });
  }
  return stars;
}
