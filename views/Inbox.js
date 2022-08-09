import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { logUserOut } from '../backend/realm';
import { getUser, acceptRequest, declineRequest, getTime } from '../backend/database';
import { useSelector } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileView } from './ProfileView';

export const InboxView = ({ navigation, route }) => {

    const userReducer = useSelector(state => state.userReducer);
    const conversations = userReducer.conversations;
    const activityList = userReducer.requests;
    const [timestamps, setTimestamps] = useState(null);
    const [seeAllActivity, setSeeAllActivity] = useState(false);
    console.log('rendered');

    /*useEffect(() => {
        let newTimestamps = []
        conversations.map((conversation) => {
            const [timeStamp, units] = getTime(conversation.timestamp);
            newTimestamps.push({timeStamp: timeStamp, units: units});
        });
        setTimestamps(newTimestamps);

    })*/

    const viewProfile = (userID) => {
        navigation.navigate('viewProfile', {userID: userID});
    }

    const acceptRequestClicked = async (userID) => {
        acceptRequest(userID);
    }

    const declineRequestClicked = async (userID) => {
        declineRequest(userID);
    }
    

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#1E1E1E',
            paddingLeft: 24,
            paddingRight: 24
        },
        header: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: 24,
            marginBottom: 20,
        },
        conversationsList: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        conversationsList: {
            width: '100%',
        },
        conversation: {
            width: '100%',
            marginBottom: 25
        },
        recipient: {
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 5,
            fontSize: 15
        },
        lastMessage: {
            fontSize: 13,
            color: '#bebebe'
        },
        newMessage: {
            fontSize: 13,
            color: 'white'
        },
        newMessageContainer: {
            display: 'flex',
            position: 'absolute',
            right: 10,
            top: '50%',
            height: '100%',
            justiftyContent: 'center',
            alignItems: 'center',
            width: 10
        },
        newMessageIcon: {
            height: 10,
            width: 10,
            borderRadius: 25,
            backgroundColor: 'turquoise'
        },
        request: {
            marginBottom: 25,
            marginLeft: 0,
            paddingLeft: 0
        },
        requestNameSection: {
            flex: 3,
            display: 'flex',
            marginLeft: 0,
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'row'
        },
        requestName: {
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold'
        },
        requestLine: {
            color: 'white',
            fontSize: 15
        },
        requestButtons: {
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            width: '100%',

        },
        acceptRequestButton: {
            backgroundColor: 'turquoise',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            marginRight: 5
        },
        acceptRequestText: {
            color: 'white',
            fontWeight: 'bold'
        },
        declineRequestButton: {
            backgroundColor: '#bebebe',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
        },
        declineRequestText: {
            color: 'white',
            fontWeight: 'bold'
        },
        messageDate: {
            fontWeight: 'bold',
            color: '#bebebe',
            marginBottom: 7,
            fontSize: 11
        },
        messageDisplay: {
            width: '80%'
        },
        seeMore: {
            marginBottom: 20
        }
    }

    return  (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
        <ScrollView style={styles.wrapper}>
            {activityList.length > 0 ? (
            <View>
            <Text style={styles.header}>Activity</Text>
            <View style={styles.activityList}>
                {activityList.map((request, index) => {
                    //console.log(usernames);
                    //console.log(usernames[index]);
                    return (!seeAllActivity && index > 2) ? (
                        <View key={index}/>
                    ) : (
                        <View key={index} style={styles.request} >
                            <View style={styles.requestNameSection}>
                                <TouchableOpacity onPress={() => {viewProfile(request.userID)}}><Text style={styles.requestName}>{request.username}</Text></TouchableOpacity><Text style={styles.requestLine}> would like to be friends.</Text>
                            </View>
                            <View style={styles.requestButtons}>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => {acceptRequestClicked(request.userID)}} style={styles.acceptRequestButton}>
                                        <Text style={styles.acceptRequestText}>accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {declineRequestClicked(request.userID)}} style={styles.declineRequestButton}>
                                        <Text style={styles.declineRequestText}>decline</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                })}
                {activityList.length > 3 ? (
                    <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={1} style={styles.seeMore} onPress={() => {setSeeAllActivity(!seeAllActivity)}}>
                            <Text style={{ color: '#bebebe' }}>{seeAllActivity ? "See less" : "See all"}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View />
                )}
            </View>
            </View>
            ) : (
                <View />
            )}
            <View>
            <Text style={styles.header}>Messages</Text>
            <View style={styles.conversationsList}>
                {conversations.map((conversation, index) => {
                        return(
                            <TouchableOpacity key={index} onPress={() => {navigation.navigate('Message', {conversationID: conversation.conversationID, conversationPrimaryID: conversation._id, recipients: conversation.recipients, newConversation: false});}} style={styles.conversation}>
                                <View><Text style={styles.geopicInfo}><TouchableOpacity style={{ margin: 0, padding: 0 }} onPress={() => {navigation.navigate('profileView', {userID: conversation.recipients[0]})}}><Text style={styles.recipient}>{conversation.usernames[0]}</Text></TouchableOpacity><View style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{timestamps != null ? (<Text style={styles.messageDate}>    •    {Math.floor(timestamps[index].timeStamp)} {timestamps[index].units} {timestamps[index].timeStamp === "now" ? "" : "ago"}</Text>) : (<View />)}</View></Text></View>
                                
                                <View style={styles.messageDisplay}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={conversation.unread > 0 ? styles.newMessage : styles.lastMessage}>{conversation.lastMessage}</Text>
                                </View>
                                {conversation.unread > 0 ? (
                                    <View style={styles.newMessageContainer}>
                                        <View style={styles.newMessageIcon} />
                                    </View>
                                ) : (
                                    <View />
                                )}
                            </TouchableOpacity>
                        )
                })}
            </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    ) 
}

export const Inbox = ({ navigation, route }) => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="inbox" >
        <Stack.Screen name="inbox" component={InboxView} />
        <Stack.Screen name='viewProfile' component={ProfileView} />
      </Stack.Navigator> 
    )
}