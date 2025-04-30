import fcmessaging from '@react-native-firebase/messaging';
import { getValueByKey } from './UserData';
import axios from 'axios';
import {APP_API_USER_URL} from '@env'
export const syncDeviceToken = async () => {
    try {
      const token = await fcmessaging().getToken();
      return token;
    } catch (err) {
      console.log('Error getting FCM token', err);
      return null;
    }
  };
  
export const UpdateFCMToken= async () => {
   
   try {
     const fmcToken = await syncDeviceToken()
     const sync=await getValueByKey('preferredLanguageChange')
     if(sync){
      return;
     }
    //  console.log(token,'new token');
     const token = await getValueByKey('token');
 
     const config = {
         headers: {
         Authorization: 'Bearer ' + token,
         },
     };
     const url = `${APP_API_USER_URL}/user/profile`;
     const res= await axios.put(url, { firebaseToken : fmcToken }  ,config)
     console.log('updated fc token');
   } catch (error) {
    console.log(error,'err in sync-fcm-token');
   }
    
  };