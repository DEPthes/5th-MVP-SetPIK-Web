import type { ReactNode } from "react";
import "./status-state.css";

interface StatusStateProps {
  action: ReactNode;
  className?: string;
  description: string;
  icon: string;
  title: string;
  titleId: string;
}

export function StatusState({ action, className, description, icon, title, titleId }: StatusStateProps) {
  const statusClassName = ["status-state", className].filter(Boolean).join(" ");

  return (
    <div className={statusClassName}>
      <div className="status-state__content">
        <span className="status-state__icon" aria-hidden="true">
          <img src={icon} alt="" />
        </span>
        <div className="status-state__message">
          <h1 className="text-heading-1" id={titleId}>{title}</h1>
          <p className="text-title-2">{description}</p>
        </div>
      </div>
      <div className="status-state__action">{action}</div>
    </div>
  );
}
