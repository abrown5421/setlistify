import React, { useEffect, useState } from "react";
import '../styles/components/search-bar.css';
import '../styles/components/setlist-track-display.css';
import { useAppSelector } from "../store/hooks";
import placeholderImg from '../../public/assets/images/placeholder.png';
import { Setlist, ExtractedSong } from "../types/globalTypes";

const SetlistTrackDisplay: React.FC = () => {
  const selectedSetlist = useAppSelector(state => state.selectedSetlist);
  const [tracks, setTracks] = useState<ExtractedSong[]>([]);
  const [loading, setLoading] = useState(true);

  const extractSongs = (data: Setlist): ExtractedSong[] => {
    const songs: ExtractedSong[] = [];
  
    if (!data?.sets?.set || !data.artist?.name) return songs;
  
    const artistName = data.artist.name;
    const sets = data.sets.set;
  
    sets.forEach(set => {
      const setName = set.name || undefined;
  
      set.song?.forEach(song => {
        if (song.name) {
          const songObj: ExtractedSong = {
            slfmTrackName: song.name,
            slfmArtistName: artistName,
            ...(setName && { slfmTrackSet: setName }),
            ...(song.info && { slfmTrackInfo: song.info })
          };
  
          songs.push(songObj);
        }
      });
    });
  
    return songs;
  };

  useEffect(() => {
    setLoading(true);
    if (selectedSetlist.setlist) {
      const songs = extractSongs(selectedSetlist.setlist);
      setTracks(songs); 
      console.log(songs);
      setLoading(false);
    }
  }, [selectedSetlist.setlist]);

  
  return <div>
    {loading ? (
      <div className="app-flex app-jc-center app-ai-center app-h-percent-100">
        <div className="app-spinner" /> 
      </div>
    ) : (
      tracks.length > 0 ? (
        <div className="app-relative">
          {tracks.map((song, idx) => (
            <div key={idx} className="app-row app-flex app-gap-1 song-card spacer">
              <div className="app-flex app-col app-fl-2 app-relative">
                  <img src={placeholderImg} alt="album art" className="album-art" />
                  <div className="app-absolute album-art-overlay app-flex app-column app-jc-center app-ai-center app-font app-font-white">
                    Login For Artwork
                  </div>
              </div>
              <div className="app-flex app-col app-fl-10">
                  <div className="track-title app-font app-font-primary">{song.slfmTrackName}</div>
                  <div className="track-artist app-font"><strong>By: </strong>{song.slfmArtistName}</div>
                  {song.slfmTrackSet && (
                      <div className="track-set app-font">
                          Set: {song.slfmTrackSet}
                      </div>
                  )}
                  {song.slfmTrackInfo && (
                      <div className="track-set app-font">
                          Notes: {song.slfmTrackInfo}
                      </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tracks found.</p>
      )
    )}
  </div>;
};

export default SetlistTrackDisplay;
