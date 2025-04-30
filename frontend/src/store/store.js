import {combineReducers, applyMiddleware} from 'redux';
import {configureStore} from '@reduxjs/toolkit';

import userReducer from './reducers/userReducer';
import entrepreneurReducer from './reducers/entrepreneurReducer';
import udyamReducer from './reducers/udyamReducer';
import beeReducer from './reducers/beeReducer';
import hiveReducer from './reducers/hiveReducer';
import userRoleReducer from './reducers/userRoleReducer';
const rootReducer = combineReducers({
  user: userReducer,
  entrepreneur: entrepreneurReducer,
  udyam: udyamReducer,
  bee: beeReducer,
  hive: hiveReducer,
  userRole:userRoleReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false, immutableCheck: false}),
});
