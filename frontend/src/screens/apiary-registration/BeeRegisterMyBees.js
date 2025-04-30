import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { envOptions,typeOptions } from './DataApiaryRegistration';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
const BeeRegisterMyBees = ({
  apiaryDetails,
  clickonnext,
  setapiaryDetails,
  setAllowProceedToNextScreen,
}) => {
  const [selectedBeeType, setSelectedBeeType] = useState(null);
  const [selectedEnvType, setSelectedEnvType] = useState(null);
  const [edit, setedit] = useState(false)
  const [flag, setflag] = useState(false)
  const [errorlist, seterrorlist] = useState({
    environmentType: false,
  })
  const {t} = useTranslation();
  const handleBeeTypeSelect = beeTypeId => {
    setSelectedBeeType(beeTypeId);

    setapiaryDetails({...apiaryDetails, typeOfBees: beeTypeId});
  };
  const handleEnvTypeSelect = val => {
    setSelectedEnvType(val);
  

    setapiaryDetails({...apiaryDetails, environmentType: val});
  };
  const BeeTypeCard = ({beeType, onSelect, isSelected}) => {
  
    const [selected, setSelected] = useState(isSelected);

    const handleSelect = () => {
      setSelected(!selected);
      onSelect(beeType.value);
    };

    const cardStyle = selected
      ? [
          styles.beeTypeCard,
          { borderWidth: 0,backgroundColor:udyamitaTheme.beeAppColor},
        ]
      : styles.beeTypeCard;
    const labelStyle = selected
      ? [styles.beeTypeLabel, {color: '#fff'}]
      : styles.beeTypeLabel;

    return (
      <TouchableOpacity onPress={handleSelect}>
        <View style={cardStyle}>
          <Image source={beeType.imgPath} style={styles.beeTypeImage} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioForm formHorizontal={true} animation={true}>
              <RadioButton labelHorizontal={true}>
                <RadioButtonInput
                  obj={{label: '', value: beeType.name}}
                  index={0}
                  isSelected={selected}
                  onPress={handleSelect}
                  borderWidth={ selected ? 3 : 1}
                  buttonInnerColor={
                    selected ? udyamitaTheme.beeAppColor : '#e74c3c'
                  }
                  buttonOuterColor={
                    selected
                    ? '#fff'
                    : udyamitaTheme.borderStyleColor
                  }
                  buttonSize={9}
                  buttonOuterSize={20}
                />
                <RadioButtonLabel
                  obj={{label: '', value: beeType.name}}
                  index={0}
                  onPress={handleSelect}
                />
              </RadioButton>
            </RadioForm>
            <Text style={labelStyle}>{t(beeType?.langConst)}</Text>
          </View>
          <Text style={labelStyle}>({t(beeType?.langConstDesc)})</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const EnvTypeCard = ({val, onSelect, isSelected}) => {
    const [selectedEnv, setSelectedEnv] = useState(isSelected);

    const handleSelectEnv = () => {
      setSelectedEnv(!selectedEnv);

      onSelect(val.id);
    };

    const cardStyle = selectedEnv
      ? [
          styles.beeTypeCard,
          { borderWidth: 0,backgroundColor:udyamitaTheme.beeAppColor},
        ]
      : styles.beeTypeCard;
    const labelStyle = selectedEnv
      ? [styles.beeTypeLabel, {color: '#fff'}]
      : styles.beeTypeLabel;

    return (
      <TouchableOpacity onPress={handleSelectEnv}>
        <View style={cardStyle}>
          <Image source={val.imgPath} style={styles.envTypeImage} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioForm formHorizontal={true} animation={true}>
              <RadioButton labelHorizontal={true}>
                <RadioButtonInput
                  obj={{label: '', value: val.id}}
                  index={0}
                  isSelected={selectedEnv}
                  onPress={handleSelectEnv}
                  borderWidth={ selectedEnv ? 3 : 1}
                  buttonInnerColor={
                    selectedEnv ? udyamitaTheme.beeAppColor : '#e74c3c'
                  }
                  buttonOuterColor={
                    selectedEnv
                      ? '#fff'
                      : udyamitaTheme.borderStyleColor
                  }
                  buttonSize={9}
                  buttonOuterSize={20}
                />
                <RadioButtonLabel
                  obj={{label: '', value: val.id}}
                  index={0}
                  onPress={handleSelectEnv}
                />
              </RadioButton>
            </RadioForm>
            <Text style={labelStyle}>{t(val?.langConst)}</Text>
          </View>
          <Text style={labelStyle}>{t(val?.langConstSub)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const { typeOfBees, environmentType } = apiaryDetails;
  
    // if (typeOfBees) {
    //   setSelectedBeeType(typeOfBees); // Set the initial value based on typeOfBees
    // }
    if (environmentType) {
      setSelectedEnvType(environmentType); // Set the initial value based on typeOfBees
    }

    const allowNext =  environmentType ;
  
    setAllowProceedToNextScreen(allowNext);
  }, [apiaryDetails]);
  useEffect(() => {
    function check() {
      const { typeOfBees, environmentType } = apiaryDetails;

      if(!edit && clickonnext==0){
        return ;      
      }
        const e=errorlist
        e.environmentType=!(environmentType?.length>0)
        console.log(e,environmentType);
        seterrorlist(e)       
       
  
        setTimeout(() => {
          setflag(!flag)
        }, 30);
    }
    check()
  
}, [clickonnext,apiaryDetails])
  
  return (
    <View>
        <View style={[styles.hiveDetailsSection, {marginTop: 20}]}>
        <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {apiaryDetails?.environmentType && <View style={{
                backgroundColor: '#028454',
                paddingHorizontal: 2,
                alignSelf: 'end',
                marginBottom:10,
                paddingVertical: 3.5,
                borderRadius: 500,
                // marginTop: 10,

              }}>
                <Image style={{ alignSelf: 'center', width: 9.17, height: 6.76 }} source={require('../../assets/images/white_tick.png')} />
              </View>}

              <Text style={!(apiaryDetails?.environmentType)?styles.label:styles.correctlabel}>
              {t('selectEnv')}
              </Text>

            </View>
            <View style={{flexDirection: 'column'}}>
            <View style={styles.beeTypeRow}>
          {envOptions.map(val => (
            <>
              <EnvTypeCard
                key={val.id}
                val={val}
                onSelect={handleEnvTypeSelect}
                isSelected={selectedEnvType === val.id}
              />
            </>
          ))}
        </View>
          {errorlist.environmentType && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 5,
                marginTop: 8,
              }}>
              <Image
                style={{width: 12.86, height: 13}}
                source={require('../../assets/images/error_alert.png')}
              />
              <Text style={styles.erroralert}>
                {t('pleaseselectenvironmenttype')}{' '}
              </Text>
            </View>
          )}
        </View>
        
      </View>


      {/* <View style={[styles.hiveDetailsSection, {marginTop: 20}]}>
        <Text style={styles.label}>{t('selectTypeOfBeesInThisApiary')}</Text>
        <View style={styles.beeTypeRow}>
          {typeOptions.map(beeType => (
            <>
              <BeeTypeCard
                key={beeType.value}
                beeType={beeType}
                onSelect={handleBeeTypeSelect}
                isSelected={selectedBeeType === beeType.value}
              />
            </>
          ))}
        </View>
      </View> */}
    </View>
  )
}

export default BeeRegisterMyBees

const styles = StyleSheet.create({
  hiveDetailsSection: {
    backgroundColor: '#fff',
    borderWidth: 0.5,

    borderColor: udyamitaTheme.borderStyleColor,
    padding: 20,
  },
  beeTypeCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
   // alignItems: 'center',
    borderColor: udyamitaTheme.borderStyleColor,
    backgroundColor: '#fff',
    //flex:1
    //width: 148,
   
  },
  beeTypeImage: {
    width: 136,
    height: 87,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  beeTypeLabel: {
    //marginTop: 8,
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    marginLeft: 5,
  },
  beeTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Allow cards to wrap to the next line
   // marginTop: 10,
  },
  envTypeImage: {
    width: 136,
    height: 87,
    resizeMode: 'contain',
    marginBottom: 10,
   // margin:8,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    marginBottom: 10,
  },
  correctlabel: {
    color: '#028454',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    marginBottom: 10,
  },
  flexrow:{
    flexDirection: 'row',
    alignItems:'center'
  },
  erroralert:{
    color:'#FF0000',
    fontSize:12,
    fontWeight:'400',
    marginLeft:8,
  },
})