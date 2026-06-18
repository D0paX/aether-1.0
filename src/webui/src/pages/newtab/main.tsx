import React from "react";
import { createRoot } from "react-dom/client";
import "../../styles/globals.css";
import "./newtab.css";
import { NewTabApp } from "./NewTabApp";

const root = document.getElementById("root");
if (!root) throw new Error("NTP root element not found");
createRoot(root).render(
  <React.StrictMode>
    <NewTabApp />
  </React.StrictMode>
);
