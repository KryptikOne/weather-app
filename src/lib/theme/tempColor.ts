import { scaleLinear } from "d3-scale";

const STOPS = [-10, 0, 10, 20, 30, 40];
const COLORS = ["#5b8def", "#7fd1f7", "#6fd08c", "#f2d64b", "#f59e3b", "#e5484d"];

const scale = scaleLinear<string>().domain(STOPS).range(COLORS).clamp(true);

/** Same color for the same temperature on every card. Input is Celsius. */
export const tempColor = (celsius: number): string => scale(celsius);
