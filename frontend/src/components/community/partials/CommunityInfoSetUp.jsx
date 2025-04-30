import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import CustomModal from '../../reusable/generic/CustomModal';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomDropdown from '../../reusable/generic/CustomDropdown';
import CustomTextInput from '../../reusable/generic/CustomTextInput';
import {languages, label} from '../../../constants/Languages';
import CustomText from '../../reusable/CustomText';
const CommunityInfoSetUp = ({
  navigation,
  communityDetails,
  setCommunityDetails,
  setAllowProceedToNextScreen,
}) => {
  const {t} = useTranslation();

  const [feedIncludesEnglish, setFeedIncludesEnglish] = useState('');
  const [language, setLanguage] = useState('');
  const [modalContent, setModalContent] = useState(false);
  const feedPostLanguageOptions = [
    {label: `${t('yesIncludeEnglishPosts')}`, value: 'yes', dbValue: true},
    {label: `${t('noShowSelectedLangauge')}`, value: 'no', dbValue: false},
  ];
  const handleSelectOption = option => {
    setFeedIncludesEnglish(option);
    // changeLanguage(visibility);
    setCommunityDetails({...communityDetails, feedInEnglish: option});
  };
  handleLangauageSelect = opt => {
    
    setLanguage(opt);
  };
  const updateModalContent = val => {
    const mmm = modalContent;
    modalContent.feedIncludesEnglish = val;
    setModalContent(mmm);
  };
  useEffect(() => {
    const {communityLangauges, feedInEnglish, aboutTheCommunity} =
      communityDetails;
   
    if (communityLangauges) {
      setLanguage(communityLangauges);
    }
    if (feedInEnglish) {
      setFeedIncludesEnglish(feedInEnglish);
    }
    const allowNext = communityLangauges ||  feedInEnglish || aboutTheCommunity;
    setAllowProceedToNextScreen(allowNext);
  }, [communityDetails]);
  return (
    <ScrollView>
      {/* <Text style={styles.label}>{t('selectThePrimaryLangauge')}</Text> */}
      <CustomText style={styles.label} type='label'>{t('selectThePrimaryLangauge')}</CustomText>
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() =>
          setModalContent({
            title: `${t('selectALangauge')}`,
            options: languages,
            feedIncludesEnglish: language,
            selectedOption: language,
            setSelectedOption: l => {
         
              setLanguage(l), setModalContent(false);
            },
            setFeedIncludesEnglish: val => {
              setLanguage(val);
              updateModalContent(val);
              setCommunityDetails({...communityDetails, languages: val});
            },
          })
        }>
        {/* <Text style={styles.dropdownBoxText}>
          {language ? label[language] : t('selectALangauge')}
        </Text> */}
        <CustomText style={styles.dropdownBoxText} type='label'>{language ? label[language] : t('selectALangauge')}</CustomText>
        <Image
          source={require('../../../assets/images/Caretdown.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
      {/* <Text style={styles.label}>{t('doYouWantToAllowEnglishPosts')}</Text> */}
       <CustomText style={styles.label} type='label'>{t('doYouWantToAllowEnglishPosts')}</CustomText>
      <RadioForm animation={true}>
        {feedPostLanguageOptions.map((option, index) => (
          <View style={{height: 35}}>
            <RadioButton labelHorizontal={true}>
              <RadioButtonInput
                obj={option}
                index={index}
                isSelected={
                  feedIncludesEnglish === option.dbValue ||
                  feedIncludesEnglish === option.value
                }
                onPress={() => handleSelectOption(option.value)}
                borderWidth={1}
                buttonInnerColor={
                  feedIncludesEnglish === option.dbValue ||
                  feedIncludesEnglish === option.value
                    ? udyamitaTheme.primaryColor
                    : '#e74c3c'
                }
                buttonOuterColor={
                  feedIncludesEnglish === option.dbValue ||
                  feedIncludesEnglish === option.value
                    ? udyamitaTheme.primaryColor
                    : udyamitaTheme.borderStyleColor
                }
                buttonSize={9}
                buttonOuterSize={20}
                buttonWrapStyle={{marginLeft: 10}}
              />
              {/* Radio button label */}
              <RadioButtonLabel
                obj={{label: option.label, value: option.value}}
                index={index}
                onPress={() => handleSelectOption(option.value)}
                labelHorizontal={true}
                labelStyle={{
                  color:
                    feedIncludesEnglish === option.dbValue ||
                    feedIncludesEnglish === option.value
                      ? udyamitaTheme.primaryColor
                      : '#000',
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                }}
                labelWrapStyle={{
                  marginLeft: 5,
                }}
              />
            </RadioButton>
          </View>
        ))}
      </RadioForm>
      {/* <Text style={styles.label}>{t('aboutThisCommunity')}</Text> */}
       <CustomText style={styles.label} type='label'>{t('aboutThisCommunity')}</CustomText>
      <TextInput
        placeholder={t('aboutThisCommunity')}
        style={[
          styles.textInputWrap,
          {
            color: '#000',
            padding: 10,
            minHeight: 40,
            flexWrap: 'wrap',
            marginTop: 10,
            backgroundColor: 'rgba(203, 203, 203, 0.1)',
          },
        ]}
        value={communityDetails.aboutTheCommunity}
        onChangeText={e => {
          setCommunityDetails({...communityDetails, aboutTheCommunity: e});
        }}
      />

      {modalContent ? (
        <CustomModal
          title={modalContent?.title || ''}
          options={modalContent?.options || ''}
          requestClose={() => {
            setModalContent(false);
          }}
          selectedOption={modalContent?.selectedOption || ''}
          visible={modalContent !== false}
          feedIncludesEnglish={modalContent?.feedIncludesEnglish}
          setSelectedOption={modalContent?.setSelectedOption}
          setFeedIncludesEnglish={modalContent?.setFeedIncludesEnglish}
        />
      ) : null}
    </ScrollView>
  );
};

export default CommunityInfoSetUp;
const styles = StyleSheet.create({
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 15,
    marginBottom: 10,
  },
  textInputStyle: {
    //height: 50,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 10,
    alignSelf: 'center',
    // letterSpacing: 1.5,
    width: '75%',
    color: 'rgba(38, 38, 38, 0.5)',
  },
  textInputWrap: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    //flexDirection: 'row',
    // marginTop: 10,
    backgroundColor: '#fff',
  },
  dropdownBox: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    height: 48,
    borderRadius: 6,
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  dropdownBoxText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: 'rgba(38, 38, 38, 0.5)',
    // textTransform:'capitalize/'
  },
});
