import { createSlice } from '@reduxjs/toolkit';
import { requestApi } from './request.api';

interface RequestState {
  requests: any[];
}

const initialState: RequestState = {
  requests: [],
};

export const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      requestApi.endpoints.getRequests.matchFulfilled,
      (state, action) => {
        state.requests = action.payload.content || [];
      }
    );
    builder.addMatcher(
      requestApi.endpoints.getRequestTypes.matchFulfilled,
      (state, action) => {
        state.requests = action.payload;
      }
    );
  },
});