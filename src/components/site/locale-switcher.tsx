"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeLabels: Record<AppLocale, string> = {
  pl: "PL",
  en: "EN",
  ru: "RU",
};

export function LocaleSwitcher({ onChange }: { onChange?: () => void }) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <div className="locale-switcher" role="group" aria-label={t("language")}>
      {routing.locales.map((nextLocale) => (
        <button
          aria-pressed={locale === nextLocale}
          aria-label={`${localeLabels[nextLocale]} — ${t(`languageNames.${nextLocale}`)}`}
          className="locale-button"
          key={nextLocale}
          onClick={() => {
            router.replace(pathname, { locale: nextLocale });
            onChange?.();
          }}
          type="button"
        >
          {localeLabels[nextLocale]}
        </button>
      ))}
    </div>
  );
}
