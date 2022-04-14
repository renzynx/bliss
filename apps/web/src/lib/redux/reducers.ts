import { combineReducers } from '@reduxjs/toolkit';
import { auth } from './slices/auth.slice';
import { userSlice } from './slices/user.slice';

export const reducer = combineReducers({
  user: userSlice.reducer,
  [auth.reducerPath]: auth.reducer,
});
