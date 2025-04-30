import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {APP_API_COMMUNITY_URL} from '@env';
import {setMessages} from '../reducers/entrepreneurReducer';

export const getCommunityChatByParticipants = createAsyncThunk(
  'org/getCommunityChatByParticipants',
  async ({dispatch, id1, id2, token}) => {

    return await axios
      .get(`${APP_API_COMMUNITY_URL}/community-connection/chat/${id1}/${id2}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        // console.log('getCommunityChatByParticipants res: ', res?.data);
        return res?.data;
      })
      .catch(err => {
        console.log('getCommunityChatByParticipants err:', err);
      });
  },
);

export const getCommunityChatByParticipantId = createAsyncThunk(
  'org/getCommunityChatByParticipants',
  async ({dispatch, id, token}) => {

    return await axios
      .get(
        `${APP_API_COMMUNITY_URL}/community-connection/single-chat/userId/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(res => {
        
        dispatch(setMessages(res?.data?.messages ? res?.data?.messages : []));
        return res?.data?.messages;
      })
      .catch(err => {
        console.log('getCommunityChatByParticipantId err:', err);
      });
  },
);
