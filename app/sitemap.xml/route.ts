import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get sitemap from Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-sitemap`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch sitemap");
    }

    const sitemapContent = await response.text();

    return new NextResponse(sitemapContent, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lumman.ai/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lumman.ai/ai-insights</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://lumman.ai/legal</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
