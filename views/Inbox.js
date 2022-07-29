import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { logUserOut } from '../backend/realm';
import { getUser, acceptRequest, declineRequest } from '../backend/database';
import { useSelector } from 'react-redux';


export const Inbox = ({ navigation, route }) => {

    const userReducer = useSelector(state => state.userReducer);
    const conversations = userReducer.conversations;
    const requests = userReducer.requests;
    const [usernames, setUsernames] = useState(null);

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
            backgroundColor: '#222222'
        },
        header: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: 18,
            margin: 10,
            marginBottom: 20,
            marginTop: 100
        },
        conversationsList: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        activityList: {
            maxHeight: 200,

        },
        conversation: {
            width: '100%',
            marginBottom: 25
        },
        recipient: {
            fontWeight: 'bold',
            color: 'white',
            margin: 10,
            fontSize: 15
        },
        lastMessage: {
            marginLeft: 10,
            fontSize: 13,
            color: '#bebebe'
        },
        newMessage: {
            marginLeft: 10,
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
        }
    }

    return  (
        <View style={styles.wrapper}>
            <Text style={styles.header}>Activity</Text>
            <ScrollView style={styles.activityList}>
                {requests.map((request, index) => {
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
            </ScrollView>
            <Text style={styles.header}>Messages</Text>
            <ScrollView style={styles.conversationsList}>
                {conversations.map((conversation, index) => {
                    //console.log(usernames);
                    //console.log(usernames[index]);
                    return(
                        <TouchableOpacity key={index} onPress={() => {navigation.navigate('Message', {conversationID: conversation.conversationID, conversationPrimaryID: conversation._id, recipients: conversation.recipients, newConversation: false});}} style={styles.conversation}>
                            <Text style={styles.recipient}>nothing</Text>
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
            </ScrollView>
        </View>
    ) 
}