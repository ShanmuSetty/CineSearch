import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import MovieDetails from './MovieDetails';
import MovieCard from './MovieCard';
import HeroSection from './HeroSection';
import MovieRow from './MovieRow';
import FilterPopup from './FilterPopup';
import Navigation from './Navigation';
import FooterComponent from './FooterComponent';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = process.env.REACT_APP_TMDB_API_URL;



<>
<MovieCard />
<HeroSection/>
<MovieRow />
<FilterPopup />
<Navigation />
<MovieDetails />

</>

const App = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    genres: [],
    year: '',
    rating: '',
    language: '',
    sortBy: 'popularity.desc'
  });
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const popular = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`).then(res => res.json());
      setPopularMovies(popular.results);
      setHeroMovie(popular.results[0]);

      const topRated = await fetch(`${API_URL}/movie/top_rated?api_key=${API_KEY}`).then(res => res.json());
      setTopRatedMovies(topRated.results);

      const action = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`).then(res => res.json());
      setActionMovies(action.results);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const searchMovies = async () => {
  const hasSearchTerm = (filters.title || searchTerm).trim() !== '';
  const hasFilters = filters.genres.length || filters.year || filters.rating || filters.language;

  if (!hasSearchTerm && !hasFilters) return;

  setIsSearching(true);

  try {
    let url;

    if (hasSearchTerm && !hasFilters) {
      // 🔎 Simple title search
      const query = encodeURIComponent(filters.title || searchTerm);
      url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    } else {
      // 🎯 Discover with filters and/or title
      url = `${API_URL}/discover/movie?api_key=${API_KEY}`;

      if ((filters.title || searchTerm).trim()) {
        url += `&query=${encodeURIComponent(filters.title || searchTerm)}`;
      }

      if (filters.genres.length) url += `&with_genres=${filters.genres.join(',')}`;
      if (filters.year) url += `&year=${filters.year}`;
      if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
      if (filters.language) url += `&with_original_language=${filters.language}`;
      if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
    }

    console.log("API Request URL:", url); // 👀 Debug here
    const data = await fetch(url).then(res => res.json());
    setSearchResults(data.results || []);
  } catch (error) {
    console.error('Search error:', error);
  }
};



  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    setFilters({ genres: [], year: '', rating: '', language: '', sortBy: 'popularity.desc' });
  };

  return (
    <Router>
      <div className="app">
        <Navigation
          onSearch={searchMovies}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onFilterSearch={searchMovies}
          filters={filters}
          setFilters={setFilters}
        />

        <Routes>
          <Route
            path="/"
            element={
              !isSearching && searchResults.length === 0 ? (
                <>
                  <HeroSection movie={heroMovie} />
                  <div className="content">
                    <MovieRow title="Popular Movies" movies={popularMovies} />
                    <MovieRow title="Top Rated" movies={topRatedMovies} />
                    <MovieRow title="Action Movies" movies={actionMovies} />
                  </div>
                </>
              ) : (
                <div className="search-section" style={{ marginTop: '80px' }}>
                  <div className="search-header">
                    <h2>Results for "{searchTerm || filters.title ||'your search'}"</h2>
                    <button className="clear-search" onClick={clearSearch}>Clear Search</button>
                  </div>
                  <div className="search-grid">
                    {searchResults.map(movie => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              )
            }
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      <FooterComponent />
      </div>
      
    </Router>
    
  );
};

export default App;