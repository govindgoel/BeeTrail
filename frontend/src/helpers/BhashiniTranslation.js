import bhashini from 'bhashini-translation';
import axios from 'axios';

const USER_ID = '656becc6d9a345c8a55bf79c5e054470';
const ULCA_API_KEY = '3739725120-5517-4677-a7f5-07b0ae342ac2';
const INFERENCE_API_KEY = 'yByVTrXFGn-xzmkb922s9nGG8KN3J4X7wFxznlH7wFLyNR3-0nr-vOSMipubABqn';

bhashini.auth(USER_ID, ULCA_API_KEY, INFERENCE_API_KEY);

const aiforbharatAsr = async (sourceLang, base64String) => {
  console.log(sourceLang ,"aiforbharat in other lang");
  let data = JSON.stringify({
      config: {
          language: {
              sourceLanguage: sourceLang,
          },
          transcriptionFormat: {
              value: 'transcript',
          },
          audioFormat: 'wav',
          samplingRate: '48000',
          postProcessors: null,
      },
      audio: [
          {
              audioContent: base64String,
          },
      ],
      controlConfig: {
          dataTracking: true,
      },
  });

  let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://demo-api.models.ai4bharat.org/inference/asr/conformer',
      headers: {
          'Content-Type': 'application/json',
      },
      data: data,
  };

  try {
      const response = await axios.request(config);
      if (!response.data || !response.data.output || !response.data.output[0] || !response.data.output[0].source) {
          console.log('Failed to transcribe audio: Invalid response format');
      }
      const transcribedText = response.data.output[0].source;
      console.log("Transcribed text:", transcribedText);
      return transcribedText;
  } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
          console.log(`AI for Bharat ASR Error: ${error.response.data.message}`);
      } else {
          console.log('AI for Bharat ASR Error: Failed to transcribe audio');
      }
  }
};

const aiforbharatAsrEng = async (sourceLang, base64String) => {
  console.log(sourceLang ,"aiforbharat for english");
  let data = JSON.stringify({
      config: {
          language: {
              sourceLanguage: sourceLang,
          },
          transcriptionFormat: {
              value: 'transcript',
          },
          audioFormat: 'wav',
          samplingRate: '16000',
          postProcessors: null,
      },
      audio: [
          {
              audioContent: base64String,
          },
      ],
      controlConfig: {
          dataTracking: true,
      },
  });

  let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://demo-api.models.ai4bharat.org/inference/asr/whisper',
      headers: {
          'Content-Type': 'application/json',
      },
      data: data,
  };

  try {
      const response = await axios.request(config);
      if (!response.data || !response.data.output || !response.data.output[0] || !response.data.output[0].source) {
          console.log('Failed to transcribe audio: Invalid response format');
      }
      const transcribedText = response.data.output[0].source;
      console.log("Transcribed text:", transcribedText);
      return transcribedText;
  } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
          console.log(`AI for Bharat ASR Error: ${error.response.data.message}`);
      } else {
          console.log('AI for Bharat ASR Error: Failed to transcribe audio');
      }
  }
};


export const translateWithBhashini = (sourceLang, targetLang, text) => {
  return bhashini.nmt(sourceLang, targetLang, text);
};
export const getVoice = (sourceLang, text) => {
  return bhashini.tts(sourceLang, text, 'male');
};
// export const getText = (sourceLang, base64) => {
//     return bhashini.asr(sourceLang, base64);
// };

export const getText = async (sourceLang, base64) => {
  try {
    const a= await bhashini.asr(sourceLang, base64);
   console.log('result of bhasini ',a);
   if(a==undefined||a==''){
    throw new Error("undefined text from bhasini");
   }
   return a;
   
  } catch (error) {
      // Handle the error here 
    //   return await bhashini.asr(sourceLang, base64);
    console.log('error in get text',error);
     if(sourceLang === 'en') {
        //for english languages whisper is getting called from ai for bharat
        const getTranscribedText = aiforbharatAsrEng(sourceLang, base64);
        return getTranscribedText
    } else {
        //for other languages conformers is getting called from ai for bharat
        const getTranscribedText = await aiforbharatAsr(sourceLang, base64);
        return getTranscribedText;
    }
      
      
  }
};

export const asrTillVoice = (sourceLang, targetLang, Base64, gender) => {
    return bhashini.asr_nmt_tts(sourceLang, targetLang, Base64, gender);
}
// export default translateWithBhashini;
