/*
 * Ishraq Chowdhury
 * File: tmdb.js
 * Assignment 4
 * October 23, 2026
 *
 * The API module for the app, written in plain JavaScript (no React)
 * It sets up one shared Axios instance that already knows TMDB's base URL
 * and sends the Bearer token on every request, then exports small helper
 * functions for the two requests the app makes: popular movies and movie
 * search. Both helpers take a page number (for "Load more") and an
 * AbortSignal (so App.jsx can cancel a request it no longer needs).
 * It also exports a helper for building TMDB image URLs.
 */

import axios from "axios";

// One pre-configured Axios instance. Every request made with `tmdb.get(...)`
// automatically starts with the baseURL and includes the Authorization header,
// so we never have to retype the long read-access token.
const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        // The token comes from the .env file (VITE_TMDB_TOKEN=...).
        // Vite only exposes variables that start with VITE_ to client code.
        // NOTE: this means the token ends up in the browser bundle, which is
        // fine for a class demo but NOT safe for a real production app.
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
});

// TMDB will not return anything past page 500 (error code 22 in their docs:
// "Pages start at 1 and max at 500"), so the app never asks for more than this.
export const MAX_PAGE = 500;

/*
 * Both list endpoints respond with the same JSON shape:
 * {
 *   page: 1,               // the page we just received
 *   results: [ ...movie objects (id, title, overview, poster_path, ...) ],
 *   total_pages: 52,       // how many pages exist in total
 *   total_results: 1031    // how many movies match in total
 * }
 * In the class demo we returned only `res.data.results`. For pagination we
 * now return the whole `res.data` object, because App.jsx needs `total_pages`
 * to know whether there is another page to load.
 */

// GET /movie/popular?page=N  ->  the current most popular movies
export const getPopularMovies = (page, signal) =>
    tmdb
        .get("/movie/popular", { params: { page }, signal })
        .then((res) => res.data);

// GET /search/movie?query=...&page=N  ->  movies whose titles match the query
// Axios turns the `params` object into the query string for us
// (and URL-encodes it, so spaces and symbols in the search are safe).
export const searchMovies = (query, page, signal) =>
    tmdb
        .get("/search/movie", { params: { query, page }, signal })
        .then((res) => res.data);

// TMDB image URLs are built from 3 pieces: base URL + size + file path.
// Example: https://image.tmdb.org/t/p/w342/1E5baAaEse26fej7uHcjOgEE2t2.jpg
// Common sizes: "w342" for posters in the grid, "w780" for wide backdrops.
const IMG_BASE = "https://image.tmdb.org/t/p";

export const imageUrl = (path, size = "w342") => `${IMG_BASE}/${size}${path}`;
