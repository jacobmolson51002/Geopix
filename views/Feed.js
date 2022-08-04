import React, { useState, useEffect } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { FeedView } from './FeedView';
import { ProfileView } from './ProfileView';
import { Message } from './Message';
import { useSelector, useDispatch } from 'react-redux';
import { setFriendGeopics } from '../redux/actions';
import { getFriendGeopics } from '../backend/database';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const Feed = ({ navigation, sheetRef, setCurrentGeopic, setComments }) => {
    const data = useSelector(state => state.geopicsReducer);
    const userRealm = useSelector(state => state.userReducer);
    const realm = userRealm.userRealm;
    const [friendGeopics, setFriendGeopics] = useState([]);
    const [rerender, setRerender] = useState(true);
    const [user, setUser] = useState('');
    const [selection, setSelection] = useState('nearby');
    const Stack = createNativeStackNavigator();
    const dispatch = useDispatch();

    console.log('feed rendering');

    if(rerender){
      setRerender(false);
      getFriendGeopics(realm).then((x) => {
        if(x != 'no friends'){
          dispatch(setFriendGeopics(x));
        }
      })
    }

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
        color: selection === 'friends' ? 'white' : 'rgba(255,255,255,0.5)',
        fontSize: selection === 'friends' ? 18 : 16,
        fontWeight: 'bold'
      },
      nearby: {
        color: selection === 'nearby' ? 'white' : 'rgba(255,255,255,0.5)',
        fontSize: selection === 'nearby' ? 18 : 16,
        fontWeight: 'bold'
      },
      friendsButton: {
          marginRight: 20,
          shadowColor: 'black',
          shadowOffset: {
              width: 1,
              height: 1
          },
          shadowOpacity: 1,
      },
      nearbyButton: {
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 1,
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
          <Stack.Screen name="feed" children={() => <FeedView friendGeopics={friendGeopics} selection={selection} setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} data={data} />} />
          <Stack.Screen name='viewProfile' component={ProfileView} /> 
        </Stack.Navigator>
      </View>
    )
}