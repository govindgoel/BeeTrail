import axios from 'axios';
import {APP_API_USER_URL} from '@env';
import { getToken, getUser } from './UserData';

const sendLog = async (logMessage, userinfo='') => {
    const token = await getToken();
    const url=APP_API_USER_URL+'/Applog'
    const config = {headers: {Authorization: 'Bearer ' + token}};
    const user = userinfo || await getUser();
  try {
    // Fetch device details
   
    const logObject = {
      data:{
        logs: logMessage,
      },
      userid:user?.userInfo?._id
     
    };
    // console.log(logObject);

    // Send log object to backend
    await axios.post(url, logObject,config);

    console.log('Log sent successfully:', logObject);
  } catch (error) {
    // Create error log if fetching device details fails
    const errorLogObject = {
      data:{error: `Error details: ${error}`,
      logs: logMessage,},
      userid:user?.userInfo?._id
    };

    // Send error log to backend
    try {
      await axios.post(url, errorLogObject,config);
      console.log('Error log sent successfully:', errorLogObject);
    } catch (error) {
      console.error('Failed to send error log:', error.response);
    }
  }
};

export default sendLog;
