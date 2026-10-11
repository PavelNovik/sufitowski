import type { AppLocale } from "@/i18n/routing";
import type { PageSlug } from "@/config/site";

export function localizedPath(locale: AppLocale, slug?: PageSlug): string {
  const path = slug ? `/${slug}` : "";
  return locale === "pl" ? path || "/" : `/${locale}${path}`;
}
