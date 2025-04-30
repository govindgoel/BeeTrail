import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {PrimaryMargin} from './reusable/UIComponentsUdyamApp';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {defaultStyles} from '../config/styles/defaultStyles';
import {useSelector} from 'react-redux';
import AudioRecord from 'react-native-audio-record';
import Voice from '@react-native-community/voice';
import axios from 'axios';

import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import { useNetInfo } from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';


const options = {
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  // wavFile: 'test.wav', // default 'audio.wav'
};
export default function RecordingComponent() {
  const {t} = useTranslation();
  const basicInfo = useSelector(state => state.entrepreneur.basicInfo);
  const [userSelectedLang,setUserSelectedLang] = useState('en');
  const [userInfo, setUserInfo] = useState(false);
 
  const backHandler = () => {
    AudioRecord.stop();
    setRecActive(false);
  };

  useBackHandler(() => {
    if (recActive) {
      backHandler();
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const selectedLang = await getValueByKey('preferredLanguage');

        if (user && user.userInfo) {
          // console.log("userInfo: in topicScreen" ,user.userInfo)
          setUserInfo(user.userInfo);
          setUserSelectedLang(selectedLang);
        }
      };

      getUserInfo();
    }, []),
  );

  const onStartRecord = async () => {
    console.log("onStartRecord");
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    if (!result) {
      console.log("🚀 ~ onStartRecord ~ result:", result)

      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ).then((granted) => {
        console.log("🚀 ~ ).then ~ granted:", granted, PermissionsAndroid.RESULTS)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show('Thanks for granting the access!', Toast.SHORT);
          AudioRecord.init(options);
          AudioRecord.start();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Toast.show('Please enable microphone access from the app settings!', Toast.SHORT);
        } else {
          Toast.show('Microphone access denied!');
        }        
      }).catch(() => {
        Toast.show('Error while seeking permissions!');
      });
    } else {
      AudioRecord.init(options);
      AudioRecord.start();
    }
  };

  const aiforbharatAsr = async base64String => {
    // console.log('base64String: ', base64String);

    let data = JSON.stringify({
      config: {
        language: {
          sourceLanguage: userSelectedLang || userInfo?.preferredLanguage,
        },
        transcriptionFormat: {
          value: 'transcript',
        },
        audioFormat: 'wav',
        samplingRate: '16000',
        postProcessors: null,
      },
      audio: [
        {
          audioContent: base64String,
        },
      ],
      controlConfig: {
        dataTracking: true,
      },
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://demo-api.models.ai4bharat.org/inference/asr/conformer',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log('aiforbharatAsr--', JSON.stringify(response.data));
        console.log(
          'ai4BharatTranscription: ',
          response?.data?.output[0]?.source,
        );
        dispatch(setQuestion(response.data?.output[0]?.source));
        console.log(
          base64String,
          '<<<<< ===== base64String == >> aiforbharatAsr ',
        );
        navigation.navigate('AnswerScreen', {
          base64string: base64String,
          language:userSelectedLang || userInfo?.preferredLanguage,
          userId: userInfo?._id,
        });
        setRecActive(false);
        // return JSON.stringify(response.data);
      })
      .catch(error => {
        console.log('aiforbharatAsr--err', error);
        // return error;
      });
  };

  const postApiCall = async () => {
    let audioFile = await AudioRecord.stop();

    const path = 'file://' + audioFile;
    console.log(
      'userInfo?.prefferedLanguage == >> ',
      userInfo?.prefferedLanguage,
    );
    if (
      userInfo?.preferredLanguage === 'en' ||
      userInfo?.preferredLanguage === 'english' || userSelectedLang === 'en'
    ) {
      // bhashini test setup
      const base64string = await readFile(path, 'base64');
      console.log(
        base64string,
        'base64String : in topic screen 163=>>> english',
      );
      // setRecActive(false);
      const bhashinitranscribed = await getText('en', base64string);
      dispatch(setQuestion(bhashinitranscribed));
      console.log('bhashinitranscribed in lang enlgish', bhashinitranscribed);
      console.log(
        base64string,
        'base64String : << === in topic screen 168=>>> english',
      );
      navigation.navigate('AnswerScreen', {
        base64string: base64string,
        language: userSelectedLang  || userInfo?.preferredLanguage,
        userId: userInfo?._id,
      });
      setRecActive(false);
    } else {
      // ai4bharat testsetup
      const base64string = await readFile(path, 'base64');
      console.log(base64string, 'non english test audio ');
      aiforbharatAsr(base64string);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const speechStartHandler = e => {
    console.log('speechStart successful', e);
  };

  const speechEndHandler = e => {
    // setLoading(false);
    console.log('stop handler', e);
  };
  const speechResultsHandler = e => {
    const text = e.value[0];
    // setResult(text);
    // console.log('speechResultsHandler', text);
  };

  const startRecording = async () => {
    // setLoading(true);
    let avail = await Voice.isAvailable();
    console.log("Voice.isAvailable()",avail);
    let availServices = await Voice.getSpeechRecognitionServices();
    console.log('availServices: ', availServices);
    try {
      console.log("lang", lang);
      await Voice.start("en-US", { RECOGNIZER_ENGINE: "GOOGLE"});
      setRecActive(true)
    } catch (error) {
      console.log('error', error);
      setRecActive(false);
    }
  };

  const stopRecording = async () => {
    console.log("stop recording");
    try {
      await Voice.stop();
      // setLoading(false);
      setRecActive(false)
    } catch (error) {
      console.log('error', error);
      setRecActive(false);
    }
  };


  const LadyWithBox = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <PrimaryMargin mt={38} />
        {/* <View style={styles.orangeCircle} /> */}
        <Image
          source={require('../assets/images/chatbot2.png')}
          style={{
            minWidth: 113,
            minHeight: 123,
            maxHeight: 123,
          }}
          resizeMode={'contain'}
        />
      </View>
    );
  };
  return (
    <View style={{alignItems: 'center'}}>
      <LadyWithBox />
      <PrimaryMargin mt={8} />
      <Text style={styles.listening}>{t('listening')}</Text>
      <PrimaryMargin mt={8} />
      <View style={[defaultStyles.flexRow, {alignItems: 'center'}]}>
        <Text style={styles.subStop}>{t('namaste')}</Text>
        <Text style={styles.subStop}> {basicInfo?.name}! </Text>
        <Text style={styles.subStop}>{t('yourQuestion2')}</Text>
      </View>
      <Text style={styles.subStop}>{t('qBeingRecorded')}</Text>
      <View style={{marginTop: 2}}>
        <LottieView
          source={require('../assets/images/speechIndicat3.json')}
          autoPlay
          loop
          style={{
            width: 240,
            height: 240,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orangeCircle: {
    minWidth: 85,
    maxWidth: 85,
    minHeight: 85,
    maxHeight: 85,
    borderRadius: 42.5,
    borderColor: udyamitaTheme.primaryColor,
    borderWidth: 1,
  },
  indicatorStyle: {
    marginTop: 42,
  },
  listening: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    lineHeight: 24,
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    textAlign: 'center',
    color: udyamitaTheme?.primaryColor,
  },
  subStop: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 24,
    color:udyamitaTheme.textColor
  },
});
