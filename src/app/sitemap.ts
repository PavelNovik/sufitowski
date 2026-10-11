import type { MetadataRoute } from "next";

import { pageSlugs, siteConfig } from "@/config/site";
import { localizedPath } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["home", ...pageSlugs] as const;
  return routes.flatMap((route) =>
    siteConfig.locales.map((locale) => ({
      url: new URL(localizedPath(locale, route === "home" ? undefined : route), siteConfig.origin).toString(),
    })),
  );
}
