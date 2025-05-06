import React, { useEffect, useState } from 'react';
import '../styles/components/spotify-playlist-save-form.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDescription, setPlistName, setTracklist } from '../store/slices/playlistSlice';
import { ExtractedSong } from '../types/globalTypes';
import { closeNotification, setMessage, setOpen, setSeverity } from '../store/slices/notificationSlice';
import { closeModal } from '../store/slices/modalSlice';

const SpotifyPlaylistSaveForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { name, description, tracklist } = useAppSelector((state) => state.playlist);
  const selectedSetlist = useAppSelector(state => state.selectedSetlist);
  const token = useAppSelector(state => state.authentication.token);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  useEffect(()=>{
      let removeEmptyTracks: ExtractedSong[] = [];
      if (Array.isArray(tracklist)) {
        removeEmptyTracks = tracklist.filter(track => track.spotifyTrackId);
      }
      dispatch(setPlistName(
        `${selectedSetlist.setlist?.artist.name ?? ''} Live From ${selectedSetlist.setlist?.venue.name ?? ''}`
      ));
      dispatch(setDescription(selectedSetlist.setlist?.info ?? ''));
      dispatch(setTracklist(removeEmptyTracks))
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlistName(e.target.value));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDescription(e.target.value));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      description: '',
    };

    if (!name) {
      newErrors.name = 'Playlist name is required';
      valid = false;
    }

    if (!description) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }
  
      const userData = await userResponse.json();
      const userId = userData.id;
  
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          public: true,
        }),
      });
  
      if (!createResponse.ok) {
        throw new Error('Failed to create playlist');
      }
  
      const playlistData = await createResponse.json();
      const playlistId = playlistData.id;
  
      const uris = tracklist.map(track => `spotify:track:${track.spotifyTrackId}`);
  
      if (uris.length > 0) {
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris }),
        });
  
        if (!addTracksResponse.ok) {
          throw new Error('Failed to add tracks to playlist');
        }
      }
      dispatch(closeModal())
      dispatch(setOpen(true));
      dispatch(setSeverity('success'));
      dispatch(setMessage('Playlist Saved Successfully'));
      setTimeout(() => dispatch(closeNotification()), 3000);
    } catch (error: any) {
      console.error(error);
      dispatch(setOpen(true));
      dispatch(setSeverity('error'));
      dispatch(setMessage('There was an error saving your playlist, please try again later.'));
      setTimeout(() => dispatch(closeNotification()), 3000);
    }
  };

  return (
    <div className='playlist-form app-w-percent-100'>
        <div className='headliner app-font-primary form-head'>Save Spotify Playlist</div>
        <div className="app-flex app-row app-gap-1 app-v-m1">
            <div className='app-flex app-col app-fl-5'>
                <input
                    id="playlistName"
                    type="text" 
                    placeholder="Playlist Name"
                    value={name}
                    onChange={handleNameChange}
                    required
                    className={`p-form-input ${errors.name ? 'error' : ''}`}
                />
            </div>

            <div className='app-flex app-col app-fl-5'>
                <input
                    id="playlistName"
                    type="text"
                    placeholder="Playlist Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                    className={`p-form-input ${errors.description ? 'error' : ''}`}
                />
            </div>
            <div className='app-flex app-col app-fl-1'>
                <button onClick={handleSave} className="app-button app-col app-fl-1 app-bg-primary app-font-black">
                    Save
                </button>
            </div>
        </div>
        <div className="app-flex app-row app-gap-1 app-v-m1">
            {errors.name && <div className='app-flex app-col app-fl-5 error-message'>{errors.name}</div>}
            {errors.description && <div className='app-flex app-col app-fl-5 error-message'>{errors.description}</div>}
            <div className='app-flex app-col app-fl-1'></div>
        </div>
        {tracklist.map((track, index) => (
            <div key={index} className='app-flex app-row app-jc-between app-v-m1 app-gap-1'>
                <div className='app-flex app-col app-fl-1'>
                    <img src={track.spotifyAlbumArt} className='album-art' alt={track.spotifyAlbum} />
                </div>
                <div className='app-flex app-col app-fl-10'>
                    <div className='app-font title'>{track.spotifyTrackName}</div>
                    <div className='app-font artist'>{track.spotifyArtist}</div>
                    <div className='app-font album'>{track.spotifyAlbum}</div>
                </div>
            </div>
        ))}
        
    </div>

  );
};

export default SpotifyPlaylistSaveForm;
