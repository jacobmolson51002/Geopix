import React from 'react';
import { View, Text } from 'react-native';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import { AppHome } from './views/AppHome';
import { CameraView } from './views/CameraView';
import { Login } from './views/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const AppContainer = () => {

    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRoute="AppHome" >
                <Stack.Screen name="AppHome" component={AppHome} />
                <Stack.Screen name="Camera" component={CameraView} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

