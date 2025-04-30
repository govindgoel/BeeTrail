import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {
  AppWelcomeText,
  CoverImages,
  appWelcomeColor,
} from '../../config/app.config';
export default function OnboardingTemplate({
  ChildrenComponent,
  buttonLabel,
  buttonOnpress,
  buttonLoading,
  buttonDisabled = true,
}) {
  const {t, i18n} = useTranslation();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const WelcomeToUdyamita = useCallback(
    () => (
      <>
        <Text>
          {t(AppWelcomeText).split(' ').map(word => (
            <CustomText
              style={
                word === t('udyamita') || word === t('beeKind')
                  ? styles.udyamitaText
                  : styles.welcomeText
              }
              type="mlabel"
              >{`${word} `}</CustomText>
          ))}
        </Text>
      </>
    ),
    [AppWelcomeText],
  );

  return (
    <View
      style={{
        backgroundColor: udyamitaTheme.themeBgColor,
        position: 'absolute',
        flex: 1,
        height: windowHeight,
      }}>
      <View style={{...styles.container, width: windowWidth}}>
        <CoverImages />
        <View style={styles.welcomeToUdyamitaContainer}>
          <WelcomeToUdyamita />
        </View>
        {ChildrenComponent ? <ChildrenComponent /> : null}
      </View>

      <TouchableOpacity
        style={[
          styles.arrowButtonStyle,
          {
            backgroundColor: !buttonDisabled
              ? udyamitaTheme.primaryColor
              : udyamitaTheme.disabledButtonColor,
            position: 'fixed',
            bottom: 0,
            width: 0.9 * windowWidth,
          },
        ]}
        disabled={buttonDisabled}
        onPress={() => buttonOnpress()}>
        <CustomText style={styles.arrowButtonLabel} type="btn">
          {buttonLabel}
        </CustomText>
        {buttonLoading ? (
          <ActivityIndicator
            size="small"
            animating={buttonLoading}
            color="white"
            style={{marginRight: 10}}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeToUdyamitaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -2,
    flexDirection: 'row',
    // marginTop:30,
  },
  container: {
    flex: 1,
    // backgroundColor: 'white',

    position: 'relative',
    bottom: 0,
    backgroundColor: '#FFF',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  dropDown: {
    height: 30,
    backgroundColor: '#f7f7f7',
    minWidth: 110,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.2,
    borderColor: udyamitaTheme.primaryColor,
    borderRadius: 5,
  },
  dropDownText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  buttonStyle: {
    position: 'absolute',
    bottom: 5,
    margin: 10,
    backgroundColor: udyamitaTheme.primaryColor,
    width: '80%',
    height: 45,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    elevation: 5,
  },

  title: {
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    alignSelf: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },

  languageListWrap: {
    marginHorizontal: '5%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  languageCard: {
    height: 52,
    // width: 130,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: udyamitaTheme.borderStyleColor,
    // elevation: 8,
  },
  languageCardSelected: {
    height: 52,
    // width: 140,
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: udyamitaTheme.primaryColor,
    borderWidth: 2,
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 8,
    backgroundColor: 'white',
  },
  languageText: {
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  languageTextSelected: {
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  logo: {
    width: 200,
    height: 79,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: -25,
  },

  modalContainer: {
    backgroundColor: 'white',
  },
  arrowButtonStyle: {
    backgroundColor: udyamitaTheme.primaryColor,
    width: '90%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 35,
    flexDirection: 'row',
  },
  arrowButtonLabel: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  welcomeText: {
    // textTransform: 'capitalize',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
  },
  udyamitaText: {
    // textTransform: 'capitalize',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor
  },
});
