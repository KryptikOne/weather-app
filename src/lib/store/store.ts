import { reduce, type Action } from "./reducer";
import type { AppState } from "./state";

export type Store = {
  getState(): AppState;
  dispatch(action: Action): void;
  subscribe(listener: () => void): () => void;
  /** True once the persisted state has been loaded on the client. */
  isHydrated(): boolean;
  markHydrated(): void;
};

export function createStore(initial: AppState): Store {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());
  return {
    getState: () => state,
    dispatch(action) {
      const next = reduce(state, action);
      if (next === state) return;
      state = next;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    isHydrated: () => hydrated,
    markHydrated() {
      if (hydrated) return;
      hydrated = true;
      notify();
    },
  };
}
