import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {defaultStyles} from '../../../config/styles/defaultStyles';
import LottieView from 'lottie-react-native';
import {PlayAudioChat, PlayAudioChatInv} from '../../../assets/Icons/IconSvg';
import moment from 'moment';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../reusable/CustomText';

const AudioBubble = ({message, myId}) => {

  // console.log('audio bubble message: ', message);
  // console.log('myId: ', myId);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const mymessage = message?.from?.toString() == myId?.toString();
  // console.log("message: ", message);
 
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const playAudio = async () => {
    try {
      await audioRecorderPlayer.startPlayer(message?.message);

      setPlaying(true);
      audioRecorderPlayer.addPlayBackListener(({ current_position }) => {

        setDuration(current_position);
      });
    } catch (err) {
      setPlaying(false);
      console.error('Error playing audio:', err);
    }
  };

  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
console.log('✌️stopPlayer  stopped--->');
    setPlaying(false);
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View style={[styles.bubble(mymessage)]}>
      <View style={defaultStyles?.flexRow}>
        {mymessage ? (
          <Pressable onPress={playing ? onStopPlay : playAudio}>
            {playing ? (
              <MaterialCommunityIcons
                name={playing ? 'pause' : 'play'}
                size={28}
                color={'white'}
              />
            ) : (
              <PlayAudioChat />
            )}
          </Pressable>
        ) : (
          <Pressable onPress={playing ? onStopPlay : playAudio}>
            {playing ? (
              <MaterialCommunityIcons
                name={'pause'}
                size={28}
                color={udyamitaTheme.primaryColor}
              />
            ) : (
              <>
             
                <PlayAudioChatInv />
              </>
            )}
          </Pressable>
        )}
        <Image
          source={
            mymessage
              ? require('../../../assets/images/audioStatic.png')
              : require('../../../assets/images/audioStaticInv.png')
          }
          style={{maxHeight: 32, maxWidth: 155, margin: 4}}
        />
      </View>
      {/* <Text>
        {`${moment.utc(duration * 1000).format('mm:ss')} / ${moment.utc(message?.duration * 1000).format('mm:ss')}`}
      </Text> */}
      <CustomText style={styles.time(mymessage)} type="label">
        {moment(message?.createdAt).format('h:mm A')}
      </CustomText>
    </View>
  );
};

export default AudioBubble;

const styles = StyleSheet.create({
  bubble(right) {
    return {
      backgroundColor: right ? udyamitaTheme.primaryColor : 'white',
      elevation: 5,
      alignSelf: right ? 'flex-end' : 'flex-start',
      marginBottom: 4,
      padding: 5,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: right ? 12 : 0,
      borderBottomRightRadius: right ? 0 : 10,
      marginHorizontal: 15,
      minWidth: 75,
      maxWidth: '80%',
      marginTop: 5,
    };
  },
  text(right) {
    return {
      color: right ? 'white' : 'black',
      marginHorizontal: 5,
      fontFamily: udyamitaTheme.mainThemeFontFamily,
      fontSize: udyamitaTheme.themeFontSizeLabel,
    };
  },
  time(right) {
    return {
      fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
      color: right ? 'white' : 'grey',
      alignSelf: right ? 'flex-end' : 'flex-start',
      fontFamily: udyamitaTheme.mainThemeFontFamily,
      marginLeft: 5,
    };
  },
});
