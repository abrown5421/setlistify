import React from "react";
import '../styles/pages/search-page.css';

const SearchPage: React.FC = () => {
  return (
    <div className="app-flex app-col app-jc-center app-ai-center app-bg-white search-page">
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Artist" />
        <input type="text" className="search-input" placeholder="Venue" />
        <input type="text" className="search-input" placeholder="Tour" />
        <input type="number" className="search-input" placeholder="Year" />
        <button
          className="app-button app-bg-primary app-font-black"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
