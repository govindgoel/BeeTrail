import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const userRoleSlice = createSlice({
  name: 'userRole',
  initialState: {
    userRole: "",
  },
  reducers: {
    setUserRole: (state, action) => {
   
      return {
        ...state,
        userRole: action.payload,
      };
    },
  },
});

export const loginUser = userData => async dispatch => {
  try {
    await AsyncStorage.setItem('selectedRole', userData.userRole);

    dispatch(handleUserLogin(userData.userRole));
  } catch (error) {
    console.error('Error storing user role:', error);
  }
};

export const logoutUser = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('selectedRole');

    dispatch(handleUserLogout());
  } catch (error) {
    console.error('Error removing user role:', error);
  }
};
export const {setUserRole, handleUserLogin, handleUserLogout} =
  userRoleSlice.actions;
export default userRoleSlice.reducer;
