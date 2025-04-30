import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {getValueByKey} from '../../../helpers/UserData';
import Clipboard from '@react-native-clipboard/clipboard';
import {APP_API_LIBRARY_URL} from '@env';

// const APP_API_LIBRARY_URL = "http://192.168.1.57:8085";

const ShareVideo = ({onClose, onShare, videoId}) => {
  const {t} = useTranslation();

  const sharedCount = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .post(`${APP_API_LIBRARY_URL}/media/share/${videoId}`, {}, config)
      .then(response => {
        console.log('yes video gets shared');
        bottomSheetRef.current.close();
      })
      .catch(err => console.log('ERR', err));
  };

  const copyToClipboard = linkToCopy => {
    try {
      Clipboard.setString(`https://deeplink.udyamita.org/video/${videoId}`);
      console.log('This link is copied to clipboard');
      sharedCount();
      onClose();
    } catch (error) {
      console.error('Failed to copy link to clipboard', error);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 40,
          height: 40,
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.mainText}>{t('share')}</Text>
        <TouchableOpacity style={{marginRight: 40}} onPress={() => onClose()}>
          <Image source={require('../../../assets/images/Cross.png')} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.content}
        onPress={() => copyToClipboard()}>
        <Text style={styles.contentText}>{t('copyLink')}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.content}>
        <Text style={styles.contentText}>{t('shareOnMyCommunity')}</Text>
      </TouchableOpacity>  */}
      {/* // To be done later for share on my community and adjust height on React-native bottom sheet*/}

      <TouchableOpacity style={styles.content} onPress={() => onShare()}>
        <Text style={styles.contentText}>{t('shareOnOtherPlatforms')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareVideo;
const styles = StyleSheet.create({
  mainText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    // textAlign:'center',
    marginBottom: 10,
    // marginLeft:20
  },
  content: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    height: 60,
    justifyContent: 'center',
  },
  contentText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
    textAlign: 'center',
  },
});
