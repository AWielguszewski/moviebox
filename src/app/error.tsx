"use client";

import { FilmIcon } from "@/components/ui/icons";
import { StatusMessage } from "@/components/ui/StatusMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4">
      <StatusMessage
        icon={<FilmIcon className="h-10 w-10" />}
        title="Something went wrong"
        description={error.message || "An unexpected error occurred."}
      >
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
      </StatusMessage>
    </main>
  );
}
