import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,

  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import FarmFilterValues from './FarmFilterValues';
import CustomText from '../../reusable/CustomText';

const FarmFilter = ({onClose}) => {
  const {t} = useTranslation();
  const [selectedFilterKeyIndex, setSelectedFilterKeyIndex] = useState(0);
  const handleSelectFilterKey = filterIndex => {
    // Handle the selection logic here
    setSelectedFilterKeyIndex(filterIndex);
  };
  const AllFilters = [
    {
      filter: t('distance'),
      filterValue: 'distance',
      filterValues: [
        {
          label: '0 km',
          value: '0 km',
        },
        {
          label: '50 km',
          value: '50 km',
        },
        {
          label: '100 km',
          value: '100 km',
        },
        {
          label: '150 km and more',
          value: '150 km and more',
        },
        
      ],
    },
    {
      filter: t('crop'),
      filterValue: 'crop',
      filterValues: [
        {
          label: t('any'),
          value: 'Any',
        },
        {
          label: t('multifloral'),
          value: 'Multifloral',
        },
        {
          label: t('ajwain'),
          value: 'Ajwain',
        },
        {
          label: t('tulsi'),
          value: 'Tulsi',
        },
        {
          label: t('litchi'),
          value: 'Litchi',
        },
        {
          label: t('hibiscus'),
          value: 'Hibiscus',
        },
        {
          label: t('ajwain'),
          value: 'Acacia',
        },
        {
          label: t('eucalyptus'),
          value: 'Eucalyptus',
        },
        {
          label: t('jamun'),
          value: 'Jamun',
        },
        {
          label: t('neem'),
          value: 'Neem',
        },
        {
          label: t('mustard'),
          value: 'Mustard',
        },
        {
          label: t('mango'),
          value: 'Mango',
        },
  
      ],
    },
    {
      filter: t('farmingMethod'),
      filterValue: 'farmingMethod',
      filterValues: [
        {
          label: t('any'),
          value: 'Any',
        },
        {
          label: 'ZNBF',
          value: 'ZNBF',
        },
        {
          label: t('organicFarming'),
          value: 'Organic Farming',
        },
        {
          label: t('agroforestry'),
          value: 'Agroforestry',
        },
      ],
    },
  ];

  const INITIAL_FILTER_STATE = AllFilters.reduce((obj, valObj) => {
    obj[valObj.filterValue] = [];
    return obj;
  }, {});
  const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);

  const resetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
    onClose();
  }
  

  // const handleValuePress = filterValueSelected => {
  //   console.log('filterValueSelected: ', filterValueSelected);
   
  //   let selectedFilterLabel = AllFilters[selectedFilterKeyIndex]['filterValue'];
   
  //   let _filtervalues = filterState[selectedFilterLabel].includes(
  //     filterValueSelected,
  //   )
  //     ? filterState[selectedFilterLabel].filter(x => x !== filterValueSelected)
  //     : [...filterState[selectedFilterLabel], filterValueSelected];
  
  //   let UPDATED_FILTER_STATE = {
  //     ...filterState,
  //     [selectedFilterLabel]: _filtervalues,
  //   };
   
  //   setFilterState(UPDATED_FILTER_STATE);
  // };

  const handleValuePress = (filterValueSelected) => {

    let selectedFilterLabel = AllFilters[selectedFilterKeyIndex]['filterValue'];
  
    let _filtervalues;
  
    if (filterValueSelected === 'Any') {
     
      _filtervalues = AllFilters[selectedFilterKeyIndex].filterValues.map(value => value.value);
    } else {
      _filtervalues = filterState[selectedFilterLabel].includes(filterValueSelected)
        ? filterState[selectedFilterLabel].filter((x) => x !== filterValueSelected)
        : [...filterState[selectedFilterLabel], filterValueSelected];
    }
  
    let UPDATED_FILTER_STATE = {
      ...filterState,
      [selectedFilterLabel]: _filtervalues,
    };
  
    setFilterState(UPDATED_FILTER_STATE);
  };
  
  return (
    <View style={{flex:1,backgroundColor:udyamitaTheme.themeBgColor}}>
      <View style={styles.header}>
        <CustomText style={styles.filtersText} type='mlabel'>{t('Filter')}</CustomText>
        <TouchableOpacity onPress={() => onClose()}>
          <Image
            source={require('../../../assets/images/Cross.png')}
            style={styles.crossBtnStyle}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
  
          <ScrollView contentContainerStyle={styles.filterKey}>
            {AllFilters &&
              AllFilters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectFilterKey(index)}
                  style={[
                    styles.filterKey_item,
                    filter.filter ===
                      AllFilters[selectedFilterKeyIndex].filter &&
                      styles.filterKey_itemSelected,
                  ]}>
                  <CustomText style={styles.filterKey_text} type='btn'>{filter?.filter}</CustomText>
                </TouchableOpacity>
              ))}
          </ScrollView>
  
        <View style={styles.columnContainer}>
          {/* Right column - Filter values */}
     
            <ScrollView contentContainerStyle={styles.filterValues}>
              {
                <FarmFilterValues
                  handleValuePress={handleValuePress}
                  filterState={
                    filterState[
                      AllFilters[selectedFilterKeyIndex].filterValue
                    ] || []
                  }
                  filterValues={AllFilters[selectedFilterKeyIndex].filterValues}
                  filterName={AllFilters[selectedFilterKeyIndex].filterValue}
                />
              }
            </ScrollView>
      
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={()=>resetFilters()}>
        <CustomText style={styles.btnText} type='btn'>{t('cancel')}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn,{backgroundColor:'#E6F3EE'}]}>
          <CustomText style={[styles.btnText,{color:udyamitaTheme.beeAppColor}]} type='btn'>{t('apply')}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FarmFilter;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderBottomWidth: 0.5,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  filtersText: {
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  crossBtnStyle: {
    width: 24,
    height: 24,
  },

  filterContainer: {
    flexDirection: 'row',
    flex:1,
 
  },

  filterKey: {
    flexGrow: 1,
    backgroundColor: '#F1F1F1',
    //width:122
  
  },
  filterKey_item: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    paddingLeft:10
  },
  filterKey_itemSelected: {
    backgroundColor: 'white',

    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  filterKey_text: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 10,
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
  columnContainer: {
    //flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
    flexGrow:1,
    //marginBottom:20
  },
  footer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    height: 98,
    flexDirection: 'row',
   justifyContent:'space-between',
   elevation:10
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '49%',
   height:44,
    backgroundColor:'#F1F1F1',
    borderRadius:6
  },
  btnText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
});
