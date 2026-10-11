import { findPriceEntry, type PriceEntry, type PriceStatus, type PriceUnit } from "@/config/pricing";

export type QuoteLine = {
  id: string;
  priceEntryId?: string;
  labelKey: string;
  unit: PriceUnit;
  quantityLabel: string;
  unitPriceGrosz: number | null;
  amountGrosz: number | null;
  status: PriceStatus;
  noteKey?: "lineNeedsVerification" | "lineRoundingUnknown" | "lineRailLengthRequired" | "lineProfileQuantityUnverified";
};

export type PreliminaryQuote = {
  areaCm2: bigint | null;
  lines: QuoteLine[];
  pricedSubtotalGrosz: number | null;
  canShowPricedSubtotal: boolean;
  isComplete: false;
};

const materialPriceIds: Record<string, string> = {
  matte: "placeholder-membrane-white-matte",
  gloss: "placeholder-membrane-glossy",
  satin: "placeholder-membrane-satin",
};

const unverifiedMaterialIds: Record<string, string> = {
  "black-gloss": "site-material-black-gloss",
  print: "site-material-print",
  "starry-sky": "site-material-starry-sky",
};

const profileIds: Record<string, string> = {
  standard: "site-profile-standard",
  "shadow-standard": "site-profile-shadow-standard",
  eurokraab: "site-profile-eurokraab",
  illuminated: "site-profile-illuminated",
};

const lightIds: Record<string, string> = {
  "spot-standard": "placeholder-spotlight",
  "lamp-standard": "site-light-lamp-standard",
  "lamp-premium": "site-light-lamp-premium",
  "led-line": "site-light-led-line",
  "spot-premium": "site-light-spot-premium",
  "magnetic-rail": "site-light-magnetic-rail",
};

const railIds: Record<string, string> = {
  standard: "site-curtain-standard",
  "concealed-premium": "site-curtain-concealed-premium",
  luxury: "site-curtain-luxury",
};

function safePositiveInteger(value: number): bigint | null {
  return Number.isSafeInteger(value) && value > 0 ? BigInt(value) : null;
}

function decimalQuantity(numerator: bigint, scale: bigint, locale: string): string {
  const whole = numerator / scale;
  const remainder = numerator % scale;
  if (remainder === BigInt(0)) return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(whole);

  const fractionDigits = scale.toString().length - 1;
  const decimal = `${whole}.${remainder.toString().padStart(fractionDigits, "0")}`.replace(/0+$/, "");
  const [integerPart, fractionalPart] = decimal.split(".");
  const localizedInteger = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(BigInt(integerPart));
  const decimalSeparator = new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === "decimal")?.value ?? ".";
  return `${localizedInteger}${decimalSeparator}${fractionalPart}`;
}

function amountGrosz(entry: PriceEntry, quantityNumerator: bigint, quantityDenominator = BigInt(1)): number | null {
  if (entry.unitPriceGrosz === null) return null;
  const valueNumerator = BigInt(entry.unitPriceGrosz) * quantityNumerator;
  if (valueNumerator % quantityDenominator !== BigInt(0)) return null;
  const value = valueNumerator / quantityDenominator;
  return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : null;
}

function addPricedOrUnknownLine(args: {
  lines: QuoteLine[];
  id: string;
  entryId: string;
  quantityLabel: string;
  quantityNumerator: bigint;
  quantityDenominator?: bigint;
  quantityDisplay?: string;
}) {
  const entry = findPriceEntry(args.entryId);
  if (!entry) return;
  const amount = amountGrosz(entry, args.quantityNumerator, args.quantityDenominator);
  args.lines.push({
    id: args.id,
    priceEntryId: entry.id,
    labelKey: entry.displayNameKey,
    unit: entry.unit,
    quantityLabel: args.quantityDisplay ?? args.quantityLabel,
    unitPriceGrosz: entry.unitPriceGrosz,
    amountGrosz: amount,
    status: entry.status,
    ...(entry.status === "UNVERIFIED" ? { noteKey: "lineNeedsVerification" } : {}),
    ...(entry.status !== "UNVERIFIED" && amount === null
      ? { noteKey: "lineRoundingUnknown" }
      : {}),
  });
}

export function calculatePreliminaryQuote(input: {
  lengthCm: number;
  widthCm: number;
  material: string;
  profile: string;
  lighting: Record<string, number>;
  rail: string;
  locale: string;
}): PreliminaryQuote {
  const length = safePositiveInteger(input.lengthCm);
  const width = safePositiveInteger(input.widthCm);
  const areaCm2 = length && width ? length * width : null;
  const lines: QuoteLine[] = [];

  if (areaCm2 && input.material) {
    const entryId = materialPriceIds[input.material] ?? unverifiedMaterialIds[input.material];
    if (entryId) {
      addPricedOrUnknownLine({
        lines,
        id: "ceiling-material",
        entryId,
        quantityLabel: "area",
        quantityNumerator: areaCm2,
        quantityDenominator: BigInt(10000),
        quantityDisplay: decimalQuantity(areaCm2, BigInt(10000), input.locale),
      });
    }
  }

  if (input.profile) {
    const profileEntryId = profileIds[input.profile];
    if (profileEntryId) {
      const entry = findPriceEntry(profileEntryId);
      if (entry) {
        lines.push({
          id: "profile",
          priceEntryId: entry.id,
          labelKey: entry.displayNameKey,
          unit: entry.unit,
          quantityLabel: "—",
          unitPriceGrosz: null,
          amountGrosz: null,
          status: "UNVERIFIED",
          noteKey: "lineProfileQuantityUnverified",
        });
      }
    }
  }

  for (const [optionId, quantity] of Object.entries(input.lighting)) {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) continue;
    const entryId = lightIds[optionId];
    if (entryId) {
      addPricedOrUnknownLine({
        lines,
        id: `lighting-${optionId}`,
        entryId,
        quantityLabel: String(quantity),
        quantityNumerator: BigInt(quantity),
      });
    }
  }

  if (input.rail && input.rail !== "none") {
    const railEntryId = railIds[input.rail];
    if (railEntryId) {
      lines.push({
        id: "curtain-rail",
        priceEntryId: railEntryId,
        labelKey: findPriceEntry(railEntryId)?.displayNameKey ?? "",
        unit: "linear_metre",
        quantityLabel: "—",
        unitPriceGrosz: null,
        amountGrosz: null,
        status: "UNVERIFIED",
        noteKey: "lineRailLengthRequired",
      });
    }
  }

  const pricedLines = lines.filter((line) => line.status !== "UNVERIFIED");
  const canSumPricedLines = pricedLines.length > 0 && pricedLines.every((line) => line.amountGrosz !== null);
  const subtotal = canSumPricedLines
    ? pricedLines.reduce((sum, line) => sum + BigInt(line.amountGrosz ?? 0), BigInt(0))
    : null;
  const safeSubtotal = subtotal !== null && subtotal <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(subtotal) : null;

  return {
    areaCm2,
    lines,
    pricedSubtotalGrosz: safeSubtotal,
    canShowPricedSubtotal: safeSubtotal !== null,
    isComplete: false,
  };
}
