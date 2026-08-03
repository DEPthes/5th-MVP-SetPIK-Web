import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "brand" | "accent" | "neutral" | "error" | "spotify" | "outline";
export type ButtonSize = "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = "brand",
  size = "medium",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || props["aria-disabled"] === true;
  const buttonClassName = [
    "button",
    variant === "brand" ? "" : `button--${variant}`,
    size === "large" ? "button--large" : "",
    fullWidth ? "button--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClassName} disabled={isDisabled} type={type} {...props}>
      {leadingIcon ? <span className="button__icon">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="button__icon">{trailingIcon}</span> : null}
    </button>
  );
}
