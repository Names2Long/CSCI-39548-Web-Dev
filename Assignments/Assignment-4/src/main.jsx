/*
 * Ishraq Chowdhury
 * File: main.jsx
 * Assignment 4
 * October 23, 2026
 *
 * The entry point of the React app (Vite loads this from index.html).
 * It loads the global styles, then renders the App component into the
 * <div id="root"> element in index.html.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// StrictMode runs extra checks in development only (for example, it runs
// effects twice to help catch missing cleanup functions).
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
