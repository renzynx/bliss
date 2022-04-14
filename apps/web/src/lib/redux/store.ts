import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducers';
import { auth } from './slices/auth.slice';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(auth.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
