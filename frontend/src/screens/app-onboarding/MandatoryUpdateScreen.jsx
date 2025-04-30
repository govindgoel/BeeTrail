import { StyleSheet, Text, View, TouchableOpacity, Image, Linking, BackHandler, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { udyamitaTheme } from '../../config/styles/udyamitaTheme'
import CustomText from '../../components/reusable/CustomText'
import { useTranslation } from 'react-i18next'
import CustomAlert from '../../components/reusable/generic/CustomAlert'
import VersionNumber from 'react-native-version-number';

const MandatoryUpdateScreen = () => {

  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitApp = () => {
    BackHandler.exitApp();
  };

  const handleStayInApp = () => {
    setShowExitModal(false);
  };

  const { t } = useTranslation();
  return (
    <>
      {/* <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          setShowExitModal(true);
        }}
        style={styles.crossIconContainer}>
        <Image
          source={require('../../assets/images/Cross.png')}
          style={styles.crossIcon}
        />
      </TouchableOpacity>
      <CustomAlert
        visible={showExitModal}
        title={t('exitApp')}
        message={t('doYouReallyWantToExitApp')}
        onCancel={handleStayInApp}
        onConfirm={handleExitApp}
        otherText={t('exitApp')}
      />
      <View style={styles.centerView}>
        <Image
          source={require('../../assets/images/Beekindlogo_Onboarding.png')}
          style={{width: 171, height: 106}}
        />
        <CustomText type="bh" style={styles.bigText}>
          {t('updateTheApp')}
        </CustomText>
        <CustomText type="mlabel" style={styles.smallText}>
          {t('kindlyUpdate')}
        </CustomText>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            const storeUrl =
              'https://play.google.com/store/apps/details?id=co.thehumblebee.beekind';

            Linking.openURL(storeUrl).catch(err =>
              console.error('Error opening store:', err),
            );
          }}>
          <CustomText type="btn" style={styles.btnText}>
            {t('updateNow')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View> */}
      <ImageBackground source={require('../../assets/images/update_background_img.png')}
        style={{
          width: '100%',
          height: '100%',
          //marginTop:-20
          // resizeMode: 'contain',
          //borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setShowExitModal(true);
          }}
          style={styles.crossIconContainer}>
          <Image
            source={require('../../assets/images/Cross.png')}
            style={styles.crossIcon}
          />
        </TouchableOpacity>
        <CustomAlert
          visible={showExitModal}
          title={t('exitApp')}
          message={t('doYouReallyWantToExitApp')}
          onCancel={handleStayInApp}
          onConfirm={handleExitApp}
          otherText={t('exitApp')}
        />
        <View style={styles.centerView}>

          <Text style={styles.bigText}>
            {t('newupdateavailable')}
          </Text>
          <Text style={styles.smallText}>
            {t('updatemessage')}
          </Text>
          <Text style={styles.greenText}>
          {VersionNumber.appVersion}
          </Text>
          <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                const storeUrl =
                  'https://play.google.com/store/apps/details?id=co.thehumblebee.beekind';

                Linking.openURL(storeUrl).catch(err =>
                  console.error('Error opening store:', err),
                );
              }}>
              <CustomText type="btn" style={styles.btnText}>
                {t('updateNow')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>


      </ImageBackground>
    </>

  );
}

export default MandatoryUpdateScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.backgroundColor,
  },
  centerView: {
    position: "absolute",
    top: "60%",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    width: "100%",
    flex: 1,
  },
  bigText: {
    fontSize: 28,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    lineHeight: 32.68,
    fontWeight: "600",
    textAlign: 'center',
    alignSelf: "center",
    width: '100%',
    marginBottom: 20

  },
  smallText: {
    fontSize: 18,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
    lineHeight: 21.79,
    fontWeight: '400',
    marginHorizontal: 70,
    textAlign: 'center'

  },
  greenText: {
    fontSize: 16,
    color: '#22c55e',
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center'

  },
  btnText: {
    fontSize: 16,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    lineHeight: 50,
    fontWeight: "600"
  },
  btn: {
    backgroundColor: udyamitaTheme.primaryColor,
    width: '90%',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52
  },
  crossIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40, height: 40,
    zIndex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  crossIcon: {
    width: 24,
    height: 24,

  },
})