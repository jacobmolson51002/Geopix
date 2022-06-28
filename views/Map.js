import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { queryMongo } from '../backend/realm';
import { setLocation } from '../backend/location';
import { StatusBar } from 'expo-status-bar';
import { Provider } from  'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';


export const Map = ({ navigation }) => {
  //queryMongo();
    setLocation();

    const location = useSelector(state => state.userReducer);

    const testFunction = () => {
      console.log("this pin was clicked");
    }

    return(
      <Provider store={Store}>
        <View style={{ flex: 1 }}>
          
          <MapView style={{ flex: 1 }} region={
            {
              latitude: location.currentLocation.latitude,
              longitude: location.currentLocation.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }
          }>
              <Marker onPress={console.log("this is working")} coordinate={{latitude: location.currentLocation.latitude, longitude: location.currentLocation.longitude}} title="You" description="Your current location" />
              <View style={{ shadowOffset: {width: 0, height: 2}, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 2, position: 'relative', top: '92%', left: '85%', width: 50, height: 50, backgroundColor: 'turquoise', borderRadius: 10 }}>
                <TouchableOpacity style={{ flex: 1 }}onPress={() => navigation.navigate("Camera")} />
              </View>
          </MapView>
          <StatusBar />
        </View>
      </Provider>
    )
};