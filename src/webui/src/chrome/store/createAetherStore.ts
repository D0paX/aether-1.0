/*
All Aether Zustand stores are created via this wrapper to ensure consistent devtools integration.
Do not call zustand's create() directly in store files.
*/

import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Creates a Zustand store with optional DevTools middleware configured for development.
 *
 * @param initializer The store initializer function
 * @param name Unique name identifier for the Redux/DevTools panel
 */
export function createAetherStore<T>(
  initializer: StateCreator<T, [["zustand/devtools", never]], []>,
  name: string,
): UseBoundStore<StoreApi<T>> {
  const storeCreator = import.meta.env.DEV
    ? devtools(initializer, { name })
    : (initializer as unknown as StateCreator<T, [], []>);

  return create<T>()(storeCreator as StateCreator<T, [], []>);
}
