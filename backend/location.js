import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocation = async () => {
    const dispatch = useDispatch(); 
    useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("error")
        return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low, distanceInterval: 0, timeInterval: 500 });
        //setLocation(location);
        //locationSet = true;
        dispatch(setCurrentLocation(location.coords));
        return(location.coords);
    })();
    }, []);
}
