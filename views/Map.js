import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Button, Image } from 'react-native';
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
import CachedImage from 'react-native-expo-cached-image';

const DisplayMap = ({ navigation }) => {
    //const [mapShowing, setMapShowing] = useState(true);
    //const [geopicData, setGeopicData] = useState(null);
    const [geopicDataReady, setGeopicDataReady] = useState(false);
  //queryMongo();
    //setLocation();
    getGeopics();
    
    
    
    const location = useSelector(state => state.userReducer);
    const geopics = useSelector(state => state.geopicsReducer);
    

    console.log(geopics.geopics);

    //console.log(location.currentLocation.latitude);

    useEffect(() => {
      (async () => {
        if(geopics.geopics != null){
          console.log("caching!");
          geopics.geopics.map((geopic, index) => {
            console.log(`caching ${geopic.pic}`);
            return(
            <CachedImage source={{ uri: geopic.pic }} />
            )
          })
        }
      })();

    }, [geopics])

    console.log("refreshed");

    return geopics.geopics != null ? (
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: 'black' }}>
        {/*<NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{headerShown: false}} initialRoute="Map">
            <Stack.Screen title="Map" component={MapDisplay} />
            <Stack.Screen title="Camera" component={CameraView} />
          </Stack.Navigator>
        </NavigationContainer>*/}
        <MapView style={{ flex: 1, borderWidth: 1, borderColor: 'black', borderRadius: 15 }} region={
            {
              latitude: location.currentLocation.latitude,
              longitude: location.currentLocation.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }
          }>
              {geopics.geopics.map((geopic, index) => {
                //console.log(geopic.location.coordinates[0]);
                return <Marker onPress={() => {navigation.navigate('singleView', { geopic: geopic })}} key={index} coordinate={{ latitude: geopic.location.coordinates[1], longitude: geopic.location.coordinates[0] }} />
              })}
              <StatusBar />
          </MapView>
          <TouchableOpacity style={{ padding: 0, justiftyContent: 'center', display: 'flex', alignItems: 'center', position: 'absolute',flex: 1, shadowOffset: {width: 0, height: 2}, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 2, top: '92%', left: '85%', width: 50, height: 50, backgroundColor: 'turquoise', borderRadius: 10 }} onPress={() => {navigation.navigate("Camera")}} >
              <Text style={{ fontSize: 50, color:  'white', marginTop: -5 }}>+</Text>
          </TouchableOpacity>
      </View>
  ) : (
    <AppLoading />
  )
}


export const Map = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }} initialRouteName="displayMap" >
      <Stack.Screen name="displayMap" component={DisplayMap} />
      <Stack.Screen name="singleView" component={SingleFeedView} />
    </Stack.Navigator> 
  )
}