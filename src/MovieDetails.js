import React, { useEffect, useState } from 'react';
import './MovieDetails.css';

const API_KEY = '65ea96af80f5b3e1bdbb0b9a400eee5c';
const API_URL = 'https://api.themoviedb.org/3';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const movieId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,reviews,external_ids`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);
const [expandedReviews, setExpandedReviews] = useState([]);
const toggleExpandReview = (id) => {
  setExpandedReviews(prev =>
    prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
  );
};
  if (!movie) return <div className="loading">Loading...</div>;

  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );

  return (
    <div className="movie-details">
      

      <div className="details-hero" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
      }}>
        <div className="details-content">
          <h1>{movie.title}</h1>
          
          {/* Tagline */}
          {movie.tagline && (
            <h3 className="tagline">"{movie.tagline}"</h3>
          )}

          <div className="movie-meta">
            <span>★ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>{movie.runtime} min</span>
            <span>{movie.status}</span>
          </div>
          
          <p className="overview">{movie.overview}</p>
          
          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="details-body">
        {/* Additional Movie Information */}
        <div className="movie-info-grid">
          {/* Release Date */}
          {movie.release_date && (
            <div className="info-item">
              <strong>Release Date:</strong> {movie.release_date}
            </div>
          )}

          {/* Rating with vote count */}
          {movie.vote_average !== undefined && (
            <div className="info-item">
              <strong>Rating:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votes)
            </div>
          )}

          {/* Budget */}
          {movie.budget > 0 && (
            <div className="info-item">
              <strong>Budget:</strong> ${movie.budget.toLocaleString()}
            </div>
          )}

          {/* Revenue */}
          {movie.revenue > 0 && (
            <div className="info-item">
              <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
            </div>
          )}

          {/* Languages */}
          {movie.spoken_languages?.length > 0 && (
            <div className="info-item">
              <strong>Languages:</strong> {movie.spoken_languages.map((l) => l.english_name).join(', ')}
            </div>
          )}

          {/* Production Countries */}
          {movie.production_countries?.length > 0 && (
            <div className="info-item">
              <strong>Production Countries:</strong> {movie.production_countries.map((c) => c.name).join(', ')}
            </div>
          )}
        </div>

        {/* External Links */}
        <div className="external-links">
          {movie.homepage && (
            <a href={movie.homepage} target="_blank" rel="noreferrer" className="external-link">
              Official Website
            </a>
          )}
          
          {movie.external_ids?.imdb_id && (
            <a
              href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`}
              target="_blank"
              rel="noreferrer"
              className="external-link"
            >
              View on IMDb
            </a>
          )}
        </div>

        {/* Production Companies */}
        {movie.production_companies?.length > 0 && (
          <div className="section">
            <h2>Production Companies</h2>
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
          <div className="section">
            <h2>Trailer</h2>
            <div className="trailer">
              <iframe
                width="100%"
                height="450"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div className="section">
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
                  <div className="cast-info">
                    <p className="actor-name">{actor.name}</p>
                    <p className="character-name">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {movie.reviews?.results?.length > 0 && (
  <div className="section">
    <h2>Reviews</h2>
    <div className="reviews-container">
      {movie.reviews.results.map((review) => {
        const isExpanded = expandedReviews.includes(review.id);
        const content = isExpanded
          ? review.content
          : review.content.length > 300
            ? `${review.content.slice(0, 300)}...`
            : review.content;

        return (
          <div key={review.id} className="review">
            <div className="review-header">
              <strong>{review.author}</strong>
            </div>
            <div
              className="review-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {review.content.length > 300 && (
              <button
                className="toggle-btn"
                onClick={() => toggleExpandReview(review.id)}
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

        
      </div>
    </div>
  );
};

export default MovieDetails;