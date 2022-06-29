import 'expo-dev-client';
import 'react-native-get-random-values';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import { Map } from './views/Map';
//import {CameraView} from './views/CameraView';
import { AppContainer } from './AppContainer'; 
//import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import {Store} from './redux/store';
import { Login } from './views/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const App = () => {

  const [appIsReady, setAppIsReady] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);


  const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        const loginCredentials = null;
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('userID');
        await AsyncStorage.removeItem('password');

        //const loginCredentials = await AsyncStorage.getItem('userID');


        if(loginCredentials !== null){
          setUserLoggedIn(true);
        }else{
          console.log("user not found");
        }
      } catch(e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };


  const onLayoutRootView = useCallback(async () => {
    prepare();
    if(appIsReady){
      console.log("splash screen ready");
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
      <Provider store={Store}>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }} > 
          {userLoggedIn ? (
            <Map />
          ) : (
            <Login />
          )}
        </View>
      </Provider>
  )
}
registerRootComponent(App);
