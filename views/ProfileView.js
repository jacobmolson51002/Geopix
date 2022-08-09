import React, { useState, useEffect } from 'react';
import { SafeAreaView, ImageBackground, ScrollView, TouchableOpacity, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import { getUserInformation, getUsername, addFriend } from '../backend/database';
import { checkFriendStatus } from '../backend/realm';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CachedImage from 'react-native-expo-cached-image';


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
        getUsername(userID).then((user) => {
            checkFriendStatus(userRealm, userID).then((friendStatus) => {
                console.log(friendStatus);
                setStatus(friendStatus);
            });
            setUserinformation(user);
            setInfoReady(true);
        });

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
            navigation.navigate('Message', {conversationID: null, conversationPrimaryID: null, recipients: [userID], usernames: [userInformation.username], newConversation: newConversation});
        }else{
            navigation.navigate('Message', {conversationID: conversation._id, conversationPrimaryID: conversation._id, recipients: [userID], usernames: [userInformation.username], newConversation: newConversation});
        }
        
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
            backgroundColor: '#1e1e1e',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            paddingTop: 50
        },
        geocashDisplay: {
            marginTop: 20,
            justiftyContent: 'center',
            alignItems: 'center',
            display: 'flex'
        },
        username: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 30
        },
        geocash: {
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold'
        },
        buttons: {
            width: '60%',
            marginTop: 26
        },
        messageUser: {
            width: '48%',
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
        },
        statusPic: {
            marginTop: 30,
            width: '80%',
            height: '65%',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
            flex: 1
        }
    }

    return infoReady ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        <View style={styles.wrapper}>
            <Text style={styles.username}>
                {userInformation.username}
            </Text>
            <View style={styles.buttons}>
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
                    <TouchableOpacity style={styles.messageUser} onPress={messageUser}>
                        <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>message</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.geocashDisplay}>
                    <Text style={{ fontSize: 12, color: '#bebebe' }}>geocash</Text>
                    <Text style={styles.geocash}>{userInformation.geocash}</Text>
                </View>
            </View>
            <View style={styles.statusPic}>
                <CachedImage source={{ uri: userInformation.statusPic }} style={styles.image}/>
            </View>
        </View>
        </SafeAreaView>
    ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        <View style={styles.wrapper}>
            <View style={{ flex: 1, display: 'flex', justiftyContent: 'center', alignItems: 'center' }} >
                <ActivityIndicator color='white' size="small" />
            </View>
        </View>
        </SafeAreaView>
    )
}