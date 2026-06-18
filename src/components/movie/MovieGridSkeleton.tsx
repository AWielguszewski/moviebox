export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul
      aria-hidden
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="space-y-2">
          <div className="aspect-[2/3] animate-pulse rounded-card bg-surface" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
        </li>
      ))}
    </ul>
  );
}
