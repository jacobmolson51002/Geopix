import React, { useState, useEffect } from 'react';
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


export const AppContainer = () => {

    const geopics = useSelector(state => state.geopicsReducer);
    const [userInfoReady, setUserInfoReady] = useState(false);
    const dispatch = useDispatch();

    getGeopics();

    useEffect(() => {
        (async () => {
            await openUserRealm(dispatch);
            setUserInfoReady(true);
        })();
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

