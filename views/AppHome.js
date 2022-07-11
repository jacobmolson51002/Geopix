import React, { useCallback, useEffect } from 'react';
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
import { getComments, addComment } from '../backend/realm';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Votes } from './FeedView';

        

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

    useEffect(() => {
        (async () => {
            //setComments({});
            const geopicComments = await getComments(currentGeopic._id);
            setComments(geopicComments);
        })();
    }, [currentGeopic])

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
            height: '18%',
            display: 'flex',
            justiftyContent: 'space-around',
            alignItems: 'center',
            padding: 5,
            marginBottom: 5,
            flexDirection: 'row',
            borderTopWidth: 0.5,
            borderTopColor: '#bebebe'
        },
        addComment: {
            borderWidth: 0.5,
            borderColor: '#bebebe',
            borderRadius: 14,
            padding: 10,
            marginLeft: 15,
            width: '75%',
            justiftyContent: 'center',
            alignItems: 'flex-start'
        },
        buttonView: {
            width: '15%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'flex-end'
        }
    }

    const Comment = ({ comment }) => {
        const styles = {
            commentContainer: { 
                flexDirection: 'row', 
                width: '100%', 
                paddingLeft: 10, 
                marginBottom: 10,
            },
            commentBox: {
                width: '75%', 
                paddingTop: 10, 
                paddingLeft: 15,
                display: 'flex',
                justifyContent: 'center'
            },
            commentUsername: {
                color: 'white', 
                paddingBottom: 5
            },
            comment: {
                color: "#bebebe", 
                paddingBottom: 5
            },
            timestamp: {
                marginTop: 5,
                color: '#bebebe'
            }
        }
        return (
            <View style={styles.commentContainer} >
                <View style={styles.commentBox} >
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text style={styles.comment}>  •   {comment.comment}</Text>
                    <Text style={styles.timestamp}>{}</Text>
                </View>
                <Votes voteableItem={comment} />
            </View>
        )
    }

    const addCommentPressed = () => {
        const currentTime = new Date();
        //use Async storage to get username
        const username = 'jacobmolson';
        const commentToAdd = {
            geopicID: currentGeopic._id,
            comment: comment,
            username: username,
            votes: [0,0,0],
            replies: 0,
            reply: false,
            timestamp: currentTime
          };
        setComments(comment);
        addComment(commentToAdd, currentGeopic._id);
        
    }

    const renderItem = useCallback(
        ({ item }) => <Comment comment={item} />,
        []
    );
    const keyExtractor = useCallback((item) => item._id, []);

    const commentSection = () => (
        <KeyboardAvoidingView style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={{ justifyContent: 'space-around', width: '100%', height: Dimensions.get('window').height * 0.7, backgroundColor: '#222222' }}>
          <TouchableOpacity onPress={() => {sheetRef.current.snapTo(0)}} style={styles.commentHeader} >
            <Text style={{ color: 'white' }}>Comments</Text>
          </TouchableOpacity>
          <FlatList style={{  }} data={comments} renderItem={renderItem} keyExtractor={keyExtractor} />
          <View style={styles.addCommentSection}>
            <TextInput defaultValue={comment} onChangeText={newText => setComment(newText)} placeholder="add comment" style={styles.addComment}/>
            <View style={styles.buttonView} >
                <Button style={{ fontSize: 10, color: 'turquoise' }} title="Post" onPress={() => {addCommentPressed()}} />
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      )

    //setLocation();

    const sheetRef = React.useRef(null);

    return (
        <View style={{ flex: 1 }}>
        <Tab.Navigator initialRouteName="Map" screenOptions={{ tabBarActiveTintColor: "#30D5C8", tabBarInactiveTintColor: "#77C1BA",headerShown: false, tabBarStyle: { borderTopWidth: 0, display: 'flex',backgroundColor: "#222222", height: '10%', padding: 5 }, tabBarOptions: {tabBarLabel: () => {return null}} }} > 
            <Tab.Screen tabBarOptions={{ showLabel: false }}name="Feed" children={()=><Feed setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef}/>} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="view-day-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Map" children={() => <Map setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} />} options={{ tabBarIcon: ({color, size}) => (<Entypo name="map" size={24} color={color}/>)}}/>
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