import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, SafeAreaView, Image, View, Text, TouchableOpacity, TouchableHighlight, Button, FlatList } from 'react-native';
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

const SingleView = ({ geopic, navigation }) => {

    console.log(geopic);

    const styles = {
        container: {
            flex: 1,
            width: '100%',
            height: Dimensions.get('window').height - 48
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

export const SingleFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { geopic } = route.params;

    const geopicView = [geopic];

    const renderItem = ({ item }) => <SingleView geopic={item} />;
    return (
        <View style={{ flex:  1 }}>
            <FlatList data={geopicView} renderItem={renderItem} keyExtractor={geopic => geopic._id} />
        </View>
    )
}

export const ScrollFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { cluster } = route.params;

    //console.log("printing cluster");

    //console.log(cluster);

    const renderItem = ({ navigation, item }) => <SingleView navigation={navigation} geopic={item} />;
    return (
        <View style={{ flex: 1 }}>
            <FlatList style={{ flex: 1 }} 
                      data={cluster} renderItem={renderItem} 
                      keyExtractor={geopic => geopic._id} 
                      showsVerticalScrollIndicator={false}
                      snapToInterval={Dimensions.get('window').height - 48}
                      snapToAlignment='start'
                      decelerationRate='fast'
                      />
        </View>
    )
}