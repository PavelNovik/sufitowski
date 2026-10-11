# Existing calculator source audit

**Audit date:** 2026-10-12 (Europe/Minsk; source implementation re-inspected)
**Source:** [https://sufitowski.pl/](https://sufitowski.pl/)
**Method:** interactive inspection in a real browser. No contact data was submitted.

**Pricing update:** The project owner supplied values from a Sufitowski quotation (application no. 1) on 2026-10-11. These are confirmed as values appearing in that quotation only; they are not a complete or necessarily current official price list. The source screenshot itself was not available as a separate workspace file during this update; the recorded values below are transcribed from the owner's message.

## Scope and outcome

The calculator is embedded in the homepage and presents six stages: room size, material, profile, lighting, curtain rails, and result. The homepage hero says “5 prostych kroków” while the calculator has six progress labels; record as a source inconsistency to resolve during content migration.

The live calculator does not reveal its own amount until a visitor enters a name and phone number, checks a consent box, and submits “Pokaż koszt.” Since that would transmit personal data to the company, no sample submission was made. The owner-provided quotation below supplies some product/service prices and one reference total, but does not explain all quantities/subtotals or establish the live calculator's complete pricing rules. **This audit does not establish price parity or a complete current official price list.**

## Owner-provided quotation prices — confirmed for this quotation only

Source: owner-provided screenshot transcription of a Sufitowski quotation, application no. 1. Amounts are confirmed as shown in that quotation; availability, current validity, tax treatment, and broader product equivalence are not established.

| Stable proposed ID | Quotation item | Unit price | Unit | Status / scope |
|---|---|---:|---|---|
| `material-303-satin-500-salon-kitchen` | 303 Satin 500 — salon / kuchnia | 100 PLN | m² | `CONFIRMED_FROM_QUOTATION`; exact named variant only |
| `material-303-satin-320-bedroom` | 303 Satin 320 — sypialnia | 90 PLN | m² | `CONFIRMED_FROM_QUOTATION`; exact named variant only |
| `material-303-satin-320-bathroom-1` | 303 Satin 320 — łazienka 1 | 90 PLN | m² | `CONFIRMED_FROM_QUOTATION`; exact named quotation line only; do not infer all bathrooms/variants |
| `service-shadow-profile-cien-standart` | Cień standart | 40 PLN | linear metre | `CONFIRMED_FROM_QUOTATION`; preserve source spelling in provenance |
| `service-additional-corners` | Dodatkowe narożniki | 30 PLN | piece | `CONFIRMED_FROM_QUOTATION` |
| `service-surface-mounted-curtain-rail` | Karnisz nadtynkowy | 80 PLN | linear metre | `CONFIRMED_FROM_QUOTATION` |
| `service-concealed-curtain-rail` | Karnisz schowany | 275 PLN | linear metre | `CONFIRMED_FROM_QUOTATION`; distinct from similarly named placeholder entry below |
| `service-led-line-30mm` | Linia LED 30 mm | 235 PLN | linear metre | `CONFIRMED_FROM_QUOTATION` |
| `service-lighting-installation` | Montaż oświetlenia | 120 PLN | piece | `CONFIRMED_FROM_QUOTATION`; do not generalize to ceiling installation |

Do not treat these named material prices as generic satin prices or infer that similarly named products share a rate. These are quotation observations, not owner confirmation of a complete official price list.

## Authorized temporary development prices

The project owner authorized the following placeholders for development. They must be stored separately from quotation-confirmed prices, carry status `TEMPORARY_PLACEHOLDER`, and never be represented as verified official commercial rates. Any estimate containing them must be labeled preliminary. In development mode, affected line items should be visibly or otherwise clearly marked as placeholders.

| Stable proposed ID | Development item | Unit price | Unit | Status / note |
|---|---|---:|---|---|
| `placeholder-membrane-white-matte` | White matte ceiling membrane | 90 PLN | m² | `TEMPORARY_PLACEHOLDER`; generic only |
| `placeholder-membrane-glossy` | Glossy ceiling membrane | 100 PLN | m² | `TEMPORARY_PLACEHOLDER`; generic only |
| `placeholder-membrane-satin` | Satin ceiling membrane | 95 PLN | m² | `TEMPORARY_PLACEHOLDER`; generic only, does not replace any named 303 Satin quotation entry |
| `placeholder-additional-profile` | Additional profile | 35 PLN | linear metre | `TEMPORARY_PLACEHOLDER` |
| `placeholder-spotlight` | Spotlight | 120 PLN | piece | `TEMPORARY_PLACEHOLDER` |
| `placeholder-led-strip-no-profile` | LED strip without profile | 60 PLN | linear metre | `TEMPORARY_PLACEHOLDER` |
| `placeholder-led-power-supply` | LED power supply | 150 PLN | piece | `TEMPORARY_PLACEHOLDER` |
| `placeholder-concealed-curtain-rail` | Concealed curtain rail | 275 PLN | linear metre | `TEMPORARY_PLACEHOLDER`; keep separate from `service-concealed-curtain-rail`, even though the amount/unit match |

No separate ceiling installation charge is authorized; do not add one until its price rule is confirmed. Temporary values are not permission to invent tax, installation, minimum, rounding, or other commercial rules.

## Quotation application no. 1 — reference fixture and arithmetic

Machine-readable fixture: [`fixtures/quotation-application-1.json`](fixtures/quotation-application-1.json). It records visible values and expected checks, not invented line quantities.

| Check | Arithmetic | Outcome |
|---|---|---|
| Material subtotal against stated area and a single quoted rate | 39.85 m² × 100 PLN/m² = 3,985.00 PLN; × 90 PLN/m² = 3,586.50 PLN | Neither equals 3,829.90 PLN. The quotation lists different named materials, but visible information supplied here does not unambiguously establish their exact applied quantities/rates or explain the subtotal. |
| Services/materials subtotal | 3,642.00 PLN | Stated subtotal; cannot independently recompute without unambiguous line quantities and aggregation rules. |
| Sum of displayed subtotals | 3,829.90 + 3,642.00 = 7,471.90 PLN | Independently established from provided values. |
| Stated total | 7,472.00 PLN | Differs from displayed subtotal sum by 0.10 PLN. Rounding or another adjustment is unknown; do not invent one. |

The visible rounded quantities and line prices do not unambiguously explain every subtotal. Retain the fixture as a comparison input, but do not force quote code to reproduce 3,829.90 or 7,472.00 using inferred quantities, hidden fees, tax, or rounding. Only the arithmetic checks above are currently established.

## Observed dimensions and geometry

| Item | Observation | Status |
|---|---|---|
| Length input | Centimeters | CONFIRMED |
| Width input | Centimeters | CONFIRMED |
| Slider | 1–100 m² labels; initial value 1 m² | CONFIRMED as UI range/initial state |
| Calculation example | 400 cm × 500 cm produced 20.0 m² and 26.0 m.b. | CONFIRMED as visible UI output; source formula for 26 is identified below |
| Area formula | converted length × converted width; input centimetres are divided by 100 before state storage | CONFIRMED in the current public inline application script |
| Source value labelled perimeter | `area * 1.3`, rounded with `toFixed(1)` and parsed back to a number | CONFIRMED in the current public inline application script; 20 × 1.3 = 26.0. This is an area-based heuristic mislabeled as perimeter, not a geometry formula |
| Geometric rectangle perimeter | `2 × (length + width)` using converted metre dimensions | 18 m for 400 × 500 cm; mathematically established, but do not substitute it for commercial profile quantity without owner approval |
| Geometry support | Length and width only; no corners, obstacles or non-rectangular controls observed | CONFIRMED for inspected UI; complex geometry UNVERIFIED |
| Input bounds and commercial minimum | Input has `min=0`, `step=1`; parsed centimetres are divided by 100. Slider is integer 1–100 m². Commercial minimum, price rounding and quote rounding remain unknown. | Partially observed; commercial rules UNVERIFIED |

The sample showed 400 and 500 as accepted values, and the next button became enabled. This only establishes that this configuration advances; it does not establish complete validation behavior.

**Source-code finding (2026-10-12):** inspected the public inline application script in the browser without submitting contact data. State initializes `length` and `width` in metres. `onLengthInput` / `onWidthInput` parse the centimeter field and divide by 100. `calculateTotal` derives `area = state.length * state.width`, then computes `perimCostBase = parseFloat((area * 1.3).toFixed(1))`; the size-step renderer and slider display use the same `area * 1.3` rule. Thus 400 × 500 cm → 4 × 5 m → 20 m² → 26.0 displayed “m.b.” The slider instead chooses an integer area from 1–100 m², derives a square room with `sqrt(area)` rounded to two decimals, and its displayed/estimated “perimeter” is still area × 1.3. The source does not reveal a geometric calculation or additional-corner state explaining 26 m. The current code's implementation behavior is now identified; whether the owner intends this heuristic commercially remains unverified. The new calculator correctly leaves profile quantity and amount unresolved pending approval.

## Options and rules visible in the UI

| Stage | Visible options/controls | Pricing or rule evidence |
|---|---|---|
| Material | Połysk, Mat, Satyna, Czarny połysk, Nadruk, Gwieździste niebo | “Cena za m² się zmienia” confirms material affects area pricing. Rates and conditional rules UNVERIFIED. Default was Połysk. |
| Profile | Standard, Standard cieniowy, EuroKraab, Podświetlany | Standard card displays “Profil 15 zł + wkładka 15 zł”; unit/conditions and other prices are UNVERIFIED. Stage says quote is calculated from room perimeter. Default was Standard. |
| Lighting | Oprawa punktowa, Lampa standard, Lampa premium, Linia świetlna LED (m.b.), Oprawa punktowa premium, Szyna magnetyczna premium (m.b.) | Multiple options can be chosen. Count/length steppers shown. Prices and quantity rules UNVERIFIED. |
| Curtain rails | Bez karnisza, Karnisz sufitowy standard, Ukryty karnisz premium, Ukryty karnisz LUXURY | Stage requests type and length; observed UI did not show a length field until a type is selected, which was not tested. Prices/rules UNVERIFIED. |
| Result | Requires name, phone, consent, then “Pokaż koszt” | Price is withheld until submission; result line item breakdown and total UNVERIFIED. |

## Representative configuration tested

Entered 400 × 500 cm (20.0 m², 26.0 m.b.), kept default gloss material and standard profile, selected four standard spotlights, retained no curtain rail, and advanced to the result gate. The page displayed a summary of material, profile and four spots. It then requested a phone number and consent to disclose the estimate. No price was shown and no data was submitted.

| Expected vs observed | Result |
|---|---|
| Geometry outputs for the sample | Match formulas above |
| Quote amount and itemized prices | Not observable; UNVERIFIED |
| Representative price comparison against new implementation | BLOCKED pending source price access |

## Source inconsistencies / questions

- “5 simple steps” conflicts with six calculator stages.
- The material step says price changes by m²; the profile step says calculation uses perimeter. The actual rate units and full formulas are not displayed at the accessible stages.
- The visible Standard card mentions 15 zł for profile plus 15 zł for insert but does not unambiguously identify the unit or scope in the accessible text.
- Live result requires personal data before revealing the live-calculator amount. Owner quotation prices provide an initial source but not the complete official price/rule sheet or live calculator parity evidence.
- Ceiling installation charges, measurement fees, minimum order, tax treatment, rounding, discounts, surcharges, and site-measurement adjustments were not verified.
- Application no. 1 visible quantities/prices do not unambiguously explain the stated subtotals, and the displayed subtotal sum differs from the stated total by 0.10 PLN.
- Confirm the current official catalog, availability and mapping from live calculator choices to quotation-specific product variants.

## Needed for parity

The current public inline script has been inspected without submitting contact details, and the 26 m formula is identified. A dated complete official price/rule list is still needed, including mapping of quotation lines to calculator options, ceiling/profile installation rates, tax treatment, minimums, rounding, conditional charges and expected calculator examples. Clarify the unexplained 0.10 PLN total difference and quotation subtotals. Encode quotation values as `CONFIRMED_FROM_QUOTATION`, not as a complete current official list; encode authorized temporary values separately as `TEMPORARY_PLACEHOLDER`. Do not claim full price parity.

## Phase 3.2 — preliminary estimate implementation

The calculator now displays a localized line breakdown on its result step. It calculates a **priced-item subtotal only** from the generic matte, gloss and satin membrane placeholders and the generic spotlight placeholder. Those entries remain `TEMPORARY_PLACEHOLDER` and are labelled as development estimates; they are not official rates. This subtotal is not a complete quote or guaranteed final price.

The visible source-site product choices have not been proven equivalent to the quotation's named 303 Satin variants or similarly named services. Therefore, quotation-confirmed entries are not silently mapped to generic choices. Unverified selected profiles, lighting and curtain rails are listed without an amount; rail length is not captured in the current UI. No tax, ceiling installation, minimum, waste, discount or rounding rule is added. The interface states that required costs may be absent and withholds a complete total. A line whose exact calculation would yield a fraction of a grosz is also withheld pending an approved rounding rule.

The untouched `quotation-application-1.json` fixture is checked by `npm run verify:quotation`. The check verifies the sum of visible subtotals (747,190 grosz), its 10-grosz difference from the stated total, the 39.85 m² single-rate comparisons (398,500 grosz at 100 PLN/m²; 358,650 grosz at 90 PLN/m²), and the fixture's quotation-price statuses. It intentionally does not reconcile the unexplained material subtotal or stated total.

Remaining commercial unknowns: complete current official price list and availability; mapping from calculator options to exact quotation products; ceiling and profile installation rates/rules; lighting installation applicability; tax treatment; minimum order; measurement, waste and other possible charges; rail length and quantity rules; rounding; and the quotation's visible line/subtotal relationship and 0.10 PLN discrepancy.
