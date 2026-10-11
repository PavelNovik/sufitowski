# PROJECT MEMORY

This file is the current source of truth for the project.

## Project Overview

### Name
Sufitowski.pl premium stretch-ceiling website refresh.

### Purpose
Present verified stretch-ceiling services/products, let visitors explore a room preview, prepare an estimate, and contact or share it.

### Target Users
Polish homeowners and prospective customers; exact geography and audience segmentation are not verified.

### Business Goal
Improve the current one-page site and provide an accessible, localized conversion path while preserving verified company facts and original calculator rules.

### Current Stage
Фазы 2, 3.1 и 3.2 реализованы. Фаза 3.2.1 подготовила реестр коммерческих вопросов. Калькулятор показывает только предварительный подытог доступных строк; полный коммерческий итог и соответствие утверждённым правилам не подтверждены.

## Product Requirements
See `docs/architecture.md`, `docs/seo-migration.md`, and `docs/calculator-source-audit.md`. The owner supplied quotation-specific rates from application no. 1 and authorized a separate temporary development price set. Neither source establishes a complete current official price list or the live calculator's full rules. Unexplained quotation subtotals remain unresolved.

## User Roles / Flows
Prospective customer: browse localized services, explore a room preview, configure an estimate, export/print/share the estimate, optionally contact the company. Contact-submission behavior needs owner clarification.

## Non-Functional Requirements
Responsive, accessible (WCAG 2.2 AA target), SEO-ready, deterministic calculations, no third-party transmission without explicit visitor action, deployable to Vercel.

## Tech Stack
Next.js 16.4.0 App Router, React 19.3.0, strict TypeScript 5.9.3, Tailwind CSS 4.3.3, next-intl 4.14.9, Zod 4.6.6, ESLint 10.12.0. Exact dependencies are pinned in `package.json`/`package-lock.json`. Playwright is deferred to the dedicated testing phase.

## Architecture
Реализованы локализованные маршруты App Router (`/` — польский, `/en`, `/ru`), серверные макеты и метаданные, шестишаговый клиентский калькулятор и типизированный каталог цен `src/config/pricing.ts`. Чистая функция `src/domain/quote.ts` строит предварительную смету по общему состоянию калькулятора; интерфейс не управляет ценами. Визуализатор использует то же состояние. `sessionStorage` сохраняет выбор между шагами и сменой языка в той же вкладке. Серверной и межустройственной синхронизации нет. Подробности — `docs/architecture.md`.

## Pricing Decision
Цены из сметы application no. 1 имеют статус `CONFIRMED_FROM_QUOTATION` только для точных названий позиций; это не подтверждение полного/актуального официального прайса. Временные ставки владельца — отдельные записи `TEMPORARY_PLACEHOLDER`. Центральный каталог хранит стабильный ID, ключ названия, единицу, цену PLN в гроше, статус, источник и категорию. Предварительный калькулятор применяет временные ставки к общим опциям матовой/глянцевой/сатиновой мембраны и стандартного точечного светильника; эти ставки не коммерческие. 303 Satin и похожие по названию услуги не связываются с общими опциями без явного правила. Показывается только сумма строк с рассчитанной ценой, полный итог недоступен. 2026-10-12 в публичном inline JS обнаружена точная причина 26 м: ввод сантиметров переводится в метры, площадь рассчитывается корректно, а показатель, подписанный «периметр», равен `area * 1.3`, округлённому до 0,1. Для 20 м² это 26 м; для прямоугольника 4×5 м геометрический периметр равен 18 м. Это исходная эвристика, её коммерческая корректность владельцем не утверждена и в новый расчёт не перенесена. Не выводятся правила монтажа потолка, налогов, минимумов и коммерческого округления. Реестр вопросов: `docs/commercial-acceptance-checklist.md`; справочник и fixture — `docs/calculator-source-audit.md` и `docs/fixtures/quotation-application-1.json`.

## Project Structure
`src/app`, `src/components`, `src/config`, `src/i18n`, `src/lib`, localized `messages/`, and `public/images/` now contain the phase 2 application foundation. Discovery documents and team files are preserved. Git is initialized on `main` and tracks the production subset; the currently audited docs/worktree have local modifications/untracked material. Phase 3.2.1 performed no Git operation.

## Database / API / Authentication / Authorization
None planned for the initial version. Contact submission behavior needs an owner decision before selecting a service.

## UI/UX
Premium, architectural, responsive and conversion-focused; implement one polished room scene first and preserve keyboard and accessibility requirements. See architecture plan.

## Dependencies / Environment
Node 24.11.1, npm 11.6.2, pnpm 10.30.1 were present. Versions checked and dependencies installed from npm; lockfile generated in the workspace. `.env.example` documents `NEXT_PUBLIC_SITE_URL`; no secrets are required. npm reported five high-severity advisories in the development-only Next ESLint dependency chain (`braces` → `micromatch` → `fast-glob` → `@next/eslint-plugin-next`); no automatic major-version downgrade was applied. The audit's proposed fix downgrades the Next ESLint config to an incompatible major. A production-only dependency audit remains outstanding.

## Development Status

### Completed
2026-10-11: inspected the live homepage and six-step calculator in a real browser. See `docs/calculator-source-audit.md` for observed inputs/options and unverified rules, and `docs/seo-migration.md` for content, URL and crawl-resource assessment.
2026-10-11: created Next.js/TypeScript/Tailwind/next-intl foundation, localized route shells, design tokens/components, six-step calculator shell, provenance-aware pricing catalog and visualizer interface. `npm run lint`, `npm run typecheck`, and `npm run build` all pass. Build required an explicit project-local SWC cache outside sandbox because default cache ACLs were rejected. First build revealed a missing pricing translation namespace, corrected before successful rerun. See README for commands and implementation boundaries.

### In Progress
Фаза 3.2 прошла lint, typecheck, production build, арифметическую проверку quotation fixture и ручной production-smoke в PL/EN/RU (исторические проверки от 2026-10-11). Фаза 3.2.1 документально выявила в текущем публичном исходном скрипте формулу `площадь × 1,3` для значения, подписанного «периметр». Реестр вопросов подготовлен; ответы владельца и коммерческая приёмка ожидаются. Playwright не настроен; полная проверка доступности и дополнительных устройств остаётся.

### Next
Перед коммерческой приёмкой получить ответы/датированный официальный прайс по P0 вопросам из `docs/commercial-acceptance-checklist.md`: подтвердить или заменить эвристику профиля, состав обязательных расходов, монтаж, налоги, минимумы, округление, маппинг опций и расшифровку fixture/разницу 0,10 PLN. Затем зафиксировать утверждённые примеры и отдельной разрешённой фазой реализовать и покрыть правила тестами. Контактная форма и права на фото проектов также требуют решения владельца.

### Blocked
Коммерческая приёмка/price parity ожидает ответы владельца и полный прайс/правила. Публичная страница позволила read-only изучить inline-логику геометрии; стоимость исходного калькулятора по-прежнему закрыта формой с персональными данными, её не отправляли. Цены quotation-confirmed ограничены конкретными строками application no. 1; placeholders разрешены только для разработки. Права на использование изображений публичного сайта не подтверждены.

## Known Issues
`/robots.txt` and `/sitemap.xml` returned 404 in the browser on 2026-10-11. Recheck during implementation. Application no. 1's displayed subtotals add to 7,471.90 PLN, while its stated total is 7,472.00 PLN; the 0.10 PLN difference is unexplained. Its visible quantities/rates also do not unambiguously explain the material subtotal.
Исходный калькулятор для 400×500 см показывает площадь 20 м² и 26 м под подписью периметра, поскольку публичный JS считает `area * 1.3`; это не геометрический периметр (18 м). Формула известна, но её коммерческий смысл не подтверждён. Метраж профиля в новом калькуляторе не рассчитывается до утверждения владельцем правила.
Npm audit reports five high-severity findings in the development-only Next ESLint dependency chain; do not downgrade Next ESLint to the audit's suggested Next 14 version. A production-only audit is still needed. On this Windows host Next build needs `SWC_NATIVE_BINDING_CACHE` set to a project-local cache and must run outside sandbox because default cache ACLs are rejected.

## Technical Debt
Ограничения визуализатора: фиксированная перспектива одной комнаты, приблизительные профили/карнизы/материалы и отсутствие автоматизированных браузерных тестов. Калькулятор показывает только сумму позиций с временными ценами; подтверждённая полная коммерческая смета заблокирована до получения правил, полного прайса и ожидаемых контрольных примеров. Реестр согласования: `docs/commercial-acceptance-checklist.md`.

## Architectural Decisions
No accepted ADRs. See `docs/architecture.md` for recommendations pending review.

## Testing Strategy
See `docs/testing.md` and `docs/fixtures/quotation-application-1.json`. Lint, typecheck, production build and `npm run verify:quotation` pass after Phase 3.2. The fixture remains unchanged; independently established arithmetic is documented in the calculator audit and README. Playwright scenarios are deferred to the testing phase.

## Deployment
Production subset was pushed to the configured GitHub `origin/main` in a prior phase (commit `6137ddec949439c517ee6e4b635c90e2b33d55df`). Phase 3.2.1 made no Git/push/deploy changes. Target remains Vercel preparation; do not deploy without owner approval.

## Change Log
- Project Memory initialized.
- 2026-10-11: Phase 1 discovery documented; active roles updated in `TEAM.md`. No application implementation started pending review of unresolved business facts and calculator source access.
- 2026-10-11: Owner supplied quotation-specific prices from application no. 1 and authorized a separate temporary development price list. Updated calculator audit, exact-grosz fixture and remaining pricing questions; no application code changed.
- 2026-10-11: Phase 2 app foundation and design system created; routes, localized metadata, pricing status schema, calculator shell and visualizer interface added. Git remains uninitialized.
- 2026-10-11: Fixed a missing namespace when rendering pricing catalog labels; lint, typecheck, and production build pass. README and project memory record validation and commercial-rule gaps.
- 2026-10-11: Фаза 3.1: добавлена отдельная сцена пустой комнаты с бетонным потолком (PNG-источник и оптимизированная WebP), перспективная SVG-маска и интерактивные слои отделки, цвета, профиля, светильников, LED и карниза. Выборы связаны с состоянием калькулятора и сохраняются в `sessionStorage` между шагами и локалями одной вкладки. Ручная проверка подтвердила EN/RU/PL переключение с сохранением конфигурации, мобильный порядок элементов без переполнения страницы и клавиатурный выбор отделки/цвета. `npm run lint`, `npm run typecheck`, `npm run build` успешны. Ценовые записи и коммерческие правила не менялись.
- 2026-10-11: Фаза 3.2: добавлена чистая модель `src/domain/quote.ts` и локализованная разбивка предварительной сметы. Используются только прямые временные цены для общих вариантов полотна и стандартных точечных светильников; подтверждённые специальные варианты не сопоставляются с похожими опциями без правила. Неподтверждённые строки отображаются без суммы, итог полной сметы скрыт; применена точная арифметика в гроше, дробная доля гроша не округляется. Добавлена команда `npm run verify:quotation`; fixture не изменялся. Коммерческие неизвестные и ограничения описаны в аудите.
- 2026-10-11: Фаза 3.2 прошла `npm run lint`, `npm run typecheck`, `npm run verify:quotation`, `npm run build` и ручной production-smoke в PL/EN/RU. В проверке 400×500 см учтен источник-расходящийся периметр: исходная страница показывает 26 м, прямоугольная геометрия даёт 18 м, поэтому метраж профиля не выводится.
- 2026-10-12: Фаза 3.2.1: выполнен аудит конфигурации, quote-функции, состояния и fixture; создан `docs/commercial-acceptance-checklist.md`. В публичном inline JS установлено, что 26 м для 400×500 см получаются как `area * 1.3`, после перевода сантиметров в метры и расчёта 20 м². Формула исходного интерфейса известна, коммерческая применимость — нет. Fixture и код/ставки не менялись; тесты повторно не запускались; форма с персональными данными не отправлялась. Активная команда обновлена в `TEAM.md`.
