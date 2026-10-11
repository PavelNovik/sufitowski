
import { getTranslations } from "next-intl/server";

import { ContentCard } from "@/components/ui/content-card";
import { PriceCatalog } from "@/components/pricing/price-catalog";
import { siteConfig } from "@/config/site";
import type { AppLocale } from "@/i18n/routing";
import type { PageSlug } from "@/config/site";
import { CalculatorShell } from "@/components/calculator/calculator-shell";

export async function LocalizedPage({ slug, locale }: { slug: PageSlug; locale: AppLocale }) {
  const t = await getTranslations(`pages.${slug}`);

  return (
    <main id="main-content">
      <section className="page-hero page-shell">
        <p className="eyebrow eyebrow-marked">{t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="page-lead">{t("intro")}</p>
        <p className="notice-banner">{t("notice")}</p>
        {slug === "contact" ? (
          <a className="button button-primary" href={`tel:${siteConfig.phone}`}>
            {t("phoneAction")} {siteConfig.phoneDisplay}
          </a>
        ) : null}
      </section>
      <section className="page-content-section page-shell">
        {slug === "calculator" ? (
          <CalculatorShell />
        ) : slug === "services" ? (
          <>
            <div className="feature-grid feature-grid-two">
              {(["materials", "profiles", "lighting", "rails"] as const).map((key, index) => (
                <ContentCard eyebrow={`0${index + 1}`} key={key} title={t(key)}>
                  <p>{t("intro")}</p>
                </ContentCard>
              ))}
            </div>
            <PriceCatalog locale={locale} />
          </>
        ) : slug === "contact" ? (
          <div className="contact-panel">
            <div>
              <p className="eyebrow">{t("phoneLabel")}</p>
              <a className="contact-phone" href={`tel:${siteConfig.phone}`}>
                {siteConfig.phoneDisplay}
              </a>
            </div>
            <span className="contact-mark" aria-hidden="true">↗</span>
          </div>
        ) : (
          <ContentCard eyebrow="SUFITOWSKI" title={t("cardTitle")}>
            <p>{t("cardBody")}</p>
          </ContentCard>
        )}
      </section>
    </main>
  );
}
