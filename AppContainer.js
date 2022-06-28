import React from 'react';
import { View, Text } from 'react-native';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import { AppHome } from './views/AppHome';
import { Login } from './views/Login';
import { Map } from './views/Map';
import { CameraView } from './views/CameraView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const test = () => {
    return ( 
        <View>
            <Text>This is working</Text>
        </View>
    )
}

export const AppContainer = () => {

    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={AppHome} />
            </Stack.Navigator>
        </NavigationContainer>
    )
    /*return(
        <View>
            <Text>This is working</Text>
        </View>
    )*/
}

