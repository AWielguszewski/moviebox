import { z } from "zod";

export const MOVIE_TYPES = ["movie", "series", "episode"] as const;
export const movieTypeSchema = z.enum(MOVIE_TYPES);
export type MovieType = z.infer<typeof movieTypeSchema>;

export const searchItemSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  Poster: z.string(),
});
export type SearchItem = z.infer<typeof searchItemSchema>;

export const searchSuccessSchema = z.object({
  Response: z.literal("True"),
  Search: z.array(searchItemSchema),
  totalResults: z.string(),
});

export const errorResponseSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});

export const searchResponseSchema = z.union([
  searchSuccessSchema,
  errorResponseSchema,
]);
export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const ratingSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

// Loose schema: OMDb returns extra type-dependent fields and "N/A" placeholders.
export const movieDetailSchema = z
  .object({
    Response: z.literal("True"),
    Title: z.string(),
    Year: z.string(),
    Rated: z.string().optional(),
    Released: z.string().optional(),
    Runtime: z.string().optional(),
    Genre: z.string().optional(),
    Director: z.string().optional(),
    Writer: z.string().optional(),
    Actors: z.string().optional(),
    Plot: z.string().optional(),
    Language: z.string().optional(),
    Country: z.string().optional(),
    Awards: z.string().optional(),
    Poster: z.string().optional(),
    Ratings: z.array(ratingSchema).optional(),
    Metascore: z.string().optional(),
    imdbRating: z.string().optional(),
    imdbVotes: z.string().optional(),
    imdbID: z.string(),
    Type: z.string(),
    totalSeasons: z.string().optional(),
  })
  .loose();
export type MovieDetail = z.infer<typeof movieDetailSchema>;

export const detailResponseSchema = z.union([
  movieDetailSchema,
  errorResponseSchema,
]);
export type DetailResponse = z.infer<typeof detailResponseSchema>;
