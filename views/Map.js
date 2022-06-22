import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import getRealm from '../server';

export const Map = () => {
    const [location, setLocation] = useState({coords: {latitude: 0, longitude: 0}});
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
    console.log(text);
    getRealm();

    return(
      <MapView style={{ flex: 1 }} region={
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }
      } />
    )
};