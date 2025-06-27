import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const API_KEY = '65ea96af80f5b3e1bdbb0b9a400eee5c';
const API_URL = 'https://api.themoviedb.org/3';

// Movie Card Component for horizontal scrolling
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

// Hero Section Component
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
        <div className="hero-buttons">
          <button className="play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            PLAY
          </button>
          <button className="add-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Movie Row Component
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

// Navigation Component
const Navigation = ({ onSearch, searchTerm, setSearchTerm }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo"><a href='/'>CineSearch</a></h1>
        <ul className="nav-links">
          
          
        </ul>
      </div>
      <div className="nav-right">
        <div className={`search-container ${showSearch ? 'active' : ''}`}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button 
            className="search-btn"
            onClick={() => {
              if (showSearch && searchTerm) {
                onSearch();
              }
              setShowSearch(!showSearch);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8" />
  <line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>

          </button>
        </div>
        
      </div>
    </nav>
  );
};

// Movie Details Component
const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const movieId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
      const data = await response.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [movieId]);

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="movie-details">
      <div className="details-hero" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
      }}>
        <div className="details-content">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span>★ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>{movie.runtime} min</span>
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch popular movies for hero and popular row
      const popularResponse = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
      const popularData = await popularResponse.json();
      setPopularMovies(popularData.results);
      setHeroMovie(popularData.results[0]);

      // Fetch top rated movies
      const topRatedResponse = await fetch(`${API_URL}/movie/top_rated?api_key=${API_KEY}`);
      const topRatedData = await topRatedResponse.json();
      setTopRatedMovies(topRatedData.results);

      // Fetch action movies (genre id: 28)
      const actionResponse = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`);
      const actionData = await actionResponse.json();
      setActionMovies(actionData.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <Router>
      <div className="app">
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #0f0f0f;
            color: #ffffff;
            overflow-x: hidden;
          }

          .app {
            min-height: 100vh;
          }

          /* Navigation Styles */
          .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            padding: 1rem 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            transition: background-color 0.3s ease;
          }

          .nav-left {
            display: flex;
            align-items: center;
            gap: 3rem;
          }

          .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #e50914;
          }

          .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
          }

          .nav-links a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s ease;
          }

          .nav-links a:hover,
          .nav-links a.active {
            color: #e50914;
          }

          .nav-right {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .search-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .search-container input {
            background: rgba(0,0,0,0.7);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            padding: 0.5rem 1rem;
            color: white;
            width: 0;
            opacity: 0;
            transition: all 0.3s ease;
          }

          .search-container.active input {
            width: 200px;
            opacity: 1;
          }

          .search-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.5rem;
          }

          .profile-btn {
            cursor: pointer;
          }

          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            background: #e50914;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
          }

          /* Hero Section Styles */
          .hero-section {
            height: 80vh;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            padding: 0 4rem;
            margin-bottom: 2rem;
          }

          .hero-content {
            max-width: 500px;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            line-height: 1.1;
          }

          .hero-description {
            font-size: 1.1rem;
            line-height: 1.5;
            margin-bottom: 1rem;
            opacity: 0.9;
          }

          .hero-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            font-size: 0.9rem;
          }

          .match-score {
            color: #46d369;
            font-weight: bold;
          }

          .hero-buttons {
            display: flex;
            gap: 1rem;
          }

          .play-btn {
            background: #ffffff;
            color: #000000;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: background-color 0.3s ease;
          }

          .play-btn:hover {
            background: rgba(255,255,255,0.8);
          }

          .add-btn {
            background: rgba(109, 109, 110, 0.7);
            color: white;
            border: none;
            padding: 0.8rem;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .add-btn:hover {
            background: rgba(109, 109, 110, 0.9);
          }

          /* Movie Row Styles */
          .movie-row {
            margin-bottom: 3rem;
            padding: 0 4rem;
          }

          .row-header h2 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .row-container {
            position: relative;
          }

          .movies-container {
            display: flex;
            gap: 0.5rem;
            overflow-x: auto;
            scroll-behavior: smooth;
            padding: 0.5rem 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .movies-container::-webkit-scrollbar {
            display: none;
          }

          .movie-card {
            flex: 0 0 auto;
            cursor: pointer;
            transition: transform 0.3s ease;
            border-radius: 4px;
            overflow: hidden;
          }

          .movie-card:hover {
            transform: scale(1.05);
            z-index: 10;
          }

          .movie-card img {
            width: 180px;
            height: 270px;
            object-fit: cover;
            border-radius: 4px;
          }

          .movie-card.large img {
            width: 300px;
            height: 450px;
          }

          .movie-info {
            padding: 0.5rem 0;
          }

          .movie-info h4 {
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 180px;
          }

          .rating {
            font-size: 0.8rem;
            color: #46d369;
          }

          .scroll-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .row-container:hover .scroll-btn {
            opacity: 1;
          }

          .scroll-btn.left {
            left: -25px;
          }

          .scroll-btn.right {
            right: -25px;
          }

          /* Search Results */
          .search-section {
            padding: 2rem 4rem;
          }

          .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .clear-search {
            background: none;
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
          }

          .search-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
          }

          /* Movie Details Styles */
          .movie-details {
            min-height: 100vh;
          }

          .details-hero {
            height: 100vh;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            padding: 0 4rem;
          }

          .details-content {
            max-width: 600px;
          }

          .details-content h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .movie-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            font-size: 1rem;
          }

          .overview {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
          }

          .genres {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .genre-tag {
            background: rgba(255,255,255,0.1);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
          }

          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 1.2rem;
          }

          /* Link Styles */
          a {
            color: inherit;
            text-decoration: none;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .navbar {
              padding: 1rem 2rem;
            }
            
            .nav-links {
              display: none;
            }
            
            .hero-section,
            .movie-row {
              padding: 0 2rem;
            }
            
            .hero-title {
              font-size: 2.5rem;
            }
            
            .movie-card img {
              width: 140px;
              height: 210px;
            }
          }
        `}</style>

        <Navigation 
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Routes>
          <Route 
            path="/" 
            element={
              <>
                {!isSearching && searchResults.length === 0 ? (
                  <>
                    <HeroSection movie={heroMovie} />
                    
                    <div className="content">
                      <MovieRow title="Popular Movies" movies={popularMovies} />
                      <MovieRow title="Top Rated" movies={topRatedMovies} />
                      <MovieRow title="Action Movies" movies={actionMovies} />
                    </div>
                  </>
                ) : (
                  <div className="search-section" style={{marginTop: '80px'}}>
                    <div className="search-header">
                      <h2>Search Results for "{searchTerm}"</h2>
                      <button className="clear-search" onClick={clearSearch}>
                        Clear Search
                      </button>
                    </div>
                    <div className="search-grid">
                      {searchResults.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            } 
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;