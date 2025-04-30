import React, {useState} from 'react';
import SystemSetting from 'react-native-system-setting';

function useSoundSetting() {
  const [muted, setMuted] = useState(false);
  const toggleVolume = vol => {
    SystemSetting.setVolume(vol);
    if(vol === 0 ){
      setMuted(true);
     } else {
      setMuted(false);
     }

    // setMuted(!muted);
  };
  return {toggleVolume, muted};
}

export {useSoundSetting};
