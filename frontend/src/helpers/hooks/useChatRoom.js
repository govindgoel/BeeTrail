import {useEffect, useRef, useState} from 'react';
import React from 'react';
import socketIOClient,{io} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {APP_API_SOCKETBE_URL} from '@env';
import {useFocusEffect} from '@react-navigation/native';
import { getUser,getToken } from '../UserData';
const NEW_MESSAGE_EVENT = 'private message';

const useChatRoom = memberId => {
  const [socketMessages, setSocketMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(false);
 // const basicInfo = useSelector(state => state.entrepreneur.basicInfo);
  const socketRef = useRef();
  const socket = io()
  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const token = await getToken();
        if (user && user.userInfo) {
          
          setUserInfo(user.userInfo);

        }
      };
      getUserInfo();
    }, []),
  );
  useEffect(() => {
    // Todo

    
    let tempArr = [];
    tempArr.push(memberId);
    tempArr.push(userInfo?._id);
    tempArr.sort();
    const hashed = tempArr.join();
    
    socketRef.current = socketIOClient(APP_API_SOCKETBE_URL, {
      query: {userId: userInfo._id, roomId: hashed},
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    socketRef.current.on(NEW_MESSAGE_EVENT, ({message, from, to, type}) => {
      const incomingMessage = {
        message: message,
        from: userInfo?._id,
        to: to,
        type: type,
      };
     

      setSocketMessages(socketMessages => [...socketMessages, incomingMessage]);
    });
    
    


    // const handleReceivedMessageRead = (messageId) => {
    //   socketRef.current.emit('message-read', roomId, messageId);
    // };

    return () => {
      socketRef.current.disconnect();
    };
  }, [memberId]);

  const sendSocketMessage = ({messageBody, from, to, type, fromName, toName}) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      message: messageBody,
      from: from,
      to: to,
      type: type,
      fromName: fromName,
      toName: toName
    });
  };

  const handleReceivedMessageRead = ({userId}) => {
    socketRef.current.emit('message-read', userId);
  }

  return {socketMessages, sendSocketMessage,handleReceivedMessageRead};
};

export default useChatRoom;
