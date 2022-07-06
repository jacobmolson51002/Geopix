import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import { getImage } from '../backend/realm';


/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/


export const SingleFeedView = async (props) => {
    const styles = {
        image: {
            flex: 1
        }
    }
    return (
        <View style={styles.image}>
            <Image source={{ uri: props.geopic.pic }} style={{ flex: 1 }}/>
        </View>
    )
}