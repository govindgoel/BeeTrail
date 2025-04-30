import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  AppState,
} from 'react-native';
import {
  PauseIcon,
  PlayIcon,
  VolumeDown,
  MutedIcon,
} from '../assets/Icons/IconSvg';
import {defaultStyles} from '../config/styles/defaultStyles';
import {useSoundSetting} from '../helpers/hooks/useSoundSetting';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';

const MAX_WIDTH = 169;
export default function ReadOut({
  stopText,
  readText,
  leftPos,
  currSpchInd,
  ansLeftToSpeak,
  answer,
}) {
  const appState = useRef(AppState.currentState);
  const {muted, toggleVolume} = useSoundSetting();
  const [leftAcc, setLeftAcc] = useState(0);
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [readOn, setReadOn] = useState(false);
  const animatedStyles = {
    transform: [
      {
        translateX: animation,
      },
    ],
  };

  const startAnimation = left => {
    Animated.timing(animation, {
      toValue: (left + currSpchInd / answer?.length) * MAX_WIDTH,
      duration: 10,
      useNativeDriver: true,
    }).start();
  };

  const updateWidth = left => {
    setLeftAcc((left + currSpchInd / answer?.length) * MAX_WIDTH);
    // setLeftAcc(prevState => {
    //   return prevState + currSpchInd / answer?.length;
    // });
  };

  useEffect(() => {
    startAnimation(leftPos);
    updateWidth(leftPos);
  }, [currSpchInd]);

  return (
    <View
    style={[
      defaultStyles?.flexRow,
      {
        backgroundColor: '#FFE0D3',
        borderRadius: 12,
        paddingRight: 12,
        alignItems: 'center',
        minHeight: 42,
        minWidth: '100%',
      },
    ]}>
      <TouchableOpacity
        onPress={() => {
          if (readOn) {
            stopText(currSpchInd);
            setReadOn(false);
          } else {
            readText(currSpchInd, ansLeftToSpeak);
            setReadOn(true);
          }
        }}
        style={{
          minWidth: 20,
          // backgroundColor:'black', 
          alignItems:'center',
          flexDirection:'row',
          paddingLeft:12,
          height:'100%'
        }}>
        {readOn ? <PauseIcon /> : <PlayIcon />}
      </TouchableOpacity>
      <View style={{marginLeft: 5}} />
      <Animated.View
        style={[
          animatedStyles,
          {
            minHeight: 8,
            minWidth: 8,
            borderRadius: 4,
            backgroundColor: udyamitaTheme.primaryColor,
            marginLeft: -2,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          left: 30,
          borderTopWidth: 0.5,
          minWidth: MAX_WIDTH,
          maxWidth: MAX_WIDTH,
          zIndex: -1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          borderColor: udyamitaTheme.primaryColor,
          borderTopWidth: 2,
          left: 30,
          width: leftAcc + 2,
        }}
      />
      <View style={{marginLeft: 10}} />
      <TouchableOpacity
        style={{
          minHeight: 18,
          justifyContent: 'center',
          position: 'absolute',
          right: 20,
        }}
        onPress={() => {
          muted ? toggleVolume(1) : toggleVolume(0);
        }}>
        {muted ? <MutedIcon /> : <VolumeDown />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
