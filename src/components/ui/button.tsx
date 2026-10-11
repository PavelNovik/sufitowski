import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "text";

const buttonClasses: Record<Variant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  text: "button button-text",
};

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${buttonClasses[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={`${buttonClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
