import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { logUserOut } from '../backend/realm';
import { getUser, acceptRequest, declineRequest, getTime } from '../backend/database';
import { useSelector } from 'react-redux';


export const Message = ({ conversation }) => {
    console.log(conversation);
    const [username, setUsername] = useState('');
    const [rerender, setRerender] = useState(true);
    /*if(rerender){
        setRerender(false);
        getUser(conversation.recipients[0]).then((user) => {
            console.log(user.username);
            setUsername(user.username);
        });
    }*/

    const [timeStamp, units] = getTime(conversation.timestamp);

    const styles = {
        messageDate: {
            color: '#bebebe',
            fontSize: 12
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
            marginLeft: 10,
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

    }
    return(
        <TouchableOpacity key={index} onPress={() => {navigation.navigate('Message', {conversationID: conversation.conversationID, conversationPrimaryID: conversation._id, recipients: conversation.recipients, newConversation: false});}} style={styles.conversation}>
            <View style={{ display: 'flex', flexDirection: 'row' }}><TouchableOpacity onPress={() => {navigation.navigate('profileView', {userID: conversation.recipients[0]})}}><Text style={styles.recipient}>{conversation.usernames[0]}</Text></TouchableOpacity><Text style={{ color: 'white', fontSize: 18 }}>    •    </Text><Text style={styles.messageDate}>something</Text></View> 
            <Text style={conversation.unread > 0 ? styles.newMessage : styles.lastMessage}>{conversation.lastMessage}</Text>
            {conversation.unread > 0 ? (
                <View style={styles.newMessageContainer}>
                    <View style={styles.newMessageIcon} />
                </View>
            ) : (
                <View />
            )}
        </TouchableOpacity>
    )
    //{Math.floor(timeStamp)} {units} {timeStamp === "now" ? "" : "ago"}
}

export const Inbox = ({ navigation, route }) => {

    const userReducer = useSelector(state => state.userReducer);
    const conversations = userReducer.conversations;
    const activityList = userReducer.requests;

    const viewProfile = () => {

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
            marginLeft: 10,
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
            height: 60
        },
        requestNameSection: {
            flex: 3,
            padding: 5,
            display: 'flex',
            alignItems: 'center'
        },
        requestName: {
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold'
        },
        requestButtons: {
            flex: 2,
            display: 'flex',
            flexDirection: 'row',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        acceptRequestButton: {
            height: '95%',
            backgroundColor: 'turquoise',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        acceptRequestText: {
            color: 'white'
        },
        declineRequestButton: {
            height: '95%',
            backgroundColor: '#bebebe',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        declineRequestText: {
            color: 'white'
        },
        messageDate: {
            color: '#bebebe',
            fontSize: 12
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
                    return(
                        <View key={index} style={styles.request} >
                            <TouchableOpacity onPress={viewProfile} style={styles.requestNameSection}>
                                <Text style={styles.requestName}>{request.userID} would like to be friends.</Text>
                            </TouchableOpacity>
                            <View style={styles.requestButtons}>
                                <TouchableOpacity onPress={() => {acceptRequestClicked(request.userID)}} style={styles.acceptRequestButton}>
                                    <Text style={styles.acceptRequestText}>accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {declineRequestClicked(request._partition)}} style={styles.declineRequestButton}>
                                    <Text style={styles.declineRequestText}>decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
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
                                <View style={{ display: 'flex', flexDirection: 'row' }}><TouchableOpacity onPress={() => {navigation.navigate('profileView', {userID: conversation.recipients[0]})}}><Text style={styles.recipient}>{conversation.usernames[0]}</Text></TouchableOpacity><Text style={{ color: 'white', fontSize: 18 }}>    •    </Text><Text style={styles.messageDate}>something</Text></View> 
                                <Text style={conversation.unread > 0 ? styles.newMessage : styles.lastMessage}>{conversation.lastMessage}</Text>
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