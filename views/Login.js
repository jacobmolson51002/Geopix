import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, Text, View, Button, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, KeyboardAvoidingView, Switch } from 'react-native';
import { sendVerificationText, checkUsername } from '../backend/database';
import { openUserRealm } from '../backend/realm';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';
import * as Notifications from 'expo-notifications';



export const TextVerification = ({ username, phoneNumber, password, code, user }) => {
    const navigation = useNavigation();
    const focusInput = useRef();
    const dispatch = useDispatch();
    const [number, setNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [userVerification, setUserVerification] = useState('');
    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const verifyCode = () => {
        setButtonClicked(true);
        setTimeout(async () => {
            setButtonClicked(false);
            if(userVerification === code){
                await openUserRealm(dispatch, false, true, user._partition, username, password, phoneNumber).then(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'AppContainer'}],
                      });
                })
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
            backgroundColor: userVerification.length === 6 ? 'turquoise' : '#5C5B57',
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
                    <Text style={styles.text}>Verification</Text>
                    <Text style={styles.subHeader}>
                        Please enter the code sent to your phone
                    </Text>
                </View>
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
            </View>
            <View style={styles.buttonView}>
                
            <TouchableOpacity disabled={userVerification.length === 6 ? false : true} style={styles.sendText} onPress={verifyCode}  >
                {buttonClicked === false ? (
                <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Verify</Text>
                ) : (
                <ActivityIndicator size='small' color="#222222" />
                )}
            </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
    )
}

export const UsernamePhonenumber = ({ setUsername, setPhoneNumber, setUser }) => {
    const navigation = useNavigation();
    const focusInput = useRef();
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [nameTaken, setNameTaken] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [userID, setUserID] = useState('');
    const [phone, setPhone] = useState(false);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const verifyUsername = async () => {
        setButtonClicked(true);
        if(phone){
            const tempName = name.replace(/-/g,'');
            const newPhone = parseInt(tempName);
            const valid = await checkUsername(newPhone, false);
            if(valid === 'invalid'){
                setButtonClicked(false);
                setInvalid(true);

            }else{
                setButtonClicked(false);
                setPhoneNumber(newPhone);
                console.log(valid);
                setUser(valid);
                setUsername(valid.username);
                navigation.navigate('password');
            }
        }else{
            const valid = await checkUsername(name, true);
            if(valid === 'invalid'){
                setButtonClicked(false);
                setInvalid(true);

            }else{
                setButtonClicked(false);
                setUsername(name);
                console.log(valid);
                setUser(valid);
                setPhoneNumber(valid.phoneNumber);
                navigation.navigate('password');
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
            backgroundColor: phone ? (name.length === 12 ? 'turquoise' : '#5C5B57') : (name.length < 5 ? '#5C5B57' : 'turquoise'),
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
        },
        choice: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 50,
        },
        username: {
            width: 110,
            marginRight: 20,
            padding: 15,
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        phone: {
            width: 100,
            padding: 15,
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        usernameText: {
            color: phone ? '#bebebe' : 'white',
            fontWeight: 'bold',
            fontSize: phone ? 15 : 16
        },
        phoneText: {
            color: phone === false ? '#bebebe' : 'white',
            fontWeight: 'bold',
            fontSize: phone === false ? 15 : 16
        },
        invalid: {
            marginTop: 15,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        invalidText: {
            color: 'orange',
            fontSize: 15,
        }
    }

    const back = '<';
    return (

        <KeyboardAvoidingView style={styles.wrapper} behavior={'padding'}>
            <View style={styles.inputSection}>
                <View style={styles.textSection}>
                    <Text style={styles.text}>Login to Geopix</Text>
                    <Text style={styles.subHeader}>
                        Input your username or phone number
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
                    keyboardType={phone ? (Platform.OS === "ios" ? "number-pad" : "numeric") : "default"}
                    onChangeText={(newValue) => {
                        if(phone){
                            if(newValue.length <= 12){
                                if((newValue.length > name.length) && (newValue.length === 3 || newValue.length === 7)){
                                    console.log('length is 3');
                                    setName(`${newValue}-`);
                                }else{
                                    setName(newValue)
                                }
                            }
                        }else{
                            setName(newValue);
                        }
                        if((newValue.length < name.length) && invalid){
                            setInvalid(false);
                        }
                    }}
                    keyboardAppearance="dark"
                    placeholder={phone ? "phone" : "username"}
                    placeholderTextColor="#bebebe"
                    />

                </View>
                <View style={styles.choice}>
                    <TouchableOpacity disabled={buttonClicked ? true : false} style={styles.username} onPress={() => {setPhone(false); setName('')}}>
                        <Text style={styles.usernameText}>username</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={buttonClicked ? true : false} style={styles.phone} onPress={() => {setPhone(true); setName('')}}>
                        <Text style={styles.phoneText}>phone</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.invalid}>
                    {invalid ? (
                        <Text style={styles.invalidText}>{phone ? "phone number" : "username"} not recognized</Text>
                    ) : (
                        <View/>
                    )}
                </View>

                </View>
                {1 === 1 ? (
                    <View style={styles.buttonView}>
                        <TouchableOpacity disabled={phone ? (name.length === 12 ? false : true) : (name.length < 5 ? true : false)}style={styles.verifyUsername} onPress={verifyUsername} >
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

export const Password = ({setPassword, user, setCode}) => {

    const navigation = useNavigation();
    const focusInput = useRef();
    const [usersPassword, setUsersPassword] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        focusInput.current.focus();
    });

    const confirm = async () => {
        setButtonClicked(true);
        if(usersPassword === user.password){
            setPassword(usersPassword);
            await sendVerificationText(user.phoneNumber).then((code) => {
                console.log(code.code);
                setCode(code.code);
                setButtonClicked(false);
                navigation.navigate('textVerification');
            });
        }else{
            setButtonClicked(false);
            setInvalid(true);
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
                <Text style={styles.text}>Login to Geopix</Text>
                <Text style={styles.subHeader}>
                    Enter your password
                </Text>
            </View>
            <View>
            <TextInput
                textAlign={"center"}
                ref={focusInput}
                style={styles.passwordInput}
                defaultValue={usersPassword}
                onChangeText={(newValue) => {
                    if((newValue.length < usersPassword.length) && invalid){
                        setInvalid(false);
                        setUsersPassword(newValue)
                    }else{  
                        setUsersPassword(newValue)
                    }
                    
                }}
                keyboardAppearance="dark"
                placeholder="password"
                placeholderTextColor="#bebebe"
                secureTextEntry={true}
                />

            {invalid ? (
                <View style={{ width: '100%', display: 'flex', justiftyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'orange', marginTop: 20 }}>Invalid password</Text>
                </View>
            ) : (
                <View />
            )}
            </View>
        </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.sendText} onPress={confirm} >
                    {buttonClicked === false ? (
                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Next</Text>
                    ) : (
                    <ActivityIndicator size='small' color="#222222" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export const Login = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [user, setUser] = useState({});

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
            <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }} initialRouteName="usernamePhoneNumber" >
                <Stack.Screen name="usernamePhoneNumber" children={() => <UsernamePhonenumber setUsername={setUsername} setPhoneNumber={setPhoneNumber} setUser={setUser} />} />
                <Stack.Screen name="password" children={() => <Password  setPassword={setPassword} user={user} setCode={setCode}/>}/>
                <Stack.Screen name="textVerification" children={() => <TextVerification phoneNumber={phoneNumber} username={username} password={password} code={code} user={user} /> }/>
            </Stack.Navigator>
        </View>
    )
}