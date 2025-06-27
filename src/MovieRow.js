
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, size = 'normal' }) => {
  const scrollContainer = (direction) => {
    const container = document.getElementById(`row-${title.replace(/\s+/g, '')}`);
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="movie-row">
      <div className="row-header">
        <h2>{title}</h2>
      </div>
      <div className="row-container">
        <button 
          className="scroll-btn left" 
          onClick={() => scrollContainer('left')}
        >
          ‹
        </button>
        <div className="movies-container" id={`row-${title.replace(/\s+/g, '')}`}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size={size} />
          ))}
        </div>
        <button 
          className="scroll-btn right" 
          onClick={() => scrollContainer('right')}
        >
          ›
        </button>
      </div>
    </div>
  );
};
export default MovieRow;