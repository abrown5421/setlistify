import React, { useEffect, useState } from "react";
import '../styles/components/search-bar.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Setlist, ExtractedSong } from "../types/globalTypes";
import placeholderImg from '../../public/assets/images/placeholder.png';
import '../styles/components/spotify-track-display.css';
import { closeModal, openModal, setModalContent } from "../store/slices/modalSlice";
import SpotifyTrackSearch from "./SpotifyTrackSearch";
import { setTracklist } from "../store/slices/playlistSlice";

const SpotifyTrackDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.authentication.token);
  const viewport = useAppSelector(state => state.viewport.type);
  const selectedSetlist = useAppSelector(state => state.selectedSetlist);
  const [tracks, setTracks] = useState<ExtractedSong[]>([]);
  const [loading, setLoading] = useState(true);

  const matchedCount = tracks.filter(t => t.spotifyTrackName).length;
  const totalCount = tracks.length;
  const allTracksMatched = matchedCount === totalCount;

  const fetchSpotifyTrack = async (
    token: string,
    trackName: string,
    artistName: string
  ): Promise<Partial<ExtractedSong>> => {
    const query = encodeURIComponent(`track:${trackName} artist:${artistName}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      console.error(`Failed to fetch Spotify track: ${res.statusText}`);
      return {};
    }
  
    const data = await res.json();
    const track = data.tracks.items[0];
  
    if (!track) return {};
    return {
      spotifyTrackId: track.id,
      spotifyArtist: track.artists[0]?.name,
      spotifyTrackName: track.name,
      spotifyAlbum: track.album?.name,
      spotifyAlbumArt: track.album?.images?.[0]?.url,
    };
  };

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
    const enrichSongsWithSpotifyData = async () => {
      if (!selectedSetlist.setlist || !token) return;
  
      const songs = extractSongs(selectedSetlist.setlist);
  
      setLoading(true); 
  
      const enrichedSongs = await Promise.all(
        songs.map(async song => {
          const spotifyData = await fetchSpotifyTrack(
            token,
            song.slfmTrackName,
            song.slfmArtistName
          );
          return { ...song, ...spotifyData };
        })
      );
  
      setTracks(enrichedSongs); 
      setLoading(false); 
    };
  
    enrichSongsWithSpotifyData();
  }, [selectedSetlist.setlist, token]);

  useEffect(()=>{
    dispatch(setTracklist(tracks))
  }, [tracks])

  return (
    <div className={loading ? "app-h-percent-100": ""}>
      {loading ? (
        <div className="app-flex app-jc-center app-ai-center app-h-percent-100">
          <div className="app-spinner" /> 
        </div>
      ) : (
        tracks.length > 0 ? (
          <div className="app-relative">
            {viewport !== 'mobile' && (
              <p className="app-font app-absolute tack-count">
                  <span className="app-font-primary track-title">{matchedCount}</span>
                  /
                  <span className={allTracksMatched ? "app-font-primary track-title" : "app-error track-title"}>
                      {totalCount}
                  </span>
              </p>
            )}
            {viewport === 'mobile' && (
              <p className="app-font tack-count">
                  <span className="app-font-primary track-title">{matchedCount}</span>
                  /
                  <span className={allTracksMatched ? "app-font-primary track-title" : "app-error track-title"}>
                      {totalCount} 
                  </span>
                  &nbsp;tracks found
              </p>
            )}
            {tracks.map((song, idx) => (
                song.spotifyTrackName ? (
                    <div key={idx} className="app-row app-flex app-gap-1 song-card spacer">
                        <div className="app-flex app-col app-fl-2">
                            <img src={song.spotifyAlbumArt ? song.spotifyAlbumArt : placeholderImg} alt="album art" className="album-art" />
                        </div>
                        <div className="app-flex app-col app-fl-10">
                            <div className="track-title app-font app-font-primary">{song.spotifyTrackName}</div>
                            <div className="track-artist app-font"><strong>By: </strong>{song.slfmArtistName}</div>
                            {song.spotifyTrackName && (
                                <div className="track-album app-font">
                                    Album: {song.spotifyAlbum}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div key={idx} className="app-row app-flex app-gap-1 song-card spacer">
                        <div className="app-flex app-col app-fl-2 app-relative">
                            <img src={song.spotifyAlbumArt ? song.spotifyAlbumArt : placeholderImg} alt="album art" className="album-art" />
                        </div>
                        <div className="app-flex app-col app-fl-10 app-relative">
                            <div className="track-title app-font app-error">Track Couldn't Be Found on Spotify</div>
                            <div className="track-artist app-font"><strong>{song.slfmTrackName}</strong></div>
                            <div className="track-artist app-font"><strong>By: </strong>{song.slfmArtistName}</div>
                            <button
                              className="app-button app-font-white app-absolute resolve-button"
                              onClick={() => {
                                if (!token) return; 
                                dispatch(setModalContent(
                                  <SpotifyTrackSearch
                                    token={token}
                                    trackName={song.slfmTrackName}
                                    artistName={song.slfmArtistName}
                                    trackIndex={idx}
                                    onAdd={(index, enrichedData) => {
                                      setTracks(prevTracks => {
                                        const updated = [...prevTracks];
                                        updated[index] = { ...updated[index], ...enrichedData };
                                        return updated;
                                      });
                                      dispatch(closeModal());
                                    }}
                                  />
                                ));
                                dispatch(openModal());
                              }}
                            >
                              Resolve
                            </button>
                        </div>
                    </div>
                )
              
            ))}
          </div>
        ) : (
          <p>No tracks found.</p>
        )
      )}
    </div>
  );
};

export default SpotifyTrackDisplay;
