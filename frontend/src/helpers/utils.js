import React from 'react';
import {Dimensions, PermissionsAndroid} from 'react-native';
import {
  udyamitaTheme,
  udyamitaThemeSm,
  udyamitaThemeLg,
  themeSizeWrappedEn,
} from '../config/styles/udyamitaTheme';
import {
  udyamitaThemeHi,
  udyamitaThemeHiSm,
  udyamitaThemeHiLg,
  themeSizeWrappedHi,
} from '../config/styles/udyamitaThemeHi';
import {
  udyamitaThemeBn,
  udyamitaThemeBnSm,
  udyamitaThemeBnLg,
  themeSizeWrappedBn,
} from '../config/styles/udyamitaThemeBn';
import {
  udyamitaThemeOd,
  udyamitaThemeOdSm,
  udyamitaThemeOdLg,
  themeSizeWrappedOd,
} from '../config/styles/udyamitaThemeOd';
import {
  udyamitaThemeKn,
  udyamitaThemeKnSm,
  udyamitaThemeKnLg,
  themeSizeWrappedKn,
} from '../config/styles/udyamitaThemeKn';
import {
  udyamitaThemeMr,
  udyamitaThemeMrSm,
  udyamitaThemeMrLg,
  themeSizeWrappedMr,
} from '../config/styles/udyamitaThemeMr';
import {
  udyamitaThemeTe,
  udyamitaThemeTeSm,
  udyamitaThemeTeLg,
  themeSizeWrappedTe,
} from '../config/styles/udyamitaThemeTe';

const langMap = new Map([
  ['en', themeSizeWrappedEn],
  ['hi', themeSizeWrappedHi],
  ['od', themeSizeWrappedOd],
  ['kn', themeSizeWrappedKn],
  ['mr', themeSizeWrappedMr],
  ['bn', themeSizeWrappedBn],
  ['te', themeSizeWrappedTe],
  ['english', themeSizeWrappedEn],
  ['hindi', themeSizeWrappedHi],
  ['or', themeSizeWrappedOd],
  ['kannada', themeSizeWrappedKn],
  ['marathi', themeSizeWrappedMr],
  ['bengali', themeSizeWrappedBn],
  ['telugu', themeSizeWrappedTe],
]);

export const textWrapper = (text, length) => {
  if (text?.length > length) {
    return `${text?.substring(0, length)}..`;
  } else {
    return `${text}`;
  }
};

export const getMonthByIndex = index => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[index];
};

//
export const getDynamicTheme = lang => {
  // console.log('lang:getDynamicTheme ', lang);
  const currLangTheme = langMap.get(lang);
  // console.log('currLangTheme:getDynamicTheme ', currLangTheme);
  return currLangTheme;
};
export const requestLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('You can use the location');
    return true;
  } else {
    console.log('Location permission denied');
    return false;
  }
};
export const formatIndianMoney = num =>
  Number.isNaN(num) ? 0 : Number(num).toLocaleString();
