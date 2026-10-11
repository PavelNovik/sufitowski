"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";

const navigationItems = ["about", "services", "projects", "guides", "contact"] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = [
    { label: t("home"), href: "/" },
    ...navigationItems.map((item) => ({ label: t(item), href: `/${item}` })),
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link aria-label={`${t("home")} · Sufitowski`} className="wordmark" href="/">
          <span className="wordmark-mark" aria-hidden="true">S.</span>
          <span>SUFITOWSKI</span>
        </Link>
        <nav aria-label={t("openMenu")} className="desktop-nav">
          {items.map((item) => (
            <Link className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LocaleSwitcher />
          <ButtonLink className="header-cta" href="/calculator">
            {t("configure")}
          </ButtonLink>
        </div>
        <div className="mobile-menu">
          <button
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={t("openMenu")}
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <nav aria-label={t("openMenu")} className={`mobile-nav ${mobileOpen ? "is-open" : ""}`} id="mobile-navigation" hidden={!mobileOpen}>
            {items.map((item) => (
              <Link className="nav-link" href={item.href} key={item.href} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <LocaleSwitcher onChange={() => setMobileOpen(false)} />
            <ButtonLink href="/calculator" onClick={() => setMobileOpen(false)}>{t("configure")}</ButtonLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
