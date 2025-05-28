import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { PostCard } from "@/components/insights/post-card";
import { CategoryList } from "@/components/insights/category-list";
import {
  getCategorySEODataServer,
  generateCanonicalUrl,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

const POSTS_PER_PAGE = 9;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const seoData = await getCategorySEODataServer(params.slug);

  if (!seoData) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const canonicalUrl = generateCanonicalUrl(
    `/ai-insights/category/${params.slug}`
  );

  return {
    title: seoData.meta_title,
    description: seoData.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoData.meta_title,
      description: seoData.meta_description,
      url: canonicalUrl,
      type: "website",
      images: seoData.og_image_url
        ? [
            {
              url: seoData.og_image_url,
              width: 1200,
              height: 630,
              alt: seoData.meta_title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.meta_title,
      description: seoData.meta_description,
      images: seoData.og_image_url ? [seoData.og_image_url] : undefined,
    },
    robots: seoData.robots_directive || "index,follow",
  };
}

async function getCategory(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data: category, error } = await supabase
    .from("insights_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !category) {
    return null;
  }

  return category;
}

async function getCategories() {
  const supabase = await createServerSupabaseClient();

  const { data: categories, error } = await supabase
    .from("insights_categories")
    .select("*")
    .order("name");

  if (error) {
    return [];
  }

  return categories || [];
}

async function getCategoryPosts(categorySlug: string, page: number = 1) {
  const supabase = await createServerSupabaseClient();
  const offset = (page - 1) * POSTS_PER_PAGE;

  // Get posts count
  const { count } = await supabase
    .from("insights_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("categories.slug", categorySlug);

  // Get posts
  const { data: posts, error } = await supabase
    .from("insights_posts")
    .select(
      `
      *,
      categories:insights_post_categories(
        category:insights_categories(*)
      ),
      author:insights_authors(*)
    `
    )
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1);

  if (error) {
    return { posts: [], count: 0 };
  }

  const formattedPosts =
    posts?.map((post) => ({
      ...post,
      categories: post.categories?.map((pc: any) => pc.category) || [],
    })) || [];

  return {
    posts: formattedPosts,
    count: count || 0,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);

  const [category, categories, postsData, seoData] = await Promise.all([
    getCategory(params.slug),
    getCategories(),
    getCategoryPosts(params.slug, currentPage),
    getCategorySEODataServer(params.slug),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.ceil(postsData.count / POSTS_PER_PAGE);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://lumman.ai" },
    { name: "AI Insights", url: "https://lumman.ai/ai-insights" },
    {
      name: category.name,
      url: `https://lumman.ai/ai-insights/category/${category.slug}`,
    },
  ]);

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd data={breadcrumbSchema} />
      {seoData?.schema_data && <JsonLd data={seoData.schema_data} />}

      <div className="container max-w-3xl py-12 md:py-24">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl text-foreground transition-colors duration-300 ease-in-out mb-4">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-base font-medium transition-colors duration-300 ease-in-out">
              {category.description ||
                `AI Insights about ${category.name.toLowerCase()}`}
            </p>
          </div>

          <CategoryList categories={categories} currentCategory={params.slug} />

          {postsData.posts.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              No posts found in this category.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {postsData.posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <a
                        key={page}
                        href={`/ai-insights/category/${params.slug}${
                          page > 1 ? `?page=${page}` : ""
                        }`}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {page}
                      </a>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
