import {createSlice} from '@reduxjs/toolkit';
import React from 'react';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: false,
  },
  reducers: {
    setLoggedIn: (state, action) => {
   
      return {
        ...state,
        loggedIn: action.payload,
      };
    },
  },
});

export const {setLoggedIn} = userSlice.actions;
export default userSlice.reducer;
