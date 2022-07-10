import React, { useCallback } from 'react';
import { Login } from './Login';
import { Map } from './Map';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Inbox } from './Inbox';
import { FlatList, TextInput, TouchableOpacity, KeyBoardAvoidingView, TouchableWithoutFeedback, Dimensions, View, Text, Button, KeyboardAvoidingView, ScrollView } from 'react-native';
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
import { getComments } from '../backend/realm';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

        


export const AppHome = ({ navigation }) => { 
    const [currentGeopic, setCurrentGeopic] = useState({username: 'jacob'});
    const [comments, setComments] = useState({});
    const [comment, setComment] = useState("");

    const Tab = createBottomTabNavigator();

    const logout = async () => {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('userID');
        await AsyncStorage.removeItem('password');
    }

    const styles = {
        commentHeader: {
            paddingTop: 5,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '5%'
        },
        commentsView: {
            width: '100%',
        },
        addCommentSection: {
            width: '100%',
            height: '15%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginBottom: 5,
        },
        addComment: {
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 15,
            padding: 5
        }
    }

    const Comment = ({ comment }) => {
        return (
            <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'white' }} >
                <Text>{comment.username}</Text>
                <Text>{comment.comment}</Text>
            </View>
        )
    }

    const renderItem = useCallback(
        ({ item }) => <Comment comment={item} />,
        []
    );
    const keyExtractor = useCallback((item) => item._id, []);

    const commentSection = () => (
        <KeyboardAvoidingView style={{ flex: 1}} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={{ width: '100%', height: Dimensions.get('window').height * 0.7, backgroundColor: '#222222' }}>
          <TouchableOpacity onPress={() => {sheetRef.current.snapTo(0)}} style={styles.commentHeader} >
            <Text stle={{ color: 'white' }}>Comments</Text>
          </TouchableOpacity>
          <FlatList style={{ flex: 1 }} data={comments} renderItem={renderItem} keyExtractor={keyExtractor} />
          <View style={styles.addCommentSection}>
            <TextInput defaultValue={comment} onChangeText={newText => setComment(newText)} placeholder="add comment" style={styles.addComment}/>
            </View>
          </View>
        </KeyboardAvoidingView>
      )

    //setLocation();

    const sheetRef = React.useRef(null);

    return (
        <View style={{ flex: 1 }}>
        <Tab.Navigator initialRouteName="Map" screenOptions={{ tabBarActiveTintColor: "#30D5C8", tabBarInactiveTintColor: "#77C1BA",headerShown: false, tabBarStyle: { borderTopWidth: 0, display: 'flex',backgroundColor: "#222222", height: '10%' }, tabBarOptions: {tabBarLabel: () => {return null}} }} > 
            <Tab.Screen tabBarOptions={{ showLabel: false }}name="Feed" children={()=><Feed setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef}/>} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="view-day-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Map" component={Map} options={{ tabBarIcon: ({color, size}) => (<Entypo name="map" size={24} color={color}/>)}}/>
            <Tab.Screen name="Inbox" component={Inbox} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="mailbox-open-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({color, size}) => (<FontAwesome5 name="user" color={color} size={23} />)}}/>
        </Tab.Navigator>
        <BottomSheet
                    ref={sheetRef}
                    snapPoints={[0, '70%']}
                    borderRadius={10}
                    renderContent={commentSection}
                />
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