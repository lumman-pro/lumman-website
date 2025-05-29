import { createClient } from "@supabase/supabase-js";

export interface SEOData {
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
  canonical_url?: string;
  schema_data?: any;
  robots_directive?: string;
}

export interface PostSEOData extends SEOData {
  post_data?: {
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    updated_at?: string;
    author: {
      name: string;
      bio: string;
    };
  };
}

// Create a static Supabase client without cookies
function createStaticSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Static SEO functions for generateMetadata and generateStaticParams
export async function getStaticSEOData(path: string): Promise<SEOData | null> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase.rpc("get_seo_metadata", {
      page_path: path,
    });

    if (error) {
      console.error("Error fetching static SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getStaticSEOData:", error);
    return null;
  }
}

export async function getStaticPostSEOData(
  slug: string
): Promise<PostSEOData | null> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase.rpc("get_post_seo_metadata", {
      post_slug: slug,
    });

    if (error) {
      console.error("Error fetching static post SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getStaticPostSEOData:", error);
    return null;
  }
}

export async function getStaticCategorySEOData(
  slug: string
): Promise<SEOData | null> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase.rpc("get_category_seo_metadata", {
      category_slug: slug,
    });

    if (error) {
      console.error("Error fetching static category SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getStaticCategorySEOData:", error);
    return null;
  }
}

// Get global SEO settings statically
export async function getStaticGlobalSEOSettings() {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from("seo_settings")
      .select("key, value")
      .in("key", [
        "site_name",
        "site_description",
        "site_url",
        "default_og_image",
        "organization_schema",
      ]);

    if (error) {
      console.error("Error fetching static global SEO settings:", error);
      return {};
    }

    const settings: Record<string, any> = {};
    data?.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    return settings;
  } catch (error) {
    console.error("Error in getStaticGlobalSEOSettings:", error);
    return {};
  }
}

// Generate breadcrumb schema (same as before)
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Clean and format meta description (same as before)
export function formatMetaDescription(
  description: string,
  maxLength: number = 160
): string {
  if (!description) return "";

  // Remove HTML tags and extra whitespace
  const cleaned = description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) return cleaned;

  // Truncate at word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

// Generate canonical URL (same as before)
export function generateCanonicalUrl(path: string): string {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://lumman.ai"
      : "http://localhost:3000";

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
