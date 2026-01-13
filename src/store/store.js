import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../network/user/user.slice';
import { cardSlice } from '../network/card/card.slice';
import { backendApi } from '../network/api.config';
import { requestSlice } from '../network/requests/request.slice';
import { profileSlice } from '../network/profile/profile.slice';

export const store = configureStore({
  reducer: {
    [backendApi.reducerPath]: backendApi.reducer,
    [userSlice.name]: userSlice.reducer,
    [cardSlice.name]: cardSlice.reducer,
    [requestSlice.name]: requestSlice.reducer,
    [profileSlice.name]: profileSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(backendApi.middleware),
});
