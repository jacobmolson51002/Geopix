import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { FeedView } from './FeedView';
import { ProfileView } from './ProfileView';
import { Message } from './Message';
import { useSelector } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const Feed = ({ navigation, sheetRef, setCurrentGeopic, setComments }) => {
    const data = useSelector(state => state.geopicsReducer);
    const [user, setUser] = useState('');
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="feed" >
        <Stack.Screen name="feed" children={() => <FeedView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} data={data} />} />
        <Stack.Screen name='viewProfile' component={ProfileView} /> 
      </Stack.Navigator>
    )
}