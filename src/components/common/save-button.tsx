import type { ButtonHTMLAttributes } from "react";
import filledHeartIcon from "@/assets/icons/ic_heart_pink.svg";
import heartIcon from "@/assets/icons/ic_heart.svg";
import "./save-button.css";

interface SaveButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  isSaved: boolean;
  label?: string;
  variant?: "circle" | "label";
}

export function SaveButton({
  isSaved,
  label = "저장",
  variant = "circle",
  className,
  ...props
}: SaveButtonProps) {
  return (
    <button
      aria-label={`${label} ${isSaved ? "저장 취소" : "저장"}`}
      aria-pressed={isSaved}
      className={["save-button", `save-button--${variant}`, isSaved ? "save-button--active" : "", className].filter(Boolean).join(" ")}
      type="button"
      {...props}
    >
      <img alt="" src={isSaved ? filledHeartIcon : heartIcon} />
      {variant === "label" ? <span>{isSaved ? "저장됨" : label}</span> : null}
    </button>
  );
}
