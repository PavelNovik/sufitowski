import Image from "next/image";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/button";
import { ContentCard, SectionHeading } from "@/components/ui/content-card";

export function HomePage() {
  const t = useTranslations("home");
  const common = useTranslations("common");

  return (
    <main id="main-content">
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-marked">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p className="hero-description">{t("description")}</p>
          <div className="hero-actions">
            <ButtonLink href="/calculator">{t("primaryCta")}</ButtonLink>
            <ButtonLink href="/services" variant="secondary">{t("secondaryCta")}</ButtonLink>
          </div>
          <p className="hero-disclaimer">{common("preliminary")} · {common("quoteOnly")}</p>
        </div>
        <figure className="hero-visual">
          <div className="hero-image-frame">
            <Image
              alt={t("sceneLabel")}
              className="hero-image"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 58vw"
              src="/images/interior-hero.png"
            />
            <span aria-hidden="true" className="hero-image-index">01 / 03</span>
          </div>
          <figcaption>{common("illustrativeImage")}</figcaption>
        </figure>
        <div aria-hidden="true" className="hero-vertical-note">INTERIOR · CEILING · LIGHT</div>
      </section>

      <section className="section-shell page-shell">
        <SectionHeading eyebrow={t("introEyebrow")} title={t("introTitle")}>
          {t("introBody")}
        </SectionHeading>
        <div className="feature-grid">
          <ContentCard eyebrow="01" title={t("materialTitle")}>
            <p>{t("materialBody")}</p>
          </ContentCard>
          <ContentCard eyebrow="02" title={t("lightTitle")}>
            <p>{t("lightBody")}</p>
          </ContentCard>
          <ContentCard eyebrow="03" title={t("profileTitle")}>
            <p>{t("profileBody")}</p>
          </ContentCard>
        </div>
      </section>

      <section className="home-cta-band">
        <div className="page-shell home-cta-inner">
          <div>
            <p className="eyebrow">SUFITOWSKI</p>
            <h2>{t("ctaTitle")}</h2>
            <p>{t("ctaBody")}</p>
          </div>
          <ButtonLink href="/calculator" variant="secondary">{t("ctaLink")}</ButtonLink>
        </div>
      </section>
    </main>
  );
}
