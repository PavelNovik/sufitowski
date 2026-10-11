export const siteConfig = {
  name: "Sufitowski.pl",
  origin: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sufitowski.pl",
  phone: "+48452873799",
  phoneDisplay: "+48 452 873 799",
  locales: ["pl", "en", "ru"] as const,
} as const;

export type PageSlug =
  | "about"
  | "services"
  | "calculator"
  | "projects"
  | "guides"
  | "contact";

export const pageSlugs: readonly PageSlug[] = [
  "about",
  "services",
  "calculator",
  "projects",
  "guides",
  "contact",
];

export function isPageSlug(value: string): value is PageSlug {
  return pageSlugs.some((slug) => slug === value);
}
