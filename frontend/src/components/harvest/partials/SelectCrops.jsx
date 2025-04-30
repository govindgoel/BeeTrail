import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import {winHeight} from '../../../helpers/dimensions';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import useDebounce from '../../../helpers/hooks/useDebounce';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const SelectCrops = ({onClose, onSelectCrops, cropSelected}) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCropForModal, setSelectedCropForModal] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredCropData, setFilteredCropData] = useState([]);

  const tabs = [
    t('all'),
    t('fruitsAndNuts'),
    t('VegetableSeedCrops'),
    t('oilseedCrops'),
    t('herbsAndSpices'),
    t('trees'),
    t('others'),
  ];

  const FruitsAndNuts = [
    {
      name: 'Almond',
      i18nLangIdentifier: 'almond',
      langIdentifier: t('almond'),
      cropId: 'almond',
      source: require('../../../assets/images/Almond.png'),
    },
    {
      name: 'Apricot',
      i18nLangIdentifier: 'apricot',
      langIdentifier: t('apricot'),
      cropId: 'apricot',
      source: require('../../../assets/images/Apricot.png'),
    },
    {
      name: 'Areca',
      i18nLangIdentifier: 'areca',
      langIdentifier: t('areca'),
      cropId: 'Areca',
      source: require('../../../assets/images/Areca.png'),
    },
    {
      name: 'Apple',
      i18nLangIdentifier: 'apple',
      langIdentifier: t('apple'),
      cropId: 'Apple',
      source: require('../../../assets/images/Apple.png'),
    },
    {
      name: 'Avocado',
      i18nLangIdentifier: 'avocado',
      langIdentifier: t('avocado'),
      cropId: 'Avocado',
      source: require('../../../assets/images/Avocado.png'),
    },
    {
      name: 'Cashew',
      i18nLangIdentifier: 'cashew',
      langIdentifier: t('cashew'),
      cropId: 'Cashew',
      source: require('../../../assets/images/Cashew.png'),
    },
    {
      name: 'Citrus',
      i18nLangIdentifier: 'citrus',
      langIdentifier: t('citrus'),
      cropId: 'Citrus',
      source: require('../../../assets/images/Citrus.png'),
    },
    {
      name: 'Coconut',
      i18nLangIdentifier: 'coconut',
      langIdentifier: t('coconut'),
      cropId: 'Coconut',
      source: require('../../../assets/images/Coconut.png'),
    },
    {
      name: 'Guava',
      i18nLangIdentifier: 'guava',
      langIdentifier: t('guava'),
      cropId: 'Guava',
      source: require('../../../assets/images/Guava.png'),
    },
    {
      name: 'Jamun',
      i18nLangIdentifier: 'jamun',
      langIdentifier: t('jamun'),
      cropId: 'Jamun',
      source: require('../../../assets/images/Jamun.png'),
    },
    {
      name: 'Kiwi',
      i18nLangIdentifier: 'kiwi',
      langIdentifier: t('kiwi'),
      cropId: 'Kiwi',
      source: require('../../../assets/images/Kiwi.png'),
    },
    {
      name: 'Litchi',
      i18nLangIdentifier: 'litchi',
      langIdentifier: t('litchi'),
      cropId: 'litchi',
      source: require('../../../assets/images/Litchi.png'),
    },
    {
      name: 'Peach',
      i18nLangIdentifier: 'peach',
      langIdentifier: t('peach'),
      cropId: 'Peach',
      source: require('../../../assets/images/Peach.png'),
    },
    {
      name: 'Strawberry',
      i18nLangIdentifier: 'strawberry',
      langIdentifier: t('strawberry'),
      cropId: 'Strawberry',
      source: require('../../../assets/images/Strawberry.png'),
    },
  ];

  const VegetableVegetableSeedCrops = [
    {
      name: 'Cabbage',
      i18nLangIdentifier: 'cabbage',
      langIdentifier: t('cabbage'),
      cropId: 'Cabbage',
      source: require('../../../assets/images/Cabbage.png'),
    },
    {
      name: 'Cauliflower',
      i18nLangIdentifier: 'cauliflower',
      langIdentifier: t('cauliflower'),
      cropId: 'Cauliflower',
      source: require('../../../assets/images/Cauliflower.png'),
    },
    {
      name: 'Carrot',
      i18nLangIdentifier: 'carrot',
      langIdentifier: t('carrot'),
      cropId: 'Carrot',
      source: require('../../../assets/images/Carrot.png'),
    },
    {
      name: 'Chili',
      i18nLangIdentifier: 'chili',
      langIdentifier: t('chili'),
      cropId: 'Chili',
      source: require('../../../assets/images/Chili.png'),
    },
    {
      name: 'Coriander',
      i18nLangIdentifier: 'coriander',
      langIdentifier: t('coriander'),
      cropId: 'Coriander',
      source: require('../../../assets/images/Coriander.png'),
    },
    {
      name: 'Cucumber',
      i18nLangIdentifier: 'cucumber',
      langIdentifier: t('cucumber'),
      cropId: 'Cucumber',
      source: require('../../../assets/images/Cucumber.png'),
    },
    {
      name: 'Gourds',
      i18nLangIdentifier: 'gourds',
      langIdentifier: t('gourds'),
      cropId: 'Gourds',
      source: require('../../../assets/images/Gourds.png'),
    },
    {
      name: 'Melon',
      i18nLangIdentifier: 'melon',
      langIdentifier: t('melon'),
      cropId: 'Melon',
      source: require('../../../assets/images/Melon.png'),
    },
    {
      name: 'Onion',
      i18nLangIdentifier: 'onion',
      langIdentifier: t('onion'),
      cropId: 'Onion',
      source: require('../../../assets/images/Onion.png'),
    },
    {
      name: 'Pumpkin',
      i18nLangIdentifier: 'pumpkin',
      langIdentifier: t('pumpkin'),
      cropId: 'Pumpkin',
      source: require('../../../assets/images/Pumpkin.png'),
    },
    {
      name: 'Radish',
      i18nLangIdentifier: 'radish',
      langIdentifier: t('radish'),
      cropId: 'Radish',
      source: require('../../../assets/images/Radish.png'),
    },
    {
      name: 'Turnip',
      i18nLangIdentifier: 'turnip',
      langIdentifier: t('turnip'),
      cropId: 'Turnip',
      source: require('../../../assets/images/Turnip.png'),
    },
  ];

  const OilseedCrops = [
    {
      name: 'Linseed',
      i18nLangIdentifier: 'linseed',
      langIdentifier: t('linseed'),
      cropId: 'Linseed',
      source: require('../../../assets/images/Linseed.png'),
    },
    {
      name: 'Mustard',
      i18nLangIdentifier: 'mustard',
      langIdentifier: t('mustard'),
      cropId: 'Mustard',
      source: require('../../../assets/images/Mustard.png'),
    },
    {
      name: 'Niger',
      i18nLangIdentifier: 'niger',
      langIdentifier: t('niger'),
      cropId: 'Niger',
      source: require('../../../assets/images/Niger.png'),
    },
    {
      name: 'Rape seed',
      i18nLangIdentifier: 'rapeSeed',
      langIdentifier: t('rapeSeed'),
      cropId: 'Rape seed',
      source: require('../../../assets/images/Rapeseed.png'),
    },
    {
      name: 'Safflower',
      i18nLangIdentifier: 'safflower',
      langIdentifier: t('safflower'),
      cropId: 'Safflower',
      source: require('../../../assets/images/Safflower.png'),
    },
    {
      name: 'Sesame',
      i18nLangIdentifier: 'sesame',
      langIdentifier: t('sesame'),
      cropId: 'Sesame',
      source: require('../../../assets/images/Sesame.png'),
    },
    {
      name: 'Sunflower',
      i18nLangIdentifier: 'sunflower',
      langIdentifier: t('sunflower'),
      cropId: 'Sunflower',
      source: require('../../../assets/images/Sunflower.png'),
    },
  ];

  const HerbsAndSpices = [
    {
      name: 'Cardamom',
      i18nLangIdentifier: 'cardamom',
      langIdentifier: t('cardamom'),
      cropId: 'Cardamom',
      source: require('../../../assets/images/Cardamom.png'),
    },
    {
      name: 'Carom',
      i18nLangIdentifier: 'carom',
      langIdentifier: t('carom'),
      cropId: 'Carom',
      source: require('../../../assets/images/Carom.png'),
    },
    {
      name: 'Cassia',
      i18nLangIdentifier: 'cassia',
      langIdentifier: t('cassia'),
      cropId: 'Cassia',
      source: require('../../../assets/images/Cassia.png'),
    },
    {
      name: 'Dill',
      i18nLangIdentifier: 'dill',
      langIdentifier: t('dill'),
      cropId: 'Dill',
      source: require('../../../assets/images/Dill.png'),
    },
    {
      name: 'Fennel',
      i18nLangIdentifier: 'fennel',
      langIdentifier: t('fennel'),
      cropId: 'Fennel',
      source: require('../../../assets/images/Fennel.png'),
    },
    {
      name: 'Saffron',
      i18nLangIdentifier: 'saffron',
      langIdentifier: t('saffron'),
      cropId: 'Saffron',
      source: require('../../../assets/images/Saffron.png'),
    },
    {
      name: 'Thyme',
      i18nLangIdentifier: 'thyme',
      langIdentifier: t('thyme'),
      cropId: 'Thyme',
      source: require('../../../assets/images/Thyme.png'),
    },
    {
      name: 'Tulsi',
      i18nLangIdentifier: 'tulsi',
      langIdentifier: t('tulsi'),
      cropId: 'Tulsi',
      source: require('../../../assets/images/Tulsi.png'),
    },
  ];

  const Trees = [
    {
      name: 'Acacia',
      i18nLangIdentifier: 'acacia',
      langIdentifier: t('acacia'),
      cropId: 'Acacia',
      source: require('../../../assets/images/Acacia.png'),
    },
    {
      name: 'Cherry',
      i18nLangIdentifier: 'cherry',
      langIdentifier: t('cherry'),
      cropId: 'Cherry',
      source: require('../../../assets/images/Cherry.png'),
    },
    {
      name: 'Crepe-myrtle',
      i18nLangIdentifier: 'crepeMyrtle',
      langIdentifier: t('crepeMyrtle'),
      cropId: 'Crepe-myrtle',
      source: require('../../../assets/images/Crepe-myrtle.png'),
    },
    {
      name: 'Curry tree',
      i18nLangIdentifier: 'curryTree',
      langIdentifier: t('curryTree'),
      cropId: 'Curry tree',
      source: require('../../../assets/images/Curry-tree.png'),
    },
    {
      name: 'Eucalyptus',
      i18nLangIdentifier: 'eucalyptus',
      langIdentifier: t('eucalyptus'),
      cropId: 'Eucalyptus',
      source: require('../../../assets/images/Eucalyptus.png'),
    },
    {
      name: 'Mimosa',
      i18nLangIdentifier: 'mimosa',
      langIdentifier: t('mimosa'),
      cropId: 'Mimosa',
      source: require('../../../assets/images/Mimosa.png'),
    },
    {
      name: 'Moringa',
      i18nLangIdentifier: 'moringa',
      langIdentifier: t('moringa'),
      cropId: 'Moringa',
      source: require('../../../assets/images/Moringa.png'),
    },
    {
      name: 'Neem',
      i18nLangIdentifier: 'neem',
      langIdentifier: t('neem'),
      cropId: 'Neem',
      source: require('../../../assets/images/Neem.png'),
    },
    {
      name: 'Pongamia',
      i18nLangIdentifier: 'pongamia',
      langIdentifier: t('pongamia'),
      cropId: 'Pongamia',
      source: require('../../../assets/images/Pongamia.png'),
    },
    // {
    //   name: 'Syzgium',
    //   langIdentifier: 'syzgium,//
    // langIdentifier: 'syzgium',
    //   cropId: 'Syzgium',
    //   source: require('../../../assets/images/Syzygium.png'),
    // },
    {
      name: 'Trumpet vine',
      i18nLangIdentifier: 'trumpetVine',
      langIdentifier: t('trumpetVine'),
      cropId: 'Trumpet vine',
      source: require('../../../assets/images/Trumpetvine.png'),
    },
  ];

  const Others = [
    {
      name: 'Cacao',
      i18nLangIdentifier: 'cacao',
      langIdentifier: t('cacao'),
      cropId: 'Cacao',
      source: require('../../../assets/images/Cacao.png'),
    },
    {
      name: 'Coffee',
      i18nLangIdentifier: 'coffee',
      langIdentifier: t('coffee'),
      cropId: 'Coffee',
      source: require('../../../assets/images/Coffee.png'),
    },
    {
      name: 'Cotton',
      i18nLangIdentifier: 'cotton',
      langIdentifier: t('cotton'),
      cropId: 'Cotton',
      source: require('../../../assets/images/Cotton.png'),
    },

    {
      name: 'Lentils',
      i18nLangIdentifier: 'lentils',
      langIdentifier: t('lentils'),
      cropId: 'Lentils',
      source: require('../../../assets/images/Lentils.png'),
    },
    {
      name: 'Lucerne',
      i18nLangIdentifier: 'lucerne',
      langIdentifier: t('lucerne'),
      cropId: 'Lucerne',
      source: require('../../../assets/images/Lucerne.png'),
    },
    {
      name: 'Millet',
      i18nLangIdentifier: 'millet',
      langIdentifier: t('millet'),
      cropId: 'Millet',
      source: require('../../../assets/images/Millet.png'),
    },
    {
      name: 'Peas',
      i18nLangIdentifier: 'peas',
      langIdentifier: t('peas'),
      cropId: 'Peas',
      source: require('../../../assets/images/Peas.png'),
    },
    {
      name: 'Soapberry',
      i18nLangIdentifier: 'soapberry',
      langIdentifier: t('soapberry'),
      cropId: 'Soapberry',
      source: require('../../../assets/images/Soapberry.png'),
    },
    {
      name: 'Tuberose',
      i18nLangIdentifier: 'tuberose',
      langIdentifier: t('tuberose'),
      cropId: 'Tuberose',
      source: require('../../../assets/images/Tuberose.png'),
    },
  ];

  const handleOpenModal = crop => {
    setSelectedCropForModal(crop);
    setModalVisible(true);
  };
  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomText style={styles.modalText} type="btn">
              {selectedCropForModal?.langIdentifier}
            </CustomText>
           
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={{width: 32, height: 32}}
              />
            </TouchableOpacity>
          </View>
          <Image  
            source={selectedCropForModal?.source}
          style={{width: 161, height: 161}}
          />
        </View>
      </View>
    </Modal>
  );
  const handleSearch = () => {
    let filteredData = [];

    switch (activeTab) {
      case 0: // All crops
        filteredData = [
          ...FruitsAndNuts,
          ...VegetableVegetableSeedCrops,
          ...OilseedCrops,
          ...HerbsAndSpices,
          ...Trees,
          ...Others,
        ];
        break;
      case 1: // Fruits and Nuts
        filteredData = FruitsAndNuts;
        break;
      case 2: // Vegetable and Vegetable Seed Crops
        filteredData = VegetableVegetableSeedCrops;
        break;
      case 3: // Oilseed Crops
        filteredData = OilseedCrops;
        break;
      case 4: // Herbs and Spices
        filteredData = HerbsAndSpices;
        break;
      case 5: // Trees
        filteredData = Trees;
        break;
      case 6: // Others
        filteredData = Others;
        break;
      default:
        filteredData = [];
    }

    // filteredData = filteredData.filter(crop =>
    //   crop.name.toLowerCase().includes(searchText.toLowerCase()),
    // );
    if (searchText) {
      const searchTextRegex = new RegExp(searchText, 'ig');
      filteredData = filteredData.filter(
        crop =>
          searchTextRegex.test(crop.i18nLangIdentifier, {lng: 'en'}) ||
          searchTextRegex.test(t(crop.i18nLangIdentifier, {lng: 'hi'})) ||
          searchTextRegex.test(t(crop.i18nLangIdentifier, {lng: 'kn'})) ||
          searchTextRegex.test(t(crop.i18nLangIdentifier, {lng: 'mr'})),
      );
    }

    setFilteredCropData(filteredData);
  };

  const renderCropItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.cropCard,
          {
            backgroundColor:
              selectedCrop === item.cropId ? udyamitaTheme.beeAppColor : '#fff',
          },
        ]}
        onPress={() => handleCropSelection(item.cropId)}>
        <Image source={item.source} style={styles.cropImage} />
        <TouchableOpacity
          style={styles.enLargeImage}
          onPress={() => handleOpenModal(item)}>
          <Image
            source={require('../../../assets/images/Enlarge.png')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
        <RadioForm formHorizontal={true}>
          <RadioButton labelHorizontal={true} key={item.cropId}>
            <RadioButtonInput
              obj={{value: item.cropId}}
              index={item.cropId}
              isSelected={selectedCrop === item.cropId}
              onPress={() => handleCropSelection(item.cropId)}
              borderWidth={selectedCrop === item.cropId ? 3 : 1}
              buttonInnerColor={
                selectedCrop === item.cropId
                  ? udyamitaTheme.beeAppColor
                  : '#e74c3c'
              }
              buttonOuterColor={
                selectedCrop === item.cropId
                  ? '#fff'
                  : udyamitaTheme.borderStyleColor
              }
              buttonSize={9}
              buttonOuterSize={20}
            />

            <RadioButtonLabel
              labelHorizontal={true}
              obj={{label: item.langIdentifier, value: item.name}}
              index={0}
              onPress={() => handleCropSelection(item.cropId)}
              labelStyle={{
                color: selectedCrop === item.cropId ? '#fff' : '#000',
                fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                flexShrink: 1,
              }}
            />
          </RadioButton>
        </RadioForm>
      </TouchableOpacity>
    );
  };

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
    const selectedCropData = filteredCropData.find(
      crop => crop.cropId === selectedCrop,
    );

    if (selectedCropData) {
      onSelectCrops([selectedCropData.name]);
    }

    onClose();
  };

  useDebounce(
    () => {
      handleSearch();
    },
    [searchText, activeTab],
    800,
  );
  const selectTab = index => {
    setActiveTab(index);
    // Call handleSearch when tab is selected
    //setFilteredCropData([]); // Clear previous filtered data
    handleSearch();
  };
  console.log(selectedCrop);

  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tabItem, activeTab === index && styles.activeTab]}
          onPress={() => selectTab(index)}>
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.activeTabText,
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
                  // flowername:
                  //   filteredCropData.find(crop => crop.cropId === selectedCrop)
                  //     ?.name || '',
                  flowername: t(selectedCrop.toLowerCase()) || '',
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
        {renderTabs()}
        {renderModal()}
        <FlatList
          ListFooterComponent={
            <View
              style={{
                paddingBottom: winHeight * 0.5,
              }}
            />
          }
          data={filteredCropData}
          renderItem={renderCropItem}
          keyExtractor={item => item.cropId}
          numColumns={3}
          contentContainerStyle={styles.cropListContainer}
          
        />
      </View>
    </View>
  );
};

export default SelectCrops;

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: udyamitaTheme.beeAppColor,
    borderWidth: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginLeft: 20,
    marginTop: 5,
    // marginBottom: 30,
    height: 50,
  },
  tabItem: {
    //paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  activeTabText: {
    color: 'white',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
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
    //flex: 1,
    margin: 8,
    width: '30%',
  },
  cropImage: {
    width: 95,
    height: 90,
    borderRadius: 4,
    marginBottom: 8,
  },
  enLargeImage: {
    position: 'absolute',
    width: 32,
    height: 32,
    right: 6,
    top: 6,
  },
  cropName: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.textColor,
    // marginLeft: -5,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    //alignItems: "center",
    shadowColor: '#000',
  },
  modalText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  button: {
    width: 32,
    height: 32,
  },
});
