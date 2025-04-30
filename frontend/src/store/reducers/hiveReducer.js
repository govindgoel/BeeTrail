import {createSlice} from '@reduxjs/toolkit';
import React from 'react';

export const hiveSlice = createSlice({
  name: 'hive',
  initialState: {
    hiveObject: {},
    lastSaved: new Date(),
  },
  reducers: {
    setHiveObject: (state, action) => {
      return {
        ...state,
        hiveObject: action.payload,
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

export const {setHiveObject, setLastSaved} = hiveSlice.actions;
export default hiveSlice.reducer;
