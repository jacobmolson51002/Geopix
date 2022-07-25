import React, { useState } from 'react';
import { Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { } from '../backend/database';
import {  } from '../backend/realm';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';


export const Start = ({ navigation }) => {

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: '#222222',
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
        },
        topView: {
            flex: 2
        },
        buttons: {
            flex: 1,
            width: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        login: {
            width: '100%',
            alignItems: 'center',
            justiftyContent: 'center',
            display: 'flex',
            backgroundColor: '#bebebe',
            height: 40,
            marginBottom: 30,
            borderRadius: 20,
            paddingTop: 10,
        },
        register: {
            width: '100%',
            alignItems: 'center',
            justiftyContent: 'center',
            display: 'flex',
            backgroundColor: 'turquoise',
            paddingTop: 10,
            height: 40,
            borderRadius: 20
        },
        buttonText: {
            color: '#222222',
            fontSize: 20,
            fontWeight: 'bold'
        }
    }
    return(
        <View style={styles.wrapper}>
            <View style={styles.topView}>

            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.login} onPress={() => {navigation.navigate("Login")}}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.register} onPress={() => {navigation.navigate("GetStarted")}}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="light" />
        </View>
    )
}