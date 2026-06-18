import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { MovieDetails } from "@/components/movie/MovieDetails";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { getMovieById } from "@/lib/omdb/client";
import type { MovieDetail } from "@/lib/omdb/schemas";
import { cleanField, detailToSummary } from "@/lib/omdb/types";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getMovieById(id);

  if (!result.ok) {
    return { title: "Title not found" };
  }

  const detail = result.data;
  const poster = cleanField(detail.Poster);
  const description =
    cleanField(detail.Plot) ?? `Details about ${detail.Title} (${detail.Year}).`;

  return {
    title: `${detail.Title} (${detail.Year})`,
    description,
    openGraph: {
      title: `${detail.Title} (${detail.Year})`,
      description,
      type: "video.movie",
      images: poster ? [{ url: poster }] : undefined,
    },
    twitter: {
      card: poster ? "summary_large_image" : "summary",
      title: `${detail.Title} (${detail.Year})`,
      description,
      images: poster ? [poster] : undefined,
    },
  };
}

function buildJsonLd(detail: MovieDetail) {
  const poster = cleanField(detail.Poster);
  const imdbRating = cleanField(detail.imdbRating ?? null);
  const votes = cleanField(detail.imdbVotes ?? null)?.replace(/,/g, "");

  return {
    "@context": "https://schema.org",
    "@type": detail.Type === "series" ? "TVSeries" : "Movie",
    name: detail.Title,
    image: poster ?? undefined,
    datePublished: cleanField(detail.Year),
    description: cleanField(detail.Plot) ?? undefined,
    genre: cleanField(detail.Genre ?? null)?.split(",").map((g) => g.trim()),
    director: cleanField(detail.Director ?? null),
    actor: cleanField(detail.Actors ?? null)?.split(",").map((a) => a.trim()),
    aggregateRating:
      imdbRating && votes
        ? {
            "@type": "AggregateRating",
            ratingValue: imdbRating,
            bestRating: "10",
            ratingCount: votes,
          }
        : undefined,
  };
}

export default async function MoviePage({ params }: { params: Params }) {
  const { id } = await params;
  const result = await getMovieById(id);

  if (!result.ok) {
    if (result.error.code === "NOT_FOUND") notFound();
    throw new Error(result.error.message);
  }

  const detail = result.data;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/search"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to search
      </Link>

      <MovieDetails
        detail={detail}
        actions={<FavoriteButton movie={detailToSummary(detail)} variant="labeled" />}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(detail)) }}
      />
    </main>
  );
}
