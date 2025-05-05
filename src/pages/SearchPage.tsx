import React from "react";
import '../styles/pages/search-page.css';
import SearchBar from "../components/SearchBar";

const SearchPage: React.FC = () => {
  return (
    <div className="app-flex app-col app-jc-center app-ai-center app-bg-white search-page">
      <SearchBar />
    </div>
  );
};

export default SearchPage;