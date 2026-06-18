import type { MovieType } from "@/lib/omdb/schemas";

export interface SearchQueryKeyArgs {
  q: string;
  year?: string;
  type?: MovieType;
}

export function searchQueryKey({ q, year, type }: SearchQueryKeyArgs) {
  return ["search", q.trim(), year ?? "", type ?? ""] as const;
}
