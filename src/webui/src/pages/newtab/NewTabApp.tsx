import React from "react";
import { useNTPBridge } from "./hooks/useNTPBridge";
import { NewTabPage } from "./NewTabPage";

export function NewTabApp(): React.JSX.Element | null {
  const { ready } = useNTPBridge();

  if (!ready) return null;

  return <NewTabPage />;
}
