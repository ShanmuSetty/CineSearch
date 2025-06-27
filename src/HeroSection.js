

const HeroSection = ({ movie }) => {
  if (!movie) return null;
  
  return (
    <div 
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.overview}</p>
        <div className="hero-meta">
          <span className="match-score">★ {movie.vote_average?.toFixed(1)}</span>
          <span className="year">{movie.release_date?.split('-')[0]}</span>
        </div>
        
      </div>
    </div>
  );
};
export default HeroSection;