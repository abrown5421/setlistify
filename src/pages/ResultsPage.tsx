import React, { useEffect } from "react";
import '../styles/pages/results-page.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Setlist } from '../types/globalTypes';
import SearchBar from "../components/SearchBar";
import { setSelectedSetlist } from "../store/slices/selectedSetlist";

const ResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector(state => state.searchResults);
  const viewport = useAppSelector(state => state.viewport);
  const selectedSetlist = useAppSelector(state => state.selectedSetlist);

  const handleSetlistClick = (setlist: Setlist) => {
    dispatch(setSelectedSetlist(setlist));
  };

  useEffect(()=>{console.log(selectedSetlist)}, [selectedSetlist])

  if (error) {
    return <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100 sb-divider">
          <SearchBar mode={viewport.type === 'mobile'} />
        </div>
        <div className="app-flex app-row app-jc-center app-ai-center app-w-vw-100 app-h-percent-100">No results found</div>
      </div>;
  }

  if (!data?.setlist?.length) {
    return <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100 sb-divider">
          <SearchBar mode={viewport.type === 'mobile'} />
        </div>
        <div className="app-flex app-row app-jc-center app-ai-center app-w-vw-100 app-h-percent-100">No results found</div>
      </div>;
  }

  return (
    <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100 sb-divider">
          <SearchBar mode={viewport.type === 'mobile'} />
        </div>
        <div className="app-flex app-row app-w-vw-100 app-h-percent-100">
            <div className="app-flex app-col app-fl-1 app-overflow-scroll">
            {data?.setlist.map((setlist: Setlist) => (
              <div key={setlist.id} className="app-flex app-row app-p1 search-result-row" onClick={() => handleSetlistClick(setlist)}>
                <div className="app-flex app-col app-gap-1">
                  <div className="headliner app-font-primary">{setlist.artist?.name || "Unknown Artist"}</div>
                  <div className="app-flex app-row app-gap-1">
                    <div className={viewport.type === 'mobile' ? "app-flex app-col" : ""}><strong>Date:</strong> {setlist.eventDate || "Unknown Date"}</div>
                    <div className={viewport.type === 'mobile' ? "app-hidden" : ""}>|</div>
                    <div className={viewport.type === 'mobile' ? "app-flex app-col" : ""}><strong>Tour:</strong> {setlist.tour?.name || "Unknown Tour"}</div>
                    <div className={viewport.type === 'mobile' ? "app-hidden" : ""}>|</div>
                    <div className={viewport.type === 'mobile' ? "app-flex app-col" : ""}><strong>Venue:</strong> {setlist.venue?.name || "Unknown Venue"} — {setlist.venue?.city?.name || "Unknown City"}, {setlist.venue?.city?.stateCode || "??"}</div>
                  </div>
                </div>
              </div>
            ))}
            </div>
            {viewport.type !== "mobile" && (
              <div className="app-flex app-col app-fl-1 app-bg-grey app-overflow-scroll app-p1">
                <div className="app-flex app-row">
                  <div className="setlist-text-l app-font">{selectedSetlist.setlist?.artist.name}:&nbsp;</div>
                  <div className="setlist-text-2 app-font">{selectedSetlist.setlist?.tour.name}</div>
                </div>
                <div className="app-flex app-row">
                  <div className="setlist-text-2 app-font">Live From: {selectedSetlist.setlist?.venue.name}</div>
                </div>
                <div className="app-flex app-row heading-divider">
                  <div className="setlist-text-3 app-font">{selectedSetlist.setlist?.venue.city.name}, {selectedSetlist.setlist?.venue.city.country.name}</div>
                </div>
                {selectedSetlist.setlist?.sets.set.map((set, setIndex) => (
                  <div key={setIndex} className="spacer">
                    {set.name ? <div className="setlist-text-l app-font">{set.name}</div> : <div className="setlist-text-l app-font">Un-named Set</div>}
                    <ul>
                      {set.song.map((song, songIndex) => (
                        <li key={songIndex}>
                          <strong>{song.name}</strong>
                          {song.info && <div style={{ fontStyle: 'italic' }}>{song.info}</div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
        </div>
    </div>
  );
};

export default ResultsPage;
