import React from "react";
import '../styles/pages/search-page.css';
import SearchBar from "../components/SearchBar";
import backgroundImage from "../../public/assets/images/search-bg.jpg";

const SearchPage: React.FC = () => {
  return (
    <div className="app-flex app-col app-jc-center app-ai-center search-page">
      <img src={backgroundImage} className='background-image' />
      <div className="background-image-overlay" />
      <SearchBar mode={false} />
    </div>
  );
};

export default SearchPage;