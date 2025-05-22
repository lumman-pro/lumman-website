export function PostCardSkeleton() {
  return (
    <article className="space-y-4 transition-colors duration-300 ease-in-out">
      <div className="block group">
        <div className="mb-4 overflow-hidden bg-muted animate-pulse h-48 w-full"></div>
        <div className="h-6 bg-muted animate-pulse w-3/4 rounded"></div>
      </div>

      <div className="flex items-center">
        <div className="h-4 bg-muted animate-pulse w-24 rounded"></div>
        <span className="mx-2">·</span>
        <div className="h-4 bg-muted animate-pulse w-16 rounded"></div>
      </div>

      <div className="h-4 bg-muted animate-pulse w-full rounded"></div>
      <div className="h-4 bg-muted animate-pulse w-5/6 rounded"></div>
    </article>
  );
}
