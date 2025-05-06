import { createSlice } from '@reduxjs/toolkit';
import { DrawerState } from '../../types/globalTypes';

const initialState: DrawerState = {
  isOpen: false,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
