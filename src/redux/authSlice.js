import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  authToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.authToken = action.payload.token
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.authToken = null
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export default authSlice;
