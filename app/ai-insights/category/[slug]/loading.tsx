import { PostCardSkeleton } from "@/components/insights/post-card-skeleton"

export default function CategoryLoading() {
  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <div className="h-10 bg-muted animate-pulse w-1/3 rounded mb-4"></div>
          <div className="h-5 bg-muted animate-pulse w-1/2 rounded"></div>
        </div>

        <div className="h-8 flex space-x-4 mb-8">
          <div className="h-5 bg-muted animate-pulse w-12 rounded"></div>
          <div className="h-5 bg-muted animate-pulse w-20 rounded"></div>
          <div className="h-5 bg-muted animate-pulse w-16 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
