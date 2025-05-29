import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  createServerSupabaseClient,
  createStaticSupabaseClient,
} from "@/lib/supabase/server-client";
import { formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  getStaticPostSEOData,
  generateCanonicalUrl,
  generateBreadcrumbSchema,
} from "@/lib/seo-static";
import JsonLd from "@/components/seo/JsonLd";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const supabase = createStaticSupabaseClient();

  const { data: posts, error } = await supabase
    .from("insights_posts")
    .select("slug")
    .eq("is_published", true);

  if (error || !posts) {
    console.error("Error fetching posts for generateStaticParams:", error);
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoData = await getStaticPostSEOData(slug);

  if (!seoData) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const canonicalUrl = generateCanonicalUrl(`/ai-insights/${slug}`);

  // Get post data for keywords
  const supabase = createStaticSupabaseClient();
  const { data: post } = await supabase
    .from("insights_posts")
    .select("seo_keywords")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return {
    title: seoData.meta_title,
    description: seoData.meta_description,
    keywords: post?.seo_keywords || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoData.meta_title,
      description: seoData.meta_description,
      url: canonicalUrl,
      type: "article",
      publishedTime: seoData.post_data?.published_at,
      modifiedTime: seoData.post_data?.updated_at,
      authors: seoData.post_data?.author?.name
        ? [seoData.post_data.author.name]
        : undefined,
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

async function getPost(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data: post, error } = await supabase
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
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) {
    return null;
  }

  return {
    ...post,
    categories: post.categories?.map((pc: any) => pc.category) || [],
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  const seoData = await getStaticPostSEOData(slug);

  if (!post) {
    notFound();
  }

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://lumman.ai" },
    { name: "AI Insights", url: "https://lumman.ai/ai-insights" },
    { name: post.title, url: `https://lumman.ai/ai-insights/${post.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd data={breadcrumbSchema} />
      {seoData?.schema_data && <JsonLd data={seoData.schema_data} />}

      <div className="container max-w-3xl py-12 md:py-24">
        <article className="space-y-8">
          <div className="space-y-4">
            <Link
              href="/ai-insights"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out"
            >
              ← Back to AI Insights
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground transition-colors duration-300 ease-in-out">
              {post.title}
            </h1>

            <div className="flex items-center text-sm text-muted-foreground">
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {formatDate(new Date(post.published_at))}
                </time>
              )}

              {post.categories && post.categories.length > 0 && (
                <>
                  <span className="mx-2">·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/ai-insights/category/${category.slug}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {post.featured_image && (
            <div className="overflow-hidden rounded-lg">
              <Image
                src={post.featured_image}
                alt={post.title}
                width={800}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                }}
                className="object-cover"
                priority
              />
            </div>
          )}

          <MarkdownRenderer content={post.content} />

          {post.author && (
            <div className="border-t border-border pt-8 mt-12">
              <div className="flex items-center gap-4">
                {post.author.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-foreground transition-colors duration-300 ease-in-out">
                    {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
