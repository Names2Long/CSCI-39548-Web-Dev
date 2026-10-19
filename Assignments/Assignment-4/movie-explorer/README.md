<!--
  Ishraq Chowdhury
  File: README.md
  Assignment 4
  October 23, 2026

  Describes the project and explains how to run it locally.
-->

# Movie Explorer (Assignment 4)

A small React + Vite app that uses the [TMDB API](https://developer.themoviedb.org/docs/getting-started) to show popular movies and search for any title. It builds on the Class 13 API demo.

## Assignment 4 additions

1. **Empty state**: a search with no matches shows “No results for ‘…’” with a button back to popular movies (`src/App.jsx`).

2. **Movie detail view**: clicking a card opens a modal built on the native `<dialog>` element, showing the backdrop, poster, release date, rating, language, and the `overview` field (`src/components/MovieDetail.jsx`). It closes with the × button, the Escape key, or a click outside the panel.

3. **Load more**: uses TMDB’s `page` query parameter and the `total_pages` field of the response to fetch and append the next page (`src/api/tmdb.js`, `src/App.jsx`). Duplicate movies across pages are skipped, and TMDB’s 500-page limit is respected.

4. **Mobile accessibility with CSS Grid**: the movie grid uses `repeat(auto-fill, minmax(...))`, so the column count adapts to the screen width without media queries. The modal uses `grid-template-areas` to rearrange itself between phone and desktop layouts, and it becomes full-screen on phones. Buttons and inputs are at least 44px tall for thumbs (`src/App.css`, `src/index.css`).

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173/.

The `.env` file is listed in `.gitignore`, so the token is never committed. If you change `.env` while the dev server is running, restart `npm run dev`.

## Built with

React, Vite, and Axios.

This product uses the TMDB API but is not endorsed or certified by TMDB.
