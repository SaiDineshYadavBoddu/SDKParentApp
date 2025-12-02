import { createSlice } from "@reduxjs/toolkit";
import { cardApi } from "./card.api";

interface CardState {
  // Add card-related state here
}

const initialState: CardState = {};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add matchers for card API endpoints here
    // Example:
    // builder.addMatcher(
    //   cardApi.endpoints.getCards.matchFulfilled,
    //   (state, { payload }) => {
    //     state.cards = payload;
    //   }
    // );
  },
});

