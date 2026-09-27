import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initTheme } from "./components/ThemeToggle.jsx";
import "./index.css";

initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);