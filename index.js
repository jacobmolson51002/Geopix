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
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { getGeopics } from './backend/database';

const App = () => {

  const [initialRoute, setInitialRoute] = useState(null);
  const Stack = createNativeStackNavigator();


  useEffect(() => {
    async function preScreen() {
      try {
        await SplashScreen.preventAutoHideAsync();

        /*const loginCredentials = null;
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('userID');
        await AsyncStorage.removeItem('password');*/

        const loginCredentials = await AsyncStorage.getItem('userID');


        if(loginCredentials !== null){
          setInitialRoute("AppContainer");
          
          //navigationRef.navigate("Home");
          //userLoggedIn = true;
          console.log(initialRoute);
        }else{
          setInitialRoute("Login");
          console.log("user not found");
        }
      } catch(e) {
        console.warn(e);
      } 
    }
    preScreen();
  }, []);

  /*const onLayoutRootView = useCallback(async () => {
    if(appIsReady){
      console.log("splash screen ready");
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);*/

  return initialRoute != null ? (
      <Provider store={Store}>
        <View style={{ flex: 1 }} >
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }} mode="modal">
                    <Stack.Screen name="AppContainer" component={AppContainer} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
                <StatusBar />
            </NavigationContainer> 
        </View>
      </Provider>
  ) : (
    <AppLoading />
  )
}
registerRootComponent(App);
