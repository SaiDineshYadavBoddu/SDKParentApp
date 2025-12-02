import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "./user.api";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface UserState {
  postDetails: Post[] | null;
}

const initialState: UserState = {
  postDetails: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getPosts.matchFulfilled,
      (state, { payload }: PayloadAction<Post[]>) => {
        state.postDetails = payload;
      }
    );
  },
});

