import React from 'react';
import { Login } from './Login';
import { Map } from './Map';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Inbox } from './Inbox';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';   
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { setLocation } from '../backend/location';
        
export const AppHome = ({ navigation }) => { 

    const Tab = createBottomTabNavigator();

    const logout = async () => {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('userID');
        await AsyncStorage.removeItem('password');
    }

    //setLocation();

    return (
        <Tab.Navigator initialRouteName="Map" screenOptions={{ tabBarActiveTintColor: "#30D5C8", tabBarInactiveTintColor: "#77C1BA",headerShown: false, tabBarStyle: { display: 'flex',backgroundColor: "#F1F2EE", height: '13%' }, tabBarOptions: {tabBarLabel: () => {return null}} }} > 
            <Tab.Screen tabBarOptions={{ showLabel: false }}name="Feed" component={Feed} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="view-day-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Map" component={Map} options={{ tabBarIcon: ({color, size}) => (<Entypo name="map" size={24} color={color}/>)}}/>
            <Tab.Screen name="Inbox" component={Inbox} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="mailbox-open-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({color, size}) => (<FontAwesome5 name="user" color={color} size={23} />)}}/>
        </Tab.Navigator>
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