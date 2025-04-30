/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { udyamitaTheme } from './src/config/styles/udyamitaTheme';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import './src/constants/i18n/i18n';

export const Main=()=>{
    return(
        <Provider store={store}>
        <PaperProvider theme={udyamitaTheme}>
            <App/>
        </PaperProvider>
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
