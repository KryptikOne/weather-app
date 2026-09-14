import { scaleLinear } from "d3-scale";

const STOPS = [-10, 0, 10, 20, 30, 40];
const COLORS = ["#3b82f6", "#22d3ee", "#4ade80", "#facc15", "#fb923c", "#ef4444"];

const scale = scaleLinear<string>().domain(STOPS).range(COLORS).clamp(true);

/** Same color for the same temperature on every card. Input is Celsius. */
export const tempColor = (celsius: number): string => scale(celsius);
