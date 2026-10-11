import { getTranslations } from "next-intl/server";

import { priceCatalog, formatPriceGrosz, type PriceCategory, type PriceEntry } from "@/config/pricing";
import type { AppLocale } from "@/i18n/routing";
import { PriceStatusBadge } from "./price-status";

const categoryOrder: readonly PriceCategory[] = ["material", "profile", "lighting", "curtain_rail"];
const categoryKeys: Record<PriceCategory, string> = {
  material: "materials",
  profile: "profiles",
  lighting: "lighting",
  curtain_rail: "rails",
};
const unitKeys: Record<PriceEntry["unit"], string> = {
  m2: "unitM2",
  linear_metre: "unitLinearMetre",
  piece: "unitPiece",
};

export async function PriceCatalog({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("pricing");
  const common = await getTranslations("common");
  const pageT = await getTranslations("pages.services");
  const development = process.env.NODE_ENV !== "production";

  return (
    <section aria-labelledby="price-reference-title" className="price-reference section-soft">
      <div className="page-shell">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">{pageT("catalogTitle")}</p>
            <h2 id="price-reference-title">{pageT("catalogTitle")}</h2>
            <p className="section-intro">{pageT("catalogBody")}</p>
          </div>
          {!development ? <p className="estimate-note">{t("developmentOnly")}</p> : null}
        </div>
        <div className="price-groups">
          {categoryOrder.map((category) => {
            const entries = priceCatalog.filter((entry) => entry.category === category);
            return (
              <section aria-labelledby={`price-${category}`} className="price-group" key={category}>
                <h3 id={`price-${category}`}>{pageT(categoryKeys[category])}</h3>
                <ul className="price-list">
                  {entries.map((entry) => {
                    const priceVisible = development && entry.unitPriceGrosz !== null;
                    return (
                      <li className="price-row" key={entry.id}>
                        <div className="price-row-main">
                          <p className="price-name">{t(entry.displayNameKey.replace(/^pricing\./, ""))}</p>
                          <PriceStatusBadge status={entry.status} />
                        </div>
                        <div className="price-value-wrap">
                          {priceVisible ? (
                            <span className="price-value">
                              {formatPriceGrosz(entry.unitPriceGrosz!, locale)}
                              <span className="price-unit"> / {t(unitKeys[entry.unit])}</span>
                            </span>
                          ) : (
                            <span className="price-muted">
                              {entry.status === "UNVERIFIED" ? t("statusUnverified") : t("statusConfirmed")}
                            </span>
                          )}
                          <span className="price-source">
                            {entry.status === "CONFIRMED_FROM_QUOTATION"
                              ? common("quoteOnly")
                              : entry.status === "TEMPORARY_PLACEHOLDER"
                                ? common("placeholderWarning")
                                : common("unverified")}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
