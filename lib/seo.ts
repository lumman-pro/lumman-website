import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

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

// Server-side SEO functions for generateMetadata
export async function getSEODataServer(path: string): Promise<SEOData | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("get_seo_metadata", {
      page_path: path,
    });

    if (error) {
      console.error("Error fetching SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getSEODataServer:", error);
    return null;
  }
}

export async function getPostSEODataServer(
  slug: string
): Promise<PostSEOData | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("get_post_seo_metadata", {
      post_slug: slug,
    });

    if (error) {
      console.error("Error fetching post SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getPostSEODataServer:", error);
    return null;
  }
}

export async function getCategorySEODataServer(
  slug: string
): Promise<SEOData | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("get_category_seo_metadata", {
      category_slug: slug,
    });

    if (error) {
      console.error("Error fetching category SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getCategorySEODataServer:", error);
    return null;
  }
}

// Client-side SEO functions (for browser use)
export async function getSEOData(path: string): Promise<SEOData | null> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc("get_seo_metadata", {
      page_path: path,
    });

    if (error) {
      console.error("Error fetching SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getSEOData:", error);
    return null;
  }
}

export async function getPostSEOData(
  slug: string
): Promise<PostSEOData | null> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc("get_post_seo_metadata", {
      post_slug: slug,
    });

    if (error) {
      console.error("Error fetching post SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getPostSEOData:", error);
    return null;
  }
}

export async function getCategorySEOData(
  slug: string
): Promise<SEOData | null> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc("get_category_seo_metadata", {
      category_slug: slug,
    });

    if (error) {
      console.error("Error fetching category SEO data:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in getCategorySEOData:", error);
    return null;
  }
}

export async function getGlobalSEOSettings() {
  try {
    const supabase = createBrowserSupabaseClient();
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
      console.error("Error fetching global SEO settings:", error);
      return {};
    }

    const settings: Record<string, any> = {};
    data?.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    return settings;
  } catch (error) {
    console.error("Error in getGlobalSEOSettings:", error);
    return {};
  }
}

// Generate breadcrumb schema
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

// Clean and format meta description
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

// Generate canonical URL
export function generateCanonicalUrl(path: string): string {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://lumman.ai"
      : "http://localhost:3000";

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
