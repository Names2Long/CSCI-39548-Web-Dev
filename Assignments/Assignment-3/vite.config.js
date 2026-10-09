/*
  Ishraq Chowdhury
  File: vite.config.js
  Assignment 3
  October 9, 2026
  Configures Vite to build and serve the React app
*/

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The React plugin lets Vite understand JSX and reload the page when files change
export default defineConfig({
  plugins: [react()],
});
