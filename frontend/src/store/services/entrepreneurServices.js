import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setBasicInfo, setNotifications} from '../reducers/entrepreneurReducer';
import {transliterationScriptsMap} from '../../screens/apiary-registration/DataApiaryRegistration';

export const getLocalUserInfo = createAsyncThunk(
  'udyamita/getLocalUserInfo',
  async ({dispatch}) => {
    return await AsyncStorage.getItem('userInfo')
      .then(function (response) {
        dispatch(setBasicInfo(JSON.parse(response)));
        return response;
      })
      .catch(function (error) {
        console.log('getLocalHiveDetails error: ', error);
      });
  },
);

export const getUserNotifications = createAsyncThunk(
  'udyamita/getUserNotifications',
  async ({dispatch}) => {
    return await AsyncStorage.getItem('notifications')
      .then(function (response) {
  
        // dispatch(setNotifications(JSON.parse(response)));
        return response;
      })
      .catch(function (error) {
        console.log('getUserNotifications error: ', error);
      });
  },
);

export const updateUserNotifications = createAsyncThunk(
  'udyamita/updateUserNotifications',
  async ({dispatch, data}) => {
    return await AsyncStorage.setItem('notifications', JSON.stringify(data))
      .then(function (response) {
      
        dispatch(setNotifications(data));
        return response;
      })
      .catch(function (error) {
        console.log('updateUserNotifications error: ', error);
      });
  },
);

export const getTransliterationNames = createAsyncThunk(
  'org/getTransliterationNames',
  async ({data, lang}) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.cognitive.microsofttranslator.com/transliterate?api-version=3.0&language=${
        lang === 'tl' ? 'te' : lang
      }&fromScript=Latn&toScript=${transliterationScriptsMap.get(lang)}`,
      headers: {
        'Content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'c60c40633cae420dae7df665abe235da',
        'Ocp-Apim-Subscription-Region': 'centralindia',
        'X-ClientTraceId': '1bf75bc8-4269-11ee-be56-0242ac120002',
      },
      data: data,
    };

    return await axios
      .request(config)
      .then(res => {
       
        return res?.data[0]?.text;
      })
      .catch(err => {
        console.log('getTransliterationNames err:', err);
      });
  },
);
