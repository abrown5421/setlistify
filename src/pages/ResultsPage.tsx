import React, { useEffect } from "react";
import '../styles/pages/results-page.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Setlist } from '../types/globalTypes';
import SearchBar from "../components/SearchBar";
import { setSelectedSetlist } from "../store/slices/selectedSetlist";
import SpotifyTrackDisplay from "../components/SpotifyTrackDisplay";
import Drawer from "../components/Drawer";
import { openDrawer } from "../store/slices/drawerSlice";
import SetlistTrackDisplay from "../components/SetlistTrackDisplay";
import { openModal, setModalContent } from "../store/slices/modalSlice";

const ResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated);
  const { data, error } = useAppSelector(state => state.searchResults);
  const viewport = useAppSelector(state => state.viewport);
  const selectedSetlist = useAppSelector(state => state.selectedSetlist);

  useEffect(()=>{console.log(selectedSetlist)}, [selectedSetlist])
  
  const handleSetlistClick = (setlist: Setlist) => {
    dispatch(setSelectedSetlist(setlist));
    dispatch(openDrawer())
  };

  const handleSaveSetlist = () => {
    console.log('saving playlist')
  }
  
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
            {viewport.type === "desktop" ? (
              selectedSetlist.setlist && selectedSetlist.setlist ? (
                <div className="app-flex app-col app-fl-1 app-bg-grey app-overflow-scroll app-p1 track-container">
                  <div className="app-flex app-row">
                    <div className="setlist-text-l app-font">{selectedSetlist.setlist?.artist.name}:&nbsp;</div>
                    <div className="setlist-text-2 app-font">{selectedSetlist.setlist?.tour?.name}</div>
                  </div>
                  <div className="app-flex app-row">
                    <div className="setlist-text-2 app-font">Live From: {selectedSetlist.setlist?.venue.name}</div>
                  </div>
                  <div className="app-flex app-row heading-divider">
                    <div className="setlist-text-3 app-font">{selectedSetlist.setlist?.venue.city.name}, {selectedSetlist.setlist?.venue.city.country.name}</div>
                  </div>
                  <div className="app-button app-v-m1 app-bg-primary app-font-white"
                    onClick={()=>{
                      if (isAuthenticated) {
                        handleSaveSetlist()
                        dispatch(setModalContent(
                          <div className="app-w-percent-100 app-jc-center app-ai-center app-flex app-col app-gap-1">
                            <div className="app-spinner" />
                            We are Saving you spotify playlist. Sit Tight...
                          </div>
                        ));
                        dispatch(openModal());
                      } else {
                        dispatch(setModalContent(
                          <div className="app-w-percent-100 app-jc-center app-ai-center app-flex app-col app-gap-1">
                            <svg className="app-font-grey app-w-percent-25" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27zM17 15.74 15.74 17 12 13.26 8.26 17 7 15.74 10.74 12 7 8.26 8.26 7 12 10.74 15.74 7 17 8.26 13.26 12z"></path></svg>
                            Please Login To Save A Playlist.
                          </div>
                        ));
                        dispatch(openModal());
                      }
                      
                    }}
                  >
                    Save as a Spotify Playlist
                  </div>
                  {isAuthenticated ? <SpotifyTrackDisplay /> : <SetlistTrackDisplay />}
                </div>
              ) : (
                <div className="app-flex app-col app-fl-1 app-bg-grey app-overflow-scroll app-ai-center app-jc-center app-p1 track-container">
                  No Setlist Selected
                </div>
              )
            ) : (
              selectedSetlist.setlist && selectedSetlist.setlist ? (
                <div className="app-absolute mobile-track-container">
                  <Drawer>
                    <div className="app-flex app-col">
                      <div className="setlist-text-l app-font">{selectedSetlist.setlist?.artist.name}:&nbsp;</div>
                      <div className="setlist-text-2 app-font">{selectedSetlist.setlist?.tour.name}</div>
                    </div>
                    <div className="app-flex app-row">
                      <div className="setlist-text-2 app-font">Live From: {selectedSetlist.setlist?.venue.name}</div>
                    </div>
                    <div className="app-flex app-row heading-divider">
                      <div className="setlist-text-3 app-font">{selectedSetlist.setlist?.venue.city.name}, {selectedSetlist.setlist?.venue.city.country.name}</div>
                    </div>
                    <div className="app-button app-v-m1 app-bg-primary app-font-white"
                      onClick={()=>{
                        if (isAuthenticated) {
                          handleSaveSetlist()
                          dispatch(setModalContent(
                            <div className="app-w-percent-100 app-jc-center app-ai-center app-flex app-col app-gap-1">
                              <div className="app-spinner" />
                              We are Saving you spotify playlist. Sit Tight...
                            </div>
                          ));
                          dispatch(openModal());
                        } else {
                          dispatch(setModalContent(
                            <div className="app-w-percent-100 app-jc-center app-ai-center app-flex app-col app-gap-1">
                              <svg className="app-font-grey app-w-percent-25" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27zM17 15.74 15.74 17 12 13.26 8.26 17 7 15.74 10.74 12 7 8.26 8.26 7 12 10.74 15.74 7 17 8.26 13.26 12z"></path></svg>
                              Please Login To Save A Playlist.
                            </div>
                          ));
                          dispatch(openModal());
                        }
                        
                      }}
                    >
                      Save as a Spotify Playlist
                    </div>
                    {isAuthenticated ? <SpotifyTrackDisplay /> : <SetlistTrackDisplay />}
                  </Drawer>
                </div>
              ) : (
                <div className="app-hidden">
                  No Setlist Selected
                </div>
              )
            )}
        </div>
    </div>
  );
};

export default ResultsPage;
