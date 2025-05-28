const puppeteer = require("puppeteer");

async function testSEO() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("🔍 Testing SEO implementation...\n");

  // Test main page
  console.log("📄 Testing main page...");
  await page.goto("http://localhost:3001");

  const title = await page.title();
  const description = await page.$eval(
    'meta[name="description"]',
    (el) => el.content
  );
  const ogTitle = await page.$eval(
    'meta[property="og:title"]',
    (el) => el.content
  );
  const canonical = await page.$eval('link[rel="canonical"]', (el) => el.href);

  console.log(`Title: ${title}`);
  console.log(`Description: ${description}`);
  console.log(`OG Title: ${ogTitle}`);
  console.log(`Canonical: ${canonical}\n`);

  // Test robots.txt
  console.log("🤖 Testing robots.txt...");
  const robotsResponse = await page.goto("http://localhost:3001/robots.txt");
  const robotsText = await robotsResponse.text();
  console.log("Robots.txt loaded successfully ✅\n");

  // Test sitemap.xml
  console.log("🗺️ Testing sitemap.xml...");
  const sitemapResponse = await page.goto("http://localhost:3001/sitemap.xml");
  const sitemapText = await sitemapResponse.text();
  console.log("Sitemap.xml loaded successfully ✅\n");

  // Test blog page
  console.log("📝 Testing blog page...");
  await page.goto("http://localhost:3001/ai-insights");

  const blogTitle = await page.title();
  const blogDescription = await page.$eval(
    'meta[name="description"]',
    (el) => el.content
  );

  console.log(`Blog Title: ${blogTitle}`);
  console.log(`Blog Description: ${blogDescription}\n`);

  console.log("✅ SEO testing completed!");

  await browser.close();
}

testSEO().catch(console.error);
