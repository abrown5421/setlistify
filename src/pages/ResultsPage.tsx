import React, { useEffect } from "react";
import '../styles/pages/results-component.css';
import { useAppSelector } from "../store/hooks";
import { Setlist } from '../types/globalTypes';
import SearchBar from "../components/SearchBar";

const ResultsPage: React.FC = () => {
  const { data, error } = useAppSelector(state => state.searchResults);

  useEffect(()=>{console.log(data)}, [data])
  if (error) {
    return <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100">
          <SearchBar />
        </div>
        <div className="app-flex app-row app-jc-center app-ai-center app-w-vw-100 app-h-percent-100">No results found</div>
      </div>;
  }

  if (!data?.setlist?.length) {
    return <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100">
          <SearchBar />
        </div>
        <div className="app-flex app-row app-jc-center app-ai-center app-w-vw-100 app-h-percent-100">No results found</div>
      </div>;
  }

  return (
    <div className="app-flex app-col app-ai-center app-bg-white results-page">
        <div className="app-p1 app-w-percent-100">
          <SearchBar />
        </div>
        <div className="app-flex app-row app-w-vw-100 app-h-percent-100">
            <div className="app-flex app-col app-fl-1 app-overflow-scroll">
              {data?.setlist.map((setlist: Setlist) => (
                <div key={setlist.id} className="app-flex app-row app-p1 search-result-row">
                  <div className="app-flex app-col app-gap-1">
                    <div className="headliner app-font-primary">{setlist.artist?.name || "Unknown Artist"}</div>
                    <div className="app-flex app-row app-gap-1">
                      <div><strong>Date:</strong> {setlist.eventDate || "Unknown Date"}</div>
                      <div>|</div>
                      <div><strong>Tour:</strong> {setlist.tour?.name || "Unknown Tour"}</div>
                      <div>|</div>
                      <div><strong>Venue:</strong> {setlist.venue?.name || "Unknown Venue"} — {setlist.venue?.city?.name || "Unknown City"}, {setlist.venue?.city?.stateCode || "??"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="app-flex app-col app-fl-1 app-bg-grey app-overflow-scroll app-jc-center app-ai-center">
                Click on a setlist to get started!
            </div>
        </div>
    </div>
  );
};

export default ResultsPage;
