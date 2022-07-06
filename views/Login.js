import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';
import { logUserIn, registerUser, openRealm } from '../backend/realm';
import { setLocation } from '../backend/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';


export const Login = ({ navigation }) => {
    //const [appIsReady, setAppIsReady] = useState(false);
    //const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginScreenShowing, setLoginScreenShowing] = useState(true);
    const [createAccountShowing, setCreateAccountShowing] = useState(false);

    const loginHandler = async () => {

        const login = await logUserIn(email, password);
        if(login === "successful login") {
            //openRealm();
            console.log("success");
            navigation.navigate("AppContainer");
        } else {
            console.log(login.message);
        }

        //navigation.navigate("Map");
    }
    const registerHandler = async () => {
        if(password === confirmPassword){
            console.log(email);
            console.log(password);
            const register = await registerUser(email, password);
            if(register === "successful register") {
                console.log("success");
                setCreateAccountShowing(true);
                //go to home page
            } else {
                console.log(register.message);
            }
        }else{
            console.log('passwords dont match');
        }


        //navigation.navigate("Map");
    }
  
  
    /*const prepare = async () => {
        try {
          await SplashScreen.preventAutoHideAsync();
  
          /*const loginCredentials = null;
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('userID');
          await AsyncStorage.removeItem('password');
  
          const loginCredentials = await AsyncStorage.getItem('userID');
  
  
          if(loginCredentials !== null){
            navigation.navigate("Home");
          }else{
            console.log("user not found");
          }
        } catch(e) {
          console.warn(e);
        } finally {
          setAppIsReady(true);
        }
      };
  
    const onLayoutRootView = useCallback(async () => {
      await prepare();
      console.log(appIsReady);
      if(appIsReady){
        console.log("splash screen ready");
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);*/



    return(
        <View style={{ flex: 1 }}>
            <View style={{ height: '12%', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'lightgray', border: '5px solid black'}} />
            <View style={{flex: 1, width: '100%'}}>
                <Button title="Login" onPress={() => {setLoginScreenShowing(true)}} style={{ justifyContent: 'space-evenly', fontSize: 20, fontWeight: 'bold', position: 'absolute', bottom: 20, textDecoration: loginScreenShowing ? 'underline' : 'none' }} >Login</Button>
                <Button title="Register" onPress={() => {setLoginScreenShowing(false)}} style={{ justifyContent: 'space-evenly', fontSize: 20, fontWeight: 'bold', position: 'absolute', bottom: 20, textDecoration: !loginScreenShowing ? 'underline' : 'none' }} >Register</Button>
            </View>
            <View style={{ flex: 3, alignItems: 'center' }}>
                {loginScreenShowing ? (
                    <View>
                        <TextInput style={styles.input} defaultValue={email} onChangeText={newText => setEmail(newText)} placeholder="email" />
                        <TextInput defaultValue={password} onChangeText={newText => setPassword(newText)} secureTextEntry={true} placeholder="password" style={styles.input}/>
                        <Button style={styles.button} title="Login" onPress={loginHandler} />
                    </View>
                 ) : createAccountShowing ? (
                    <View>
                        <TextInput  defaultValue={email} onChangeText={newText => setEmail(newText)} placeholder="email" style={styles.input}/>
                        <TextInput  defaultValue={password} onChangeText={newText => setPassword(newText)} secureTextEntry={true} placeholder="password" style={styles.input}/>
                        <TextInput  defaultValue={confirmPassword} onChangeText={newText => setConfirmPassword(newText)} secureTextEntry={true} placeholder="confirm password" style={styles.input}/>
                        <Button style={styles.button} title="Create Account" onPress={registerHandler} />
                    </View>
                 ) : (
                    <View>
                        <TextInput defaultValue={email} onChangeText={newText => setEmail(newText)} placeholder="email" style={styles.input}/>
                        <TextInput defaultValue={password} onChangeText={newText => setPassword(newText)} secureTextEntry={true} placeholder="password" style={styles.input}/>
                        <TextInput defaultValue={confirmPassword} onChangeText={newText => setConfirmPassword(newText)} secureTextEntry={true} placeholder="confirm password" style={styles.input}/>
                        <Button style={styles.button} title="Register" onPress={registerHandler} />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: '#30C5D8',
      padding: 10,
      width: 200
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#30DC58'
    }
});

//onChangeText={newText => setEmail(newText)}
//onChangeText={newText => setPassword(newText)}