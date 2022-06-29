import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';
import { logUserIn, registerUser } from '../backend/realm';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginScreenShowing, setLoginScreenShowing] = useState(true);

    const loginHandler = async () => {

        const login = await logUserIn(email, password);
        if(login === "successful login") {
            console.log("success");
            //go to home page
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
                //go to home page
            } else {
                console.log(register.message);
            }
        }else{
            console.log('passwords dont match');
        }


        //navigation.navigate("Map");
    }

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
                        <TextInput defaultValue={email} onChangeText={newText => setEmail(newText)} placeholder="email" style={{ borderWidth: 2, width: 200, marginTop: 50, height: 25 }}/>
                        <TextInput defaultValue={password} onChangeText={newText => setPassword(newText)} secureTextEntry={true} placeholder="password" style={{ borderWidth: 2, width: 200, marginTop: 50, height: 25 }}/>
                        <Button title="Login" onPress={loginHandler} />
                    </View>
                 ) : (
                    <View>
                        <TextInput defaultValue={email} onChangeText={newText => setEmail(newText)} placeholder="email" style={{ borderWidth: 2, width: 200, marginTop: 33, height: 25 }}/>
                        <TextInput defaultValue={password} onChangeText={newText => setPassword(newText)} secureTextEntry={true} placeholder="password" style={{ borderWidth: 2, width: 200, marginTop: 33, height: 25 }}/>
                        <TextInput defaultValue={confirmPassword} onChangeText={newText => setConfirmPassword(newText)} secureTextEntry={true} placeholder="confirm password" style={{ borderWidth: 2, width: 200, marginTop: 33, height: 25 }}/>
                        <Button title="Register" onPress={registerHandler} />
                    </View>
                )}
            </View>
        </View>
    )
}

//onChangeText={newText => setEmail(newText)}
//onChangeText={newText => setPassword(newText)}