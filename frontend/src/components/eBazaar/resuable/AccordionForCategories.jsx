import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'react-native-feather';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import SubCategoryList from '../partials/SubCategoryList';
import CustomText from '../../reusable/CustomText';
const AccordionForCategories = ({
  categoryName,
  catImage,
  id,
  getSubCategoriesByCategoryId,
  subcatToRender,
  navigation,
  isOpen,
  handleAccordionPress,
}) => {
 
  const {t} = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleAccordion = () => {
    handleAccordionPress();
   
    getSubCategoriesByCategoryId(id);
  };
  
  
  return (
    <TouchableOpacity
      onPress={() => toggleAccordion()}
      style={{...styles.container}}>
      <View style={styles.header}>
        <Image source={{uri: catImage}} style={styles.catImage} />
        <CustomText numberOfLines={3}  style={isOpen ? styles.Expandedtitle : styles.title} type='label'>
        {categoryName}        </CustomText>
        <View style={{marginRight:16}}>
          {isOpen ? (
            <ChevronUp
              width={22}
              height={22}
              color={udyamitaTheme.primaryColor}
            />
          ) : (
            <ChevronDown
              width={22}
              height={22}
              color={udyamitaTheme.primaryColor}
            />
          )}
        </View>
      </View>
      {isOpen && (
        <>
          <SubCategoryList Items={subcatToRender} navigation={navigation} />
        </>
      )}
    </TouchableOpacity>
  );
};

export default AccordionForCategories;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    paddingLeft: 20,
    // height: 272,
    width: 300,
    // marginLeft: 30,
    // marginRight: 10,
    borderRadius: 12,
    //paddingRight: 10,
    bottom: 0,
    position: 'relative',
    //paddingBottom: 10,
    zIndex: 2,
    
  },
  closeButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: udyamitaTheme.beeAppColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  modalImg: {
    width: 295,
    height: 200,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 5,
   borderColor:udyamitaTheme.borderStyleColor,
    // borderTopWidth: 5,
    backgroundColor: '#fff',
    //paddingRight:10,
    flexShrink: 1,
    marginBottom:-6
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  title: {
    textAlign:'center',
    //fontWeight: 'bold',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
    marginRight: 8,
    flexWrap:'wrap',
    width:'60%'
  },
  Expandedtitle: {
    textAlign:'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
    marginRight: 8,
    flexWrap:'wrap',
    width:'60%'
  },
  content: {
    marginTop: 5,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  subTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  ResultImg: {
    width: 255,
    height: 148,
    borderRadius: 5,
    resizeMode: 'cover',
    paddingLeft: 10,
  },
  ViewButton: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.beeAppColor,
    borderRadius: 5,
    height: 48,
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginTop: 10,
  },
  contentText: {
    //paddingLeft: 10,
    paddingBottom: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  subText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    marginBottom: 5,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  linkStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  catImage: {
    width: 75,
    height: 75,
  },
});
