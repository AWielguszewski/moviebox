import type { Metadata } from "next";

import { FavoritesView } from "@/features/favorites/FavoritesView";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved movies and series.",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Favorites</h1>
      <FavoritesView />
    </main>
  );
}
