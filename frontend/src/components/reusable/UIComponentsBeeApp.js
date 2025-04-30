import React, {useEffect} from 'react';
import {Image, View} from 'react-native';
import {
  Button,
  useTheme,
  TouchableRipple,
  TextInput,
  Text,
} from 'react-native-paper';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import CustomText from './CustomText';

export const PrimaryButton = props => {
  const theme = useTheme();
  return (
    <TouchableRipple
      mode="contained"
      style={{
        backgroundColor: props.disabled
          ? theme?.beeAppDisabledColor
          : theme?.beeAppColor,
        borderRadius: 12,
        justifyContent: 'center',
        minHeight: 52,
        minWidth: '100%',
        marginTop:12
      }}
      {...props}
    />
  );
};

export const PrimaryInput = props => {
  
  const theme = useTheme();
  return (
    <TextInput
      mode="outlined"
      dense={true}
      activeOutlineColor={props?.activeOutlineColor || "#FEC251"}
      style={{
        backgroundColor: '#fff',
        minHeight: 48,
        maxHeight: 48,
        textAlignVertical: 'top',
        fontSize: udyamitaTheme.themeFontSizeLabel,
        lineHeight: 18,
        fontFamily: udyamitaTheme.mainThemeFontFamily,
        color: udyamitaTheme.beeAppColor,
      }}
      left={
        props?.leftSrc && (
          <TextInput.Icon
            icon={() => (
              <Image
                source={props?.leftSrc}
                resizeMode="contain"
                style={{maxWidth: 29, maxHeight: 29}}
              />
            )}
            size={30}
          />
        )
      }
      {...props}
      theme={{
        fonts: {
          regular: {
            fontFamily: udyamitaTheme.mainThemeFontFamily,
          },
          bodyLarge: {
            ...theme.fonts.bodyLarge,
            fontFamily: udyamitaTheme.mainThemeFontFamily,
          },
        },
      }}
      labelStyle={{fontSize: udyamitaTheme.themeFontSizeSmall}}
    />
  );
};

export const LabelText = props => {
  const theme = useTheme();
  return (
    <CustomText
      style={{
        color: udyamitaTheme.beeAppColor,
        fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
        fontSize: udyamitaTheme.themeFontSizeLabel,
       
        lineHeight: 20,
        marginTop: 24,
        marginBottom: 16,
      }}
      type="label"
      {...props}
    />
  );
};

export const ButtonText = props => {
  const theme = useTheme();
  return (
    <CustomText
      style={{
        color: '#fff',
        fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
        fontSize: udyamitaTheme.themeFontSizeLabel,
        lineHeight: 20,
        textTransform: 'none',
        textAlign: 'center',
      }}
      type="label"
      {...props}
    />
  );
};

export const PrimaryMargin = props => {
  return <View style={{marginTop: props?.mt, marginBottom: props?.mb}} />;
};
