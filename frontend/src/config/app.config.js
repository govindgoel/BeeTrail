import React from 'react';
import { Dimensions, Image } from 'react-native';

export const EXPORT_WHATSAPP_CONTACT_NUMBER = '919637919614';
  
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const AppWelcomeText = 'welcomeToBeeKind';


export const BeekindSplashScreenImage = () => (
  <Image
    source={require('../assets/images/Beekindlogo_Onboarding.png')}
    style={{height:106,width:171,alignSelf:'center',marginTop:-20}}
  />
);

const BeekindHeaderLogoImage = () => {
  return <Image
    source={require('../assets/images/Beekindlogo_Homepage.png')}
    style={{ width: 115, height: 25, marginLeft: 10,resizeMode:'contain' }}
  />;
}

const BeekindCoverImage = () => {
  return (
    <>
      <Image
        style={{
          height: windowHeight / 2.5,
          width: windowWidth,
          resizeMode: 'cover',
        }}
        source={require('../assets/images/Onboarding.png')}
      />
      <BeekindSplashScreenImage />
    </>
  );
};

export const CoverImages = () => {
  return <BeekindCoverImage />;
};

export const HeaderScreenLogoImage = () => {
  return <BeekindHeaderLogoImage />;

}