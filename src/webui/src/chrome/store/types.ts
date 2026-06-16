import { StateCreator, StoreMutators } from "zustand";

export const STORE_VERSION = 1;

/**
 * A generic type helper for Zustand store slices that are compatible
 * with the DevTools middleware.
 */
export type DevtoolsSlice<
  T,
  Mutators extends [keyof StoreMutators<unknown, unknown>, unknown][] = [
    ["zustand/devtools", never],
  ],
> = StateCreator<T, Mutators, []>;
