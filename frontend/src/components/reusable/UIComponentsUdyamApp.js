import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  Button,
  useTheme,
  TouchableRipple,
  TextInput,
  Text,
} from 'react-native-paper';
import {SearchIcon, QuestionIcon} from '../../assets/Icons/IconSvg';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import CustomText from './CustomText';
import { Topics } from '../../screens/ai-helpdesk/DataHelpDesk';
import En_FAQs from '../../screens/ai-helpdesk/FAQs/En_FAQs.json';

export const PrimaryButton = props => {
  const theme = useTheme();
  return (
    <TouchableRipple
      mode="contained"
      style={{
        backgroundColor: props.disabled
          ? theme?.beeAppDisabledColor
          : theme?.primaryColor,
        borderRadius: 12,
        justifyContent: 'center',
        minHeight: 52,
        maxWidth: props?.mWidth && props?.mWidth,
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
      activeOutlineColor={theme.primaryColor}
      style={{
        backgroundColor: '#fff',
        borderColor: '#969696',
        minHeight: 48,
        maxHeight: 48,
        minWidth: '80%',
        textAlignVertical: 'top',
   
        lineHeight: 18,
        marginTop: 8,
        fontFamily: theme.mainThemeFontFamily,
        color: theme.primaryColor,
        fontSize: udyamitaTheme.themeFontSizeLabel,
      }}
      {...props}
    />
  );
};

export const SearchInput = props => {
  // console.log('props: ', props?.initialList);
  const [search, setSearch] = useState('');
  const theme = useTheme();
useEffect(()=>{

},[])

  const updateList = text => {
    console.log('text: ', text);
    const Text_Regex = new RegExp(text, 'ig');
    const ALL_FAQS = props?.faq;
    const MATCHING_Qs = ALL_FAQS?.filter(faq=>Text_Regex?.test(faq.answer) || Text_Regex?.test(faq.name));
    const MATCHING_TOPIC_IDS = MATCHING_Qs?.reduce((set, faq)=> set?.includes(faq.topic_id)?set:[...set,faq.topic_id], []);
    let temp = props?.initialList?.filter(el => {
      return MATCHING_TOPIC_IDS?.includes(el.topicId) || MATCHING_TOPIC_IDS?.includes(el.topic_id)|| el?.name?.toLowerCase().includes(text?.toLowerCase()) || 
             el?.answer?.toLowerCase().includes(text?.toLowerCase());
    });
    
    props?.setUpdatedList(temp);
  };
  return (
    <TextInput
      mode="outlined"
      dense={true}
      activeOutlineColor={theme.primaryColor}
      style={{
        backgroundColor: '#fff',
        minHeight: 48,
        maxHeight: 48,
        // minWidth: '90%',
        // maxWidth: '90%',
        marginHorizontal: '5%',
        textAlignVertical: 'top',
        fontSize: udyamitaTheme.themeFontSizeSmallHeader,
        lineHeight: 18,
        marginTop: 12,
        fontFamily: theme.mainThemeFontFamily,
        color: theme.primaryColor,
      }}
      // assets/images/Cross.png
      right={<TextInput.Icon icon={() => search ? <TouchableOpacity onPress={() => {
        setSearch('')
      props?.setUpdatedList(props?.initialList)} }>
              <Image source={require('../../assets/images/Cross.png')}
                style={{width: 25, height: 25}} />
          </TouchableOpacity> : <SearchIcon />} size={18} />}
      {...props}
      onChangeText={text => {
        updateList(text);
        setSearch(text);
      }}
      value={search}
    />
  );
};

export const QuestionInput = props => {
  // console.log('props: ', props);
  const theme = useTheme();
  return (
    <TextInput
      mode="outlined"
      dense={true}
      activeOutlineColor={theme.primaryColor}
      cursorColor={theme.primaryColor}
      style={{
        backgroundColor: 'white',
        borderColor: udyamitaTheme.borderStyleColor,
        minHeight: 48,
        maxHeight: 48,
        // minWidth: '90%',
        // maxWidth: '90%',
        // marginHorizontal: '5%',
        textAlignVertical: 'top',
        fontSize: udyamitaTheme.themeFontSizeLabel,
        lineHeight: 18,
        marginTop: 12,
        fontFamily: udyamitaTheme.mainThemeFontFamily,
        color: theme.primaryColor,
      }}
      right={
        <TextInput.Icon
          icon={() => <QuestionIcon />}
          size={18}
          disabled={props?.disabled}
          onPress={props?.onPress}
        />
      }
      {...props}
    />
  );
};

export const LabelText = props => {
  const theme = useTheme();
  return (
    <CustomText
      style={{
        color: theme.primaryColor,
        fontFamily: theme.mainThemeFontFamilySemiBold,
        fontSize: udyamitaTheme.themeFontSizeLabel,
        fontWeight: '600',
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
        color: theme.udyamAppTertiaryColor,
        fontFamily: theme.mainThemeFontFamilySemiBold,
        fontSize: udyamitaTheme.themeFontSizeButton,
        fontWeight: '600',
        lineHeight: 24,
        textTransform: 'none',
        textAlign: 'center',
      }}
      type="btn"
      {...props}
    />
  );
};

export const PrimaryMargin = props => {
  return <View style={{marginTop: props?.mt}} />;
};
