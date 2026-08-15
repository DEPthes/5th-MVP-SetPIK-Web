import { Link, type LinkProps } from "react-router-dom";
import type { ReactNode } from "react";
import arrowLeftIcon from "@/assets/icons/ic_chevron_left_thick.svg";
import "./back-button.css";

interface BackLinkProps extends LinkProps {
  children: ReactNode;
}

export function BackLink({ children, className, ...props }: BackLinkProps) {
  const linkClassName = ["back-button", className].filter(Boolean).join(" ");

  return (
    <Link {...props} className={linkClassName}>
      <img src={arrowLeftIcon} alt="" />
      <span>{children}</span>
    </Link>
  );
}
