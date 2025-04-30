// utils/useTransliteratedName.js
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTransliterationNames } from '../../store/services/entrepreneurServices';
import { getUser } from '../UserData';
const useTransliteratedName = (text) => {
  const dispatch = useDispatch();
  const [transliteratedName, setTransliteratedName] = useState(text);
  const [userInfo, setUserInfo] = useState(false);
  useEffect(() => {
    const getUserInfo = async () => {
        const user = await getUser();
   
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
          
         
        }
      };
      getUserInfo();
  }, [userInfo])
  useEffect(() => {
    if (userInfo) {
      if (userInfo.preferredLanguage === 'en' || userInfo.preferredLanguage === 'english') {
        setTransliteratedName(text);
      } else {
        let reqObj = {};
        reqObj.text = text;
        reqObj.script = 'Latn';
        let data = [];
        data.push(reqObj);
        dispatch(getTransliterationNames({ data: data, lang: userInfo.preferredLanguage }))
          .unwrap()
          .then(res => {
            setTransliteratedName(res);
          })
          .catch(err => {
            console.log('err: ', err);
          });
      }
    }
  }, [userInfo, dispatch]);

  return transliteratedName;
};

export default useTransliteratedName;
