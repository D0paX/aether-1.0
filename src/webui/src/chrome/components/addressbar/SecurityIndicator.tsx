import React from "react";
import { Lock, AlertTriangle, AlertOctagon, Globe } from "lucide-react";
import { SecurityLevel } from "../../../shared/types/navigation";

interface SecurityIndicatorProps {
  level: SecurityLevel;
}

interface IconConfig {
  Icon: React.ElementType;
  color: string;
  tooltip: string;
}

export function SecurityIndicator({ level }: SecurityIndicatorProps): React.JSX.Element {
  const getIconConfig = (): IconConfig => {
    switch (level) {
      case "secure":
        return {
          Icon: Lock,
          color: "var(--color-success)",
          tooltip: "Connection is secure"
        };
      case "warning":
        return {
          Icon: AlertTriangle,
          color: "var(--color-warning)",
          tooltip: "Connection not fully secure"
        };
      case "dangerous":
        return {
          Icon: AlertOctagon,
          color: "var(--color-danger)",
          tooltip: "Dangerous site"
        };
      case "none":
      default:
        return {
          Icon: Globe,
          color: "var(--color-text-tertiary)",
          tooltip: "No security info"
        };
    }
  };

  const { Icon, color, tooltip } = getIconConfig();

  return (
    <div 
      className="security-indicator"
      title={tooltip}
    >
      <Icon size={13} color={color} />
    </div>
  );
}
