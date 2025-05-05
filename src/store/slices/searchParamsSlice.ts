import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchParamsState } from '../../types/globalTypes';

const initialState: SearchParamsState = {
  artist: '',
  venue: '',
  tour: '',
  year: '',
};

const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setArtist: (state, action: PayloadAction<string>) => {
      state.artist = action.payload;
    },
    setVenue: (state, action: PayloadAction<string>) => {
      state.venue = action.payload;
    },
    setTour: (state, action: PayloadAction<string>) => {
      state.tour = action.payload;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    clearAll: (state) => {
      state.artist = '';
      state.venue = '';
      state.tour = '';
      state.year = '';
    },
  },
});

export const { setArtist, setVenue, setTour, setYear, clearAll } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;