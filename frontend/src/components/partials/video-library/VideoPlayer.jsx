import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';

const VideoPlayer = ({videoId, isFocused}) => {
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoErr, setVideoErr] = useState(false);
  const youtubeRef = useRef();

  const {height, width} = useWindowDimensions();
  const handleFullScreenChange = isFullScreen => {
    setIsFullScreen(isFullScreen);
    if (isFullScreen) {
      Orientation.lockToLandscape();
      Orientation.lockToPortrait();
    }
  };
  // useEffect(() => {
  //   if (!isFocused) {
  //     youtubeRef?.current?.pause();
  //   }
  // }, [isFocused]);
  return (
    <View>
      <YoutubePlayer
        ref={youtubeRef}
        videoId={videoId}
        useLocalHTML={true}
        forceAndroidAutoplay={true}
        color={udyamitaTheme.primaryColor}
        height={isFullScreen ? height : 250}
        width={isFullScreen ? width : Dimensions.get('screen').width}
        play={isFocused ? false : true}
        // play={true}
        controls={true}
        initialPlayerParams={{
          modestbranding: true,
          // rel:0
          // preventFullScreen: true,
        }}
        onReady={() => {
          setLoading(false);
          setVideoErr(false);
        }}
        onError={err => {
          setLoading(false);
          setVideoErr(true);
          // Todo unavailable video ui
          console.log('err: ', err);
        }}
        onFullScreenChange={handleFullScreenChange}
      />
      <TouchableOpacity
        style={{
          top: 0,
          height: 50,
          width: '100%',
          position: 'absolute',
          // backgroundColor: 'red',
          
        }}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          // backgroundColor: 'red',
          height: 50,
          width: '20%',
          right: 40,
          bottom: 10,
        }}
      />
    </View>
  );
};

export default VideoPlayer;
