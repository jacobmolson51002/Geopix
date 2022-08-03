import React, { useState } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { FeedView } from './FeedView';
import { ProfileView } from './ProfileView';
import { Message } from './Message';
import { useSelector } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const Feed = ({ navigation, sheetRef, setCurrentGeopic, setComments }) => {
    const data = useSelector(state => state.geopicsReducer);
    const [user, setUser] = useState('');
    const [selection, setSelection] = useState('nearby');
    const Stack = createNativeStackNavigator();
    const styles = {
      feedOptions: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 60,
        flexDirection: 'row',
        zIndex: 100,
      },
      friends: {
        color: selection === 'friends' ? '#222222' : 'white',
        fontSize: 16,
        fontWeight: 'bold'
      },
      nearby: {
        color: selection === 'nearby' ? '#222222' : 'white',
        fontSize: 16,
        fontWeight: 'bold'
      },
      friendsButton: {
          marginRight: 20
      },
      nearbyButton: {
      }
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.feedOptions}>
          <TouchableOpacity style={styles.friendsButton} onPress={() => {setSelection('friends')}}>
            <Text style={styles.friends}>friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nearbyButton} onPress={() => {setSelection('nearby')}}>
            <Text style={styles.nearby}>nearby</Text>
          </TouchableOpacity>
        </View>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="feed" >
          <Stack.Screen name="feed" children={() => <FeedView selection={selection} setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} data={data} />} />
          <Stack.Screen name='viewProfile' component={ProfileView} /> 
        </Stack.Navigator>
      </View>
    )
}