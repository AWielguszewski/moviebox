"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FilmIcon, HeartIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Search", Icon: SearchIcon },
  { href: "/favorites", label: "Favorites", Icon: HeartIcon },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <FilmIcon className="h-6 w-6 text-accent" />
          <span className="text-lg">Moviebox</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-foreground",
                  active ? "text-foreground" : "text-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
