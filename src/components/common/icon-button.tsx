import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./icon-button.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  children: ReactNode;
}

export function IconButton({ className, children, type = "button", ...props }: IconButtonProps) {
  const buttonClassName = ["icon-button", className].filter(Boolean).join(" ");

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  );
}
