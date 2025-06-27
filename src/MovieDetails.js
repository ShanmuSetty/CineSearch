import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetails.css';

const API_KEY = '65ea96af80f5b3e1bdbb0b9a400eee5c';
const API_URL = 'https://api.themoviedb.org/3';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,reviews,external_ids`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );

  return (
    <div className="movie-details">
      <Link to="/" className="back-button">
        ← Back to Search
      </Link>

      {/* Title */}
      {movie.title && <h1>{movie.title}</h1>}

      {/* Tagline */}
      {movie.tagline && (
        <h3 style={{ fontStyle: 'italic' }}>"{movie.tagline}"</h3>
      )}

      {/* Backdrop */}
      {movie.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt={movie.title}
          className="backdrop-img"
        />
      )}

      <div className="details-content">
        {/* Overview */}
        {movie.overview && (
          <p>
            <strong>Overview:</strong> {movie.overview}
          </p>
        )}

        {/* Release Date */}
        {movie.release_date && (
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
        )}

        {/* Runtime */}
        {movie.runtime && (
          <p>
            <strong>Runtime:</strong> {movie.runtime} mins
          </p>
        )}

        {/* Status */}
        {movie.status && (
          <p>
            <strong>Status:</strong> {movie.status}
          </p>
        )}

        {/* Rating */}
        {movie.vote_average !== undefined && (
          <p>
            <strong>Rating:</strong> ⭐ {movie.vote_average} (
            {movie.vote_count} votes)
          </p>
        )}

        {/* Genres */}
        {movie.genres?.length > 0 && (
          <p>
            <strong>Genres:</strong>{' '}
            {movie.genres.map((g) => g.name).join(', ')}
          </p>
        )}

        {/* Budget */}
        {movie.budget > 0 && (
          <p>
            <strong>Budget:</strong> ${movie.budget.toLocaleString()}
          </p>
        )}

        {/* Revenue */}
        {movie.revenue > 0 && (
          <p>
            <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
          </p>
        )}

        {/* Languages */}
        {movie.spoken_languages?.length > 0 && (
          <p>
            <strong>Languages:</strong>{' '}
            {movie.spoken_languages.map((l) => l.english_name).join(', ')}
          </p>
        )}

        {/* Production Countries */}
        {movie.production_countries?.length > 0 && (
          <p>
            <strong>Production Countries:</strong>{' '}
            {movie.production_countries.map((c) => c.name).join(', ')}
          </p>
        )}

        {/* Official Website */}
        {movie.homepage && (
          <p>
            <strong>Official Website:</strong>{' '}
            <a href={movie.homepage} target="_blank" rel="noreferrer">
              {movie.homepage}
            </a>
          </p>
        )}

        {/* IMDb */}
        {movie.external_ids?.imdb_id && (
          <p>
            <strong>IMDb:</strong>{' '}
            <a
              href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`}
              target="_blank"
              rel="noreferrer"
            >
              View on IMDb
            </a>
          </p>
        )}

        {/* Production Companies */}
        {movie.production_companies?.length > 0 && (
          <div>
            <strong>Production Companies:</strong>
            <div className="production-companies">
              {movie.production_companies.map((company) => (
                <div key={company.id} className="company">
                  {company.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                    />
                  ) : (
                    <div className="no-logo">{company.name}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {trailer && (
          <div className="trailer">
            <h2>Trailer</h2>
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div>
            <h2>Top Cast</h2>
            <div className="cast-list">
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="cast-card">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={actor.name}
                  />
                  <p>
                    <strong>{actor.name}</strong>
                  </p>
                  <p>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {movie.reviews?.results?.length > 0 && (
          <div>
            <h2>Reviews</h2>
            {movie.reviews.results.map((review) => (
              <div key={review.id} className="review">
                <p>
                  <strong>{review.author}</strong> says:
                </p>
                <p>
                  {review.content.length > 300
                    ? `${review.content.slice(0, 300)}...`
                    : review.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
