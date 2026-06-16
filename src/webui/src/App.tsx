import React from "react";
import { useTheme } from "./chrome/hooks/useTheme";
import { useTabKeyboard } from "./chrome/hooks/useTabKeyboard";
import AppLayout from "./chrome/components/layout/AppLayout";

/**
 * Root application component.
 * Mounts the core layout container AppLayout.
 */
export default function App(): React.JSX.Element {
  useTheme();
  useTabKeyboard();

  return <AppLayout />;
}
