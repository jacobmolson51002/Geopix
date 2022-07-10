import React, { useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { logUserOut, uploadManyGeopics, deleteManyGeopics } from '../backend/realm';
import { useSelector } from 'react-redux';


export const Profile = ({ navigation }) => {
    const [value, setValue] = useState("");
    const location = useSelector(state => state.userReducer);

    return(
        <View style={{ flex: 1, paddingTop: 50 }}>
            <Text>Profile Page</Text>
            <Button style={{paddingTop: 200}} onPress={() => {logUserOut(); navigation.navigate("Login")}} title="Logout" />
            <TextInput style={{ padding: 20, borderWidth: 1, borderColor: 'black', margin: 10 }}defaultValue={value} onChangeText={newText => setValue(newText)} placeholder="how many geopics?" />
            <Button style={{paddingTop: 200}} onPress={() => {uploadManyGeopics(location, value);}} title="Upload" />
            <Button style={{paddingTop: 200}} onPress={() => {deleteManyGeopics();}} title="Delete" />
        </View>
    )
}