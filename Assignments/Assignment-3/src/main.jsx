/*
  Ishraq Chowdhury
  File: main.jsx
  Assignment 3
  October 9, 2026
  Entry point that loads the styles and renders the Game component into the page
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/*
  Find the empty div with the id "root" in index.html and draw the app inside it
  StrictMode runs extra checks while developing to help catch mistakes
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
