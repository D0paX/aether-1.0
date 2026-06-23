import React from "react";
import {
  Sliders,
  Shield,
  Palette,
  Zap,
  Search,
  Download,
  Package,
  Info,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import "./SettingsNav.css";

const NAV_ITEMS = [
  { key: "general", label: "General", icon: Sliders },
  { key: "privacy", label: "Privacy", icon: Shield },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "performance", label: "Performance", icon: Zap },
  { key: "search", label: "Search", icon: Search },
  { key: "downloads", label: "Downloads", icon: Download },
  { key: "extensions", label: "Extensions", icon: Package },
  { key: "about", label: "About Aether", icon: Info },
];

export function SettingsNav(): React.JSX.Element {
  const settingsSection = useUIStore((state) => state.settingsSection);
  const setSettingsSection = useUIStore((state) => state.setSettingsSection);

  return (
    <div className="settings-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = settingsSection === item.key;

        return (
          <div
            key={item.key}
            className={`settings-nav-item ${isActive ? "active" : ""}`}
            onClick={() => {
              setSettingsSection(item.key);
            }}
          >
            <div className="settings-nav-icon">
              <Icon size={15} />
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
