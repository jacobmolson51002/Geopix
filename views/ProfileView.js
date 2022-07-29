import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import { getUserInformation, getUser, addFriend } from '../backend/database';
import { checkFriendStatus } from '../backend/realm';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const ProfileView = ({ navigation, route }) => {
    const { userID } = route.params;
    const [userInformation, setUserinformation] = useState({geocash: '', content: []});
    const [infoReady, setInfoReady] = useState(false);
    const userReducer = useSelector(state => state.userReducer);
    const userRealm = userReducer.userRealm;
    const conversations = userReducer.conversations;
    const [rerender, setRerender] = useState(true);
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState('');

    if(rerender){
        setRerender(false);
        getUser(userID).then((user) => {
            checkFriendStatus(userRealm, userID).then((friendStatus) => {
                console.log(friendStatus);
                setStatus(friendStatus);
            });
            setUserinformation(user);
            setInfoReady(true);
        });

    }
    const loadHistory = () => {
        getUserInformation(userID).then((userHistory) => {
            setHistory(userHistory);
        })
    }

    const messageUser = async () => {
        const currentUser = await AsyncStorage.getItem('userID');
        const recipient = userInformation;
        let newConversation = true;
        let conversation = null;
        conversations.map((convo) => {
            if(convo.recipients.length === 1 && convo.recipients[0] == currentUser){
                newConversation = false;
                conversation = convo
            }
        });
        if(newConversation){
            navigation.navigate('Message', {conversationID: null, conversationPrimaryID: null, recipients: [userID], newConversation: newConversation});
        }else{
            navigation.navigate('Message', {conversationID: conversation._id, conversationPrimaryID: conversation._id, recipients: [userID], newConversation: newConversation});
        }
        
    }
    const viewGeopic = () => {
        console.log('heres teh geopic');
    }

    const viewComment = () => {
        console.log('heres teh comment');
    }

    const addFriendClicked = () => {
        addFriend(userID);
        setStatus('pending');
    }

    const report = () => {
        console.log('reported');
    }

    const styles = {
        wrapper: {
            flex: 1, 
            paddingTop: 50, 
            backgroundColor: '#222222',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            paddingTop: 100
        },
        geocashDisplay: {
            width: 90,
            height: 90,
            borderRadius: 50,
            borderWidth: 1.5,
            borderColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        username: {
            marginTop: 20,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 30
        },
        geocash: {
            color: 'turquoise',
            fontSize: 20,
        },
        buttons: {
            width: '60%',
            marginTop: 26
        },
        messageUser: {
            width: '100%',
            padding: 9,
            borderRadius: 12,
            backgroundColor: 'turquoise',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        inlineButtons: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            marginTop: 7
        },
        addFriend: {
            width: '48%',
            padding: 9,
            borderRadius: 12,
            backgroundColor: 'turquoise',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '4%'
        },
        pendingFriend: {
            width: '48%',
            padding: 9,
            borderRadius: 12,
            backgroundColor: '#bebebe',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '4%'
        },
        report: {
            width: '48%',
            padding: 9,
            borderRadius: 12,
            backgroundColor: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        historyContainer: {
            marginTop: 50,
            width: '80%',
            borderTopWidth: 1,
            borderTopColor: 'white'
        },
        historyLine: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        plus: {
            color: 'turquoise'
        },
        minus: {
            color: 'red'
        }
    }

    return infoReady ? (
        <View style={styles.wrapper}>
            <View style={styles.geocashDisplay}>
                <Text style={styles.geocash}>{userInformation.geocash}</Text>
            </View>
            <Text style={styles.username}>
                {userInformation.username}
            </Text>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={messageUser} style={styles.messageUser} >
                    <Text style={{ color: '#222222', fontSize: 20, fontWeight: 'bold'}}>message</Text>
                </TouchableOpacity>
                <View style={styles.inlineButtons}>
                    {status === '' ? (
                        <View style={styles.addFriend} >
                            <ActivityIndicator size={'small'} color='white' />
                        </View>
                    ) : status === 'friend' ? (
                        <View style={styles.addFriend} onPress={addFriendClicked}>
                            <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>friends</Text>
                        </View>
                    ) : status === 'pending' ? (
                        <View style={styles.pendingFriend} >
                            <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>pending</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addFriend} onPress={addFriendClicked}>
                            <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>add friend</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.report} onPress={report}>
                        <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>report</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.historyContainer} onLayout={loadHistory}>
                {history !== null ? (
                    <ScrollView style={styles.history}>
                        {history.map((historyLine, index) => {
                            return (
                                <View key={index} style={styles.historyLine}>
                                    <Text style={{ color:'white', fontSize: 15 }}><Text style={historyLine.votes[2] > 0 ? styles.plus : styles.minus}>{historyLine.votes[2]} </Text>
                                     from <TouchableOpacity style={{ margin: 0, padding: 0 }} onPress={historyLine.pic !== null ? viewGeopic : viewComment}><Text style={{ color: 'turquoise' }}>this </Text></TouchableOpacity>
                                     {historyLine.pic !== null ? 'geopic.' : 'comment.'}
                                    </Text>
                                </View>
                            )  
                        })}
                    </ScrollView>
                ) : (
                    <ActivityIndicator color='white' size='small' />
                )}

            </View>
        </View>
    ) : (
        <View style={styles.wrapper}>
            <View style={{ flex: 1, display: 'flex', justiftyContent: 'center', alignItems: 'center' }} >
                <ActivityIndicator color='white' size="small" />
            </View>
        </View>
    )
}