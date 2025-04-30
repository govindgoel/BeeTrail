import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import CustomText from '../../components/reusable/CustomText';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'react-native-raw-bottom-sheet';
import {FetchIcon} from '../../assets/Icons/IconSvg';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import React, {useState, useEffect, useRef} from 'react';
import Geocoder from 'react-native-geocoding';
import {useFocusEffect} from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
// import CustomText from '../../components/reusable/CustomText';
const Farmregistry_addphotos = ({
  navigation,
  farmdetails,
  setfarmdetails,
  setAllowProceedToNextScreen,
  address,
  geoCoordinates,
  isEdit,
  userInfo,
}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef();
  const [selectedImage, setSelectedImage] = useState([]);

  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);
  useEffect(() => {
    const allowNext = farmdetails.profilepicture?.length > 0;
    console.log(farmdetails);
    setAllowProceedToNextScreen(allowNext);
  }, [farmdetails, address]);
  const getFileItem = image => ({
    uri: image.path,
    type: image.mime,
    name:
      image.filename ||
      `profile_pic.${image.path.split('.')[image.path.split('.').length - 1]}`,
  });
  const handleChooseFromLibrary = async () => {
    try {
      const ph = await ImagePicker.openPicker({
        multiple: true,
        includeExif: true,
        includeBase64: true,
        width: 640,
        height: 480,
        mediaType: 'photo',
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.3,
        maxFiles: 6,
      });
      console.log(ph);
      const newImages = ph.map(image => ({
        data:image.data,
        path:image.path,
        uri: image.path,
        type: image.mime,
        name:
          image.filename ||
          `profile_pic.${
            image.path.split('.')[image.path.split('.').length - 1]
          }`,
      }));

      setfarmdetails({
        ...farmdetails,
        profilepicture: [...farmdetails?.profilepicture, ...newImages].slice(0, 6),
      });
      // setfarmdetails({
      //   ...farmdetails,
      //   latitude: ph.exif.Latitude,
      //   longitude: ph.exif.Longitude,
      //   apiaryImage: ph.path,
      // });
      console.log('🚀 ~ handleChooseFromLibrary ~ ph:', ph.length);
      console.log(selectedImage);
      // if multiple images are selected
      // for (let i = 0; i < ph.length; i++) {
      //   const image = ph[i];
      //   console.log(JSON.stringify(image.exif));
      // }
      bottomSheetRef.current.close();
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };
  const handleTakePhoto = async () => {
    try {
      const media = await ImagePicker.openCamera({
        includeExif: true,
        includeBase64: true,
        width: 640,
        height: 480,
        mediaType: 'photo',
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.3,
        maxFiles: 6,

        multiple: true,
      });

      console.log('media.exif', media.path);

      if (!media) {
        console.error('No media selected or an error occurred.');
        return;
      }
      console.log(selectedImage);
      setfarmdetails({
        ...farmdetails,
        profilepicture: [...farmdetails?.profilepicture, media].slice(0, 6),
      });

      // setfarmdetails({
      //   ...farmdetails,
      //   latitude: media.exif.Latitude,
      //   longitude: media.exif.Longitude,
      //   apiaryImage: media.path,
      // });
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }

      bottomSheetRef.current.close();
    } catch (error) {
      console.error('Error taking a photo:', error);
    }
  };
  const RBSheetBottomOptionsComponent = () => {
    return (
      <React.Fragment>
        <TouchableOpacity
          style={{
            padding: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
              fontSize: udyamitaTheme.themeFontSizeButton,
              color: udyamitaTheme.textColor,
            }}>
            {t('addPhotos')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,

            alignItems: 'center',
            height: 70,
            flexDirection: 'row',
          }}
          onPress={() => handleChooseFromLibrary()}>
          <Image
            source={require('../../assets/images/addmediaGreen.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('chooseFromLibrary')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            flexDirection: 'row',
          }}
          onPress={() => handleTakePhoto()}>
          <Image
            source={require('../../assets/images/CameraGreen.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('takePhoto')}
          </CustomText>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  // Modify the title using the modifyTitle function
  //const modifiedTitle = modifyTitle(title);

  return (
    <View>
      <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
        <Text style={{color: '#262626', fontSize: 14, fontWeight: '600'}}>
          Add Photos
        </Text>
        <Text style={styles.label}>You can add up to 6 photos</Text>

        <View style={[styles.addMediaContainer,{borderWidth:farmdetails?.profilepicture?.length>0?0:0.5,alignItems: farmdetails?.profilepicture?.length>0?null:'center',
    justifyContent:farmdetails?.profilepicture?.length>0?null: 'center',}]}>
          {farmdetails?.profilepicture?.length > 0 ? (
            <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',flexWrap:'wrap',width:'100%',gap:15}}> 
            {farmdetails?.profilepicture?.map((it, id) => (
              <Image
                source={{
                  uri: it ? (it.path ? it.path : it) : null,
                }}
                style={styles.selectedImage}
              />
            ))}
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => bottomSheetRef.current.open()}>
                <Text style={styles.uploadText}>+</Text>
                <Text style={styles.uploadText}>{t('uploadAPhoto')}</Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  color: '#262626',
                  marginTop: 20,
                  fontWeight: '400',
                }}>
                Showcase Your Farm and Blooms
              </Text>
            </>
          )}

          {farmdetails?.profilepicture?.length > 0 && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => bottomSheetRef.current.open()}>
              <Image
                source={require('../../assets/images/EditGreen.png')}
                style={{width: 16, height: 17, marginRight: 5}}
              />
              <Text style={styles.editText}>{t('edit')}</Text>
            </TouchableOpacity>
          )}
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={240}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: udyamitaTheme.borderStyleColor,
            },
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: '#fff',
            },
          }}>
          <RBSheetBottomOptionsComponent />
        </BottomSheet>
      </View>
    </View>
  );
};

export default Farmregistry_addphotos;

const styles = StyleSheet.create({
  hiveDetailsSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontWeight: '400',
    fontSize: 12,

    marginBottom: 10,
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  textInputWrapNormal: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  },
  fetchBtn: {
    height: 52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 6,
    borderColor: udyamitaTheme.beeAppColor,
    borderWidth: 1.2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 20,
  },
  fetchTxt: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    lineHeight: 24,
    marginLeft: 10,
  },
  greenBtn: {
    backgroundColor: udyamitaTheme.beeAppColor,
    height: 52,
    margin: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  greenBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  editText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: udyamitaTheme.beeAppColor,
  },
  uploadText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginLeft: 10,
  },
  selectedImage: {
    width: '47%',
    height: 124,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  addMediaContainer: {
    backgroundColor: 'rgba(203, 203, 203, 0.1)',
    // paddingVertical: 8,
    // borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 258,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  button: {
    backgroundColor: '#E6F3EE',
    //width: 155,
    height: 43,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 10,
  },
  text: {
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    // marginLeft: 10,
    marginLeft: 30,
    color: udyamitaTheme.textColor,
  },
});
