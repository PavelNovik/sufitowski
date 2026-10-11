import type { Metadata } from "next";

import type { AppLocale } from "@/i18n/routing";
import { siteConfig, type PageSlug } from "@/config/site";

type PageKey = "home" | PageSlug;

export function getPageMetadata(
  locale: AppLocale,
  page: PageKey,
  title: string,
  description: string,
): Metadata {
  const slug = page === "home" ? undefined : page;
  const path = slug ? `/${slug}` : "/";
  const languages = Object.fromEntries(
    siteConfig.locales.map((language) => [
      language === "pl" ? "pl-PL" : language,
      localizedPathFor(language, path),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: localizedPathFor(locale, path),
      languages: { ...languages, "x-default": path },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: siteConfig.name,
      url: localizedPathFor(locale, path),
    },
  };
}

function localizedPathFor(locale: AppLocale, path: string): string {
  if (locale === "pl") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
