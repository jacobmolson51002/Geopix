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
import { AppHome } from './views/AppHome'; 
//import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import {Store} from './redux/store';
import { Login } from './views/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {

  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);
  let userLoggedIn = false;
  const Stack = createNativeStackNavigator();
  const navigationRef = useNavigationContainerRef();


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
          setInitialRoute("Home");
          
          //navigationRef.navigate("Home");
          //userLoggedIn = true;
          console.log(initialRoute);
        }else{
          setInitialRoute("Login");
          console.log("user not found");
        }
      } catch(e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
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
            <NavigationContainer ref={navigationRef} independent={true}>
                <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }} mode="modal">
                    <Stack.Screen name="Home" component={AppHome} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer> 
        </View>
      </Provider>
  ) : (
    <AppLoading />
  )
}
registerRootComponent(App);
