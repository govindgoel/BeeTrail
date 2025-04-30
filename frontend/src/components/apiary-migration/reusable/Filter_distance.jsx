import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import CustomText from '../../reusable/CustomText';

const filterValues = [
  {
    label: 'My farm',
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
];

const Filter_distance = () => {
  const [selectdot, setselectdot] = useState(-1);

  useEffect(() => {
    console.log(selectdot);
  }, [selectdot]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={[styles.container2]}>
          {filterValues?.map((it, id) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setselectdot(id);
                  }}
                  style={{
                    flexDirection: 'row',
                    width: '25%',
                    height: 24,
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setselectdot(id)}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          selectdot >= id ? '#028454' : '#CBCBCB',
                        width: selectdot == id ? 24 : 8,
                        height: selectdot == id ? 24 : 8,
                      },
                    ]}
                  />
                  {id != filterValues?.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        {
                          borderColor:
                            selectdot - 1 >= id ? '#028454' : '#CBCBCB',
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              </>
            );
          })}
        </View>
        <View style={[styles.container2]}>
          {filterValues?.map((it, id) => {
            return (
              <>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '25%',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    
                  }}>
                  <CustomText
                    style={{fontWeight: '400', width: '75%', lineHeight: 18,textAlign:'center'}}
                    type="label">
                    {it.label}
                  </CustomText>
                </View>
              </>
            );
          })}
        </View>
        <CustomText style={[styles.footertitle]}>
          {selectdot==-1?null:selectdot==0?'At My Farm':`${filterValues[selectdot]?.value} from my Farm`}
           
        </CustomText>
      </View>
    </>
  );
};

export default Filter_distance;

const styles = StyleSheet.create({
  footertitle: {
    marginTop: 10,
    fontWeight: '400',
    lineHeight: 18,
  },
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container2: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 500,
  },
  selectdot: {
    width: 24,
    height: 24,
    borderRadius: 500,
  },
  line: {
    zIndex: -1,
    position: 'absolute',
    width: '100%',
    borderWidth: 1,
    top: '50%',
    bottom: '50%',
    left: '50%',
  },
});
