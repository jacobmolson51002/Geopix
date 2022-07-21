import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { logUserOut } from '../backend/database';
import { getMessages, updateConversation } from '../backend/realm';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const Message = ({ navigation, route }) => {
    const { conversationID } = route.params;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(null);
    const [userID, setUserID] = useState('');
    const realmRedux = useSelector(state => state.userReducer);
    const realm = realmRedux.userRealm;

    console.log('test');
    if(messages == null){
        updateConversation(realm, conversationID);

        getMessages(conversationID, setMessages);
    }
    

    //updateConversation(realm, conversationID);
    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem('userID');
            setUserID(user);
        })()
    })
    

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222'
        },
        topBar: {
            height: '10%',
            borderBottomWidth: 0.5,
            borderBottomColor: '#bebebe',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingBottom: 10
        },
        username: {
            color: 'white',
            fontSize: 20,
            padding: 10
        },
        messages: {
            height: '80%',
            display: 'flex',
        },
        inputView: {
            display: 'flex',
            justiftyContent: 'center',
            flexDirection: 'row'
        },
        message: {
            borderWidth: 1,
            borderColor: "#bebebe",
            borderRadius: 15,
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 10,
            paddingRight: 10,
            color: '#bebebe',
            width: '75%',
            height: 30,
            margin: 20,
            fontSize: 16
        },
        messagesView: {
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end'
        },
        buttonContainer: {
            width: '15%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        sendMessage: {
            color: 'white',
        }
    }

    const sendMessage = () => {
        let newMessages = [];
        messages.map((currentMessage) => {
            newMessages.push(currentMessage);
        });
        newMessages.push({message: message, from: userID});
        setMessages(newMessages)
        //sendMessage(message, realm, conversationID, userID);
    }

    const MyMessage = (message) => {
        const styles = {
            messageWrapper: {
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end'
            },
            textBubble: {
                maxWidth: '60%',
                flexWrap: 'wrap',
                display: 'flex',
                padding: 15,
                fontSize: 15,
                color: 'white',
                backgroundColor: 'turquoise',
                borderRadius: 25,
                marginRight: 10,
                marginTop: 1,
                justifyContent: 'flex-end'
            }
        }
        return(
            <View style={styles.messageWrapper}>
                <View style={styles.textBubble}>
                    <Text style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {message.message}
                    </Text>
                </View>
            </View>
        )
    }

    const RecipientMessage = (message) => {
        const styles = {
            messageWrapper: {
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start'
            },
            textBubble: {
                maxWidth: '60%',
                flexWrap: 'wrap',
                display: 'flex',
                flex: 1,
                padding: 15,
                fontSize: 15,
                color: '#bebebe',
                backgroundColor: 'gray',
                borderRadius: 25,
                marginLeft: 10,
                marginTop: 1,
            }
        }
        return(
            <View style={styles.messageWrapper}>
                <View style={styles.textBubble}>
                    <Text style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {message.message}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.topBar}>
                <Text style={styles.username}>Test</Text>
            </View>
            <ScrollView style={styles.messages}>
                {messages != null ? (
                <View style={styles.messagesView}>
                    {messages.map((message, index) => {
                        return(
                            message.to === userID ? (
                                <RecipientMessage key={index} message={message.message} />
                            ) : (
                                <MyMessage key={index} message={message.message} />
                            )

                        )
                    })}
                </View>
                ) : (
                    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'blue' }} />
                )}
            </ScrollView>
            <KeyboardAvoidingView behavior={'padding'}>
                <View style={styles.inputView}>
                    <TextInput returnKeyType="send" keyboardAppearance='dark' placeholderTextColor="#bebebe" multiline={true} defaultValue={message} onChangeText={newText => setMessage(newText)} placeholder={"Send message"} style={styles.message}/>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.sendMessage} title="Send" onPress={sendMessage} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}