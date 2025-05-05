import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResults } from '../../types/globalTypes';

interface SearchResultsState {
  data: SearchResults | null;
  loading: boolean;
  error: string | null;
}

const initialState: SearchResultsState = {
  data: null,
  loading: false,
  error: null,
};

const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    fetchSearchResultsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSearchResultsSuccess(state, action: PayloadAction<SearchResults>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchSearchResultsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearchResults(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  fetchSearchResultsStart,
  fetchSearchResultsSuccess,
  fetchSearchResultsFailure,
  clearSearchResults,
} = searchResultsSlice.actions;

export default searchResultsSlice.reducer;
