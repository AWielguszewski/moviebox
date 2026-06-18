import Link from "next/link";

import { FilmIcon } from "@/components/ui/icons";
import { StatusMessage } from "@/components/ui/StatusMessage";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4">
      <StatusMessage
        icon={<FilmIcon className="h-10 w-10" />}
        title="Page not found"
        description="The page or title you are looking for does not exist."
      >
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Back home
        </Link>
      </StatusMessage>
    </main>
  );
}
