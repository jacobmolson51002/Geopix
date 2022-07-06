import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { queryMongo, getGeopics, getImage } from '../backend/realm';
import { StatusBar } from 'expo-status-bar';
import { Provider } from  'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';
import { CameraView } from './CameraView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import _ from 'underscore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SingleFeedView, getGeopicDataReady } from './FeedView';

export const Map = ({ navigation }) => {
    const [mapShowing, setMapShowing] = useState(true);
    const [geopicData, setGeopicData] = useState(null);
    const [geopicDataReady, setGeopicDataReady] = useState(false);
  //queryMongo();
    //setLocation();
    getGeopics();
    
    
    
    const location = useSelector(state => state.userReducer);
    const geopics = useSelector(state => state.geopicsReducer);

    const getGeopicDataReady = async (geopic) => {
      const url = await getImage(geopic);
      console.log(url);
      geopic.pic = url;
      setGeopicData(geopic);
      setGeopicDataReady(true);
    }
    

    console.log(geopicData);
    

    console.log(geopics.geopics);

    //console.log(location.currentLocation.latitude);

    console.log("refreshed");

    return geopics.geopics != null && mapShowing ? (
      <View style={{ flex: 1 }}>
        {/*<NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{headerShown: false}} initialRoute="Map">
            <Stack.Screen title="Map" component={MapDisplay} />
            <Stack.Screen title="Camera" component={CameraView} />
          </Stack.Navigator>
        </NavigationContainer>*/}
        <MapView style={{ flex: 1 }} region={
            {
              latitude: location.currentLocation.latitude,
              longitude: location.currentLocation.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }
          }>
              {geopics.geopics.map((geopic, index) => {
                //console.log(geopic.location.coordinates[0]);
                return <Marker onPress={() => {
                  setMapShowing(false); 
                  getGeopicDataReady(geopic, setGeopicData, setGeopicDataReady, geopicData);

                }} key={index} coordinate={{ latitude: geopic.location.coordinates[1], longitude: geopic.location.coordinates[0] }} title="You" description={geopic.timestamp} />
              })}
              <StatusBar />
          </MapView>
          <TouchableOpacity style={{ position: 'absolute',flex: 1, shadowOffset: {width: 0, height: 2}, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 2, top: '92%', left: '85%', width: 50, height: 50, backgroundColor: 'turquoise', borderRadius: 10 }} onPress={() => {navigation.navigate("Camera")}} >
              <Text>hello there</Text>
          </TouchableOpacity>
      </View>
  ) : !mapShowing && geopicDataReady ? (
    <SingleFeedView geopic={geopicData} style={{ flex: 1 }}/>
  ) : (
    <AppLoading />
  )
};