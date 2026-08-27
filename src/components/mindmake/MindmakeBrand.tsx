import { Link, useLocation } from "react-router-dom";
import mindmakeWordmark from "@/assets/mindmake-wordmark.png";
import mindmakeIcon from "@/assets/mindmaker-icon.png";

interface MindmakeBrandProps {
  light?: boolean;
}

export function MindmakeBrand({ light = false }: MindmakeBrandProps) {
  const location = useLocation();
  const homeTarget = location.pathname === "/" ? "#top" : "/#top";

  return (
    <Link className="mm-brand" to={homeTarget} aria-label="Mindmake home">
      <img className="mm-brand-icon" src={mindmakeIcon} alt="" aria-hidden="true" />
      <img
        className={`mm-brand-wordmark${light ? " is-light" : ""}`}
        src={mindmakeWordmark}
        alt="Mindmake"
      />
    </Link>
  );
}
