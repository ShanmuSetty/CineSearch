
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
const MovieCard = ({ movie, size = 'normal' }) => {
  const imageSize = size === 'large' ? 'w500' : 'w300';
  const cardClass = size === 'large' ? 'movie-card large' : 'movie-card';
  
  return (
    <div className={cardClass}>
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/${imageSize}${movie.poster_path}`
              : 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
          }
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-info">
          <h4>{movie.title}</h4>
          <span className="rating">★ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </Link>
    </div>
  );
};
export default MovieCard;