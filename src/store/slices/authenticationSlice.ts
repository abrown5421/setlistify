import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthenticationState, SpotifyUser } from '../../types/globalTypes';

  const initialState: AuthenticationState = {
    token: null,
    isAuthenticated: false,
    user: null,
  };
  
  const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
      setToken: (state, action: PayloadAction<string | null>) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      },
      setUser: (state, action: PayloadAction<SpotifyUser>) => {
        state.user = action.payload;
      },
      logout: (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      },
    },
  });
  
  export const { setToken, setUser, logout } = authenticationSlice.actions;
  export default authenticationSlice.reducer;