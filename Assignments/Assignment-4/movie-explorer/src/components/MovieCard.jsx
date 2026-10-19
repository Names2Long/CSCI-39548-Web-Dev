/*
 * Ishraq Chowdhury
 * File: MovieCard.jsx
 * Assignment 4
 * October 23, 2026
 *
 * Defines the MovieCard component: one tile in the movie grid. It shows the
 * movie's poster (or a "No image" placeholder), its title, release year, and
 * average rating. Clicking anywhere on the card (or pressing Enter/Space on
 * it with the keyboard) calls onSelect(movie), which App.jsx uses to open the
 * MovieDetail modal for that movie.
 */

import { imageUrl } from "../api/tmdb";

export default function MovieCard({ movie, onSelect }) {

    // release_date looks like "2026-07-17". The first 4 characters are the year.
    // The ? (optional chaining) avoids a crash if release_date is missing.
    const year = movie.release_date?.slice(0, 4) || "Unknown Year";

    // Movies nobody has rated yet come back with vote_count 0 and vote_average 0, so showing "★ 0.0" would be misleading.
    const rating =
        movie.vote_count > 0 ? `★ ${movie.vote_average.toFixed(1)}` : "Not Rated Yet";

    return (
        
        <article className="card">
            {movie.poster_path ? (
                <img
                    src={imageUrl(movie.poster_path, "w342")}
                    alt={`${movie.title} poster`}

                    // Lazy loading: posters further down the page (especially after "Load more") only download when the user scrolls near them.
                    loading="lazy"
                />
            ) : (
                <div className="no-poster">No image</div>
            )}

            <h3 className="card-title">
                
                {/*
                 * The title is a real <button>, so the card works with a keyboard and
                 * screen readers for free. In App.css, the button's ::after is
                 * stretched over the whole card, so clicking the poster also counts
                 * as clicking this button.
                 */}

                <button type="button" onClick={() => onSelect(movie)}>
                    {movie.title}
                </button>
            </h3>

            <p className="card-meta">
                <span>{year}</span>
                <span className="rating">{rating}</span>
            </p>
        </article>
    );
}
