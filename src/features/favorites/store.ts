import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { MovieSummary } from "@/lib/omdb/types";

interface FavoritesState {
  items: MovieSummary[];
  toggle: (movie: MovieSummary) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (movie) => {
        const exists = get().items.some((item) => item.id === movie.id);
        set({
          items: exists
            ? get().items.filter((item) => item.id !== movie.id)
            : [movie, ...get().items],
        });
      },
      remove: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "moviebox:favorites",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Guards against SSR/CSR hydration mismatch for persisted state:
// false during SSR and first paint, true once mounted on the client.
const noop = () => () => {};
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) =>
    state.items.some((item) => item.id === id),
  );
}
