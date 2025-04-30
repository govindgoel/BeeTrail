import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import FarmCard from '../../components/apiary-migration/partials/FarmCard';
import {APP_API_USER_URL_SECOND} from '@env'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import FarmReserveSuccess from '../../components/apiary-migration/reusable/FarmReserveSuccess';
export const AcceptRequest = () => {
  const {t} = useTranslation();

  const navigation = useNavigation();
  const route = useRoute();
  const [orderInfo, setorderInfo] = useState(route?.params?.bookingInfo);
  const [isChecked, setIsChecked] = useState(false);
  const [orderstatus, setorderstatus] = useState(false)
  const goBack = () => {
    navigation.goBack();
  };
  const [showaccepted, setshowaccepted] = useState(false)

  function getMonthDate(dates) {
    const date = new Date(dates);
    const options = { month: 'long', day: 'numeric' , year:'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const completeOrder=async()=>{
    if(route?.params?.bookingInfo){
      const data={
        matchmaking_id:route?.params?.bookingInfo?._id ,
        is_accepted: false,
        breakup: [
          {
            title: "Service Charge",
            price: {
              currency: "INR",
              value: "2000"
            }
          }
        ],
        price: {
          currency: "INR",
          value: "2000"
        },
        payment_method: "cash",
      }
      try {
        let url = `${APP_API_USER_URL_SECOND}order/create`
        console.log(data, url, 'order',route?.params?.bookingInfo);
        const res = await axios.post(url,data)
        console.log(res.data);
        setorderstatus(res.data)
      } catch (error) {
        console.log(error, 'while completing order',error?.response);
      }
    }
  }

  useEffect(() => {
completeOrder()

  }, [])
  

  const handleAccept = () => {
    if (!isChecked) {
      Alert.alert('Confirmation Required', 'Please confirm you have read the contract.');
      return;
    }
    // Proceed with accept logic here
    setshowaccepted(true)
    setTimeout(() => {
      navigation.navigate('Farmer_dashboard')
    }, 2500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <>
      <CustomHeader
        title="Order Info"
        showBackIcon={true}
        onBackPress={goBack}
      />
      {
        showaccepted?

        <FarmReserveSuccess farmer={true} />
        :
        <>
           <ScrollView style={styles.container}>
        {orderInfo?.farm && (
          <>
          <FarmCard farm={orderInfo?.farm} navigation={e => {}} />
          <Text
              style={[styles.smallText, {marginVertical: 5}]}
              type="sh">
              {t('arrivingDate')} : {getMonthDate( orderInfo?.pollination_window_start)}
            </Text>
        </>
          
        )}
        {/* <View style={styles.section}>
          <Text style={styles.label}>
            Farm Name: <Text style={styles.value}>{orderInfo?.farm?.name}</Text>
          </Text>
          <Text style={styles.label}>
            Location: <Text style={styles.value}>{orderInfo?.farm?.fulladdress}</Text>
          </Text>
          <Text style={styles.label}>
            Total Bee Boxes: <Text style={styles.value}>{orderInfo.bee_box_count}</Text>
          </Text>
          <Text style={styles.label}>
            Pollination Start Window Date:{' '}
            <Text style={styles.value}>{getMonthDate(orderInfo.pollination_window_start)}</Text>
          </Text>
        </View> */}

        {!orderstatus ? (
          <ActivityIndicator
            size="small"
            animating={!orderstatus}
            color="#028454"
            style={{marginleft: 10, marginVertical:20}}
          />
        ) : (
          <TouchableOpacity
            style={{marginTop: 30}}
            onPress={() =>
              Linking.openURL(
                orderstatus?.contract_pdf_url,
              )
            }>
            <Text style={styles.link}>📄 View Contract</Text>
          </TouchableOpacity>
        )}

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#CBCBCB',
            }}
            onPress={e => setIsChecked(!isChecked)}>
            {isChecked && (
              <View
                style={{
                  backgroundColor: udyamitaTheme.beeAppColor,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}>
                <Image source={require('../../assets/images/tick.png')} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I have read and accept the contract
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttonRow}>
       {
       !orderstatus ?
       <View style={{
        justifyContent:'center',
        alignItems:'center',
        width:'100%'
       }}>

       <ActivityIndicator
       size={40}
       animating={!orderstatus}
       color="#028454"
       style={{marginleft: 10, marginVertical:20,alignSelf:'center'}}
     />
     </View>
     :
     <>
       <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        </>
        }
      </View>
        </>
      }
    
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingTop:10,
    paddingBottom:150,
  },
  section: {
    marginBottom: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#262626',
  },
  value: {
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    fontSize: 16,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  smallText: {
    marginLeft:5,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: 16,
    color: udyamitaTheme.textColor,
    marginTop:5
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#262626',
  },
  buttonRow: {
    marginHorizontal:20,
    position:'absolute',
    bottom:20,
    backgroundColor:'#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#00A651',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
