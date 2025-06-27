import { useState } from 'react';

import FilterPopup from './FilterPopup';
const Navigation = ({ onSearch, searchTerm, setSearchTerm, onFilterSearch, filters, setFilters }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  return (
    <>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            
            <button 
              className="filter-btn"
              onClick={() => setShowFilterPopup(true)}
              title="Advanced Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
              </svg>
            </button>
          </div>
          
        </div>
      </nav>
      
      <FilterPopup 
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        onFilter={onFilterSearch}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};
export default Navigation;