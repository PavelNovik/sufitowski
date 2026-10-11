import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { LocalizedPage } from "@/components/pages/localized-page";
import { isPageSlug, pageSlugs, type PageSlug } from "@/config/site";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isPageSlug(slug) || !routing.locales.includes(locale as AppLocale)) return {};

  const t = await getTranslations({ locale: locale as AppLocale, namespace: `metadata.${slug}` });
  return getPageMetadata(locale as AppLocale, slug, t("title"), t("description"));
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as AppLocale) || !isPageSlug(slug)) notFound();

  return <LocalizedPage locale={locale as AppLocale} slug={slug as PageSlug} />;
}
