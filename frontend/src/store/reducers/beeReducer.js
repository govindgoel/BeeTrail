import {createSlice} from '@reduxjs/toolkit';
import React from 'react';

export const beeSlice = createSlice({
  name: 'user',
  initialState: {
    apiaryObject: {},
    lastSaved: new Date(),
  },
  reducers: {
    setApiaryObject: (state, action) => {
      return {
        ...state,
        apiaryObject: action.payload,
      };
    },
    setLastSaved: (state, action) => {
      return {
        ...state,
        lastSaved: action.payload,
      };
    },
  },
});

export const {setApiaryObject, setLastSaved} = beeSlice.actions;
export default beeSlice.reducer;
