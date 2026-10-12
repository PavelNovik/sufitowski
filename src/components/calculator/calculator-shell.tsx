"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { RoomVisualizer } from "@/components/visualizer/room-visualizer";
import { calculatePreliminaryQuote } from "@/domain/quote";
import { formatPriceGrosz } from "@/config/pricing";

const dimensionSchema = z.object({
  lengthCm: z.coerce.number().int().positive().refine(Number.isSafeInteger),
  widthCm: z.coerce.number().int().positive().refine(Number.isSafeInteger),
});

const steps = ["stepRoom", "stepMaterial", "stepProfile", "stepLighting", "stepRails", "stepResult"] as const;
const calculatorStorageKey = "sufitowski-calculator-state-v1";
const calculatorStateSchema = z.object({
  version: z.literal(1),
  step: z.number().int().min(0).max(5),
  lengthCm: z.string(),
  widthCm: z.string(),
  material: z.string(),
  materialColor: z.string(),
  profile: z.string(),
  lighting: z.record(z.string(), z.number().int().nonnegative()),
  rail: z.string(),
});

const materialOptions = [
  ["gloss", "pricing.unverified.siteGloss"],
  ["matte", "pricing.unverified.siteMatte"],
  ["satin", "pricing.unverified.siteSatin"],
  ["black-gloss", "pricing.unverified.siteBlackGloss"],
  ["print", "pricing.unverified.sitePrint"],
  ["starry-sky", "pricing.unverified.siteStarrySky"],
] as const;

const profileOptions = [
  ["standard", "pricing.unverified.siteStandardProfile"],
  ["shadow-standard", "pricing.unverified.siteShadowProfile"],
  ["eurokraab", "pricing.unverified.siteEurokraab"],
  ["illuminated", "pricing.unverified.siteIlluminatedProfile"],
] as const;

const lightingOptions = [
  ["spot-standard", "pricing.unverified.siteSpotStandard"],
  ["lamp-standard", "pricing.unverified.siteLampStandard"],
  ["lamp-premium", "pricing.unverified.siteLampPremium"],
  ["led-line", "pricing.unverified.siteLedLine"],
  ["spot-premium", "pricing.unverified.siteSpotPremium"],
  ["magnetic-rail", "pricing.unverified.siteMagneticRail"],
] as const;

const railOptions = [
  ["standard", "pricing.unverified.siteCurtainStandard"],
  ["concealed-premium", "pricing.unverified.siteCurtainConcealedPremium"],
  ["luxury", "pricing.unverified.siteCurtainLuxury"],
] as const;

export function CalculatorShell() {
  const locale = useLocale();
  const t = useTranslations("pages.calculator");
  const priceT = useTranslations("pricing");
  const visualizerT = useTranslations("visualizer");
  const common = useTranslations("common");
  const translatePrice = (key: string) => priceT(key.replace(/^pricing\./, ""));
  const [step, setStep] = useState(0);
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [dimensionError, setDimensionError] = useState(false);
  const [material, setMaterial] = useState("");
  const [materialColor, setMaterialColor] = useState("white");
  const [profile, setProfile] = useState("");
  const [lighting, setLighting] = useState<Record<string, number>>({});
  const [rail, setRail] = useState("");
  const [restoredFromSession, setRestoredFromSession] = useState(false);

  useEffect(() => {
    // Browser-only session hydration runs after SSR so the first client render matches the server markup.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const rawState = window.sessionStorage.getItem(calculatorStorageKey);
      if (rawState) {
        const parsedState = calculatorStateSchema.safeParse(JSON.parse(rawState));
        if (parsedState.success) {
          const saved = parsedState.data;
          setStep(saved.step);
          setLengthCm(saved.lengthCm);
          setWidthCm(saved.widthCm);
          setMaterial(saved.material);
          setMaterialColor(saved.materialColor);
          setProfile(saved.profile);
          setLighting(saved.lighting);
          setRail(saved.rail);
        }
      }
    } catch {
      window.sessionStorage.removeItem(calculatorStorageKey);
    } finally {
      setRestoredFromSession(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!restoredFromSession) return;
    window.sessionStorage.setItem(calculatorStorageKey, JSON.stringify({
      version: 1,
      step,
      lengthCm,
      widthCm,
      material,
      materialColor,
      profile,
      lighting,
      rail,
    }));
  }, [restoredFromSession, step, lengthCm, widthCm, material, materialColor, profile, lighting, rail]);

  function next(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (step === 0) {
      const dimensions = dimensionSchema.safeParse({ lengthCm, widthCm });
      if (!dimensions.success) {
        setDimensionError(true);
        return;
      }
      setDimensionError(false);
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function updateLighting(id: string, quantity: number) {
    setLighting((current) => {
      const nextValues = { ...current };
      if (quantity > 0) nextValues[id] = quantity;
      else delete nextValues[id];
      return nextValues;
    });
  }

  function reset() {
    setStep(0);
    setLengthCm("");
    setWidthCm("");
    setDimensionError(false);
    setMaterial("");
    setMaterialColor("white");
    setProfile("");
    setLighting({});
    setRail("");
  }

  const currentStepKey = steps[step];
  const selectedMaterialLabel = materialOptions.find(([id]) => id === material)?.[1];
  const selectedProfileLabel = profileOptions.find(([id]) => id === profile)?.[1];
  const selectedRailLabel = railOptions.find(([id]) => id === rail)?.[1];
  const activeLighting = lightingOptions.filter(([id]) => (lighting[id] ?? 0) > 0);
  const isDevelopment = process.env.NODE_ENV !== "production";
  const parsedLength = Number(lengthCm);
  const parsedWidth = Number(widthCm);
  const quote = calculatePreliminaryQuote({
    lengthCm: parsedLength,
    widthCm: parsedWidth,
    material,
    profile,
    lighting,
    rail,
    locale,
  });

  return (
    <section aria-label={t("progressLabel")} className="calculator-shell">
      <ol aria-label={t("progressLabel")} className="calculator-progress">
        {steps.map((stepKey, index) => (
          <li aria-current={step === index ? "step" : undefined} className={step === index ? "is-current" : step < index ? "is-upcoming" : "is-complete"} key={stepKey}>
            <span className="progress-number">{index + 1}</span>
            <span>{t(stepKey)}</span>
          </li>
        ))}
      </ol>

      <div className="calculator-layout">
        <div aria-live="polite" className="calculator-step-card">
          <p className="eyebrow">{t(currentStepKey)}</p>
          <h2 id="calculator-step-title">{t(
            currentStepKey === "stepRoom" ? "roomTitle" :
            currentStepKey === "stepMaterial" ? "materialTitle" :
            currentStepKey === "stepProfile" ? "profileTitle" :
            currentStepKey === "stepLighting" ? "lightingTitle" :
            currentStepKey === "stepRails" ? "railsTitle" : "summaryTitle"
          )}</h2>

          {step === 0 ? (
            <form className="dimension-form" onSubmit={next} noValidate>
              <p className="step-help">{t("roomHelp")}</p>
              <div className="field-grid">
                <label className="form-field">
                  <span>{t("length")}</span>
                  <input
                    autoComplete="off"
                    inputMode="numeric"
                    min="1"
                    name="lengthCm"
                    onChange={(event) => setLengthCm(event.target.value)}
                    type="number"
                    value={lengthCm}
                  />
                </label>
                <label className="form-field">
                  <span>{t("width")}</span>
                  <input
                    autoComplete="off"
                    inputMode="numeric"
                    min="1"
                    name="widthCm"
                    onChange={(event) => setWidthCm(event.target.value)}
                    type="number"
                    value={widthCm}
                  />
                </label>
              </div>
              {dimensionError ? <p className="field-error" role="alert">{t("dimensionError")}</p> : null}
            </form>
          ) : null}

          {step === 1 ? (
            <ChoiceGroup
              legend={t("materialTitle")}
              name="material"
              onChange={setMaterial}
              options={materialOptions.map(([id, key]) => ({ id, label: translatePrice(key) }))}
              value={material}
            />
          ) : null}

          {step === 2 ? (
            <ChoiceGroup
              legend={t("profileTitle")}
              name="profile"
              onChange={setProfile}
              options={profileOptions.map(([id, key]) => ({ id, label: translatePrice(key) }))}
              value={profile}
            />
          ) : null}

          {step === 3 ? (
            <fieldset className="choice-fieldset">
              <legend>{t("lightingTitle")}</legend>
              <p className="step-help">{t("selectHelp")}</p>
              <div className="choice-grid">
                {lightingOptions.map(([id, key]) => {
                  const unitLabel = priceT(id === "led-line" || id === "magnetic-rail" ? "unitLinearMetre" : "unitPiece");
                  return (
                    <label className="quantity-choice" key={id}>
                      <span className="choice-copy">
                        <span className="choice-title">{translatePrice(key)}</span>
                        <span className="choice-subtitle">{priceT("statusUnverified")}</span>
                      </span>
                      <span className="quantity-control">
                        <span>{t("quantity")} · {unitLabel}</span>
                        <input
                          aria-label={`${t("quantity")}: ${translatePrice(key)} (${unitLabel})`}
                          min="0"
                          onChange={(event) => updateLighting(id, Number(event.target.value))}
                          step="1"
                          type="number"
                          value={lighting[id] ?? 0}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {step === 4 ? (
            <fieldset className="choice-fieldset">
              <legend>{t("railsTitle")}</legend>
              <p className="step-help">{t("selectHelp")}</p>
              <div className="choice-grid">
                <ChoiceCard checked={rail === "none"} id="rail-none" label={t("noRail")} name="curtain-rail" onChange={() => setRail("none")} value="none" />
                {railOptions.map(([id, key]) => (
                  <ChoiceCard checked={rail === id} id={`rail-${id}`} key={id} label={translatePrice(key)} name="curtain-rail" onChange={() => setRail(id)} value={id} />
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 5 ? (
            <div className="result-summary">
              <dl className="summary-list">
                <SummaryItem label={t("roomSummary")} value={lengthCm && widthCm ? `${lengthCm} × ${widthCm} cm` : t("emptySelection")} />
                <SummaryItem label={t("materialSummary")} value={selectedMaterialLabel ? `${translatePrice(selectedMaterialLabel)} · ${visualizerT(`colors.${materialColor}`)}` : t("emptySelection")} />
                <SummaryItem label={t("profileSummary")} value={selectedProfileLabel ? translatePrice(selectedProfileLabel) : t("emptySelection")} />
                <SummaryItem
                  label={t("lightingSummary")}
                  value={activeLighting.length ? activeLighting.map(([id, key]) => `${translatePrice(key)} × ${lighting[id]}`).join(", ") : t("emptySelection")}
                />
                <SummaryItem label={t("railsSummary")} value={rail === "none" ? t("noRail") : selectedRailLabel ? translatePrice(selectedRailLabel) : t("emptySelection")} />
              </dl>
              <section className="quote-breakdown" aria-labelledby="quote-breakdown-title">
                <h3 id="quote-breakdown-title">{t("breakdownTitle")}</h3>
                {quote.lines.length ? (
                  <ul className="quote-lines">
                    {quote.lines.map((line) => {
                      const unitLabel = priceT(line.unit === "m2" ? "unitM2" : line.unit === "linear_metre" ? "unitLinearMetre" : "unitPiece");
                      return (
                        <li className="quote-line" key={line.id}>
                          <div className="quote-line-copy">
                            <strong>{translatePrice(line.labelKey)}</strong>
                            <span>{line.quantityLabel} {unitLabel}{line.unitPriceGrosz !== null ? ` × ${formatPriceGrosz(line.unitPriceGrosz, locale)} / ${unitLabel}` : ""}</span>
                            <span className={`quote-provenance quote-provenance-${line.status.toLowerCase()}`}>
                              {priceT(line.status === "TEMPORARY_PLACEHOLDER" ? "statusTemporary" : line.status === "CONFIRMED_FROM_QUOTATION" ? "statusConfirmed" : "statusUnverified")}
                            </span>
                            {line.noteKey ? <span className="quote-line-note">{t(line.noteKey)}</span> : null}
                          </div>
                          <strong className="quote-line-amount">
                            {line.amountGrosz === null ? t("amountUnavailable") : formatPriceGrosz(line.amountGrosz, locale)}
                          </strong>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>{t("noPricedLines")}</p>
                )}
                <div className="quote-priced-subtotal">
                  <span>{t("pricedSubtotal")}</span>
                  <strong>{quote.canShowPricedSubtotal && quote.pricedSubtotalGrosz !== null ? formatPriceGrosz(quote.pricedSubtotalGrosz, locale) : t("amountUnavailable")}</strong>
                </div>
                <div className="no-total-note" role="status">
                  <span className="no-total-label">{common("preliminary")}</span>
                  <p>{t("estimateIncomplete")}</p>
                </div>
              </section>
              {isDevelopment ? (
                <p className="dev-mode-note">{t("developmentPriceNote")}</p>
              ) : null}
            </div>
          ) : null}

          {step > 0 && step < 5 ? <p className="step-help step-help-bottom">{t("selectHelp")}</p> : null}
          <div className="calculator-actions">
            {step > 0 ? <Button onClick={() => setStep((current) => Math.max(0, current - 1))} type="button" variant="secondary">{t("back")}</Button> : <span />}
            {step < 5 ? (
              <Button onClick={() => next()} type="button">{t("next")}</Button>
            ) : (
              <Button onClick={reset} type="button" variant="secondary">{t("restart")}</Button>
            )}
          </div>
        </div>
        <aside className="calculator-aside">
          <RoomVisualizer
            selectedMaterial={material || undefined}
            selectedMaterialLabel={selectedMaterialLabel ? translatePrice(selectedMaterialLabel) : undefined}
            selectedColor={materialColor}
            onColorChange={setMaterialColor}
            selectedProfile={profile || undefined}
            selectedProfileLabel={selectedProfileLabel ? translatePrice(selectedProfileLabel) : undefined}
            selectedLighting={activeLighting.map(([id]) => ({ id, quantity: lighting[id] ?? 0 }))}
            selectedCurtainRail={rail || undefined}
            selectedCurtainRailLabel={selectedRailLabel ? translatePrice(selectedRailLabel) : undefined}
          />
          <p className="estimate-note">{t("selectHelp")}</p>
          <p className="estimate-note">{priceT("statusUnverified")}</p>
        </aside>
      </div>
    </section>
  );
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="choice-fieldset">
      <legend>{legend}</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <ChoiceCard checked={value === option.id} id={`${name}-${option.id}`} key={option.id} label={option.label} name={name} onChange={() => onChange(option.id)} value={option.id} />
        ))}
      </div>
    </fieldset>
  );
}

function ChoiceCard({
  checked,
  id,
  label,
  name,
  onChange,
  value,
}: {
  checked: boolean;
  id: string;
  label: string;
  name: string;
  onChange: () => void;
  value: string;
}) {
  return (
    <label className={`choice-card ${checked ? "is-selected" : ""}`} htmlFor={id}>
      <input checked={checked} id={id} name={name} onChange={onChange} type="radio" value={value} />
      <span aria-hidden="true" className="choice-indicator" />
      <span className="choice-title">{label}</span>
      <span className="choice-subtitle">{useTranslations("pricing")("statusUnverified")}</span>
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="summary-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
