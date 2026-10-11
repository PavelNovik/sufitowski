import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand-block">
          <Link className="wordmark footer-wordmark" href="/">
            <span className="wordmark-mark" aria-hidden="true">S.</span>
            <span>SUFITOWSKI</span>
          </Link>
          <p>{t("tagline")}</p>
        </div>
        <div>
          <h2 className="footer-label">{t("navigation")}</h2>
          <nav aria-label={t("navigation")} className="footer-links">
            <Link href="/services">{nav("services")}</Link>
            <Link href="/calculator">{nav("calculator")}</Link>
            <Link href="/projects">{nav("projects")}</Link>
            <Link href="/about">{nav("about")}</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-label">{t("contact")}</h2>
          <a className="footer-phone" href={`tel:${siteConfig.phone}`}>
            {siteConfig.phoneDisplay}
          </a>
          <p className="footer-small">{t("disclaimer")}</p>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {year} Sufitowski.pl. {t("copyright")}</span>
        <span>{t("disclaimer")}</span>
      </div>
    </footer>
  );
}
