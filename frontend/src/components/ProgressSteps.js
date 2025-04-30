import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import { udyamitaTheme } from '../config/styles/udyamitaTheme';
import CustomText from './reusable/CustomText';
export default function ProgressSteps({stepNo}) {
  return (
    <View style={styles.root}>
      <Divider
        style={styles.div}
        bold={true}
        theme={{colors: {primary: udyamitaTheme.textColor}}}
      />
      <View style={styles.dotBox}>
        <View>
          <View style={styles.circle} />
          <CustomText style={[styles.text1, styles.label]} type='sm'>1</CustomText>
        </View>
        <View>
          <View style={stepNo > 1 ? styles.circle : styles.invCircle} />
          <CustomText style={[styles.text2, styles.label]} type='sm'>2</CustomText>
        </View>
        <View>
          <View style={stepNo > 2 ? styles.circle : styles.invCircle} />
          <CustomText style={[styles.text3, styles.label]} type='sm'>3</CustomText>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    position: 'relative',
    marginBottom: 30,
  },
  div: {
    backgroundColor: udyamitaTheme.beeAppColor,
  },
  dotBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 30,
    top: 22,
    minWidth: "100%",
    maxWidth: "100%",
  },
  circle: {
    minWidth: 16,
    maxWidth: 16,
    minHeight: 16,
    maxHeight: 16,
    borderRadius: 8,
    backgroundColor: udyamitaTheme.beeAppColor,
  },
  invCircle: {
    minWidth: 16,
    maxWidth: 16,
    minHeight: 16,
    maxHeight: 16,
    borderRadius: 8,
    backgroundColor: udyamitaTheme.udyamAppTertiaryColor,
    borderWidth: 0.5,
    borderColor: 'rgba(38, 38, 38, 0.50)',
  },
  circle1: {},
  circle2: {},
  circle3: {},
  text1: {
    position: 'absolute',
    minWidth: 100,
    top: 20,
    left: 5,
  },
  text2: {
    position: 'absolute',
    minWidth: 100,
    top: 20,
    left: 5,
  },
  text3: {
    position: 'absolute',
    minWidth: 100,
    top: 20,
    left: 5,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmall,
    fontWeight: '400',
    lineHeight: 18,
  },
});
