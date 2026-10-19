/*
 * Ishraq Chowdhury
 * File: App.jsx
 * Assignment 4
 * October 23, 2026
 *
 * Defines the App component, which holds all of the app's state and logic.
 * It loads popular movies when the page opens, runs a TMDB search when the
 * search form is submitted, and shows the results in a grid of MovieCards.
 * Assignment 4 additions handled here:
 *   1. Empty state: "No results for '...'" when a search finds nothing.
 *   2. Detail view: tracks which movie was clicked and opens MovieDetail.
 *   3. Pagination: a "Load more" button that requests the next TMDB page
 *      (using the `page` param) and adds those movies to the end of the grid.
 * It also shows loading and error messages, with a "Try again" button.
 */

import { useEffect, useState } from "react";
import { isCancel } from "axios";
import { getPopularMovies, searchMovies, MAX_PAGE } from "./api/tmdb";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";
import "./App.css";

// Picks a helpful error message based on what went wrong with the request.
function getErrorMessage(err, isFirstPage) {
    // 401 = TMDB rejected our token (usually a missing or wrong .env value).
    if (err.response?.status === 401) {
        return "TMDB rejected the API token. Check VITE_TMDB_TOKEN in your .env file, then restart the dev server.";
    }
    return isFirstPage
        ? "Couldn't load movies. Check your connection and try again."
        : "Couldn't load more movies. Check your connection and try again.";
}

export default function App() {
    // The movie objects currently shown in the grid (from the API responses).
    const [movies, setMovies] = useState([]);
    // Whether a request is in progress, so we can show "Loading…".
    const [loading, setLoading] = useState(true);
    // An error message to show the user, or null if everything worked.
    const [error, setError] = useState(null);

    // query = what's typed in the box right now (updates on every keystroke).
    // search = what was actually submitted (only changes when the form is
    // submitted, so we don't call the API on every single keystroke).
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState("");

    // --- Pagination state (new for Assignment 4) ---
    // Which TMDB page we want. Page 1 replaces the grid; pages 2+ are added on.
    const [page, setPage] = useState(1);
    // How many pages TMDB says exist for the current list (from total_pages).
    const [totalPages, setTotalPages] = useState(0);
    // How many movies match in total (from total_results), for the results count.
    const [totalResults, setTotalResults] = useState(0);
    // Bumping this number forces the effect to run again even when the search
    // and page stay the same (used by "Try again" and by re-submitting a search).
    const [reloadKey, setReloadKey] = useState(0);

    // --- Detail view state (new for Assignment 4) ---
    // The movie whose details are open in the modal, or null if it's closed.
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Effect: fetch movies whenever the search, the page, or the reloadKey changes.
    // Note: setLoading(true) / setError(null) are NOT called here. They're called
    // in the event handlers below (the click/submit that causes the new request),
    // because React's lint rules (and the Class 11/12 slides) say state updates
    // that can happen in an event handler should happen there, not in an effect.
    // `loading` already starts as true, which covers the very first request.
    useEffect(() => {
        // Lets us cancel this request if the effect re-runs before it finishes
        // (e.g. the user submits a new search while a page is still loading).
        const controller = new AbortController();

        // Search results if there's a submitted search, otherwise popular movies.
        const request = search
            ? searchMovies(search, page, controller.signal)
            : getPopularMovies(page, controller.signal);

        request
            .then((data) => {
                setMovies((prevMovies) => {
                    // Page 1 means a brand new list, so replace what was there.
                    if (page === 1) return data.results;

                    // Pages 2+ get added to the end. The popular list can shift
                    // slightly between requests, so the same movie sometimes shows
                    // up on two pages. Skipping ids we already have prevents
                    // duplicate cards (and React's duplicate `key` warning).
                    const existingIds = new Set(prevMovies.map((m) => m.id));
                    const newMovies = data.results.filter((m) => !existingIds.has(m.id));
                    return [...prevMovies, ...newMovies];
                });
                setTotalPages(data.total_pages);
                setTotalResults(data.total_results);
                setLoading(false);
            })
            .catch((err) => {
                if (isCancel(err)) return; // ignore requests we aborted ourselves
                // If the first page failed, clear out the old results so the
                // user doesn't mistake an old list for the new one.
                if (page === 1) setMovies([]);
                setError(getErrorMessage(err, page === 1));
                setLoading(false);
            });

        // Cleanup: abort the request if the effect re-runs or App unmounts.
        return () => controller.abort();
    }, [search, page, reloadKey]);

    // --- Event handlers ---
    // Shows "Loading…" and clears any old error, right when a request starts.
    const startLoading = () => {
        setLoading(true);
        setError(null);
    };

    // Starts over at page 1 for a search ("" means popular movies).
    const loadFirstPage = (newSearch) => {
        startLoading();
        setSearch(newSearch);
        setPage(1); // every new search starts back at the first page
        // If the user re-submits the exact same search while on page 1, neither
        // `search` nor `page` changes, so the effect wouldn't re-run and
        // "Loading…" would never go away. Bumping reloadKey guarantees a re-run.
        setReloadKey((k) => k + 1);
    };

    // Runs when the search form is submitted (Enter key or the Search button).
    const handleSearch = (e) => {
        e.preventDefault(); // stop the browser from reloading the page
        loadFirstPage(query.trim());
    };

    // Used by the empty state's button: go back to the popular movies list.
    const clearSearch = () => {
        setQuery("");
        loadFirstPage("");
    };

    // "Load more": ask for the next page. The effect sees the new page number,
    // fetches it, and adds those movies to the end of the grid.
    const loadMore = () => {
        startLoading();
        setPage((p) => p + 1);
    };

    // "Try again": repeat the request that failed (same search, same page).
    const retry = () => {
        startLoading();
        setReloadKey((k) => k + 1);
    };

    // --- Values derived from state (calculated during render, no extra state) ---
    // Only the first page hides the grid while loading. When loading page 2+,
    // the movies already on screen stay visible.
    const firstPageLoading = loading && page === 1;
    // Never ask for a page past what TMDB has, or past TMDB's 500-page limit.
    const lastPage = Math.min(totalPages, MAX_PAGE);
    const hasMorePages = page < lastPage;
    // The search finished, nothing went wrong, and there are zero movies.
    const showEmptyState = !loading && !error && movies.length === 0;

    return (
        // <main> is the semantic tag for the main content of the page.
        <main className="app">
            <header className="app-header">
                <h1>Movie Explorer</h1>

                <form className="search" onSubmit={handleSearch} role="search">
                    {/* Visually hidden label so screen readers know what the box is for. */}
                    <label htmlFor="search-input" className="visually-hidden">
                        Search movies
                    </label>
                    <input
                        id="search-input"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies…"
                        autoComplete="off"
                        // Shows a "Search" key on phone keyboards instead of "Return".
                        enterKeyHint="search"
                    />
                    <button type="submit">Search</button>
                </form>
            </header>

            <section className="results" aria-labelledby="results-heading">
                {/* Heading + count describing what the grid is showing. */}
                <div className="results-header">
                    <h2 id="results-heading">
                        {search ? `Results for “${search}”` : "Popular right now"}
                    </h2>
                    {/* role="status" makes screen readers announce changes politely. */}
                    <p className="results-count" role="status">
                        {firstPageLoading
                            ? "Loading…"
                            : movies.length > 0 &&
                              `Showing ${movies.length.toLocaleString()} of ${totalResults.toLocaleString()} movies`}
                    </p>
                </div>

                {/* The grid itself. Hidden only while the first page is loading. */}
                {!firstPageLoading && movies.length > 0 && (
                    <div className="grid">
                        {movies.map((m) => (
                            <MovieCard key={m.id} movie={m} onSelect={setSelectedMovie} />
                        ))}
                    </div>
                )}

                {/* Empty state (Assignment 4 #1): the request worked but found nothing. */}
                {showEmptyState && (
                    <div className="empty">
                        <p className="empty-title">
                            {search ? `No results for “${search}”` : "No movies to show right now."}
                        </p>
                        {search && (
                            <>
                                <p>Check the spelling, or try a shorter or different title.</p>
                                <button type="button" onClick={clearSearch}>
                                    Back to popular movies
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Error message, with a button that retries the same request. */}
                {error && (
                    <div className="error" role="alert">
                        <p>{error}</p>
                        <button type="button" onClick={retry}>
                            Try again
                        </button>
                    </div>
                )}

                {/* Load more (Assignment 4 #3): ask TMDB for the next page. */}
                {!firstPageLoading && !error && hasMorePages && (
                    <button
                        type="button"
                        className="load-more"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? "Loading…" : "Load more"}
                    </button>
                )}
            </section>

            {/* Detail view (Assignment 4 #2): only rendered while a movie is selected.
                The key makes React build a fresh modal for each different movie. */}
            {selectedMovie && (
                <MovieDetail
                    key={selectedMovie.id}
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}

            {/* <footer> is the semantic tag for the bottom of the page.
                TMDB's terms ask apps that use their API to show this notice. */}
            <footer className="app-footer">
                <p>
                    Movie data and images from{" "}
                    <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
                        TMDB
                    </a>
                    . This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
            </footer>
        </main>
    );
}
