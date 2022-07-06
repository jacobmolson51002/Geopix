import React from 'react';
import { Text, View, Button } from 'react-native';
import { logUserOut } from '../backend/realm';


export const Profile = ({ navigation }) => {

    return(
        <View style={{ flex: 1, paddingTop: 50 }}>
            <Text>Profile Page</Text>
            <Button style={{paddingTop: 200}} onPress={() => {logUserOut(); navigation.navigate("Login")}} title="Logout" />
        </View>
    )
}