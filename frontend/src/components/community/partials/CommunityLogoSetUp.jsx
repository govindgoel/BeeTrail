import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import React,{useState} from 'react';
import {useTranslation} from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const CommunityLogoSetUp = ({navigation,communityDetails,setCommunityDetails}) => {
  const [selectedImage, setSelectedImage] = useState(communityDetails?.logoUrl || null);
  const getFileItem = image => ({
    uri: image.path,
    type: image.mime,
    name:
      image.filename ||
      `profile_pic.${image.path.split('.')[image.path.split('.').length - 1]}`,
  });
  const handleChooseFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        // cropping: true,
        multiple: false,
        compressImageQuality:0.2
      });

      
       setSelectedImage(image.path);
      setCommunityDetails({...communityDetails, logoUrl:getFileItem(image)})
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const {t} = useTranslation();
  return (
    <View>
    {/* <Text style={styles.label}>{t("addProfilePictureForTheCommunity")}</Text> */}
    <CustomText style={styles.label} type='label'>{t("addProfilePictureForTheCommunity")}</CustomText>
    <View style={styles.addMediaContainer}>
      {selectedImage ? ( // Conditionally render the selected image if it exists
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleChooseFromLibrary}>
          <Image source={require('../../../assets/images/AddMediaColor.png')} />
          {/* <Text style={styles.uploadText}>{t("uploadAPhoto")}</Text> */}
           <CustomText style={styles.uploadText} type="label">{t("uploadAPhoto")}</CustomText>
        </TouchableOpacity>
      )}
       {selectedImage && (
          <TouchableOpacity style={styles.editButton} onPress={handleChooseFromLibrary}>
           
            <Image source={require('../../../assets/images/Edit.png')} style={{width:16,height:17,marginRight:5}} />
            {/* <Text style={styles.editText}>{t("edit")}</Text> */}
            <CustomText style={styles.editText}>{t("edit")}</CustomText>
          </TouchableOpacity>
        )}
    </View>
  </View>
  );
};

export default CommunityLogoSetUp;
const styles = StyleSheet.create({
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 15,
    marginBottom: 10,
  },
  addMediaContainer: {
    backgroundColor: 'rgba(203, 203, 203, 0.1)',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 312,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFE0D3',
    //width: 155,
    height: 43,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
padding:10
  },
  uploadText:{
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeLabel,
    marginLeft:10
  },
  selectedImage: {
    width: '100%', 
    height: 312, 
    borderRadius: 10, 
   resizeMode:'cover'
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff', 
    padding:10,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderWidth:1,
    borderColor:udyamitaTheme.primaryColor
  },
  editText:{
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.primaryColor,
    fontSize:udyamitaTheme.themeFontSizeLabel
  }
});
