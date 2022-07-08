import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import { getImage } from '../backend/realm';
import AppLoading from 'expo-app-loading';
import * as firebase from '../backend/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CachedImage from 'react-native-expo-cached-image';

/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/


export const SingleFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { geopic } = route.params;

    //setGeopicData(true);

    //const geopicRef = ref(firebase.storage, props.geopic.pic);
    
    /*getDownloadURL(geopicRef)
    .then((url) => {
        const geopic = props.geopic;
        geopic.pic = url;
        setGeopicData(geopic);
    })
    .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/object-not-found':
            console.log('doesnt exist');
            break;
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log('no permissions');
            break;
        case 'storage/canceled':
            // User canceled the upload
            console.log('canceled upload');
            break;
    
        // ...
    
        case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
    });*/

    const styles = {
        container: {
            flex: 1
        },
        image: {
            width: '101%',
            height: '87%',
            borderLeftWidth: 0,
            marginLeft: -1,
            marginRight: -1
        },
        bottomBox: {
            width: '100%',
            height: '13%',
            padding: 15,
            backgroundColor: 'black'
        },
        captionBox: {
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            width: '60%'
        },
        captionText: {
            fontSize: 15,
            color: 'white'
        },
        retakeButton: {
            color: 'white',
            fontSize: 25
        },
            retakeButtonContainer: {
            position: 'absolute',
            top: 70,
            left: 15
        },
    }
    const backButton = '<-';
    return (
        <View style={styles.container}>
            <CachedImage source={{ uri: geopic.pic }} style={styles.image}/>
            <View style={styles.bottomBox} >
                <View style={styles.captionBox}>
                    <Text style={{ fontWeight: 'bold', color: 'white', paddingBottom: 5}}>{geopic.username}:</Text>
                    <Text style={styles.captionText}>{geopic.caption}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => {navigation.navigate('displayMap')}} style={styles.retakeButtonContainer}>
                <Text style={styles.retakeButton}>{backButton}</Text>
            </TouchableOpacity>
        </View>
    )
}