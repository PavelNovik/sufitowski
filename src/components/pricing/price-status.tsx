import { useTranslations } from "next-intl";

import type { PriceStatus } from "@/config/pricing";

export function PriceStatusBadge({ status }: { status: PriceStatus }) {
  const t = useTranslations("pricing");
  const label =
    status === "CONFIRMED_FROM_QUOTATION"
      ? t("statusConfirmed")
      : status === "TEMPORARY_PLACEHOLDER"
        ? t("statusTemporary")
        : t("statusUnverified");

  return <span className={`price-status price-status-${status.toLowerCase()}`}>{label}</span>;
}
