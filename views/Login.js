import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';

export const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = () => {
        console.log(email);
        console.log(password);
    }

    return(
        <View style={{ flex: 1 }}>
            <View style={{ height: '12%', width: '100%', alignItems: 'center', backgroundColor: 'lightgray', border: '5px solid black'}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', position: 'absolute', bottom: 20 }}>Login</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <TextInput onChangeText={newText => setEmail(newText)} value={email} placeholder="email" style={{ borderWidth: 2, width: 200, marginTop: 50, height: 25 }}/>
                <TextInput secureTextEntry={true} onChangeText={newText => setPassword(newText)} value={password} placeholder="password" style={{ borderWidth: 2, width: 200, marginTop: 50, height: 25 }}/>
                <Button title="Home" onPress={loginHandler} />
            </View>
        </View>
    )
}