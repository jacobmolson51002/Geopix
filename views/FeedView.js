import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import { getImage } from '../backend/realm';
import AppLoading from 'expo-app-loading';
import * as firebase from '../backend/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/


export const SingleFeedView = (props) => {
    const [geopicData, setGeopicData] = useState(null);

    console.log(props.geopic.pic);

    const geopicRef = ref(firebase.storage, props.geopic.pic);
    
    getDownloadURL(geopicRef)
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
    });

    const styles = {
        image: {
            flex: 1
        }
    }
    return geopicData != null ? (
        <View style={styles.image}>
            <Image source={{ uri: geopicData.pic }} style={{ flex: 1 }}/>
        </View>
    ) : (
        <AppLoading />
    )
}