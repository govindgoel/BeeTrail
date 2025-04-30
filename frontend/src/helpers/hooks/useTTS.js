import React, {useEffect,useState} from 'react';
import Tts from 'react-native-tts';
import {useSelector} from 'react-redux';
import { getUser } from '../UserData';
// import { useTranslation } from 'react-i18next';
import i18n from "i18next";

function useTTS() {
  const lang = useSelector(state => state?.entrepreneur?.prefLang);
 
  const initTts = async () => {
    // const user = await getUser();
      // const userLang = user.userInfo.preferredLanguage
    // console.log("🚀 ~ initTts ~ userLang:", user)
    // const { i18n } = useTranslation();
    const userLang = i18n.language;
    console.log("🚀 ~ initTts ~ userLang:", userLang)
    try {
      await Tts.engines().then(async engines => {
        const engineName = 'com.google.android.tts';
        const index = engines.findIndex(item => item.name === engineName);
        await Tts.setDefaultEngine(engines[index]?.name);
      });
      const voices = await Tts.voices();
      const downloadedVoices = voices?.filter(v => {
        // return v?.id?.includes(`${userLang ? userLang : 'hi'}-IN`);
        return v?.id?.toLowerCase().includes(`${userLang ? userLang : 'hi'}-IN`.toLowerCase()) && (!v.notInstalled || !v.networkConnectionRequired);
      });
      console.log("🚀 ~ downloadedVoices ~ downloadedVoices:", downloadedVoices.length)
      const availableVoices = downloadedVoices.length>0 ? downloadedVoices : voices?.filter(v => {
        // return v?.id?.includes(`${userLang ? userLang : 'hi'}-IN`);
        return v?.id?.toLowerCase().includes(`${userLang ? userLang : 'hi'}-IN`.toLowerCase());
      });
      console.log("🚀 ~ availableVoices ~ availableVoices:", availableVoices.length)
      let selectedVoice = null;
      if (availableVoices && availableVoices?.length > 0) {
        selectedVoice = availableVoices[0];
        console.log("🚀 ~ initTts ~ availableVoices[0]:", availableVoices[0])
        if (availableVoices[0].notInstalled && availableVoices[0].networkConnectionRequired) {
          const engineName = 'com.google.android.tts';
          await Tts.requestInstallData({name: engineName})
            .then(installData => {
              console.log(`Installation data for ${engineName}:`, installData);
              // Handle the installation data as needed
            })
            .catch(error => {
              console.error(
                `Error requesting installation data for ${engineName}:`,
                error,
              );
              // Handle the error
            });
        } else {
          // console.log( i18n.language)
          if (i18n.language === 'or') {
            await Tts.setDefaultRate(0.30);
          } else if (i18n.language === 'bn') {
            await Tts.setDefaultRate(0.35);
          }          // (i18n.language=='or' )&& await Tts.setDefaultRate(0.30); 
          await Tts.setDefaultVoice(availableVoices[0]?.id);
          await Tts.setDefaultLanguage(availableVoices[0]?.language);
          console.log("🚀 ~ initTts ~ availableVoices[0]?.id:", availableVoices[0]?.id)
          console.log("🚀 ~ initTts ~ availableVoices[0]?.language:", availableVoices[0]?.language)
        }
      }
    } catch (err) {
      console.log('setDefaultLanguage error ', err);
      if (err.code === 'no_engine') {
        await Tts.requestInstallEngine();
      }
    }
  };
  useEffect(() => {
    Tts.getInitStatus().then(initTts);
  }, []);


  return Tts;
}

export {useTTS};
