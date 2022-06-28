import React from 'react';
import { Login } from './Login';
import { Map } from './Map';
import { CameraView } from './CameraView';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';   
        
export const AppHome = ({ navigation }) => { 

    const Stack = createNativeStackNavigator();

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer independent={true}>
                <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
                    <Stack.Screen name="Map" component={Map} />
                    <Stack.Screen name="Camera" component={CameraView} />
                </Stack.Navigator>
            </NavigationContainer>
            <View style={styles.nav}>
                <Text>This is working</Text>
            </View>
        </View>

    )
}

const styles = {
    map: {
        width: '100%',
        height: '87%'
    },
    nav: {
        width: '100%',
        height: '13%'
    }
};