import React from "react";
import '../styles/pages/search-page.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setArtist, setTour, setVenue, setYear } from "../store/slices/searchParamsSlice";
import { setMessage, setOpen, setSeverity, closeNotification } from "../store/slices/notificationSlice";

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artist, venue, tour, year } = useAppSelector(state => state.searchParams);

  const handleSearch = () => {
    if (artist || venue || tour || year) {
      console.log({ artist, venue, tour, year });
    } else {
      dispatch(setOpen(true))
      dispatch(setSeverity('error'))
      dispatch(setMessage('Please fill out at least one search field.'))
      setTimeout(() => {
        dispatch(closeNotification())
      }, 3000)
    }
  };

  return (
    <div className="app-flex app-col app-jc-center app-ai-center app-bg-white search-page">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Artist"
          value={artist}
          onChange={(e) => dispatch(setArtist(e.target.value))}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Venue"
          value={venue}
          onChange={(e) => dispatch(setVenue(e.target.value))}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Tour"
          value={tour}
          onChange={(e) => dispatch(setTour(e.target.value))}
        />
        <input
          type="number"
          className="search-input"
          placeholder="Year"
          value={year}
          onChange={(e) => dispatch(setYear(e.target.value))}
        />
        <button
          className="app-button app-bg-primary app-font-black"
          onClick={() => handleSearch()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchPage;