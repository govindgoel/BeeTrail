import React, {useState, useEffect, useCallback} from 'react';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {getDynamicTheme} from '../utils';
import { getUser } from '../UserData';

const {width, height} = Dimensions?.get('window');
//
export function useDynamicTheme() {
  const [currTheme, setCurrTheme] = useState();
  const basicInfo = useSelector(state => state?.entrepreneur?.basicInfo);
  const prefLang = useSelector(state => state?.entrepreneur?.prefLang);
  // console.log('prefLang: ', prefLang);
  const currLangTheme = getDynamicTheme(
    basicInfo?.preferredLanguage
      ? basicInfo?.preferredLanguage?.toLowerCase()
      : 'en',
  );


  // useEffect(() => {
     
  // },[prefLang])
  // console.log('currLangTheme: ', currLangTheme);

  //for language test
  // const currLangTheme = getDynamicTheme("kn");

  useEffect(() => {
    // console.log('useDynamicTheme width, height: ', width, height);
    if (height < 700) {
     

      // console.log('useDynamicThemecurrLangTheme: ', currLangTheme);
      // console.log('useDynamicThemecurrLangTheme[1]: ', currLangTheme[1]);
      setCurrTheme(currLangTheme[1]);
    } else if (height > 700 && height < 900) {
      // console.log('test normal range----');
      // console.log('useDynamicThemecurrLangTheme: ', currLangTheme);
      // console.log('useDynamicThemecurrLangTheme[0]: ', currLangTheme[0]);
      setCurrTheme(currLangTheme[0]);
    } else {
      // console.log('test large screens');
      // console.log('useDynamicThemecurrLangTheme: ', currLangTheme);
      // console.log('useDynamicThemecurrLangTheme[2]: ', currLangTheme[2]);
      setCurrTheme(currLangTheme[2]);
    }
  }, [height]);

  return currTheme;
}
