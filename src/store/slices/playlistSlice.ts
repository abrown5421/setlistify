import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistState, ExtractedSong } from '../../types/globalTypes';

const initialState: PlaylistState = {
  name: '',
  description: '',
  tracklist: [],
  albumArt: '',
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setTracklist: (state, action: PayloadAction<ExtractedSong[]>) => {
      state.tracklist = action.payload;
    },
    setAlbumArt: (state, action: PayloadAction<string>) => {
      state.albumArt = action.payload;
    },
    resetPlaylist: () => initialState,
  },
});

export const { setName, setDescription, setTracklist, setAlbumArt, resetPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
