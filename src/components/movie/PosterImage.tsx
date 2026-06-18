"use client";

import Image from "next/image";
import { useState } from "react";

import { FilmIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface PosterImageProps {
  poster: string | null;
  title: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  quality?: number;
  className?: string;
}

export function PosterImage({
  poster,
  title,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px",
  priority = false,
  decorative = false,
  quality,
  className,
}: PosterImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = poster !== null && !failed;

  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden bg-surface",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={poster}
          alt={decorative ? "" : title}
          aria-hidden={decorative || undefined}
          fill
          sizes={sizes}
          quality={quality}
          className="object-cover"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface to-background p-3 text-center"
          aria-hidden={decorative || undefined}
        >
          <FilmIcon className="h-8 w-8 text-muted/60" />
          {!decorative && (
            <span className="line-clamp-3 text-xs font-medium text-muted">
              {title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
