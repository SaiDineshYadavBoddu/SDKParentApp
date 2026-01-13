import { createSlice } from "@reduxjs/toolkit";
import { profileApi } from "./profile.api";

interface ProfileState {
  user: any;
}

const initialState: ProfileState = {
  user: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      profileApi.endpoints.getUserDetails.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});