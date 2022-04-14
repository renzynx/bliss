import type { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@prisma/client';

interface UserState {
  user: User;
  isAuth: boolean;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
} as UserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
  },
});

export const { setUser, setIsAuth } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
