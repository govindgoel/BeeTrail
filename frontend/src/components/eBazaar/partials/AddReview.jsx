import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import {BackIcon} from '../../../assets/Icons/IconSvg';
import ImagePicker from 'react-native-image-crop-picker';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {AirbnbRating} from 'react-native-ratings';
import { useTranslation } from 'react-i18next';
import BottomSheet from 'react-native-raw-bottom-sheet';
import ReviewSubmittedModal from '../resuable/ReviewSubmittedModal';
import axios from 'axios'
 import {APP_API_ORDER_SERVICES} from '@env';
import { getValueByKey } from '../../../helpers/UserData';
import CustomText from '../../reusable/CustomText';

const AddReview = ({onClose, navigation,route}) => {

  const [showModal, setShowModal] = useState(false);
  const {t} =useTranslation();
  const bottomSheetRef = useRef(null);
  const [review,setReview] =useState(null)
  const windowHeight = Dimensions.get('window').height;
  const [isFocused, setIsFocused] = useState(false);
  const [reviewImages,setReviewImages] = useState([]);
  const [rating, setRating] = useState(0);
  const [selectedImageUri, setSelectedImageUri] = useState([]);
  const [reviewDone, setReviewDone] = useState(true);
  const [imageIndex, setImageIndex] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [variantId, setVariantId] = useState(route?.params?.selectedItem?._id);
  const [isCameraImage,setIsCameraImage] = useState(true);
  const title = route?.params?.userReview?._id ? `${t('editReview')}` : `${t('reviewNow')}`;  
  const post_review = route?.params?.userReview?._id ? `${t('editReview')}`:`${t('addReview')}`;

  const getFileItem = image => ({
    uri: image.path,
    type: image.mime,
    name:
      image.filename ||
      `media.${image.path.split('.')[image.path.split('.').length - 1]}`,
  });

  const handleMediaResponse = response => {
    
   

    if (Array.isArray(response) && response.length > 0) {
      const selectedImages = response.map(asset => asset.path);
      
      setSelectedImageUri([...selectedImageUri, ...selectedImages]);
      
      setReviewImages(selectedImages);
    }  else if(isCameraImage){
      const selectedImages = response.path;
      
      setSelectedImageUri([...selectedImageUri, selectedImages]);
      setReviewImages(selectedImages);
      // setIsCameraImage(false);
    } else {
      console.log('No assets found in the response.');
    }
  };

  const handlePost = async () => {
    setReviewDone(false);
    let temp = new FormData();

   
    temp.append('productReview', review);
    temp.append("productRating",rating);
    temp.append("variantId",variantId);

    for (let i = 0; i < selectedImageUri.length; i++) {
      temp.append(`media[${i}]`, {
        uri: selectedImageUri[i],
        type: 'image/jpeg',
        name: `image_${i}.${selectedImageUri[i].split('.')[selectedImageUri[i].split('.').length-1]}`
      });
    }
      const data = getRequestBody();
      const token = await getValueByKey('token');

     
      const config = {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      };
      // await axios({
      //   method: isEdit ? 'PUT' : 'POST',
      //   url: apiEndpoint,
      //   data: temp,
      //   config,
      //   headers: config.headers,
      // })
      if(route?.params?.userReview?._id){
        // await axios
        // .put(`${APP_API_ORDER_SERVICES}/product/review/${route?.params?.userReview?._id}`, data, config,headers: config.headers,)
        await axios({
        method: 'PUT' ,
        url: `${APP_API_ORDER_SERVICES}/product/review/${route?.params?.userReview?._id}`,
        data: temp,
        config,
        headers: config.headers,
      })
        .then(response => {
          if (response.status ===200) {
            setShowModal(true);
            // Snackbar.show({text: 'Post added successfully'});
            setRating(null);
            setReview(null);
            setSelectedImageUri(null);
            setReviewDone(true);
            // onClose();
          }
        })
        .catch(err => {
         
          console.log('error while posting', err);
        });
      }else {

      
   

      await axios({
        method: 'POST' ,
        url: `${APP_API_ORDER_SERVICES}/product/review`,
        data: temp,
        config,
        headers: config.headers,
      })
        .then(response => {
          if (response.status === 200 ) {
          
            setShowModal(true);
            // Snackbar.show({text: 'Post added successfully'});
            setRating(null);
            setReview(null);
            setSelectedImageUri(null);
            setReviewDone(true);
            //onClose();
          }
        })
        .catch(err => {
         
          console.log('error while posting review', err);
          // Snackbar.show({text: 'Unable to post '});
        });
      }
    }
  

  const getRequestBody = () => {
    let temp = new FormData();

   
    temp.append('productReview', review);
    temp.append("productRating",rating);
    temp.append("variantId",variantId);

    for (let i = 0; i < selectedImageUri.length; i++) {
      temp.append(`media[${i}]`, {
        uri: selectedImageUri[i],
        type: 'image/jpeg',
        name: `image_${i}.${selectedImageUri[i].split('.')[selectedImageUri[i].split('.').length-1]}`
      });
    }
    return temp;
    
  };

useEffect(()=>{
   if(route?.params?.userReview){
    const {review,productRating,mediaUrls} = route?.params?.userReview

      setReview(review);
      setRating(productRating);
      setSelectedImageUri(mediaUrls);
   }
},[route?.params?.userReview]);


  const handleChooseFromLibrary = async () => {
    try {
      const media = await ImagePicker.openPicker({
        width: 300, // Adjust these options as needed
        height: 400,
        // cropping: true,
        multiple: true,
        mediaType: 'any',
        compressImageQuality:0.2,
        compressVideoPreset:0.2
      });
      // setReviewImages(getFileItem(image));
     
      
        const selectedImages = media.filter(item => item.mime.startsWith('image/'));
        const selectedVideos = media.filter(item => item.mime.startsWith('video/'));
    
      
    
        // Handle the selected media (both images and videos)
        handleMediaResponse(selectedImages, selectedVideos);

      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        // cropping: true,
        multiple:true,
        mediaType: 'any',
        compressImageQuality:0.2,
        compressVideoPreset:0.2
      });
  
      // setReviewImages(getFileItem(image));
     
      setIsCameraImage(true);
     
      
       handleMediaResponse(image);

      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    } catch (error) {
      console.error('Error taking a photo:', error);
    }
  };
  const handleCancel = () => {
    setShowModal(false)
    navigation.goBack();
  };

  const handleImageClick = uri => {
    setSelectedImage(uri);
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowItems}>
        <TouchableOpacity style={styles.row} onPress={() => handleBackPress()}>
          <BackIcon />
          <CustomText style={styles.boldText} type='mlabel'>{title}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
  disabled={!review && !rating && reviewDone  }
  style={[
    styles.postReviewBtn,
    {
      backgroundColor: review
        ? udyamitaTheme.primaryColor
        : udyamitaTheme.disabledButtonColor,
    }
  ]}
  onPress={()=>{
    handlePost()
    // setShowModal(true)
    
    }}
>
  <CustomText style={styles.btnText} type='btn'>{post_review}</CustomText>
</TouchableOpacity>

      </View>
      <View style={styles.reviewSection}>
        <CustomText
        type='label'
          style={[
            styles.boldText,
            {fontSize: udyamitaTheme.themeFontSizeLabel, marginLeft: 0},
          ]}>
          {t('giveRating')}
        </CustomText>
        <CustomText style={styles.secondText} type='sh'>
          {t('ratingText')}
        </CustomText>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
          defaultRating={rating || 0}
          size={30}
          showRating={false}
          starContainerStyle={styles.starContainer}
          halfStar={true}
          starStyle={styles.star}
          onFinishRating={(num) => setRating(num)}
        />
        <CustomText
        type='label'
          style={[
            styles.boldText,
            {
              fontSize: udyamitaTheme.themeFontSizeLabel,
              marginLeft: 0,
              marginTop: 40,
              marginBottom: 10,
            },
          ]}>
          {t('writeYourReview')}
        </CustomText>
        <TextInput
          placeholder={t('reviewPlaceHolder')}
           
          placeholderTextColor="#ABB2B9"
          multiline
          value={review}
          onChangeText={(e)=>{setReview(e)}}
          numberOfLines={3}
          style={[
            styles.reviewTextInput,
            {
              borderColor: isFocused ? udyamitaTheme.primaryColor : udyamitaTheme.borderStyleColor,
              borderWidth: isFocused ? 1 : 0.5,
            },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
          style={styles.addMedia}
          onPress={() => bottomSheetRef.current.open()}>
          <View style={styles.mediaIcon}>
            <Image
              source={require('../../../assets/images/AddMediaColor.png')}
            />
          </View>
          <CustomText style={styles.addMediaText} type='sh'>{t('addMedia')}</CustomText>
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        height={227}
        duration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
        }}>
        <View>
          <View style={styles.titleSection}>
            <Text
              style={[
                styles.boldText,
                {
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  marginLeft: 0,
                },
              ]}>
              {t('addMedia')}
            </Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current.close()}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={styles.crossIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.mediaBtns} onPress={()=>handleChooseFromLibrary()}>
            <Image source={require('../../../assets/images/AddMediaColor.png')}/>
          <Text style={styles.mediaBtnsText}>{t('addFromGallery')}</Text>
          </TouchableOpacity>
      <TouchableOpacity style={[styles.mediaBtns,{borderBottomWidth:0}]} onPress={()=>handleTakePhoto()}>
      <Image source={require('../../../assets/images/Cameraorange.png')} style={styles.cameraIcon}/>
      <Text style={styles.mediaBtnsText}>{t('addUsingCamera')}</Text>
        </TouchableOpacity>    

        </View>
      </BottomSheet>
      {selectedImageUri && selectedImageUri.length > 0 ? (
          <>
            <FlatList
              data={selectedImageUri}
              numColumns={3}
              keyExtractor={(item, index) => index?.toString()}
              renderItem={({item, index}) => (
                <View style={{position: 'relative'}}>
                  <TouchableOpacity
                    onPress={() => handleImageClick(item)}
                    style={{marginTop: 10, marginLeft: 10}}>
                    <Image
                      source={{uri: item}}
                      style={{width: 100, height: 100, margin: 5}}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImageUri(prevImages =>
                        prevImages.filter((x, i) => i !== index ),
                      );
                      
                      setImageUri(item);
                      setImageIndex(index);
                      setDeleteImage(true);
                    }}
                    style={styles.deleteImageBox}>
                    <Text style={styles.deleteSymbol}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        ) :null}

        <Modal visible={selectedImage !== null} animationType="slide">
          <View style={{flex: 1, backgroundColor: 'black'}}>
            <Image
              source={{uri: selectedImage}}
              style={{flex: 1}}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.bigImageModal}>
              <Text style={styles.bigImageDeleteSymbol}>X</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      {showModal ? <ReviewSubmittedModal visible={showModal} onCancel={handleCancel}/>:null}
    </View>
  );
};

export default AddReview;

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',
    flex:1
  },
  rowItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 20,
    borderColor: udyamitaTheme.borderStyleColor,
  },
  postReviewBtn: {
    backgroundColor: udyamitaTheme.primaryColor,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    marginLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  btnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  reviewSection: {
    margin: 20,
  },
  secondText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: '#000000',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    opacity: 0.5,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  star: {
    marginRight: 10,
  },
  reviewTextInput: {
    backgroundColor: '#F2F3F4',
    borderWidth: 0.5,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    borderRadius: 6,
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 20,
    paddingRight: 20,
    color:udyamitaTheme.textColor
  },
  mediaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMedia: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
  },
  addMediaText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  crossIcon: {
    width: 24,
    height: 24,
  },
  titleSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderBottomWidth: 0.5,
    padding: 20,
  },
  mediaBtns:{
    flexDirection:'row',
    alignItems:'center',
    padding:20,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderBottomWidth: 0.5,
  },
  mediaBtnsText:{
    fontFamily:udyamitaTheme.mainThemeFontFamilyMedium,
    marginLeft:10,
    fontSize:udyamitaTheme.themeFontSizeButton,
    color:udyamitaTheme.textColor
  },
  cameraIcon:{
    width:30,
    height:30
  },

  bigImageModal: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
  },
  bigImageDeleteSymbol: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeHeader,
  },
  deleteImageBox: {
    position: 'absolute',
    top: '18%',
    right: '8%',
    height: '18%',
    width: '18%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteSymbol: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    alignItems: 'center',
    marginTop: -2,
  },
});
