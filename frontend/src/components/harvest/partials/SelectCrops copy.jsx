import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {Checkbox} from 'react-native-paper';
import useDebounce from '../../../helpers/hooks/useDebounce';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const SelectCrops = ({onClose, onSelectCrops}) => {
  const {t} = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [checked, setChecked] = React.useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCropData, setFilteredCropData] = useState([]);
  const cropData = [
    {
      id: '0',
      name: t('ajwain'),
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Carom_Flowers.jpg/1200px-Carom_Flowers.jpg',
    },
    {
      id: '1',
      name: t('alfalfa'),
      image:
        'https://cdn.britannica.com/18/182618-050-53ADCEF8/Alfalfa-forage-crop.jpg',
    },
    {
      id: '2',
      name: t('blueberry'),
      image:
        'https://i.pinimg.com/736x/19/d1/2d/19d12dea99d0a23e360bc66680e9e949.jpg',
    },
    {
      id: '3',
      name: t('clover'),
      image:
        'https://images.pexels.com/photos/12200818/pexels-photo-12200818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '4',
      name: t('coriander'),
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Coriandrum_sativum_003.JPG/225px-Coriandrum_sativum_003.JPG',
    },
    {
      id: '5',
      name: t('dill'),
      image: 'https://cdn.mos.cms.futurecdn.net/6KLYPweJK5RgYtGQV4WwpE.jpg',
    },
    {
      id: '6',
      name: t('lavender'),
      image: 'https://www.senteurs.in/wp-content/uploads/2021/02/Lavender.jpeg',
    },
    {
      id: '7',
      name: t('mint'),
      image:
        'https://www.petalrepublic.com/wp-content/uploads/2021/04/Ultimate-Guide-to-Mint-Plant-Meaning-Symbolism-Types-and-Uses.jpeg',
    },
    {
      id: '8',
      name: t('mustard'),
      image:
        'https://plantura.garden/uk/wp-content/uploads/sites/2/2022/03/mustard-plant.jpg',
    },
  ];
  const handleSearch = () => {
    const filteredData = cropData.filter(crop =>
      crop.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredCropData(filteredData);
  };
  const renderCropItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.cropCard,
        {
          backgroundColor:
            selectedCrop === item.id ? udyamitaTheme.beeAppColor : '#fff',
        },
      ]}
      onPress={() => handleCropSelection(item.id)}>
      <Image source={{uri: item.image}} style={styles.cropImage} />

      <RadioForm formHorizontal={true}>
        <RadioButton labelHorizontal={true} key={item.id}>
          <RadioButtonInput
            obj={{value: item.id}}
            index={item.id}
            isSelected={selectedCrop === item.id}
            onPress={() => handleCropSelection(item.id)}
            borderWidth={selectedCrop === item.id ? 3 : 1}
            buttonInnerColor={
              selectedCrop === item.id ? udyamitaTheme.beeAppColor : '#e74c3c'
            }
            buttonOuterColor={
              selectedCrop === item.id ? '#fff' : udyamitaTheme.borderStyleColor
            }
            buttonSize={9}
            buttonOuterSize={20}
          />

          <RadioButtonLabel
            labelHorizontal={true}
            obj={{label: item.name, value: item.name}}
            index={0}
            onPress={() => handleCropSelection(item.id)}
            labelStyle={{
              color: selectedCrop === item.id ? '#fff' : '#000',
              fontSize: udyamitaTheme.themeFontSizeSmallHeader,
              fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
              flexShrink: 1,
            }}
          />
        </RadioButton>
      </RadioForm>
    </TouchableOpacity>
  );

  const handleCropSelection = cropId => {
    setSelectedCrop(cropId);
  };

  const removeSelection = cropIdToRemove => {
    const updatedSelection = selectedCrop.filter(
      cropId => cropId !== cropIdToRemove,
    );
    setSelectedCrop(updatedSelection);
  };

  const handleConfirmCrops = () => {
    const selectedCropData = cropData.find(crop => crop.id === selectedCrop);

    if (selectedCropData) {
      onSelectCrops([selectedCropData.name]);
    }

    onClose();
  };
  useDebounce(
    () => {
      handleSearch(searchText);
    },
    [searchText],
    800,
  );
  return (
    <View style={styles.mainConatiner}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.headerText}>{t('selectFlower')}</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              source={require('../../../assets/images/Cross.png')}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',

              borderWidth: 0.5,
              borderColor: udyamitaTheme.borderStyleColor,
              borderRadius: 6,
              width: '100%',
              alignItems: 'center',
              paddingLeft: 5,
              paddingRight: 10,
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <TextInput
              placeholder={t('searchForAFlower')}
              placeholderTextColor={udyamitaTheme.textColor}
              style={{
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                opacity: 0.8,
                width: '100%',
              }}
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
            <TouchableOpacity
              onPress={() => handleSearch()}
              style={{position: 'absolute', right: 10}}>
              <Image
                source={require('../../../assets/images/SearchGreen.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {selectedCrop === null ? (
          <CustomText style={styles.cropLengthText} type="label">
            {t('selectedFlowerWillShowHere')}
          </CustomText>
        ) : (
          <>
            {selectedCrop && (
              <CustomText style={styles.cropNameSelected} type="sh">
                {t('hasBeenSelected', {
                  flowername: cropData[selectedCrop].name,
                })}
              </CustomText>
            )}
          </>
        )}

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                selectedCrop === null
                  ? udyamitaTheme.beeAppDisabledColor
                  : udyamitaTheme.beeAppColor,
            },
          ]}
          onPress={handleConfirmCrops}
          disabled={!selectedCrop}>
          <Text style={styles.btnText}>{t('confirmFlower')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginLeft: 10, marginRight: 10}}>
        <FlatList
          data={filteredCropData.length > 0 ? filteredCropData : cropData}
          renderItem={renderCropItem}
          keyExtractor={item => item.id}
          numColumns={3}
        />
      </View>
    </View>
  );
};

export default SelectCrops;

const styles = StyleSheet.create({
  mainConatiner: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    elevation: 40,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderBottomWidth: 0.5,
    padding: 20,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginBottom: 10,
  },
  headerText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  iconStyle: {
    width: 32,
    height: 32,
  },
  searchContainer: {
    //padding: 20,
    marginBottom: 8,
  },
  cropCard: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexWrap: 'wrap',
    flex: 1,
    margin: 8,
   
  },
  cropImage: {
    width: 90,
    height: 90,
    borderRadius: 4,
    marginBottom: 8,
    
  },
  cropName: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.textColor,
    marginLeft: -5,
    flexShrink: 1,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    padding: 20,
  },
  normalText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: '#000000',
  },
  btn: {
    height: 48,
    backgroundColor: udyamitaTheme.beeAppColor,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  selectedCropsContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    borderRadius: 21,
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start', // Align to the start (left) of the container
  },
  cropImageStyle: {
    width: 35,
    height: 35,
    borderRadius: 42,
    marginRight: 5,
  },
  cropNameSelected: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    textAlign: 'center',
    marginBottom: 10,
  },
  cropLengthText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    marginBottom: 10,
    color: udyamitaTheme.textColor,
    opacity: 0.5,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    textAlign: 'center',
  },
});
