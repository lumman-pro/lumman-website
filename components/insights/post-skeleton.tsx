export function PostSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse w-24 rounded"></div>

        <div className="h-10 bg-muted animate-pulse w-3/4 rounded"></div>

        <div className="flex items-center">
          <div className="h-4 bg-muted animate-pulse w-32 rounded"></div>
          <span className="mx-2">·</span>
          <div className="h-4 bg-muted animate-pulse w-24 rounded"></div>
        </div>
      </div>

      <div className="overflow-hidden bg-muted animate-pulse h-64 w-full"></div>

      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse w-full rounded"></div>
        <div className="h-4 bg-muted animate-pulse w-5/6 rounded"></div>
        <div className="h-4 bg-muted animate-pulse w-full rounded"></div>
        <div className="h-4 bg-muted animate-pulse w-4/5 rounded"></div>
      </div>

      <div className="space-y-4">
        <div className="h-6 bg-muted animate-pulse w-1/2 rounded"></div>
        <div className="h-4 bg-muted animate-pulse w-full rounded"></div>
        <div className="h-4 bg-muted animate-pulse w-5/6 rounded"></div>
      </div>
    </div>
  );
}
