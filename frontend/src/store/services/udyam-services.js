import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {setQuestion} from '../reducers/udyamReducer';
import {SIMILARITY_MODEL_API_URL} from '@env';

const MLQAModelURL =  SIMILARITY_MODEL_API_URL



export const postAudio = createAsyncThunk(
  'org/postAudio',
  async ({dispatch, data, lang}) => {

    //prod-devs
    return await axios
      .post(
        `${MLQAModelURL}/transcribe?lang=${lang}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': true,
          },
        },
      )
      .then(res => {
      
        dispatch(setQuestion(res?.data?.transcription));
      })
      .catch(err => {
        console.log('err:postAudio ', err);
      });
  },
);

export const postAskQuestion = createAsyncThunk(
  'org/postAskQuestion',
  async ({dispatch, data}) => {

    //prod-dev
    return await axios
      .post(`${MLQAModelURL}/askQuestion`, data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': true,
        },
      })
      .then(res => {
        console.log('postAskQuestion res: ', res?.data);
        return res;
      })
      .catch(err => {
        console.log('postAskQuestion err:', err);
        return err;
      });
  },
);

export const postFeedback = createAsyncThunk(
  'org/postFeedback',
  async ({dispatch, data}) => {
 
    //prod-dev
    return await axios
      .post(`${MLQAModelURL}/feedback`, data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': true,
        },
      })
      .then(res => {
        console.log('postFeedback res: ', res);
        return res;
      })
      .catch(err => {
        console.log('postFeedback err:', err);
      });
  },
);

export const getPastQuestionsByUser = createAsyncThunk(
  'org/getPastQuestionsByUser',
  async ({dispatch, data}) => {
    // console.log('data: getPastQuestionsByUser', data);
    //prod-dev
   
    return await axios
      .get(`${MLQAModelURL}/past_question/${data}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': true,
        },
      })
      .then(res => {
        // console.log('getPastQuestionsByUser res: ', res?.data);
        return res?.data;
      })
      .catch(err => {
        console.log('getPastQuestionsByUser err:', err);
      });
  },
);
