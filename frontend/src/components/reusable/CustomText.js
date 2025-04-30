import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';

const textSizeMap = new Map([
  ['label', 'themeFontSizeLabel'],
  ['mlabel', 'themeFontSizeModalLabel'],
  ['xs', 'themeFontSizeExtraSmall'],
  ['btn', 'themeFontSizeButton'],
  ['sm', 'themeFontSizeSmall'],
  ['sh', 'themeFontSizeSmallHeader'],
  ['h', 'themeFontSizeHeader'],
  ["bh", 'themeFontSizeBigHeader'],
  ['vs',"themeFontSizeVerySmallHeader"],
  ['mh',"themeFontSizeMediumHeader"],
  ['ml',"themeFontSizeCardMiniLabel"]
]);

export default function CustomText(props) {
  // console.log('props: ', props);
  // console.log('props:style ', props?.style);
  // console.log('props?.type ', props?.type);
  // console.log('textSizeMap', textSizeMap.get(props?.type));
  const currThemeId = textSizeMap.get(props?.type);
  // console.log('currThemeId: ', currThemeId);
  // const currTheme = useDynamicTheme();
  const [actLangTheme, setActLangTheme] = useState(udyamitaTheme);
  useEffect(() => {
    if (true) {
      setActLangTheme('en');
    }
  }, []);

  return (
    <Text numberOfLines={props.numberOfLines} ellipsizeMode={props.ellipsizeMode} style={[props.style, {fontSize: actLangTheme[`${currThemeId}`]}]}>
      {props?.children}
    </Text>
  );
}
