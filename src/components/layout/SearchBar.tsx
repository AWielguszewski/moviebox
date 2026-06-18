"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "hero" | "compact";
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  variant = "hero",
  defaultValue = "",
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const isHero = variant === "hero";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search movies and series
      </label>
      <SearchIcon
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
          isHero ? "left-5 h-5 w-5" : "left-3.5 h-4 w-4",
        )}
      />
      <input
        id={inputId}
        type="search"
        name="q"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies, series…"
        autoComplete="off"
        className={cn(
          "w-full rounded-full border border-border bg-surface/80 text-foreground shadow-lg backdrop-blur placeholder:text-muted",
          isHero
            ? "py-4 pl-13 pr-16 text-base sm:pr-32 sm:text-lg"
            : "py-2.5 pl-10 pr-24 text-sm",
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-accent font-semibold text-white transition-colors hover:bg-accent-hover",
          isHero
            ? "right-2 px-3 py-2.5 text-sm sm:px-6"
            : "right-1.5 px-4 py-1.5 text-xs",
        )}
      >
        {isHero ? (
          <>
            <SearchIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
}
