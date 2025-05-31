import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createServerSupabaseClient,
  createStaticSupabaseClient,
} from "@/lib/supabase/server-client";
import { PostCard } from "@/components/insights/post-card";
import { CategoryList } from "@/components/insights/category-list";
import {
  getStaticCategorySEOData,
  generateCanonicalUrl,
  generateBreadcrumbSchema,
} from "@/lib/seo-static";
import JsonLd from "@/components/seo/JsonLd";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 10;

// Generate static params for all categories
export async function generateStaticParams() {
  const supabase = createStaticSupabaseClient();

  const { data: categories, error } = await supabase
    .from("insights_categories")
    .select("slug");

  if (error || !categories) {
    console.error("Error fetching categories for generateStaticParams:", error);
    return [];
  }

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoData = await getStaticCategorySEOData(slug);

  if (!seoData) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const canonicalUrl = generateCanonicalUrl(`/ai-insights/category/${slug}`);

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
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: seoData.meta_title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.meta_title,
      description: seoData.meta_description,
      images: seoData.og_image_url ? [seoData.og_image_url] : ["/og-image.png"],
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

  // First, get the category ID
  const { data: category } = await supabase
    .from("insights_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    return { posts: [], count: 0 };
  }

  // Get post IDs for this category
  const { data: postIds } = await supabase
    .from("insights_posts_categories")
    .select("post_id")
    .eq("category_id", category.id);

  if (!postIds || postIds.length === 0) {
    return { posts: [], count: 0 };
  }

  const postIdArray = postIds.map((item) => item.post_id);

  // Get posts count
  const { count } = await supabase
    .from("insights_posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)
    .in("id", postIdArray);

  // Get posts
  const { data: posts, error } = await supabase
    .from("insights_posts")
    .select(
      `
      *,
      categories:insights_posts_categories(
        category:insights_categories(*)
      ),
      author:insights_authors(*)
    `
    )
    .eq("is_published", true)
    .in("id", postIdArray)
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
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  const [category, categories, postsData, seoData] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getCategoryPosts(slug, currentPage),
    getStaticCategorySEOData(slug),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.ceil(postsData.count / POSTS_PER_PAGE);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.lumman.ai" },
    { name: "AI Insights", url: "https://www.lumman.ai/ai-insights" },
    {
      name: category.name,
      url: `https://www.lumman.ai/ai-insights/category/${category.slug}`,
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

          <CategoryList categories={categories} currentCategory={slug} />

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
                        href={`/ai-insights/category/${slug}${
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
