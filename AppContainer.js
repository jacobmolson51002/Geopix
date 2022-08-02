import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import { AppHome } from './views/AppHome';
import { CameraView } from './views/CameraView';
import { Login } from './views/Login';
import { Message } from './views/Message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { getGeopics } from './backend/database';
import { useSelector, useDispatch } from 'react-redux';
import { openUserRealm } from './backend/realm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


export const AppContainer = ({ loggedInFirst }) => {

    const geopics = useSelector(state => state.geopicsReducer);
    const [userInfoReady, setUserInfoReady] = useState(false);
    const notificationListener = useRef();
    const [expoPushToken, setExpoPushToken] = useState('');
    const responseListener = useRef();
    const dispatch = useDispatch();

    getGeopics();

    useEffect(() => {

        registerForPushNotificationsAsync().then(async (token) => {
            console.log(`this is the token: ${token}`)
            setExpoPushToken(token);
            if(loggedInFirst == false){
                console.log('opening realm');
                const userID = await AsyncStorage.getItem('userID');
                await openUserRealm(dispatch, false, false, userID, token);
                setUserInfoReady(true);
            }
        });

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };

        
    })

    const Stack = createNativeStackNavigator();
    return geopics.geopics != null && setUserInfoReady ? (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AppHome" >
            <Stack.Screen name="AppHome" component={AppHome} />
            <Stack.Screen name="Camera" component={CameraView} />
            <Stack.Screen name="Message" component={Message} />
        </Stack.Navigator>
    ) : (
        <AppLoading />
    )
}

async function registerForPushNotificationsAsync() {
    const experienceId = '@geopix/Geopix';
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({experienceId})).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
}
