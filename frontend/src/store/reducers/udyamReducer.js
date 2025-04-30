import {createSlice} from '@reduxjs/toolkit';
import React from 'react';

export const udyamSlice = createSlice({
  name: 'udyam',
  initialState: {
    question: '',
    questionInitial: "",
  },
  reducers: {
    setQuestion: (state, action) => {
      return {
        ...state,
        question: action.payload,
      };
    },
    setQuestionInitial: (state, action) => {
      return {
        ...state,
        questionInitial: action.payload,
      };
    },
  },
});

export const {setQuestion, setQuestionInitial} = udyamSlice.actions;
export default udyamSlice.reducer;
