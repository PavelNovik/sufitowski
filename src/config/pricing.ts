import { z } from "zod";

export const priceStatusSchema = z.enum([
  "CONFIRMED_FROM_QUOTATION",
  "TEMPORARY_PLACEHOLDER",
  "UNVERIFIED",
]);

export const priceUnitSchema = z.enum(["m2", "linear_metre", "piece"]);

export const priceCategorySchema = z.enum([
  "material",
  "profile",
  "lighting",
  "curtain_rail",
]);

export const priceEntrySchema = z.object({
  id: z.string().min(1),
  displayNameKey: z.string().min(1),
  unit: priceUnitSchema,
  unitPriceGrosz: z.number().int().nonnegative().nullable(),
  status: priceStatusSchema,
  sourceNote: z.string().min(1),
  category: priceCategorySchema.optional(),
  availability: z.enum(["quotation_only", "development_only", "source_option"]).optional(),
}).refine(
  (entry) =>
    (entry.status === "UNVERIFIED" && entry.unitPriceGrosz === null) ||
    (entry.status !== "UNVERIFIED" && entry.unitPriceGrosz !== null),
  { message: "Unverified entries must not carry a price; priced entries require an exact grosz value." },
);

export type PriceStatus = z.infer<typeof priceStatusSchema>;
export type PriceUnit = z.infer<typeof priceUnitSchema>;
export type PriceCategory = z.infer<typeof priceCategorySchema>;
export type PriceEntry = z.infer<typeof priceEntrySchema>;

const priceCatalogSchema = z.array(priceEntrySchema);

/** Values and statuses are source-tagged here, never embedded in UI components. */
export const priceCatalog: readonly PriceEntry[] = priceCatalogSchema.parse([
  {
    id: "material-303-satin-500-salon-kitchen",
    displayNameKey: "pricing.quote.303Satin500",
    unit: "m2",
    unitPriceGrosz: 10000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; named salon/kitchen line only.",
    category: "material",
    availability: "quotation_only",
  },
  {
    id: "material-303-satin-320-bedroom",
    displayNameKey: "pricing.quote.303Satin320Bedroom",
    unit: "m2",
    unitPriceGrosz: 9000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; named bedroom line only.",
    category: "material",
    availability: "quotation_only",
  },
  {
    id: "material-303-satin-320-bathroom-1",
    displayNameKey: "pricing.quote.303Satin320Bathroom",
    unit: "m2",
    unitPriceGrosz: 9000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; bathroom 1 line only.",
    category: "material",
    availability: "quotation_only",
  },
  {
    id: "service-shadow-profile-cien-standart",
    displayNameKey: "pricing.quote.shadowProfile",
    unit: "linear_metre",
    unitPriceGrosz: 4000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; do not equate to similarly named source-site options.",
    category: "profile",
    availability: "quotation_only",
  },
  {
    id: "service-additional-corners",
    displayNameKey: "pricing.quote.additionalCorners",
    unit: "piece",
    unitPriceGrosz: 3000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1.",
    category: "profile",
    availability: "quotation_only",
  },
  {
    id: "service-surface-mounted-curtain-rail",
    displayNameKey: "pricing.quote.surfaceMountedRail",
    unit: "linear_metre",
    unitPriceGrosz: 8000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1.",
    category: "curtain_rail",
    availability: "quotation_only",
  },
  {
    id: "service-concealed-curtain-rail",
    displayNameKey: "pricing.quote.concealedRail",
    unit: "linear_metre",
    unitPriceGrosz: 27500,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; distinct from the similarly priced generic development placeholder.",
    category: "curtain_rail",
    availability: "quotation_only",
  },
  {
    id: "service-led-line-30mm",
    displayNameKey: "pricing.quote.ledLine30mm",
    unit: "linear_metre",
    unitPriceGrosz: 23500,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; do not equate to generic LED options.",
    category: "lighting",
    availability: "quotation_only",
  },
  {
    id: "service-lighting-installation",
    displayNameKey: "pricing.quote.lightingInstallation",
    unit: "piece",
    unitPriceGrosz: 12000,
    status: "CONFIRMED_FROM_QUOTATION",
    sourceNote: "Owner-provided Sufitowski quotation, application no. 1; lighting installation only, not ceiling installation.",
    category: "lighting",
    availability: "quotation_only",
  },
  {
    id: "placeholder-membrane-white-matte",
    displayNameKey: "pricing.placeholder.whiteMatte",
    unit: "m2",
    unitPriceGrosz: 9000,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price; generic white matte membrane, not a named quotation product.",
    category: "material",
    availability: "development_only",
  },
  {
    id: "placeholder-membrane-glossy",
    displayNameKey: "pricing.placeholder.glossy",
    unit: "m2",
    unitPriceGrosz: 10000,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price; generic glossy membrane, not a named quotation product.",
    category: "material",
    availability: "development_only",
  },
  {
    id: "placeholder-membrane-satin",
    displayNameKey: "pricing.placeholder.satin",
    unit: "m2",
    unitPriceGrosz: 9500,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price; generic satin membrane, distinct from all named 303 Satin quotation lines.",
    category: "material",
    availability: "development_only",
  },
  {
    id: "placeholder-additional-profile",
    displayNameKey: "pricing.placeholder.additionalProfile",
    unit: "linear_metre",
    unitPriceGrosz: 3500,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price.",
    category: "profile",
    availability: "development_only",
  },
  {
    id: "placeholder-spotlight",
    displayNameKey: "pricing.placeholder.spotlight",
    unit: "piece",
    unitPriceGrosz: 12000,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price for a spotlight; separate from lighting installation.",
    category: "lighting",
    availability: "development_only",
  },
  {
    id: "placeholder-led-strip-no-profile",
    displayNameKey: "pricing.placeholder.ledStripNoProfile",
    unit: "linear_metre",
    unitPriceGrosz: 6000,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price; LED strip without profile.",
    category: "lighting",
    availability: "development_only",
  },
  {
    id: "placeholder-led-power-supply",
    displayNameKey: "pricing.placeholder.ledPowerSupply",
    unit: "piece",
    unitPriceGrosz: 15000,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price.",
    category: "lighting",
    availability: "development_only",
  },
  {
    id: "placeholder-concealed-curtain-rail",
    displayNameKey: "pricing.placeholder.concealedRail",
    unit: "linear_metre",
    unitPriceGrosz: 27500,
    status: "TEMPORARY_PLACEHOLDER",
    sourceNote: "Owner-authorized temporary development price; distinct from the similarly priced quotation entry.",
    category: "curtain_rail",
    availability: "development_only",
  },
  ...[
    ["site-material-gloss", "pricing.unverified.siteGloss", "m2", "material"],
    ["site-material-matte", "pricing.unverified.siteMatte", "m2", "material"],
    ["site-material-satin", "pricing.unverified.siteSatin", "m2", "material"],
    ["site-material-black-gloss", "pricing.unverified.siteBlackGloss", "m2", "material"],
    ["site-material-print", "pricing.unverified.sitePrint", "m2", "material"],
    ["site-material-starry-sky", "pricing.unverified.siteStarrySky", "m2", "material"],
    ["site-profile-standard", "pricing.unverified.siteStandardProfile", "linear_metre", "profile"],
    ["site-profile-shadow-standard", "pricing.unverified.siteShadowProfile", "linear_metre", "profile"],
    ["site-profile-eurokraab", "pricing.unverified.siteEurokraab", "linear_metre", "profile"],
    ["site-profile-illuminated", "pricing.unverified.siteIlluminatedProfile", "linear_metre", "profile"],
    ["site-light-spot-standard", "pricing.unverified.siteSpotStandard", "piece", "lighting"],
    ["site-light-lamp-standard", "pricing.unverified.siteLampStandard", "piece", "lighting"],
    ["site-light-lamp-premium", "pricing.unverified.siteLampPremium", "piece", "lighting"],
    ["site-light-led-line", "pricing.unverified.siteLedLine", "linear_metre", "lighting"],
    ["site-light-spot-premium", "pricing.unverified.siteSpotPremium", "piece", "lighting"],
    ["site-light-magnetic-rail", "pricing.unverified.siteMagneticRail", "linear_metre", "lighting"],
    ["site-curtain-standard", "pricing.unverified.siteCurtainStandard", "linear_metre", "curtain_rail"],
    ["site-curtain-concealed-premium", "pricing.unverified.siteCurtainConcealedPremium", "linear_metre", "curtain_rail"],
    ["site-curtain-luxury", "pricing.unverified.siteCurtainLuxury", "linear_metre", "curtain_rail"],
  ].map(([id, displayNameKey, unit, category]) => ({
    id,
    displayNameKey,
    unit,
    unitPriceGrosz: null,
    status: "UNVERIFIED" as const,
    sourceNote: "Visible as an option in the existing site calculator; no verified price or mapping to a quotation line.",
    category,
    availability: "source_option" as const,
  })),
]);

export function findPriceEntry(id: string): PriceEntry | undefined {
  return priceCatalog.find((entry) => entry.id === id);
}

export function formatPriceGrosz(grosz: number, locale: string): string {
  if (!Number.isSafeInteger(grosz)) throw new RangeError("Price in grosz must be a safe integer.");
  const value = BigInt(grosz);
  const absolute = value < BigInt(0) ? -value : value;
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const integerFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const template = currencyFormatter.formatToParts(value < BigInt(0) ? -0.01 : 0.01);
  return template.map((part) => {
    if (part.type === "integer") return integerFormatter.format(absolute / BigInt(100));
    if (part.type === "fraction") return (absolute % BigInt(100)).toString().padStart(2, "0");
    return part.value;
  }).join("");
}
