import React, { useCallback, useEffect, useRef } from 'react';
import { Login } from './Login';
import { Map } from './Map';
import { Feed } from './Feed';
import { Profile } from './Profile';
import { Inbox } from './Inbox';
import { ActivityIndicator, SafeAreaView, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyBoardAvoidingView, TouchableWithoutFeedback, Dimensions, View, Text, Button, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
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
import { getComments, addComment, getTime } from '../backend/database';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Votes } from './FeedView';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

        

export const AppHome = ({ navigation }) => { 
    const [currentGeopic, setCurrentGeopic] = useState({username: 'jacob'});
    const [comments, setComments] = useState({});
    const [comment, setComment] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);

    const Tab = createBottomTabNavigator();

    const logout = async () => {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('userID');
        await AsyncStorage.removeItem('password');
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
                paddingBottom: 5,
                fontWeight: 'bold'
            },
            comment: {
                color: "white", 
                paddingBottom: 5
            },
            timestamp: {
                color: '#bebebe',
                fontSize: 10
            }
        }
        const [timestamp, units] = getTime(comment.timestamp);
        return (
            <View style={styles.commentContainer} >
                <View style={styles.commentBox} >
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text style={styles.comment}>{comment.comment}</Text>
                    <Text style={styles.timestamp}>{timestamp === 'now' ? timestamp : Math.floor(timestamp)} {units} {timestamp === "now" ? "" : "ago"}</Text>
                </View>
                <Votes voteableItem={comment} />
            </View>
        )
    }

    const addCommentPressed = async () => {
        setButtonClicked(true);
        const currentTime = new Date();
        const userID = await AsyncStorage.getItem('userID');
        const commentToAdd = {
            geopicID: currentGeopic._id,
            comment: comment,
            userID: `${userID}`,
            votes: [0,0,0],
            replies: 0,
            reply: false,
            timestamp: currentTime
          };
        const newComment = await addComment(commentToAdd, currentGeopic);
        const newComments = comments;
        newComments.unshift(newComment);
        setComments(newComments);
        setComment("");
        setButtonClicked(false);
        
    }

    const renderItem = useCallback(
        ({ item }) => <Comment comment={item} />,
        []
    );
    const keyExtractor = useCallback((item) => item._id, []);


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
            flexDirection: 'row',
            justiftyContent: 'flex-end',
            alignItems: 'center',
            padding: 5,
            paddingBottom: 5,
            borderBottomWidth: 0.2,
            borderBottomColor: '#bebebe',
        },
        commentViewContainer: {
            height: '95%',
            flex: 1
        },
        addComment: {
            borderWidth: 0.5,
            borderColor: 'white',
            borderRadius: 14,
            padding: 10,
            marginLeft: 15,
            width: '75%',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
            color: "#bebebe",
            paddingTop: 10,
            paddingBottom: 10

        },
        buttonView: {
            width: '15%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'flex-end'
        },
        commentList: {
            height: '77%',
            flex: 1,
        },
        keyboardView: {

        }
    }

    const keyboardStyles = StyleSheet.create({
        keyboardView: {
            justifyContent: 'flex-start',
            width: '100%', 
            height: Dimensions.get('window').height * 0.7, 
            backgroundColor: '#222222' 
        }
    })

    const focusInput = useRef();

    useEffect(() => {
        if(currentGeopic.comments === 0){
            focusInput.current.focus();
        }
    });

    const commentSection = () => (
        <View style={keyboardStyles.keyboardView}>

            <View style={styles.addCommentSection}>
                    <TextInput ref={focusInput} returnKeyType="send" keyboardAppearance='dark' placeholderTextColor="#bebebe" multiline={true} defaultValue={comment} onChangeText={newText => setComment(newText)} placeholder={currentGeopic.comments === 0 ? "Be the first to comment" : "Add comment"} style={styles.addComment}/>
                    <View style={styles.buttonView} >
                        {buttonClicked === false ? (
                        <TouchableOpacity onPress={() => {addCommentPressed()}} >
                            <Text style={{ fontSize: 16, color: 'turquoise' }}>Post</Text>
                        </TouchableOpacity>
                        ) : (
                            <ActivityIndicator color={'turquoise'} small={'medium'} />
                        )}
                    </View>
            </View>
            {currentGeopic.comments > 0 && Object.keys(comments).length === 0 ? ( //
                <View style={{ marginTop: 10, width: '100%', alignItems: 'center', justiftyContent: 'center', display: 'flex' }}>
                    <ActivityIndicator color={'#bebebe'} size={'small'} />
                </View>
            ) : (
                <FlatList style={styles.commentList} data={comments} renderItem={renderItem} keyExtractor={keyExtractor} />
            )}
        </View>
        
        
    )
      {/*<KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black'}} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-around' }} >
        <Image style={styles.optionsPreviewImage} source={{uri: url}} />
        <TextInput defaultValue={caption} onChangeText={newText => setCaption(newText)} placeholder="caption" style={styles.captionBox}/>
      </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={() => {navigation.navigate("reviewAndUpload", { url: url, caption: caption })}} style={styles.uploadButtonContainer}>
        <Text style={styles.uploadButton}>-></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>*/}

    //setLocation();

    const sheetRef = React.useRef(null);

    const notifications = useSelector(state => state.userReducer);


    const NotificationIcon = ({ notifications, color }) => {

        const styles = {
            wrapper: {

            },
            notificationNumber: {
                width: 16,
                height: 16,
                position: 'absolute',
                top: -3,
                right: -5,
                backgroundColor: 'red',
                borderRadius: 50,
                display: 'flex',
                justiftyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 2
            },
            notificationText: {
                color: 'white',
                fontSize: 13,
                fontWeight: 'bold'
            }
        }

        return (
            <View style={styles.wrapper}>
                {notifications > 0 ? (
                    <View style={styles.notificationNumber} >
                        <View><Text style={styles.notificationText}>{notifications}</Text></View>
                    </View>
                ) : (
                    <View />
                )}
                <MaterialCommunityIcons name="mailbox-open-outline" color={color} size={30} />
            </View>
        )
    }
    

    return (
        <View style={{ flex: 1, }}>
        <Tab.Navigator initialRouteName="Map" screenOptions={{ tabBarActiveTintColor: "#30D5C8", tabBarInactiveTintColor: "#77C1BA",headerShown: false, tabBarStyle: { borderTopWidth: 0, display: 'flex',backgroundColor: "#222222", height: '10%', padding: 5 }, tabBarOptions: {tabBarLabel: () => {return null}} }} > 
            <Tab.Screen tabBarOptions={{ showLabel: false }} name="Feed" children={()=><Feed setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef}/>} options={{ tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="view-day-outline" color={color} size={30} />)}}/>
            <Tab.Screen name="Map" children={() => <Map setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} />} options={{ tabBarIcon: ({color, size}) => (<Entypo name="map" size={24} color={color}/>)}}/>
            <Tab.Screen name="Inbox" component={Inbox} options={{ tabBarIcon: ({color, size}) => (<NotificationIcon color={color} notifications={notifications.unreadCount} />)}}/>
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