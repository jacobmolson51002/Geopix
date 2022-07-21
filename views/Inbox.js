import React, { useState } from 'react';
import { Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { logUserOut } from '../backend/realm';
import { useSelector } from 'react-redux';


export const Inbox = ({ navigation, route }) => {

    const conversationsReducer = useSelector(state => state.userReducer);
    const conversations = conversationsReducer.messages;

    console.log(conversations);

    const viewConversation = (conversationID) => {
        
    }
    
    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222'
        },
        messagesHeader: {
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
        }
    }

    return(
        <View style={styles.wrapper}>
            <Text style={styles.messagesHeader}>Messages</Text>
            <ScrollView style={styles.conversationsList}>
                {conversations.map((conversation, index) => {
                    return(
                        <TouchableOpacity key={index} onPress={() => {navigation.navigate('Message', {conversationID: conversation._id});}} style={styles.conversation}>
                            <Text style={styles.recipient}>{conversation.recipients[0]}</Text>
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