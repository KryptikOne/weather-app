"use client";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_STATE } from "@/config/defaults";
import { loadState, readStorage, STORAGE_KEY, writeStorage, type Catalog } from "./persist";
import type { Action } from "./reducer";
import type { AppState } from "./state";
import { createStore, type Store } from "./store";

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const [store] = useState(() => createStore(DEFAULT_STATE));

  useEffect(() => {
    store.dispatch({ type: "hydrate", state: loadState(readStorage(), DEFAULT_STATE, catalog) });
    store.markHydrated();
    const unsubscribe = store.subscribe(() => writeStorage(store.getState()));
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) store.dispatch({ type: "hydrate", state: loadState(e.newValue, DEFAULT_STATE, catalog) });
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [store, catalog]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

const serverFalse = () => false;

export function useAppState(): { state: AppState; dispatch: (a: Action) => void; hydrated: boolean } {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useAppState must be used inside StoreProvider");
  const state = useSyncExternalStore(store.subscribe, store.getState, () => DEFAULT_STATE);
  const hydrated = useSyncExternalStore(store.subscribe, store.isHydrated, serverFalse);
  return { state, dispatch: store.dispatch, hydrated };
}
