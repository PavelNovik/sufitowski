import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");
  return (
    <main className="page-shell not-found-page" id="main-content">
      <p className="eyebrow">404</p>
      <h1>404</h1>
      <Link className="button button-primary" href="/">{t("backHome")}</Link>
    </main>
  );
}
