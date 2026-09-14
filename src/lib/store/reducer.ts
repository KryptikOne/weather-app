import type { Breakpoint, CardInstance } from "@/cards/types";
import type { Units } from "@/lib/format/units";
import type { AppState, LastKnown, SavedLocation } from "./state";

export type Action =
  | { type: "hydrate"; state: AppState }
  | { type: "replaceLayout"; breakpoint: Breakpoint; cards: CardInstance[] }
  | { type: "setUnits"; units: Partial<Units> }
  | { type: "setActiveLocation"; active: "current" | string }
  | { type: "addSavedLocation"; location: SavedLocation }
  | { type: "removeSavedLocation"; id: string }
  | { type: "setLastKnown"; lastKnown: LastKnown };

export function reduce(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "replaceLayout":
      return { ...state, layouts: { ...state.layouts, [action.breakpoint]: action.cards } };
    case "setUnits":
      return { ...state, units: { ...state.units, ...action.units } };
    case "setActiveLocation":
      return { ...state, locations: { ...state.locations, active: action.active } };
    case "addSavedLocation": {
      if (state.locations.saved.some((l) => l.id === action.location.id)) return state;
      return { ...state, locations: { ...state.locations, saved: [...state.locations.saved, action.location] } };
    }
    case "removeSavedLocation": {
      const saved = state.locations.saved.filter((l) => l.id !== action.id);
      const active = state.locations.active === action.id ? "current" : state.locations.active;
      return { ...state, locations: { ...state.locations, saved, active } };
    }
    case "setLastKnown":
      return { ...state, locations: { ...state.locations, lastKnown: action.lastKnown } };
  }
}
