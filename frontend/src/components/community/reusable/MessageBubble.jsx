import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';

import moment from 'moment';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';

const MessageBubble = ({message, myId}) => {
//console.log('✌️message --->', message);
 
  const mymessage = message?.from?.toString() == myId?.toString();

  return (
    <Pressable style={styles.bubble(mymessage)}>
      {/* <Image source={{ uri: 'https://picsum.photos/id/237/200/300' }} style={{ height: 150, width: 150 }} /> */}
      {/* <Text style={styles.text(mymessage)}>{message?.message}</Text> */}
      <CustomText style={styles.text(mymessage)} type='label'>{message?.message}</CustomText>
      {/* <Text style={styles.time(mymessage)}>
        {moment(message?.createdAt).format('h:mm A')}
      </Text> */}
      <CustomText style={styles.time(mymessage)} type='label'>{moment(message?.createdAt).format('h:mm A')}</CustomText>
      {/* {message.seenAt && <Text>{t('seen')}</Text>} */}
    </Pressable>
  );
};

export default MessageBubble;

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
