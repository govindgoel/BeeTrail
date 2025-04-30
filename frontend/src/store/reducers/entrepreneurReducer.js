import {createSlice} from '@reduxjs/toolkit';
import React from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';

const initialState = {
  basicInfo: {},
  prefLang: 'en',
  dynThemeActive: false,
  themeType: 'md',
  notifications: [],
  messages: []
};
export const entrepreneurSlice = createSlice({
  name: 'entrepreneur',
  initialState: initialState,
  reducers: {
    setBasicInfo: (state, action) => {
      return {
        ...state,
        basicInfo: action.payload,
      };
    },
    setPrefLang: (state, action) => {
      return {
        ...state,
        prefLang: action.payload,
      };
    },
    setDynThemeActive: (state, action) => {
      return {
        ...state,
        dynThemeActive: action.payload,
      };
    },
    setThemeType: (state, action) => {
      return {
        ...state,
        themeType: action.payload,
      };
    },
    setNotifications: (state, action) => {
      return {
        ...state,
        notifications: action.payload,
      };
    },
    setMessages: (state, action) => {
      return {
        ...state,
        messages: action.payload,
      };
    },
    setInitialEntState: (state, action) => {
      return initialState;
    },
  },
});

export const {
  setBasicInfo,
  setInitialEntState,
  setPrefLang,
  setDynThemeActive,
  setThemeType,
  setNotifications,
  setMessages
} = entrepreneurSlice.actions;
export default entrepreneurSlice.reducer;
