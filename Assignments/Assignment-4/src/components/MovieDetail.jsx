/*
 * Ishraq Chowdhury
 * File: MovieDetail.jsx
 * Assignment 4
 * October 23, 2026
 *
 * Defines the MovieDetail component: the modal (pop-up panel) that opens when
 * a movie card is clicked. It shows the movie's backdrop, poster, title,
 * release date, rating, original language, and the `overview` field that is
 * already included in the search/popular results (so no extra API call is
 * needed). It is built on the native HTML <dialog> element, which gives us a
 * dimmed backdrop, Escape-to-close, and keyboard focus handling for free.
 * The modal closes with the X button, the Escape key, or a click outside it.
 */

import { useEffect, useRef } from "react";
import { imageUrl } from "../api/tmdb";

// Turns a language code like "ko" into a readable name like "Korean".
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

// "2026-07-17" -> "July 17, 2026". Returns null if there is no date.
function formatDate(dateString) {

    if (!dateString) return null;
    
    // Adding T00:00:00 makes JavaScript read it as local time, which stops the
    // date from shifting back one day in time zones behind UTC.
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function MovieDetail({ movie, onClose }) {

    // A ref gives us direct access to the real <dialog> DOM element,
    // because opening it as a modal requires calling dialog.showModal().
    const dialogRef = useRef(null);

    // Effect: as soon as this component appears on screen, open the dialog.
    // Opening a <dialog> is talking to the browser's DOM (an external system),
    // which is exactly what useEffect is for. Empty array = run once on mount.
    useEffect(() => {
        
        const dialog = dialogRef.current;
        // The `open` check matters in development: React StrictMode runs effects
        // twice, and calling showModal() on an already-open dialog can throw.
        if (!dialog.open) dialog.showModal();
    }, []);

    // Every way of closing goes through the browser's dialog.close(). That fires
    // the dialog's "close" event (handled by onClose below) and makes the browser
    // return keyboard focus to the card the user clicked.
    const closeDialog = () => dialogRef.current.close();

    // Clicking the dimmed area outside the panel counts as a click on the
    // <dialog> element itself (the panel and close button cover everything
    // inside it), so e.target === e.currentTarget only for outside clicks.
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeDialog();
    };

    const releaseDate = formatDate(movie.release_date);
    const language = movie.original_language
        ? languageNames.of(movie.original_language)
        : null;
    // Only show the original title when it differs (e.g. foreign-language films).
    const showOriginalTitle =
        movie.original_title && movie.original_title !== movie.title;

    return (
        <dialog
            ref={dialogRef}
            className="detail"

            // "close" fires for the X button, the Escape key, and backdrop clicks.
            // onClose tells App.jsx to clear the selected movie, which unmounts this.
            onClose={onClose}
            onClick={handleBackdropClick}
            aria-labelledby="detail-title"
        >
            {/* The close button sits outside the scrolling panel so it never scrolls away. */}
            <button
                type="button"
                className="detail-close"
                onClick={closeDialog}
                aria-label="Close movie details"
            >
                ×
            </button>

            {/* The panel is the part that scrolls if the overview is long. */}
            <div className="detail-panel">
                
                {/* Wide backdrop image across the top, if TMDB has one. */}
                {movie.backdrop_path && (
                    <img
                        className="detail-backdrop"
                        src={imageUrl(movie.backdrop_path, "w780")}
                        alt=""
                    />
                )}

                {/*
                 * The body is a CSS Grid with named areas (see App.css):
                 *   phone:   poster + title side by side, overview full width below
                 *   desktop: poster on the left, title and overview stacked on the right
                 */}
                <div className="detail-body">
                    {movie.poster_path ? (
                        <img
                            className="detail-poster"
                            src={imageUrl(movie.poster_path, "w342")}
                            alt={`${movie.title} poster`}
                        />
                    ) : (
                        <div className="detail-poster no-poster">No image</div>
                    )}

                    <div className="detail-title-block">
                        <h2 id="detail-title">{movie.title}</h2>
                        {showOriginalTitle && (
                            <p className="detail-original">{movie.original_title}</p>
                        )}

                        {/* A description list (<dl>) is the semantic tag for label/value pairs. */}
                        <dl className="detail-facts">
                            <div>
                                <dt>Released</dt>
                                <dd>{releaseDate ?? "Unknown"}</dd>
                            </div>
                            <div>
                                <dt>Rating</dt>
                                <dd>
                                    {movie.vote_count > 0
                                        ? `★ ${movie.vote_average.toFixed(1)} / 10 (${movie.vote_count.toLocaleString()} votes)`
                                        : "Not rated yet"}
                                </dd>
                            </div>
                            {language && (
                                <div>
                                    <dt>Language</dt>
                                    <dd>{language}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="detail-info">
                        <h3>Overview</h3>
                        <p className="detail-overview">
                            {movie.overview || "TMDB doesn't have an overview for this movie yet."}
                        </p>

                        <a
                            className="detail-link"
                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View on TMDB
                        </a>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
