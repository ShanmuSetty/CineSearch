import { useState, useEffect } from 'react';
import './FilterPopup.css'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = process.env.REACT_APP_TMDB_API_URL;
const FilterPopup = ({ isOpen, onClose, onFilter, filters, setFilters }) => {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchFilterData();
    }
  }, [isOpen]);

  const fetchFilterData = async () => {
    try {
      // Fetch genres
      const genresResponse = await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
      const genresData = await genresResponse.json();
      setGenres(genresData.genres);

      // Fetch languages
      const languagesResponse = await fetch(`${API_URL}/configuration/languages?api_key=${API_KEY}`);
      const languagesData = await languagesResponse.json();
      setLanguages(languagesData.slice(0, 20)); // Limit to first 20 languages
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenreChange = (genreId) => {
    const currentGenres = filters.genres || [];
    const updatedGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(id => id !== genreId)
      : [...currentGenres, genreId];
    
    handleFilterChange('genres', updatedGenres);
  };

  const resetFilters = () => {
    setFilters({
      genres: [],
      year: '',
      rating: '',
      language: '',
      sortBy: 'popularity.desc',
      title: ''
    });
  };
  

  if (!isOpen) return null;


  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h3>Advanced Search</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="filter-group">
  <label>Search Movie:</label>
  <input
    type="text"
    className="search-bar"
    placeholder="Enter movie title..."
    value={filters.title || ''}
    onChange={(e) => handleFilterChange('title', e.target.value)}
    onKeyDown={(e) => {
  if (e.key === 'Enter') {
    onFilter();
    onClose();
  }
}}

  />
</div>

        <div className="filter-content">
          <div className="filter-group">
            <label>Genre:</label>
            <div className="genre-grid">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  className={`genre-btn ${(filters.genres || []).includes(genre.id) ? 'active' : ''}`}
                  onClick={() => handleGenreChange(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Year:</label>
              <select 
                value={filters.year || ''} 
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Rating:</label>
              <select 
                value={filters.rating || ''} 
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="9">9+ Stars</option>
                <option value="8">8+ Stars</option>
                <option value="7">7+ Stars</option>
                <option value="6">6+ Stars</option>
                <option value="5">5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Language:</label>
              <select 
                value={filters.language || ''} 
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang.iso_639_1} value={lang.iso_639_1}>
                    {lang.english_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select 
                value={filters.sortBy || 'popularity.desc'} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="popularity.asc">Least Popular</option>
                <option value="release_date.desc">Latest Release</option>
                <option value="release_date.asc">Oldest Release</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="vote_average.asc">Lowest Rated</option>
                <option value="vote_count.desc">Most Voted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
          <button
  className="apply-btn"
  onClick={() => {
    console.log('Filters applied:', filters); // 👈 For debugging
    onFilter(); // This triggers `searchMovies` in App.js
    onClose();
  }}
>
  Apply Filters
</button>

        </div>
      </div>
    </div>
  );
};

export default FilterPopup;