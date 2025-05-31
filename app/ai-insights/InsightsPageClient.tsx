"use client";

import { useState } from "react";
import { useInsights, useCategories } from "@/hooks/use-data-fetching";
import { PostCard } from "@/components/insights/post-card";
import { CategoryList } from "@/components/insights/category-list";
import { Pagination } from "@/components/insights/pagination";
import { PostCardSkeleton } from "@/components/insights/post-card-skeleton";

const POSTS_PER_PAGE = 9;

export default function InsightsPageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  // Use React Query hooks
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const {
    data: insightsData,
    isLoading: isInsightsLoading,
    error: insightsError,
  } = useInsights({
    limit: POSTS_PER_PAGE,
    offset,
  });

  const totalPages = insightsData
    ? Math.ceil(insightsData.count / POSTS_PER_PAGE)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        {isCategoriesLoading ? (
          <div className="h-10 bg-muted animate-pulse rounded-md" />
        ) : (
          <CategoryList categories={categoriesData || []} />
        )}

        {isInsightsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : insightsError ? (
          <p className="text-destructive py-12 text-center">
            {insightsError instanceof Error
              ? insightsError.message
              : "Failed to load insights"}
          </p>
        ) : !insightsData || insightsData.posts.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">
            No posts found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {insightsData.posts.map((post, index) => (
                <PostCard key={post.id} post={post} priority={index === 0} />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              basePath="/ai-insights"
            />
          </>
        )}
      </div>
    </div>
  );
}
