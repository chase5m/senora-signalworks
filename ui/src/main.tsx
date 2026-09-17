import React from "react";
import ReactDOM from "react-dom/client";
import "./fonts.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/rajdhani/latin-600.css";
import "@fontsource/rajdhani/latin-700.css";
import "./styles.css";
import { ChaseApp } from "./App";
import { ChaseDashboardOverlay } from "./DashboardOverlay";
import "./redesign.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChaseApp />
    <ChaseDashboardOverlay />
  </React.StrictMode>,
);
