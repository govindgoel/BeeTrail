import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {typeOptions} from './DataApiaryRegistration';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useRef } from 'react';
import { err } from 'react-native-svg/lib/typescript/xml';
const BeeRegisterMyHives = ({
  apiaryDetails,
  clickonnext,
  setapiaryDetails,
  setAllowProceedToNextScreen,
}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const [selectedBeeType, setSelectedBeeType] = useState(apiaryDetails?.typeOfBees?.length>0?apiaryDetails?.typeOfBees:null);
  const [chammber, setchammber] = useState(apiaryDetails?.frameCountPerChamber>0?apiaryDetails?.frameCountPerChamber:-1)
  const noofbroodhive = useRef(false)
  const [edit, setedit] = useState(false)
  const noofbroodandsuperhive = useRef(false)
  const [flag, setflag] = useState(false)
  const [errorlist, seterrorlist] = useState({
    noofbroodhive: false,
    noofbroodandsuperhive: false,
    noofframeperchamber: false,
    beeType:false
  })

  useEffect(() => {
      function check() {
        const {
          frameCountPerChamber,
          numberOfHivesWithBroodAndSuper,
          numberOfHivesWithBroodOnly,
        } = apiaryDetails;
        const totalHiveCount =
          parseInt(numberOfHivesWithBroodAndSuper || 0) +
          parseInt(numberOfHivesWithBroodOnly || 0);
        
        if(!edit && clickonnext==0){
          return ;      
        }
          const e=errorlist
          e.noofbroodhive= !(numberOfHivesWithBroodOnly>=0 && numberOfHivesWithBroodOnly?.toString()?.length>0)
          e.noofbroodandsuperhive=!(numberOfHivesWithBroodAndSuper>=0&& numberOfHivesWithBroodAndSuper?.toString()?.length>0)
          e.beeType= !(apiaryDetails?.typeOfBees?.length>0)
          e.noofframeperchamber= !(frameCountPerChamber &&frameCountPerChamber!==-1)
         
          console.log(e,edit,numberOfHivesWithBroodAndSuper);
            seterrorlist(e)       
         
    
          setTimeout(() => {
            setflag(!flag)
          }, 30);
      }
      check()
        
    
      
    
  }, [clickonnext,apiaryDetails])


  useEffect(() => {
    const {
      frameCountPerChamber,
      numberOfHivesWithBroodAndSuper,
      numberOfHivesWithBroodOnly,
    } = apiaryDetails;
    const totalHiveCount =
      parseInt(numberOfHivesWithBroodAndSuper || 0) +
      parseInt(numberOfHivesWithBroodOnly || 0);
    const allowNext =
      frameCountPerChamber &&
      numberOfHivesWithBroodAndSuper &&
      numberOfHivesWithBroodOnly &&
      totalHiveCount >= 1 &&
      frameCountPerChamber!==-1;
    console.log(allowNext,frameCountPerChamber!=='',frameCountPerChamber);
    setAllowProceedToNextScreen(allowNext);
  }, [apiaryDetails]);
  const getTotalBoxes = () => {
    return (
      Number(
        apiaryDetails?.numberOfHivesWithBroodOnly === undefined
          ? 0
          : apiaryDetails?.numberOfHivesWithBroodOnly,
      ) +
      Number(
        apiaryDetails?.numberOfHivesWithBroodAndSuper === undefined
          ? 0
          : apiaryDetails?.numberOfHivesWithBroodAndSuper,
      )
    );
  };
  useEffect(() => {
    const totalBoxes = getTotalBoxes();
    if (isNaN(totalBoxes) || totalBoxes <= 0) {
      ToastAndroid.showWithGravity(
        t('youShouldHave'),
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // Check if totalBoxes is NaN or less than or equal to 0
      //showToast(t('You should have at least one hive')); // Assuming showToast is a function to display the toast
    }
  }, []);
  useEffect(() => {
    setapiaryDetails({
      ...apiaryDetails,
      frameCountPerChamber: chammber,
    });
  }, [chammber])
  
  const handleBeeTypeSelect = beeTypeId => {
    if(!edit){
      setedit(!edit)
    }
    setSelectedBeeType(beeTypeId);
    if(beeTypeId=='mellifera'){ setchammber(10)}
    else{  console.log('sccs');
      setchammber(-1)}
     setapiaryDetails({...apiaryDetails, typeOfBees: beeTypeId});
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
          {borderWidth: 0, backgroundColor: udyamitaTheme.beeAppColor},
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
                  borderWidth={selected ? 3 : 1}
                  buttonInnerColor={
                    selected ? udyamitaTheme.beeAppColor : '#e74c3c'
                  }
                  buttonOuterColor={
                    selected ? '#fff' : udyamitaTheme.borderStyleColor
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

  return (
    <>
      <View style={[styles.hiveDetailsSection, {marginTop: 20}]}>
      <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {apiaryDetails?.typeOfBees?.length>0 && <View style={{
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

              <Text style={!(apiaryDetails?.typeOfBees?.length>0)?styles.label:styles.correctlabel}>1. {t('selectTypeOfBeesInThisApiary')}</Text>

            </View>
            <View style={{flexDirection: 'column'}}>
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
          {errorlist.beeType && (
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
                {t('please')+' '+ t('selectTypeOfBeesInThisApiary')}{' '}
              </Text>
            </View>
          )}
        </View>

         
      </View>
      <View style={{marginTop: 20}}>
        <View style={styles.hiveDetailsSection}>
        <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {apiaryDetails?.numberOfHivesWithBroodOnly?.toString()?.length>0 && <View style={{
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

              <Text style={!(apiaryDetails?.numberOfHivesWithBroodOnly?.toString()?.length>0)?styles.label:styles.correctlabel}>2. {t('numberOfHivesWithBroodOnly')}</Text>

            </View>
            <View style={{flexDirection: 'column',marginBottom: 10,}}>
            <TouchableOpacity
            style={{
              flexDirection: 'row',
              borderWidth: 0.8,
              borderColor:  noofbroodhive?.current? '#028454': errorlist?.noofbroodhive ? '#FF0000' : udyamitaTheme.borderStyleColor,
              borderRadius: 6,
              paddingLeft: 10,
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              source={require('../../assets/images/beeBox.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />
            <TextInput
              placeholder={t('numberOfHivesWithBroodOnly')}
              placeholderTextColor={udyamitaTheme.textColor}
              style={styles.textInputWrap}
              keyboardType="number-pad"
              value={apiaryDetails?.numberOfHivesWithBroodOnly?.toString()}
              onChangeText={val => {
                if(!edit){
                  setedit(!edit)
                }
                // Check if the entered value is a number
                if (!isNaN(val)) {
                  // If it's a number, update the state
                  setapiaryDetails({
                    ...apiaryDetails,
                    numberOfHivesWithBroodOnly: val,
                  });
                } else {
                  Toast.show(t('pleaseEnterNumbers'), Toast.SHORT);
                }
              }}
              onFocus={e=>{
                noofbroodhive.current=true
                setflag(!flag)
              }}
              onBlur={e=>{
                noofbroodhive.current=false
                setflag(!flag)
              }}
            />
          </TouchableOpacity>
          {errorlist.noofbroodhive && (
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
                {t('pleaseenternoofhive')}{' '}
              </Text>
            </View>
          )}
        </View>
    
          <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {apiaryDetails?.numberOfHivesWithBroodAndSuper?.toString()?.length>0 && <View style={{
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

              <Text style={!(apiaryDetails?.numberOfHivesWithBroodAndSuper?.toString()?.length>0)?styles.label:styles.correctlabel}>
              3. {t('numberOfHivesWithBroodAndSuper')}
              </Text>

            </View>
            <View style={{flexDirection: 'column'}}>
            <TouchableOpacity
            style={{
              flexDirection: 'row',
              // marginTop: 10,
              borderWidth: 0.8,
              borderColor:  noofbroodandsuperhive?.current? '#028454': errorlist?.noofbroodandsuperhive ? '#FF0000' : udyamitaTheme.borderStyleColor,
              borderRadius: 6,
              paddingLeft: 10,
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              source={require('../../assets/images/beeBox.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />
            <TextInput
              placeholder={t('numberOfHivesWithBroodAndSuper')}
              placeholderTextColor={udyamitaTheme.textColor}
              style={styles.textInputWrap}
              keyboardType="number-pad"
              value={apiaryDetails?.numberOfHivesWithBroodAndSuper?.toString()}
              onChangeText={val => {
                if(!edit){
                  setedit(!edit)
                }
                // Check if the entered value is a number
                if (!isNaN(val)) {
                  // If it's a number, update the state
                  setapiaryDetails({
                    ...apiaryDetails,
                    numberOfHivesWithBroodAndSuper: val,
                  });
                } else {
                  Toast.show(t('pleaseEnterNumbers'), Toast.SHORT);
                }
              }}
              onFocus={e=>{
                noofbroodandsuperhive.current=true
                setflag(!flag)
              }}
              onBlur={e=>{
                noofbroodandsuperhive.current=false
                setflag(!flag)
              }}
            />
          </TouchableOpacity>
          {errorlist.noofbroodandsuperhive && (
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
                {t('pleaseenternoofhive')}{' '}
              </Text>
            </View>
          )}
        </View>
  
          <View style={{flexDirection: 'column', marginBottom: 10}}>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              
              <Text style={[styles.label3, {marginBottom: 0}]}>
                {t('totalHives')}:
              </Text>
              <Text
                style={[
                  styles.label3,
                  {
                    marginBottom: 0,
                    marginLeft: 2,
                    color: udyamitaTheme.beeAppColor,
                  },
                ]}>
                {getTotalBoxes() == NaN ? 0 : getTotalBoxes()}
              </Text>
            </View>
            {apiaryDetails.numberOfHivesWithBroodAndSuper == '' ||
            apiaryDetails.numberOfHivesWithBroodOnly == '' ||
            parseInt(apiaryDetails.numberOfHivesWithBroodAndSuper) +
              parseInt(apiaryDetails.numberOfHivesWithBroodOnly) >
              0 ? null : (
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
               <Text
                style={{
                  color: 'red',
                  marginTop: 0,
                  fontSize: 14,
                  marginLeft:8,
                  fontWeight: '400',
                }}>
                {t('totalnoerrormsg')}
              </Text>
            </View>     
            )}
          </View>
          {selectedBeeType == 'mellifera' ? (
            <>
            <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {true && <View style={{
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

              <Text style={false?styles.label:styles.correctlabel}>
              4. {t('numberOfFramesPerChamber')}
              </Text>

            </View>
              <View
                style={{
                  flexDirection: 'row',
                  //marginTop: 10,
                  position:'relative',
                  marginBottom:10,
                  borderWidth: 0.8,
                  borderColor: udyamitaTheme.borderStyleColor,
                  borderRadius: 6,
                  paddingVertical: 15,
                  paddingHorizontal:10,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}>
                <Text style={[styles.textInputWrap,{color:'#262626'}]}>10</Text>
                <View
                  style={{
                    position: 'absolute',
                    borderWidth: 1,
                    right:0,
                    backgroundColor:'#FAFAFA',
                    
                    borderColor: udyamitaTheme.borderStyleColor,
                    borderRadius: 6,
                    paddingVertical: 14,
                  
                    alignItems: 'center',
                  }}>
                   
                  <Text style={{paddingHorizontal:5,fontSize:14,fontWeight:'600'}}>frames</Text>
                </View>
              </View>
            </>
          ) : selectedBeeType == 'cerana indica' ? (
            <>
             <View style={[styles.flexrow, { gap: 8, marginTop: 14, marginBottom: 6 }]}>
              {apiaryDetails?.frameCountPerChamber>0 && <View style={{
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

              <Text style={!(apiaryDetails?.frameCountPerChamber>0)?styles.label:styles.correctlabel}>
              4. {t('numberOfFramesPerChamber')}
              </Text>

            </View>
            <View style={{flexDirection: 'column',marginBottom:15}}>
            <View style={{flexDirection:'row',width:'80%',justifyContent:'space-between',alignItems:'center',gap:5,marginTop:5}}>
               <RadioForm formHorizontal={true} animation={true}>
              <RadioButton labelHorizontal={true}>
                <RadioButtonInput
                  obj={{label: '6', value: '6'}}
                  index={0}
                  isSelected={chammber==6}
                  onPress={()=>{setchammber(6)}}

                  borderWidth={1}
                  buttonInnerColor={
                    chammber==6  ? udyamitaTheme.beeAppColor : '#e74c3c'
                  }
                  buttonOuterColor={
                     udyamitaTheme.borderStyleColor
                  }
                  buttonSize={15}
                  buttonOuterSize={20}
                />
                <RadioButtonLabel
                  obj={{label: '6 Frames', value: '6'}}
                  index={0}
                  onPress={()=>{setchammber(6)}}
                  labelStyle={{ marginLeft:10 }}                />
              </RadioButton>
            </RadioForm>
               <RadioForm formHorizontal={true} animation={true}>
              <RadioButton labelHorizontal={true}>
                <RadioButtonInput
                  obj={{label: '8', value: '8'}}
                  index={0}
                  isSelected={chammber==8}
                  onPress={()=>{setchammber(8)}}

                  borderWidth={1}
                  buttonInnerColor={
                    chammber==8  ? udyamitaTheme.beeAppColor : '#e74c3c'
                  }
                  buttonOuterColor={
                     udyamitaTheme.borderStyleColor
                  }
                  buttonSize={15}
                  buttonOuterSize={20}
                />
                <RadioButtonLabel
                  obj={{label: '8 Frames', value: '8'}}
                  index={0}
                  onPress={()=>{setchammber(8)}}
                  labelStyle={{ marginLeft:10 }}
                />
              </RadioButton>
            </RadioForm>
            
               </View>
          {errorlist.noofframeperchamber && (
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
                {t('pleaseselectnoofframe')}{' '}
              </Text>
            </View>
          )}
        </View>
              
            </>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default BeeRegisterMyHives;

const styles = StyleSheet.create({
  hiveDetailsSection: {
    backgroundColor: '#fff',
    borderWidth: 0.8,

    borderColor: udyamitaTheme.borderStyleColor,
    padding: 20,
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
  label3: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  textInputWrapNormal: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  beeTypeCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    // alignItems: 'center',
    borderColor: udyamitaTheme.borderStyleColor,
    backgroundColor: '#fff',
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
    flexWrap: 'wrap',
  },
  erroralert:{
    color:'#FF0000',
    fontSize:12,
    fontWeight:'400',
    marginLeft:8,
  }
});
