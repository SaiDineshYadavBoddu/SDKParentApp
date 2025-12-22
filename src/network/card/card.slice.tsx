import { createSlice } from "@reduxjs/toolkit";
import { cardApi } from "./card.api";

interface CardState {
  // Add card-related state here
  cards: Card[];
}

const initialState: CardState = {
  cards: [],
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      cardApi.endpoints.getCards.matchFulfilled,
      (state, { payload }) => {
        state.cards = payload;
      }
    );
  },
});

