import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUser = async () => {
  const userData = await AsyncStorage.getItem('userInfo');
  const parsedData = JSON.parse(userData);
  return parsedData;
};

export const getvideoProgress = async () => {
  const videoProgress = await AsyncStorage.getItem('VideoProgress');
  const parsedData = JSON.parse(videoProgress);
  return parsedData;
};

export const getToken = async () => {
  const userData = await AsyncStorage.getItem('token');
  const parsedData = isJsonString(userData) ? JSON.parse(userData) : userData;
  return parsedData;
};
export const getEntity = async () => {
  const entityData = await AsyncStorage.getItem('entity');
  const parsedData = JSON.parse(entityData);
  return parsedData;
};

export const storeUser = async (value, updated) => {
  const val = {
    message: value.message,
    token: updated ? value.userInfo.token : value.token,
    userInfo: value.userInfo,
  };
  try {
    const jsonValue = JSON.stringify(val);
    await AsyncStorage.setItem('userInfo', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const storeValueByKey = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getValueByKey = async key => {
  try {
    const entityData = await AsyncStorage.getItem(key);
    const parsedData = isJsonString(entityData)
      ? JSON.parse(entityData)
      : entityData;

    return parsedData;
  } catch (e) {
    console.log(e);
  }
};
export const removeItemByKey = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const getApiConfig = async () => {
  const token = await getToken();
  const config = {
    headers: {Authorization: 'Bearer ' + token},
  };
  return config;
};
