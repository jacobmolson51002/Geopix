import React, { useState } from 'react';
import { Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { logUserOut } from '../backend/database';
import { useSelector } from 'react-redux';


export const Message = ({ navigation, route }) => {
    const { recipient } = route.params;
    const [message, setMessage] = useState("");

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
        console.log("sent message");
    }

    return(
        <View style={styles.wrapper}>
            <View style={styles.topBar}>
                <Text style={styles.username}>{recipient.username}</Text>
            </View>
            <ScrollView style={styles.messages}>

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