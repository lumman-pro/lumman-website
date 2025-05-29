import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call Supabase Edge Function directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-robots`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Edge Function failed: ${response.status}`);
    }

    const robotsContent = await response.text();

    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error calling Edge Function for robots.txt:", error);

    // Improved fallback robots.txt (fixed % issue)
    const fallbackRobots = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /login
Disallow: /signup

Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml

Sitemap: https://lumman.ai/sitemap.xml`;

    return new NextResponse(fallbackRobots, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
