import React, { useState, useRef } from 'react';
import { Text, View, Button, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { sendVerificationText } from '../backend/database';
import {  } from '../backend/realm';
import { useSelector } from 'react-redux';
import * as SMS from 'expo-sms';


export const GetStarted = ({ navigation }) => {
    const [number, setNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [userVerification, setUserVerification] = useState('');

    const sendMessage = async () => {
        setButtonClicked(true);
        await sendVerificationText(number).then((code) => {
            console.log(code.code);
            setVerificationCode(code.code);
            setButtonClicked(false);
        });
    }

    const verifyCode = () => {
        setButtonClicked(true);
        setTimeout(() => {
            setButtonClicked(false);
            if(userVerification === verificationCode){
                console.log('matches');
            }else{
                console.log('doesnt match');
            }
        }, 400)
    }

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
            paddingTop: 50,
        },
        inputSection: {
            display: 'flex',
        },
        textSection: {
            width: '100%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold'
        },
        sendText: {
            backgroundColor: 'turquoise',
            padding: 20,
            fontSize: 18,
            color: '#222222',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            width: '40%',
            marginTop: 20,
            marginLeft: '30%',
        },
        phoneNumberInput: {
            marginTop: 20,
            width: '60%',
            padding: 10,
            borderBottomWidth: 1.5, 
            borderBottomColor: 'white',
            fontSize: 24,
            color: 'white',
            marginLeft: '20%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
    return(
        <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
            <View style={styles.wrapper}>
            <View style={styles.inputSection}>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Let's get you started.</Text>
                </View>
                {verificationCode === '' ? (
                <View>
                <TextInput
                    textAlign={"center"}
                    style={styles.phoneNumberInput}
                    value={number}
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    onChangeText={(newValue) => {
                        if(newValue.length <= 12){
                            if((newValue.length > number.length) && (newValue.length === 3 || newValue.length === 7)){
                                console.log('length is 3');
                                setNumber(`${newValue}-`);
                            }else{
                                setNumber(newValue)
                            }
                        }
                    }}
                    keyboardAppearance="dark"
                    placeholder="Enter phone number"
                    placeholderTextColor="#bebebe"
                    />
                <TouchableOpacity style={styles.sendText} onPress={sendMessage}  >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Send text</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
                </View>
                ) : (
                <View>
                <TextInput
                    textAlign={"center"}
                    style={styles.phoneNumberInput}
                    defaultValue={userVerification}
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    onChangeText={(newValue) => {setUserVerification(newValue)}}
                    keyboardAppearance="dark"
                    placeholder="Verification Code" />
                <TouchableOpacity style={styles.sendText} onPress={verifyCode}  >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Verify</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
                </View>
                )}
            </View>
            </View>
        </TouchableWithoutFeedback>
    )
}