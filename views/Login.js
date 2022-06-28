import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';

export const Login = ({ navigation }) => {
    return(
        <View style={{ flex: 1 }}>
            <View style={{ height: '12%', width: '100%', alignItems: 'center', backgroundColor: 'lightgray', border: '5px solid black'}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', position: 'absolute', bottom: 20 }}>Login</Text>
            </View>
            <View style={{  }}>
                <Text>This is the login screen</Text>
                <Button title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    )
}