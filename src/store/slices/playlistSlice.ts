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
    setPlistName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setTracklist: (state, action: PayloadAction<ExtractedSong[]>) => {
      state.tracklist = action.payload;
    },
    resetPlaylist: () => initialState,
  },
});

export const { setPlistName, setDescription, setTracklist, resetPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
