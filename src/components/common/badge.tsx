import type { HTMLAttributes, ReactNode } from "react";
import "./badge.css";

export type BadgeTone = "accent" | "brand" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = "accent", className, children, ...props }: BadgeProps) {
  const badgeClassName = ["badge", `badge--${tone}`, className].filter(Boolean).join(" ");

  return (
    <span className={badgeClassName} {...props}>
      {children}
    </span>
  );
}
