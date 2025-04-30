import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
import NetInfo from "@react-native-community/netinfo";
const getNetworkBandwidth = async ()=> {
    try {
      const networkSpeed = await measureConnectionSpeed();
    //   console.log('network speed',networkSpeed); // Network bandwidth speed 
      return networkSpeed;
    } catch (err) {
      console.log('error',err);  
    }
  }
// In the unsubscribe.js file
export const unsubscribe = () => {
    return new Promise((resolve, reject) => {
      const listener = NetInfo.addEventListener(async state => {
        if (state.isConnected) {
          const speed = await getNetworkBandwidth();
        //   console.log('Network speed:', speed);
          listener(); // Remove the event listener after getting the speed
          resolve(speed); // Resolve with the speed value
        } else {
          reject('No network connection'); // Reject if there's no network connection
        }
      });
    });
  };
  
