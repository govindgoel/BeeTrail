import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import moment from 'moment';
import {Modal, Portal} from 'react-native-paper';

import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';

const ImageBubble = ({message, myId}) => {
  // console.log('message: ', message);
  // console.log('myId: ', myId);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white'};
  const mymessage = message?.from?.toString() == myId?.toString();
console.log(moment(message?.createdAt).format('h:mm A'))
  return (
    <>
      <Pressable style={styles.bubble(mymessage)} onPress={showModal}>
        <Image
          source={{
            uri: message?.message,
          }}
          style={{height: 222, width: 282,borderRadius:6}}
        />
        <CustomText style={styles.time(mymessage)} type='label'>
          {moment(message?.createdAt).format('h:mm A')}
        </CustomText>
      </Pressable>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Image
            source={{
              uri: message?.message,
            }}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </Modal>
      </Portal>
    </>
  );
};

export default ImageBubble;

const styles = StyleSheet.create({
  bubble(right) {
    return {
      backgroundColor: right ? udyamitaTheme.primaryColor : 'white',
      //elevation: 5,
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
      color: right ? 'black' : 'black',
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
