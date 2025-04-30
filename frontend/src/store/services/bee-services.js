import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setApiaryObject, setLastSaved} from '../reducers/beeReducer';
import { APP_API_MENTOR_VAlUECHAIN_SERVICES, APP_API_NOTIFICATIONS_URL } from '@env';
import { getToken } from '../../helpers/UserData';

const NotificationsBaseURL = `${APP_API_NOTIFICATIONS_URL}/notifications`;

export const postApiary = createAsyncThunk(
  'bee/postApiary',
  // async ({ dispatch, body, token }) => {
  async ({ dispatch, body }) => {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    const API_URL = `${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries`;


    return await axios
      .post(API_URL, body, config)

      .then(function (response) {

        return response;
      })
      .catch(function (error) {
        console.log('postApiary error: ', error);
      });
  },
);

export const getLocalApiaryDetails = createAsyncThunk(
  'bee/getLocalApiaryDetails',
  async ({dispatch}) => {
    return await AsyncStorage.getItem('apiaryObj')
      .then(function (response) {
        dispatch(setApiaryObject(JSON.parse(response)));
        return response;
      })
      .catch(function (error) {
        console.log('getLocalApiaryDetails error: ', error);
      });
  },
);

export const saveLocalApiaryDetails = createAsyncThunk(
  'bee/getLocalApiaryDetails',
  async ({dispatch, apiaryObj}) => {
    return await AsyncStorage.setItem('apiaryObj', JSON.stringify(apiaryObj))
      .then(function (response) {
        dispatch(setLastSaved(new Date()));
        return response;
      })
      .catch(function (error) {
        console.log('saveLocalApiaryDetails error: ', error);
      });
  },
);


export const getAllLocalKeys = createAsyncThunk(
  'bee/getAllLocalKeys',
  async () => {
    return await AsyncStorage.getAllKeys()
      .then(function (response) {
        // console.log('getAllKeys (response): ', JSON.parse(response));
        return response;
      })
      .catch(function (error) {
        console.log('getAllLocalKeys error: ', error);
      });
  },
);

export const notifyIncompleteInspection = createAsyncThunk(
  'bee/notifyIncompleteInspection',
  async ({dispatch, data, token}) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${NotificationsBaseURL}/singlecastinternal`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };
    
    return await axios
      .request(config)
      .then(function (response) {
      
        return response;
      })
      .catch(function (error) {
        console.log('notifyIncompleteInspection error: ', error);
      });
  },
);

