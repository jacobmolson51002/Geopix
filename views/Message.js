import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { logUserOut } from '../backend/database';
import { getMessages, updateConversation, sendMessage, createNewConversation, sendNewMessage } from '../backend/realm';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentConversation } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ObjectId} from 'bson';


export const Message = ({ navigation, route }) => {
    let { conversationID, conversationPrimaryID, recipients, newConversation } = route.params;
    const [message, setMessage] = useState("");
    const [userID, setUserID] = useState('');
    const [getData, setGetData] = useState(true);
    const [firstMessageNew, setFirstMessageNew] = useState(newConversation);
    const userRedux = useSelector(state => state.userReducer);
    const messages = userRedux.currentConversation;
    const userRealm = userRedux.userRealm;
    const messagesRealm = userRedux.messagesRealm;
    const dispatch = useDispatch();

    console.log('test');
    console.log(newConversation);
    updateConversation(userRealm, conversationPrimaryID);


    if(messages == null && newConversation === false){
        console.log('working');
        
        getMessages(conversationID, dispatch);
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
            backgroundColor: '#222222',
            paddingBottom: 20
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
            paddingTop: 10,
            height: '80%',
            display: 'flex',
        },
        inputView: {
            display: 'flex',
            justiftyContent: 'center',
            flexDirection: 'row',
        },
        message: {
            borderWidth: 1,
            borderColor: "#bebebe",
            borderRadius: 15,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 15,
            paddingRight: 15,
            color: '#bebebe',
            width: '75%',
            marginLeft: 20,
            marginBottom: 20,
            marginTop: 20,
            fontSize: 15,
            maxHeight: 100
        },
        messagesView: {
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end'
        },
        buttonContainer: {
            width: '15%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        sendMessage: {
            position: 'relative',
            bottom: 19,
            right: 14,
            color: 'white',
        }
    }

    const sendMessageClicked = async () => {
        setMessage('');
        let newMessages = [];
        if(firstMessageNew === false){
            console.log('false');
            messages.map((currentMessage) => {
                newMessages.push(currentMessage);
            });
            newMessages.push({message: message, from: userID});
            dispatch(setCurrentConversation(newMessages));
            sendMessage(message, messagesRealm, userRealm, conversationID, conversationPrimaryID, userID, recipients);
        }else{
            console.log('true');
            newMessages.push({message: message, from: userID});
            newConversation = false;
            dispatch(setCurrentConversation(newMessages));

            const newConversationID = new ObjectId();
            const timestamp = new Date();
            createNewConversation(newConversationID, timestamp, userRealm, recipients, message, userID);
            sendNewMessage(newConversationID, timestamp, dispatch, message, messagesRealm, userRealm, userID, recipients);
            setFirstMessageNew(false);

        }
    }

    const MyMessage = (message) => {
        const styles = {
            messageWrapper: {
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
            },
            textBubble: {
                maxWidth: '60%',
                flexWrap: 'wrap',
                display: 'flex',
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: 15,
                color: 'white',
                backgroundColor: '#77C1BA',
                borderRadius: 25,
                marginRight: 5,
                marginTop: 1,
                justifyContent: 'flex-end',
                flexDirection: 'row'
            }
        }
        return(
            <View style={styles.messageWrapper}>
                <View style={styles.textBubble}>
                    <Text style={{ display: 'flex', flexWrap: 'wrap', color: 'white', fontWeight: 'bold' }}>
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
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: 15,
                color: '#bebebe',
                backgroundColor: 'gray',
                borderRadius: 25,
                marginLeft: 5,
                marginTop: 1,
                flexDirection: 'row'
            }
        }
        return(
            <View style={styles.messageWrapper}>
                <View style={styles.textBubble}>
                    <Text style={{ display: 'flex', flexWrap: 'wrap', fontWeight: 'bold', color:'white' }}>
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
            <ScrollView 
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            style={styles.messages}>
                {messages != null ? (
                <View style={styles.messagesView}>
                    {messages.map((message, index) => {
                        return(
                            message.from == userID ? (
                                <MyMessage key={index} message={message.message} />
                            ) : (
                                <RecipientMessage key={index} message={message.message} />
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
                        <Button style={styles.sendMessage} title="Send" onPress={sendMessageClicked} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}