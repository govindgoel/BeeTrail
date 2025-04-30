import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import FilterValues from './FilterValues';
import React, {useState, useEffect} from 'react';
import {getValueByKey} from '../../../helpers/UserData';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {APP_API_CATALOG_SERVICES} from '@env';

import axios from 'axios';
import NoFiltersToShow from './NoFiltersToShow';
import CustomText from '../../reusable/CustomText';

const ProductFilter = ({
  onClose,
  item,
  id,

  subId,

  setFiltersApplied,
  setFilteredProducts,
}) => {
  const {t} = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState({});
  const [initialFilterSelectState, setInitialFilterSelectState] = useState({});
  const [filterState, setFilterState] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [AllFilters, setAllFilters] = useState([]);
  // useEffect(() => {

  //   setSelectedFilter(prevSelectedFilter => {
  //     if (prevSelectedFilter && prevSelectedFilter[0]) {
  //       return prevSelectedFilter;
  //     } else {
  //       return {...prevSelectedFilter, [0]: []};
  //     }
  //   });
  //   // setSelectedFilterKey(AllFilters);
  //   //setSelectAll(false);
  // }
  //   ,[])
  const handleSelectFilterKey = filterName => {
    // console.log("fi;ltername",filterName);
    setSelectedFilter(prevSelectedFilter => {
      if (prevSelectedFilter && prevSelectedFilter[filterName]) {
        return prevSelectedFilter;
      } else {
        return {...prevSelectedFilter, [filterName]: []};
      }
    });
    setSelectedFilterKey(filterName);
    setSelectAll(false);
  };
  const handleSelectFilterValue = (filterName, selectedValues) => {
    setSelectedFilter(prevSelectedFilter => ({
      ...prevSelectedFilter,
      [filterName]: selectedValues,
    }));
  };
  const handleSelectAll = filterValues => {
    setSelectAll(prevSelectAll => !prevSelectAll);
    setSelectedFilter(prevSelectedFilter => {
      const updatedSelectedFilter = {...prevSelectedFilter};

      if (!selectAll) {
        // Select all values for the current filter
        const selectedValues = filterValues.map(valueObj => valueObj.value);
        updatedSelectedFilter[selectedFilterKey] = selectedValues;
      } else {
        // Clear selected values for the current filter
        updatedSelectedFilter[selectedFilterKey] = [];
      }

      const updatedFilterState = {
        ...filterState,
        [selectedFilterKey]: true,
      };

      setFilterState(updatedFilterState);
      return updatedSelectedFilter;
    });
  };
  const handleDeselectAll = selectedFilterKey => {
    setSelectedFilter(prevSelectedFilter => {
      const updatedSelectedFilter = {...prevSelectedFilter};
      updatedSelectedFilter[selectedFilterKey] = [];
      return updatedSelectedFilter;
    });

    const updatedFilterState = {
      ...filterState,
      [selectedFilterKey]: false,
    };
    setFilterState(updatedFilterState);
  };
  const toggleSelection = () => {
    if (!filterState[selectedFilterKey]) {
      handleSelectAll(
        AllFilters?.find(filter => filter.filter === selectedFilterKey)?.values,
      );
    } else {
      handleDeselectAll(selectedFilterKey);
    }
  };
  const handleValuePress = (filterName, value) => {
    setSelectedFilter(prevSelectedFilter => {
      const selectedValues = prevSelectedFilter[filterName] || [];
      let updatedSelectedValues;

      if (selectedValues.includes(value)) {
        updatedSelectedValues = selectedValues.filter(val => val !== value);
      } else {
        updatedSelectedValues = [...selectedValues, value];
      }

      return {
        ...prevSelectedFilter,
        [filterName]: updatedSelectedValues,
      };
    });
  };

  const getSubcategoriesFilters = async subcatId => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(
        `${APP_API_CATALOG_SERVICES}/subcategories/bySubCategory/${subcatId}`,
        config,
      )

      .then(function (response) {
        if (response.status === 200) {
          setAllFilters(response?.data?.filters);

          const filterKeys = AllFilters?.length > 0 && AllFilters?.map(x => x?.filter).reduce(
            (prev, curr) => {
              prev[curr] = false;
              return prev;
            },
            {},
          );
          setSelectedFilter(prevSelectedFilter => {
            if (prevSelectedFilter && prevSelectedFilter[response?.data?.filters[0]?.filter]) {
              return prevSelectedFilter;
            } else {
              return {...prevSelectedFilter, [response?.data?.filters[0]?.filter]: []};
            }
          });
          setSelectedFilterKey(response?.data?.filters[0]?.filter);
          setInitialFilterSelectState(filterKeys);
          setFilterState(filterKeys);
        }
      })
      .catch(function (error) {
        console.log('getProductsFilters error', error);
      });
  };

  const [selectedFilterKey, setSelectedFilterKey] = useState(
    AllFilters[0]?.filter || null,
  );
  useEffect(() => {
    getSubcategoriesFilters(id);
  }, []);
  const handleClearAll = () => {
    setSelectedFilter({});
    setFilterState(initialFilterSelectState);
    onClose();
  };

  const getProductVariantByFilters = async () => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(
        `${APP_API_CATALOG_SERVICES}/variants/byFilters/${subId}?filters=${JSON.stringify(
          selectedFilter,
        )}`,
        config,
      )

      .then(function (response) {
        if (response.status === 200) {
          setFilteredProducts(response?.data?.variantsByFilters);

          setFiltersApplied(true);
          onClose();
        }
      })
      .catch(function (error) {
        console.log('getProductVariantByFilters error', error);
      });
  };
  return (
    <>
      <View style={styles.header}>
        <CustomText style={styles.filtersText} type='mlabel'>{t('filters')}</CustomText>
        {AllFilters && AllFilters.length > 0 ? (
          <>
            <TouchableOpacity
              onPress={() => handleClearAll()}
              style={{width: 25, height: 25}}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => onClose()}
              style={{width: 25, height: 25}}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View
        style={{
          borderBottomColor: udyamitaTheme.borderStyleColor,
          borderBottomWidth: 0.5,
          marginHorizontal: 10,
          marginTop: 5,
        }}
      />
      {AllFilters && AllFilters.length > 0 ? (
        <>
          <View style={styles.container}>
            <View style={styles.content}>
              <ScrollView>
                <ScrollView contentContainerStyle={styles.filterKey}>
                  {/* Display filter names */}
                  {AllFilters &&
                    AllFilters.map((filter, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectFilterKey(filter?.filter)}
                        style={[
                          styles.filterKey_item,
                          filter.filter === selectedFilterKey &&
                            styles.filterKey_itemSelected,
                        ]}>
                        <CustomText style={styles.filterKey_text} type='btn'>
                          {filter?.filter}
                        </CustomText>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </ScrollView>
            </View>
            <View style={styles.columnContainer}>
              {/* Right column - Filter values */}
              <ScrollView>
                <ScrollView contentContainerStyle={styles.filterValues}>
                  {selectedFilterKey && (
                    <FilterValues
                      handleValuePress={handleValuePress}
                      selectedFilterKey={selectedFilterKey}
                      filterValues={
                        AllFilters.find(
                          filter => filter.filter === selectedFilterKey,
                        )?.values
                      }
                      selectedValues={selectedFilter[selectedFilterKey] || []}
                      onSelectValue={values =>
                        handleSelectFilterValue(selectedFilterKey, values)
                      }
                      toggleSelection={() => toggleSelection()}
                      selectAll={filterState[selectedFilterKey]}
                    />
                  )}
                </ScrollView>
              </ScrollView>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onClose();
              }}>
              <CustomText
              type='btn'
                style={{
                  color: udyamitaTheme.textColor,
                  fontFamily: udyamitaTheme.mainThemeFontFamily,
                  fontSize: udyamitaTheme.themeFontSizeButton,
                  // marginTop: -20,
                  textTransform: 'uppercase',
                }}>
                {t('close')}
              </CustomText>
            </TouchableOpacity>
            {/* <View style={styles.separator} /> */}
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#FDEFE9'}]}
              onPress={() => getProductVariantByFilters()}>
              <CustomText
              type='btn'
                style={{
                  color: udyamitaTheme.themeColor,

                  fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                  fontSize: udyamitaTheme.themeFontSizeButton,
                  //marginTop: -20,
                  textTransform: 'uppercase',
                }}>
                {t('apply')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <NoFiltersToShow />
        </>
      )}
    </>
  );
};

export default ProductFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: '8%',
    marginRight: '8%',
    marginTop: 20,
  },
  filtersText: {
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  clearAllText: {
    color: udyamitaTheme.themeColor,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  columnContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  filterKey: {
    flexGrow: 1,
    backgroundColor: '#F2F3F4',
  },
  filterKey_item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D6DBDF',
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
  filterValues: {
    flexGrow: 1,
  },
  filterValue_text: {
    marginVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 88,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: -20,
    backgroundColor: '#F1F1F1',
    alignSelf: 'center',
  },
  separator: {
    height: '100%',
    borderLeftWidth: 0.5,
    borderLeftColor: udyamitaTheme.borderStyleColor,
    marginLeft: 19,
  },
  content: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});
