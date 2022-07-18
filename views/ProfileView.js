import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { getUserInformation } from '../backend/database';
import { useSelector } from 'react-redux';


export const ProfileView = ({ navigation, route }) => {
    const { username } = route.params;
    const [userInformation, setUserinformation] = useState({geocash: '', content: []});
    useEffect(() => {
        (async () => {
            const user = await getUserInformation(username);
            setUserinformation(user);
        })()
    })
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

    const messageUser = () => {
        const recipient = userInformation;
        recipient.username = username;
        navigation.navigate('message', { recipient: recipient });
    }

    return userInformation.geocash != '' ? (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{username}</Text>
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