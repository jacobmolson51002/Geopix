import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, Text, View, Button, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { sendVerificationText, checkUsername } from '../backend/database';
import {  } from '../backend/realm';
import { useSelector } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export const TextVerification = ({ setPhoneNumber }) => {
    const navigation = useNavigation();
    const focusInput = useRef();
    const [number, setNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [userVerification, setUserVerification] = useState('');
    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const sendMessage = async () => {
        if(number.length === 12){
            setButtonClicked(true);
            await sendVerificationText(number).then((code) => {
                console.log(code.code);
                setVerificationCode(code.code);
                setButtonClicked(false);
            });
        }

    }

    const verifyCode = () => {
        setButtonClicked(true);
        setTimeout(() => {
            setButtonClicked(false);
            if(userVerification === verificationCode){
                setPhoneNumber(number);
                navigation.navigate('personalInfo');
            }else{
                setInvalidCode(true);
            }
        }, 400)
    }

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
            paddingTop: 50,
            width: '100%',
            heigth: '100%'
        },
        inputSection: {
            display: 'flex',
            width: '100%',
            height: '100%'
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
        subHeader: {
            fontSize: 15,
            color: 'white',
            marginTop: 30
        },
        sendText: {
            backgroundColor: verificationCode === '' ? (number.length === 12 ? 'turquoise' : '#5C5B57') : (userVerification.length === 6 ? 'turquoise' : '#5C5B57'),
            padding: 14,
            fontSize: 18,
            color: '#222222',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            width: '90%',
            marginTop: 20,
            marginLeft: '30%',
            position: 'absolute',
            bottom: 0
        },
        phoneNumberInput: {
            marginTop: 40,
            width: '80%',
            padding: 10,
            fontSize: 35,
            color: 'white',
            marginLeft: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold'
        },
        backToNumber: {
            width: 50,
            height: 50,
            position: 'absolute',
            left: 75,
            top: 105
        },
        buttonView: {
            width: '100%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            bottom: 15
        }
    }

    const back = '<';
    return (

            <KeyboardAvoidingView style={styles.wrapper} behavior={'padding'}>
            <View style={styles.inputSection}>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Let's get you started.</Text>
                    <Text style={styles.subHeader}>
                        {verificationCode === '' ? (
                        "First, what is your phone number?"
                        ) : (
                        "Enter your verification code"
                        )}
                    </Text>
                </View>
                {verificationCode === '' ? (
                <View>
                <TextInput
                    textAlign={"center"}
                    ref={focusInput}
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
                    placeholder="phone"
                    placeholderTextColor="#bebebe"
                    />

                </View>
                ) : (
                <View>
                <TextInput
                    textAlign={"center"}
                    ref={focusInput}
                    style={styles.phoneNumberInput}
                    defaultValue={userVerification}
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    onChangeText={(newValue) => {setUserVerification(newValue)}}
                    keyboardAppearance="dark"
                    placeholder="code" 
                />
                {invalidCode ? (
                    <Text style={{ color: 'red', marginTop: 20 }}>Invalid verification code</Text>
                ) : (
                    <View />
                )}
                </View>
                )}
            </View>
            {verificationCode === '' ? (
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.sendText} onPress={sendMessage} >
                        {buttonClicked === false ? (
                        <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Send text</Text>
                        ) : (
                        <ActivityIndicator size='small' color="#222222" />
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buttonView}>
                    
                    <TouchableOpacity style={styles.backToNumber} onPress={() => {setVerificationCode('')}}>
                        <Text style={{ color: 'white', fontSize: 30 }}>{back}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendText} onPress={verifyCode}  >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Verify</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
                </View>
            )}
            </KeyboardAvoidingView>
    )
}

export const AppInfo = ({ setUsername }) => {
    const navigation = useNavigation();
    const focusInput = useRef();
    const [name, setName] = useState('');
    const [nameTaken, setNameTaken] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const verifyUsername = async () => {
        setButtonClicked(true);
        if(name.length >= 5){
            const valid = await checkUsername(name);
            if(valid){
                setButtonClicked(false);
                setNameTaken(false);
                setUsername(name);
                navigation.navigate('textVerification');
            }else{
                setButtonClicked(false);
                setNameTaken(true);
                //setName('');
            }
        }
    }

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
            paddingTop: 50,
            width: '100%',
            heigth: '100%',
        },
        inputSection: {
            display: 'flex',
            width: '100%',
            height: '100%'
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
        subHeader: {
            fontSize: 15,
            color: 'white',
            marginTop: 30
        },
        verifyUsername: {
            backgroundColor: name.length >= 5 ? 'turquoise' : '#5C5B57',
            padding: 14,
            fontSize: 18,
            color: '#222222',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            width: '90%',
            marginTop: 20,
            marginLeft: '30%',
            position: 'absolute',
            bottom: 0
        },
        usernameInput: {
            marginTop: 40,
            width: '80%',
            padding: 10,
            fontSize: 35,
            color: 'white',
            marginLeft: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold'
        },
        backToNumber: {
            width: 50,
            height: 50,
            position: 'absolute',
            left: 75,
            top: 105
        },
        buttonView: {
            width: '100%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            bottom: 15,
        }
    }

    const back = '<';
    return (

        <KeyboardAvoidingView style={styles.wrapper} behavior={'padding'}>
            <View style={styles.inputSection}>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Let's get started</Text>
                    <Text style={styles.subHeader}>
                        {nameTaken === false ? (
                        "First, what do you want to be known as?"
                        ) : (
                        "Sorry, that name is taken. Try another"
                        )}
                    </Text>
                </View>
                <View>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlign={"center"}
                    ref={focusInput}
                    style={styles.usernameInput}
                    defaultValue={name}
                    onChangeText={(newValue) => {setName(newValue)}}
                    keyboardAppearance="dark"
                    placeholder="Geopix name"
                    placeholderTextColor="#bebebe"
                    />

                </View>
                </View>
                {1 === 1 ? (
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.verifyUsername} onPress={verifyUsername} >
                            {buttonClicked === false ? (
                            <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Next</Text>
                            ) : (
                            <ActivityIndicator size='small' color="#222222" />
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View />
                )}
        </KeyboardAvoidingView>
    )
}

export const PersonalInfo = ({setBirthday}) => {

    const [userBirthday, setUserBirthday] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
            paddingTop: 50,
            width: '100%',
            heigth: '100%'
        },
        inputSection: {
            display: 'flex',
            width: '100%',
            height: '100%'
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
        subHeader: {
            fontSize: 15,
            color: 'white',
            marginTop: 30
        },
        sendText: {
            backgroundColor: verificationCode === '' ? (number.length === 12 ? 'turquoise' : '#5C5B57') : (userVerification.length === 6 ? 'turquoise' : '#5C5B57'),
            padding: 14,
            fontSize: 18,
            color: '#222222',
            borderRadius: 10,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            width: '90%',
            marginTop: 20,
            marginLeft: '30%',
            position: 'absolute',
            bottom: 0
        },
        phoneNumberInput: {
            marginTop: 40,
            width: '80%',
            padding: 10,
            fontSize: 35,
            color: 'white',
            marginLeft: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold'
        },
        backToNumber: {
            width: 50,
            height: 50,
            position: 'absolute',
            left: 75,
            top: 105
        },
        buttonView: {
            width: '100%',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            bottom: 15
        }
    }

    const back = '<';
    return (

            <KeyboardAvoidingView style={styles.wrapper} behavior={'padding'}>
            <View style={styles.inputSection}>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Let's get you started.</Text>
                    <Text style={styles.subHeader}>
                        {verificationCode === '' ? (
                        "First, what is your phone number?"
                        ) : (
                        "Enter your verification code"
                        )}
                    </Text>
                </View>
                <View>
                <TextInput
                    textAlign={"center"}
                    ref={focusInput}
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
                    placeholder="phone"
                    placeholderTextColor="#bebebe"
                    />

                </View>

            </View>
            {verificationCode === '' ? (
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.sendText} onPress={sendMessage} >
                        {buttonClicked === false ? (
                        <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Send text</Text>
                        ) : (
                        <ActivityIndicator size='small' color="#222222" />
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buttonView}>
                    
                    <TouchableOpacity style={styles.backToNumber} onPress={() => {setVerificationCode('')}}>
                        <Text style={{ color: 'white', fontSize: 30 }}>{back}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendText} onPress={verifyCode}  >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Verify</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
                </View>
            )}
            </KeyboardAvoidingView>
    )
}

export const Success = ({navigation}) => {

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: "#222222"
        }
    }
    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export const GetStarted = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
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
    }
    return(
        <View style={styles.wrapper}>
            <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }} initialRouteName="textVerification" >
                <Stack.Screen name="textVerification" children={() => <TextVerification setPhoneNumber={setPhoneNumber} />} />
                <Stack.Screen name="personalInfo" children={() => <PersonalInfo setName={setName} setBirthday={setBirthday} />}/>
                <Stack.Screen name="appInfo" children={() => <AppInfo setUsername={setUsername} setPassword={setPassword} />}/>
                <Stack.Screen name="success" children={() => <Success phoneNumber={phoneNumber} name={name} birthday={birthday} username={username} password={password} /> }/>
            </Stack.Navigator>
        </View>
    )
}