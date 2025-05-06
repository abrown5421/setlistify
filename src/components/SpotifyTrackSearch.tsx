import React, { useEffect, useState } from 'react';
import placeholderImg from '../../public/assets/images/placeholder.png';
import '../styles/components/spotify-track-search.css';
import { SpotifyTrackSearchProps } from '../types/globalTypes';

const SpotifyTrackSearch: React.FC<SpotifyTrackSearchProps> = ({ token, trackName, trackIndex, artistName, onAdd }) => {
  const [trackQuery, setTrackQuery] = useState<string>(`${trackName}`);
  const [artistQuery, setArtistQuery] = useState<string>(`${artistName}`);
  const [albumQuery, setAlbumQuery] = useState<string>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSpotify = async () => {
    const searchTerms = [];
    if (trackQuery) searchTerms.push(`track:${trackQuery}`);
    if (artistQuery) searchTerms.push(`artist:${artistQuery}`);
    if (albumQuery) searchTerms.push(`album:${albumQuery}`);
  
    if (searchTerms.length === 0) return;
  
    const searchTerm = searchTerms.join(' ');
    setLoading(true);
  
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`;
  
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      setResults(data.tracks?.items || []);
    } catch (err) {
      console.error('Spotify search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchSpotify();
  }, [trackQuery, albumQuery, artistQuery]);

  return (
    <div>
      <div className='track-title app-font app-font-primary'>Search For a Spotify Track</div>
      <div className='app-flex app-row app-gap-1 app-v-m1'>
        <input
            type="text"
            className="search-input"
            value={trackQuery}
            onChange={e => setTrackQuery(e.target.value)}
            placeholder="Track"
        />
        <input
            type="text"
            className="search-input"
            value={artistQuery}
            onChange={e => setArtistQuery(e.target.value)}
            placeholder="Artist"
        />
        <input
            type="text"
            className="search-input"
            value={albumQuery}
            onChange={e => setAlbumQuery(e.target.value)}
            placeholder="Album"
        />
      </div>
      
      {loading && <div className="app-spinner" />}
      {!loading && results.length > 0 && (
        <div className="app-col app-gap-1">
          {results.map((track, idx) => (
            <div key={idx} className="app-row app-flex app-gap-1 song-card spacer">
              <div className="app-col app-fl-2">
                <img
                  src={track.album?.images?.[0]?.url || placeholderImg}
                  alt="Album Art"
                  className="album-art"
                />
              </div>
              <div className="app-col app-fl-8">
                <div className="track-title app-font app-font-primary">{track.name}</div>
                <div className="track-artist app-font">
                  <strong>By: </strong>{track.artists.map((a: any) => a.name).join(', ')}
                </div>
                <div className="track-album app-font">
                  Album: {track.album?.name}
                </div>
              </div>
              <div className="app-col app-fl-2 app-flex app-ai-center">
                <button className="app-button" onClick={() => {
                    const enrichedData = {
                        spotifyTrackId: track.id,
                        spotifyArtist: track.artists[0]?.name,
                        spotifyTrackName: track.name,
                        spotifyAlbum: track.album?.name,
                        spotifyAlbumArt: track.album?.images?.[0]?.url,
                    };
                    onAdd(trackIndex, enrichedData);
                    }}>
                    Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && results.length === 0 && (
        <p className="app-font">No results found.</p>
      )}
    </div>
  );
};

export default SpotifyTrackSearch;
