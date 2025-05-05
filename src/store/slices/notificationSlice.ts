import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState } from '../../types/globalTypes';

const initialState: NotificationState = {
    open: false,
    severity: '',
    message: '',
};

const searchParamsSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setSeverity: (state, action: PayloadAction<string>) => {
      state.severity = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    closeNotification: (state) => {
      state.open = false;
      setTimeout(() => {
        state.severity = '';
        state.message = '';
      }, 250)
    },
  },
});

export const { setOpen, setSeverity, setMessage, closeNotification } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;