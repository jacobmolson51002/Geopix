import React, { useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { uploadManyGeopics, deleteManyGeopics, sendPushNotification } from '../backend/database';
import { logUserOut } from '../backend/realm';
import { useSelector } from 'react-redux';


export const Profile = ({ navigation }) => {
    const [value, setValue] = useState("");
    const location = useSelector(state => state.userReducer);

    const logout = () => {
        logUserOut();
        navigation.reset({
            index: 0,
            routes: [{name: 'Start'}],
          });
    }

    return(
        <View style={{ flex: 1, paddingTop: 50 }}>
            <Text>Profile Page</Text>
            <Button style={{paddingTop: 200}} onPress={logout} title="Logout" />
            <TextInput style={{ padding: 20, borderWidth: 1, borderColor: 'black', margin: 10 }}defaultValue={value} onChangeText={newText => setValue(newText)} placeholder="how many geopics?" />
            <Button style={{paddingTop: 200}} onPress={() => {uploadManyGeopics(location, value);}} title="Upload" />
            <Button style={{paddingTop: 200}} onPress={() => {deleteManyGeopics();}} title="Delete" />
            <Button style={{paddingTop: 200}} onPress={() => {sendPushNotification();}} title="Notify" />
        </View>
    )
}