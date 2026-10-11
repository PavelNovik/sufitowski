import { getTranslations } from "next-intl/server";

import { HomePage } from "@/components/pages/home-page";
import { getPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return getPageMetadata(locale, "home", t("title"), t("description"));
}

export default function Home() {
  return <HomePage />;
}
