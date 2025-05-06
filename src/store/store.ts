import { configureStore } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewportSlice';
import activePageReducer from './slices/activePageSlice';
import authenticationReducer from './slices/authenticationSlice';
import searchParamsReducer from './slices/searchParamsSlice';
import notificationReducer from './slices/notificationSlice';
import searchResultsReducer from './slices/searchResultsSlice';
import selectedSetlistReducer from './slices/selectedSetlist';
import drawerReducer from './slices/drawerSlice';
import modalReducer from './slices/modalSlice';
import playlistReducer from './slices/playlistSlice';

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
    activePage: activePageReducer,
    authentication: authenticationReducer,
    searchParams: searchParamsReducer,
    notification: notificationReducer,
    searchResults: searchResultsReducer,
    selectedSetlist: selectedSetlistReducer,
    drawer: drawerReducer,
    modal: modalReducer,
    playlist: playlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
