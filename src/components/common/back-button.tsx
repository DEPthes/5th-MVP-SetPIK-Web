import type { ButtonHTMLAttributes, ReactNode } from "react";
import arrowLeftIcon from "@/assets/icons/ic-chevron-left.svg";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function BackButton({ children = "이전 단계로", className, type = "button", ...props }: BackButtonProps) {
  const buttonClassName = ["back-button", className].filter(Boolean).join(" ");

  return (
    <button className={buttonClassName} type={type} {...props}>
      <img src={arrowLeftIcon} alt="" />
      <span>{children}</span>
    </button>
  );
}
