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
            width: '90%',
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
            marginBottom: 30,
            borderRadius: 10,
            padding: 14,
        },
        register: {
            width: '100%',
            alignItems: 'center',
            justiftyContent: 'center',
            display: 'flex',
            backgroundColor: 'turquoise',
            padding: 14,
            borderRadius: 10
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