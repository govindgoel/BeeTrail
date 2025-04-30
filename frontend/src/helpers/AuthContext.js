import React, {createContext, useState} from 'react';

export const userContext = createContext({});

const AuthContext = props => {
  const [userToken, setUserToken] = useState('');
  const [user, setUser] = useState({});
  const [firebaseToken, setFirebaseToken] = useState('');
  const [swatiLead, setSwatiLead] = useState({});
  const [currentCourse, setCurrentCourse] = useState(null);
  const [moduleSkippable, setModuleSkippable] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [entityId, setEntityId] = useState('');
  const [entityDetail, setEntityDetail] = useState(null);

  const saveToken = token => {
    setUserToken(token);
  };

  const saveUser = user => {
    setUser(user);
  };

  const savePreferredLanguage = lang => {
    setPreferredLanguage(lang);
  };

  const saveLeadId = id => {
    setLeadId(id);
  };

  const saveCurrentCourse = courseId => {
    setCurrentCourse(courseId);
  };

  const saveFirebaseToken = fireBaseToken => {
    setFirebaseToken(fireBaseToken);
  };

  const saveSwatiLead = leadInfo => setSwatiLead(leadInfo);

  const saveModuleSkippable = skippable => setModuleSkippable(skippable);

  const saveEntityId = entityId => setEntityId(entityId);

  const saveEntityDetail = entityDetail => setEntityDetail(entityDetail);

  const resetState = () => {
 
    setUserToken('');
    setUser({});
    setPreferredLanguage(null);
    setLeadId(null);
    setFirebaseToken('');
    setSwatiLead({});
    setCurrentCourse(null);
    setModuleSkippable(false);
    setEntityId('');
    setEntityDetail(null);
  };

  return (
    <userContext.Provider
      value={{
        state: {
          userToken,
          user,
          preferredLanguage,
          leadId,
          currentCourse,
          firebaseToken,
          moduleSkippable,
          entityId,
          entityDetail,
        },
        saveToken: saveToken,
        saveUser: saveUser,
        savePreferredLanguage: savePreferredLanguage,
        saveLeadId: saveLeadId,
        saveCurrentCourse: saveCurrentCourse,
        saveFirebaseToken,
        saveSwatiLead,
        saveModuleSkippable,
        saveEntityId: saveEntityId,
        saveEntityDetail: saveEntityDetail,
        resetState: resetState
      }}
      {...props}
    />
  );
};

export default AuthContext;
