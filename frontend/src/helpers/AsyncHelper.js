import AsyncStorage from "@react-native-async-storage/async-storage";


export const getAllKeyValuePairsByPattern = async (pattern) => {
    const toSend = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = keys.filter((key) => new RegExp(pattern, 'ig').test(key));
      const stores = await AsyncStorage.multiGet(filteredKeys);
      stores.forEach((result, i) => {
        toSend.push({
          [result[0]]: JSON.parse(result[1])
        });
      });
    } catch (error) {
      console.error('Error while fetching data:', error);
    }
    return toSend;
  }

export const clearAKey = (key)=>{
    AsyncStorage.removeItem(key);
};

export const clearAsyncStorage = async() => {
  AsyncStorage.clear();
}
