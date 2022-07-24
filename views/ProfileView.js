import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { getUserInformation } from '../backend/database';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const ProfileView = ({ navigation, route }) => {
    const { userID } = route.params;
    const [userInformation, setUserinformation] = useState({geocash: '', content: []});
    const [infoReady, setInfoReady] = useState(false);
    const userReducer = useSelector(state => state.userReducer);
    const conversations = userReducer.conversations;
    useEffect(() => {
        (async () => {
            if(infoReady == false){
                const user = await getUserInformation(userID);
                setUserinformation(user);
                setInfoReady(true);
            }

        })()
    })
    console.log(userInformation);
    const styles = {
        wrapper: {
            flex: 1, 
            paddingTop: 50, 
            backgroundColor: '#222222'
        },
        header: {
            paddingTop: 100,
            paddingBottom: 100,
            display: 'flex',
            alignItems: 'center',
            justiftyContent: 'center'
        },
        headerText: {
            color: 'white',
            fontSize: 25
        },
        geocash: {
            color: 'white',
            fontSize: 15,
            paddingTop: 15
        }
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

    return userInformation.geocash !== '' ? (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{userInformation.username}</Text>
                <Text style={styles.geocash}>geocash: <Text style={{ color: 'turquoise' }}>{userInformation.geocash}</Text></Text>
                <Button onPress={messageUser} title="Message" />
            </View>
        </View>
    ) : (
        <View style={styles.wrapper}>
            <View style={{ flex: 1, display: 'flex', justiftyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: 'white', fontSize: 20 }} >Loading...</Text>
            </View>
        </View>
    )
}