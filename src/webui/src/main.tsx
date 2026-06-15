import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

// The HTML entry point (index.html) guarantees that the element with id "root" exists,
// so a non-null assertion here is safe.
const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
