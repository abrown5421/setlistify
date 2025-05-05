import { configureStore } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewportSlice';
import activePageReducer from './slices/activePageSlice';
import authenticationReducer from './slices/authenticationSlice';
import searchParamsReducer from './slices/searchParamsSlice';

export const store = configureStore({
  reducer: {
    viewport: viewportReducer,
    activePage: activePageReducer,
    authentication: authenticationReducer,
    searchParams: searchParamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
