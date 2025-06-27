import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie">
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          <p>{movie.release_date}</p>
        </div>
        <div>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/400'
            }
            alt={movie.title}
          />
        </div>
        <div>
          <span>Movie</span>
          <h3>{movie.title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
