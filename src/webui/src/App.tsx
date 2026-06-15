import React from "react";
import { useTheme } from "./chrome/hooks/useTheme";
import AppShell from "./chrome/components/AppShell";

/**
 * Root application component.
 * Mounts the core layout grid container AppShell.
 */
export default function App(): React.JSX.Element {
  useTheme();

  return <AppShell />;
}
