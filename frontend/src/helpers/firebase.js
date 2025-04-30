// Import the functions you need from the SDKs you need
import {initializeApp, getApp} from '@firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../../app.config';

const appFirebaseConfig = appConfig.firebaseConfig;

// const firebaseConfig = {
//     apiKey: "AIzaSyDzFysz68ze3lOU-Q_U3XEvlCgDOloVtpM",
//     authDomain: "udyamitamobileapp.firebaseapp.com",
//     projectId: "udyamitamobileapp",
//     storageBucket: "udyamitamobileapp.appspot.com",
//     messagingSenderId: "687511023150",
//     appId: "1:687511023150:web:0536e1bc0cea5e3840b9bf",
//     measurementId: "G-BLT6KGDVSH"
// };

// const newFirebaseConfig = {
//     apiKey: "AIzaSyA8rAEczXWXnu0Enus5eR9MEKRHrOPl7dI",
//     authDomain: "udyamita-mobile-app.firebaseapp.com",
//     projectId: "udyamita-mobile-app",
//     storageBucket: "udyamita-mobile-app.appspot.com",
//     messagingSenderId: "561641805090",
//     appId: "1:561641805090:android:7cf423b821a1c20f52017b",
//     measurementId: "G-BLT6KGDVSH"
// };

// const app = initializeApp(newFirebaseConfig);

// update app config
const app = initializeApp(appFirebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export {auth};
