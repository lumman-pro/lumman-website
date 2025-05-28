"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInsights, useCategories } from "@/hooks/use-data-fetching";
import { PostCard } from "@/components/insights/post-card";
import { CategoryList } from "@/components/insights/category-list";
import { Pagination } from "@/components/insights/pagination";
import { PostCardSkeleton } from "@/components/insights/post-card-skeleton";

const POSTS_PER_PAGE = 9;

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
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
    categorySlug: slug,
  });

  const category = categoriesData?.find((c) => c.slug === slug);
  const totalPages = insightsData
    ? Math.ceil(insightsData.count / POSTS_PER_PAGE)
    : 0;

  // If category not found after loading, redirect to 404
  useEffect(() => {
    if (!isCategoriesLoading && categoriesData && !category) {
      router.push("/404");
    }
  }, [isCategoriesLoading, categoriesData, category, router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isCategoriesLoading || (categoriesData && !category)) {
    return (
      <div className="container max-w-3xl py-12 md:py-24">
        <div className="space-y-8 animate-pulse">
          <div className="h-16 bg-muted rounded-md" />
          <div className="h-10 bg-muted rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
            {category?.name}
          </h1>
          <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
            AI Insights about {category?.name.toLowerCase()}
          </p>
        </div>

        <CategoryList
          categories={categoriesData || []}
          currentCategory={slug}
        />

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
            No posts found in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {insightsData.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              basePath={`/ai-insights/category/${slug}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
