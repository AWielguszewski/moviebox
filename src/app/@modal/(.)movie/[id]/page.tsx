import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { MovieDetails } from "@/components/movie/MovieDetails";
import { MovieModal } from "@/components/movie/MovieModal";
import { getMovieById } from "@/lib/omdb/client";
import { detailToSummary } from "@/lib/omdb/types";

type Params = Promise<{ id: string }>;

export default async function InterceptedMoviePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const result = await getMovieById(id);

  if (!result.ok) {
    if (result.error.code === "NOT_FOUND") notFound();
    throw new Error(result.error.message);
  }

  const detail = result.data;

  return (
    <MovieModal title={`${detail.Title} (${detail.Year})`}>
      <MovieDetails
        detail={detail}
        actions={<FavoriteButton movie={detailToSummary(detail)} variant="labeled" />}
      />
    </MovieModal>
  );
}
