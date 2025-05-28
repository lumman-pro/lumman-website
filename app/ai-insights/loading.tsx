import { PostCardSkeleton } from "@/components/insights/post-card-skeleton"

export default function InsightsLoading() {
  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            AI Insights
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            Thoughts on AI, automation, and business transformation
          </p>
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
