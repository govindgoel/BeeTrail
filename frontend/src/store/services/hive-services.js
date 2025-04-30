import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setApiaryObject, setLastSaved} from '../reducers/beeReducer';


export const getLocalHiveDetails = createAsyncThunk(
  'bee/getLocalHiveDetails',
  async ({dispatch}) => {
    return await AsyncStorage.getItem('apiaryObj')
      .then(function (response) {
        dispatch(setApiaryObject(JSON.parse(response)));
        return response;
      })
      .catch(function (error) {
        console.log('getLocalHiveDetails error: ', error);
      });
  },
);

export const saveLocalHiveDetails = createAsyncThunk(
  'bee/saveLocalHiveDetails',
  async ({dispatch, apiaryObj}) => {
    return await AsyncStorage.setItem('apiaryObj', JSON.stringify(apiaryObj))
      .then(function (response) {
        dispatch(setLastSaved(new Date()));
        return response;
      })
      .catch(function (error) {
        console.log('saveLocalHiveDetails error: ', error);
      });
  },
);
