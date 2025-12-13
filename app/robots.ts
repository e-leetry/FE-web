import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/auth/*"]
      }
    ],
    // Expand here later for /mypage/* etc.
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/sitemap.xml`
  };
}
