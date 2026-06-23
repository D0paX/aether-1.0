import React from "react";
import { useUIStore } from "../../store/uiStore";
import { GeneralSection } from "./sections/GeneralSection";
import { PrivacySection } from "./sections/PrivacySection";
import { AppearanceSection } from "./sections/AppearanceSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { SearchSection } from "./sections/SearchSection";
import { DownloadsSection } from "./sections/DownloadsSection";
import { ExtensionsSection } from "./sections/ExtensionsSection";
import { AboutSection } from "./sections/AboutSection";

const SECTIONS: Record<string, React.JSX.Element> = {
  general: <GeneralSection />,
  privacy: <PrivacySection />,
  appearance: <AppearanceSection />,
  performance: <PerformanceSection />,
  search: <SearchSection />,
  downloads: <DownloadsSection />,
  extensions: <ExtensionsSection />,
  about: <AboutSection />,
};

export function SettingsContent(): React.JSX.Element {
  const section = useUIStore((s) => s.settingsSection);

  return SECTIONS[section] ?? <GeneralSection />;
}
