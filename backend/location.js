import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentLocation } from '../redux/actions';

export const setLocation = () => {
    /*const [location, setLocation] = useState({coords: {latitude: 0, longitude: 0}});
    const [errorMsg, setErrorMsg] = useState(null);*/
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
        console.log(location);
    })();
    }, []);
}