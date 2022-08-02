import React, { useState } from 'react';
import { SafeAreaView, ImageBackground, TouchableOpacity, ActivityIndicator, Text, View, Button, TextInput } from 'react-native';
import { uploadManyGeopics, deleteManyGeopics, sendPushNotification, updateUserInformation } from '../backend/database';
import { logUserOut, getUserInfo } from '../backend/realm';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CachedImage from 'react-native-expo-cached-image';
import { Camera } from 'expo-camera';


export const Profile = ({ navigation }) => {
    const [userID, setUserID] = useState('');
    const [infoReady, setInfoReady] = useState(false);
    const [rerender, setRerender] = useState(true);
    const [editing, setEditing] = useState(false);
    const [userInformation, setUserinformation] = useState({});
    const [newUsername, setNewUsername] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [picTaken, setPicTaken] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const userReducer = useSelector(state => state.userReducer);
    const realm = userReducer.userRealm;

    const logout = () => {
        logUserOut();
        navigation.reset({
            index: 0,
            routes: [{name: 'Start'}],
          });
    }

    const setup = async () => {
        const id = await AsyncStorage.getItem('userID');
        setUserID(id);
        getUserInfo(realm, id).then((user) => {
            setUserinformation(user);
            setInfoReady(true);
        });
    }

    if(rerender){
        setRerender(false);
        setup();
    }

    const editProfile = async () => {
        setEditing(true);
    }

    const saveChanges = async () => {
        setButtonClicked(true);
        console.log(userID);
        console.log(userInformation.username);
        console.log(newUsername);
        console.log(newUrl);
        updateUserInformation(userID, userInformation.username, newUsername, newUrl).then(() => {
            setButtonClicked(false);
            setEditing(false);
        })
        
    }

    const cancelEditing = () => {
        setPicTaken(false);
        setNewUrl(false);
        setNewUsername(userInformation.username);
        setEditing(false);
    }

    const takePic = async () => {
        const pic = await camera.takePictureAsync({quality: 0.5});
        setNewUrl(pic.uri);
        setPicTaken(true);

    }


    const styles = {
        wrapper: {
            flex: 1, 
            backgroundColor: '#1e1e1e',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
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
        editProfile: {
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
        },
        confirmChanges: {
            width: '100%',
            marginTop: 20,
            padding: 9,
            borderRadius: 12,
            backgroundColor: 'turquoise',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        cancel: {
            width: '100%',
            marginTop: 10,
            padding: 9,
            borderRadius: 12,
            backgroundColor: '#bebebe',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        newUsername: {
            marginTop: 20,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 30,
            borderWidth: 0,
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

    return infoReady ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        <View style={styles.wrapper}>
            {editing === false ? (
            <Text style={styles.username}>
                {userInformation.username}
            </Text>
            ) : (
                <TextInput defaultValue={userInformation.username} onChangeText={(newText) => {setNewUsername(newText)}} style={styles.newUsername} />
            )}
            {editing === false ? (
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.editProfile} onPress={editProfile}>
                    <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>edit profile</Text>
                </TouchableOpacity>
                <View style={styles.geocashDisplay}>
                    <Text style={{ fontSize: 12, color: '#bebebe' }}>geocash</Text>
                    <Text style={styles.geocash}>{userInformation.geocash}</Text>
                </View>
            </View>
            ) : (
                <View />
            )}
            <View style={styles.statusPic}>
                {editing === false ? (
                    <CachedImage source={{ uri: userInformation.statusPic }} style={styles.image}/>
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
                        <ImageBackground source={{ uri: newUrl }} style={styles.image}/>
                        <TouchableOpacity onPress={() => {setPicTaken(false)}} style={styles.retake}>
                            <Text style={{ color:'white', fontSize: 30 }}>x</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {editing ? (
            <View style={{ width: '60%' }}>
                <TouchableOpacity style={styles.cancel} onPress={cancelEditing}>
                    <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmChanges} onPress={saveChanges}>
                    {buttonClicked === false ? (
                    <Text style={{ color: "#222222", fontSize: 17, fontWeight:'bold' }}>done</Text>
                    ) : (
                        <ActivityIndicator size="small" color="#222222" />
                    )}
                </TouchableOpacity>

            </View>
            ) : (
                <View />
            )}
        </View>
        </SafeAreaView>
    ) : (
        <View style={styles.wrapper}>
            <View style={{ flex: 1, display: 'flex', justiftyContent: 'center', alignItems: 'center' }} >
                <ActivityIndicator color='white' size="small" />
            </View>
        </View>
    )
}