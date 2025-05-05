import React, { useState } from "react";
import '../styles/components/search-bar.css';
import { SearchBarProps } from "../types/globalTypes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setArtist, setTour, setVenue, setYear } from "../store/slices/searchParamsSlice";
import { setMessage, setOpen, setSeverity, closeNotification } from "../store/slices/notificationSlice";
import { fetchSearchResultsFailure, fetchSearchResultsStart, fetchSearchResultsSuccess } from "../store/slices/searchResultsSlice";
import { setActivePage } from "../store/slices/activePageSlice";
import AnimatedContainer from "../containers/AnimatedContainer";

const SearchBar: React.FC<SearchBarProps> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const { artist, venue, tour, year } = useAppSelector(state => state.searchParams);
  const searchResults = useAppSelector(state => state.searchResults);
  const viewport = useAppSelector(state => state.viewport);

  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);
  
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

  const inputFields = (
    <div className={viewport.type === 'mobile' ? "search-container app-col" : "search-container" }>
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
      {!mode && (
        <button
          className="app-button app-bg-primary app-font-black"
          onClick={() => handleSearch()}
        >
          {searchResults.loading ? <div className="app-spinner" /> : "Search"}
        </button>
      )}
    </div>
  );

  return (
    <>
      {mode ? (
        <div
          className={`collapse-content ${collapseOpen ? 'open' : 'closed'}`}
          style={{
            maxHeight: collapseOpen ? '500px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
          }}
        >
          {collapseOpen && (
            <>
              {inputFields}
              <div className="app-flex app-row app-gap-1 app-p1">
                <button
                  className="app-button app-col app-fl-1 app-bg-secondary"
                  onClick={() => setCollapseOpen(prev => !prev)}
                >
                  Hide Search
                </button>
                <button
                  className="app-button app-col app-fl-1 app-bg-primary app-font-black"
                  onClick={() => handleSearch()}
                >
                  {searchResults.loading ? <div className="app-spinner" /> : "Search"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {inputFields}
        </>
      )}
      <AnimatedContainer isEntering={mode && !collapseOpen}>
        <div className="app-flex app-row app-gap-1 app-p1">
          <button
            className="app-button app-col app-fl-1 app-bg-primary"
            onClick={() => setCollapseOpen(prev => !prev)}
          >
            Expand Search
          </button>
        </div>
      </AnimatedContainer>
    </>
  );
};

export default SearchBar;