import React, { useState, useRef, useEffect } from 'react';
import { ImageBackground, Dimensions, Text, View, Button, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, KeyboardAvoidingView, Switch } from 'react-native';
import { sendVerificationText, checkUsername, getPic } from '../backend/database';
import { openUserRealm } from '../backend/realm';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';
import * as Notifications from 'expo-notifications';



export const TextVerification = ({ setPhoneNumber }) => {
    const navigation = useNavigation();
    const focusInput = useRef();
    const [number, setNumber] = useState("");
    const [numberInUse, setNumberInUse] = useState(false);
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
            let check = number.replace(/-/g, '');
            check = parseInt(check);
            const checkNumber = await checkUsername(check, false);
            console.log(checkNumber);
            if(checkNumber === 'invalid'){
                await sendVerificationText(number).then((code) => {
                    console.log(code.code);
                    setVerificationCode(code.code);
                    setButtonClicked(false);
                });
            }else{
                setButtonClicked(false);
                setNumberInUse(true);
            }

        }

    }

    const verifyCode = () => {
        setButtonClicked(true);
        setTimeout(() => {
            setButtonClicked(false);
            if(userVerification === verificationCode){
                setPhoneNumber(number);
                navigation.navigate('username');
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
        },
        phoneNumberInvalid: {
            marginTop: 15,
            width: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        invalidText: {
            color: 'orange',
            fontSize: 14
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
                        "First, what's your phone number?"
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
                        if((newValue.length < number.length) && numberInUse){
                            setNumberInUse(false);
                        }
                    }}
                    keyboardAppearance="dark"
                    placeholder="phone"
                    placeholderTextColor="#bebebe"
                    />
                {numberInUse ? (
                <View style={styles.phoneNumberInvalid}>
                    <Text style={styles.invalidText}>phone number already in use</Text>
                </View>
                ) : (
                <View />
                )}
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
                    <TouchableOpacity disabled={number.length === 12 ? false : true} style={styles.sendText} onPress={sendMessage} >
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

export const Username = ({ setUsername }) => {
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
            const valid = await checkUsername(name, true);
            if(valid === 'invalid'){
                setButtonClicked(false);
                setNameTaken(false);
                setUsername(name);
                navigation.navigate('password');
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
                    <Text style={styles.text}>Thanks</Text>
                    <Text style={styles.subHeader}>
                        {nameTaken === false ? (
                        "Next, what do you want to be known as?"
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

export const Password = ({setPassword}) => {

    const navigation = useNavigation();
    const focusInput = useRef();
    const [usersPassword, setUsersPassword] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [dontMatch, setDontMatch] = useState(false);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const firstPassword = () => {
        setButtonClicked(true)
        if(usersPassword.length >= 6){
            setConfirming(true);
            setButtonClicked(false);
        }
    }

    const confirm = () => {
        setButtonClicked(true);
        if(usersPassword === confirmPassword){
            setPassword(usersPassword)
            setConfirmed(true);
            navigation.navigate('statusPic');
        }else{
            setButtonClicked(false);
            setDontMatch(true);
        }
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
            backgroundColor: usersPassword.length >= 6 ? 'turquoise' : '#5C5B57',
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
        passwordInput: {
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
                <Text style={styles.text}>Great choice</Text>
                <Text style={styles.subHeader}>
                    {confirming === false ? (
                    "Next, choose a password you won't forget"
                    ) : (
                    "Confirm your password"
                    )}
                </Text>
            </View>
            {confirming === false ? (
            <View>
            <TextInput
                textAlign={"center"}
                ref={focusInput}
                style={styles.passwordInput}
                defaultValue={usersPassword}
                onChangeText={(newValue) => {setUsersPassword(newValue)}}
                keyboardAppearance="dark"
                placeholder="password"
                placeholderTextColor="#bebebe"
                secureTextEntry={true}
                />

            </View>
            ) : (
            <View>
            <TextInput
                textAlign={"center"}
                ref={focusInput}
                style={styles.passwordInput}
                defaultValue={confirmPassword}
                onChangeText={(newValue) => {setConfirmPassword(newValue)}}
                keyboardAppearance="dark"
                placeholder="confirm" 
                secureTextEntry={true}
            />
            {dontMatch ? (
                <View style={{ width: '100%', display: 'flex', justiftyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red', marginTop: 20 }}>Passwords don't match</Text>
                </View>
            ) : (
                <View />
            )}
            </View>
            )}
        </View>
        {confirming === false ? (
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.sendText} onPress={firstPassword} >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Next</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.buttonView}>
                
                <TouchableOpacity style={styles.backToNumber} onPress={() => {setConfirming(false)}}>
                    <Text style={{ color: 'white', fontSize: 30 }}>{back}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendText} onPress={confirm}  >
                {buttonClicked === false ? (
                <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Confirm Password</Text>
                ) : (
                <ActivityIndicator size='small' color="#222222" />
                )}
            </TouchableOpacity>
            </View>
        )}
        </KeyboardAvoidingView>
    )
}

export const Permissions = ({ phoneNumber, username, password, statusPic }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [buttonClicked, setButtonClicked] = useState(false);
    const [location, setLocation] = useState(false);
    const [notifications, setNotifications] = useState(false);
    
    const locationPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation(false);
        }else{
            setLocation(true);
        }
    }

    const notificationPermissions = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if(status != 'granted'){
            setNotifications(false);
        }{
            setNotifications(true);
        }
    }

    const login = async () => {
        phoneNumber = phoneNumber.replace(/-/g, '');
        const newNumber = parseInt(phoneNumber);
        await openUserRealm(dispatch, true, false, '', username, password, newNumber, statusPic).then(() => {
            navigation.reset({
                index: 0,
                routes: [{name: 'AppContainer'}],
              });
        });

    }


    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: "#222222",
            justiftyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        },
        button: {
            width: '100%',
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        loginButton: {
            backgroundColor: location ? 'turquoise' : '#5C5B57',
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
        header: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
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
        permissions: {
            marginTop: 100,
            display: 'flex',
            justfiyContent: 'center',
            alignItems: 'center'
        },
        option: {
            width: '40%',
            marginBottom: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        permissionPrompt: {
            color: 'white',
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        permissionsSubheader: {
            color:'white',
            fontSize: 12,
            marginBottom: 10
        }
    }
    return(
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.text}>One more thing</Text>
                <Text style={styles.subHeader}>Geopix needs your permission to use these services</Text>
            </View>
            <View style={styles.permissions}>
                <View style={styles.option}>
                    <Text style={styles.permissionPrompt}>Location</Text>
                    <Text style={styles.permissionsSubheader}>(to see cool geopics nearby!)</Text>
                    <Switch value={location} onValueChange={locationPermissions}></Switch>
                </View>
                <View style={styles.option}>
                    <Text style={styles.permissionPrompt}>Notifications</Text>
                    <Text style={styles.permissionsSubheader}>(to stay in the loop!)</Text>
                    <Switch value={notifications} onValueChange={notificationPermissions}></Switch>
                </View>
            </View>
            <View style={styles.button}>
                <TouchableOpacity disabled={location ? false : true} style={styles.loginButton} onPress={login} >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Jump in</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const StatusPic = ({ setStatusPic }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [useCamera, setUseCamera] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [picTaken, setPicTaken] = useState(false);
    const [localPic, setLocalPic] = useState('');

    const cameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if(status != 'granted'){
            setUseCamera(false);
        }{
            setUseCamera(true);
        }
    }

    const takePic = async () => {
        const pic = await camera.takePictureAsync({quality: 0.5});
        setStatusPic(pic.uri);
        setLocalPic(pic.uri);
        setPicTaken(true);
    }




    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: "#222222",
            justiftyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        },
        button: {
            width: '100%',
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        loginButton: {
            backgroundColor: picTaken ? 'turquoise' : '#5C5B57',
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
        header: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
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
        cameraView: {
            marginTop: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            borderRadius: 20,
            height: '60%',
            overflow: 'hidden'
        },
        cameraHidden: {
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems:'center'
        },
        takePic: {
            width: 200,
            padding: 14,
            borderRadius: 10,
            backgroundColor: '#bebebe',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        option: {
            width: '40%',
            marginBottom: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        permissionPrompt: {
            color: 'white',
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        permissionsSubheader: {
            color:'white',
            fontSize: 12,
            marginBottom: 10
        },
        capture: {
            borderWidth: 4,
            width: 60,
            height: 60,
            borderColor: 'white',
            borderRadius: 60,

        },
        retake: {
            position: 'absolute',
            top: 20,
            left: 20
        }
    }
    return(
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.text}>Great now let's setup</Text>
                <Text style={styles.subHeader}>Take a status pic to display on your profile</Text>
                <Text style={styles.subHeader}>(it can be changed at any time)</Text>
            </View>
            <View style={styles.cameraView}>
                {useCamera === false ? (
                    <View style={styles.cameraHidden}>
                        <TouchableOpacity style={styles.takePic} onPress={cameraPermissions}>
                            <Text style={{ color: 'white' }}>Take Pic</Text>
                        </TouchableOpacity>
                    </View>
                ) : picTaken === false ? (
                    <View style={{ flex: 1, width: '100%', height: '100%' }}>
                        <Camera  style={{ flex: 1, width: '100%', height: '100%' }}
                        ref={(r) => {
                            camera = r
                        }}>
                        </Camera>
                        <View style={{ width: '100%', position: 'absolute', bottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={takePic} style={styles.capture} />
                        </View>
                    </View>
                ) : (
                    <View style={{ flex: 1, width: '100%', height: '100%' }}>
                        <ImageBackground
                            source={{uri: localPic}}
                            style={{
                                flex: 1, width: '100%', height: '100%'
                            }}
                        />
                        <TouchableOpacity onPress={() => {setPicTaken(false)}} style={styles.retake}>
                            <Text style={{ color:'white', fontSize: 30 }}>x</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.button}>
                <TouchableOpacity  disabled={picTaken ? false : true} style={styles.loginButton} onPress={() => {navigation.navigate('permissions')}} >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Continue</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const GetStarted = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusPic, setStatusPic] = useState('');

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
                <Stack.Screen name="username" children={() => <Username setUsername={setUsername} />}/>
                <Stack.Screen name="password" children={() => <Password  setPassword={setPassword} />}/>
                <Stack.Screen name="statusPic" children={() => <StatusPic setStatusPic={setStatusPic} /> } /> 
                <Stack.Screen name="permissions" children={() => <Permissions phoneNumber={phoneNumber} username={username} password={password} statusPic={statusPic} /> }/>
            </Stack.Navigator>
        </View>
    )
}