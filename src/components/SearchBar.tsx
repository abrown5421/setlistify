import React from "react";
import '../styles/components/search-bar.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setArtist, setTour, setVenue, setYear } from "../store/slices/searchParamsSlice";
import { setMessage, setOpen, setSeverity, closeNotification } from "../store/slices/notificationSlice";
import { fetchSearchResultsFailure, fetchSearchResultsStart, fetchSearchResultsSuccess } from "../store/slices/searchResultsSlice";
import { setActivePage } from "../store/slices/activePageSlice";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artist, venue, tour, year } = useAppSelector(state => state.searchParams);
  const searchResults = useAppSelector(state => state.searchResults);

  const handleSearch = async () => {
    if (artist || venue || tour || year) {
      dispatch(fetchSearchResultsStart());
  
      try {
        const params = new URLSearchParams();
        if (artist) params.append('artist', artist);
        if (venue) params.append('venue', venue);
        if (tour) params.append('tour', tour);
        if (year) params.append('year', year);
  
        const response = await fetch(`/.netlify/functions/searchSetlists?${params.toString()}`);
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Search failed');
        }
  
        dispatch(fetchSearchResultsSuccess(data));
        const hasSetlistResults = searchResults?.data?.setlist?.length ?? 0;

        if (hasSetlistResults === 0) {
            dispatch(setActivePage({ key: "In", value: false }));
            dispatch(setActivePage({ key: "Name", value: "Results" }));

            setTimeout(() => {
                dispatch(setActivePage({ key: "In", value: true }));
            }, 500);
        }
      } catch (error) {
        dispatch(fetchSearchResultsFailure('No results match your search.'));
        dispatch(setOpen(true));
        dispatch(setSeverity('error'));
        dispatch(setMessage('No results match your search.'));
        setTimeout(() => dispatch(closeNotification()), 3000);
      }
    } else {
      dispatch(setOpen(true));
      dispatch(setSeverity('error'));
      dispatch(setMessage('Please fill out at least one search field.'));
      setTimeout(() => dispatch(closeNotification()), 3000);
    }
  };  

  return (
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
            {searchResults.loading ? <div className="spinner" /> : "Search"}
        </button>
    </div>
  );
};

export default SearchBar;