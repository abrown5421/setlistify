import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Setlist } from '../../types/globalTypes';

interface SelectedSetlistState {
  setlist: Setlist | null;
}

const initialState: SelectedSetlistState = {
  setlist: null,
};

const selectedSetlistSlice = createSlice({
  name: 'selectedSetlist',
  initialState,
  reducers: {
    setSelectedSetlist: (state, action: PayloadAction<Setlist>) => {
      state.setlist = action.payload;
    },
    clearSelectedSetlist: (state) => {
      state.setlist = null;
    },
  },
});

export const { setSelectedSetlist, clearSelectedSetlist } = selectedSetlistSlice.actions;

export default selectedSetlistSlice.reducer;
