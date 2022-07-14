import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Button, Image } from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { queryMongo, getGeopics, getImage, hideGeopic } from '../backend/database';
import { openLocalRealm } from '../backend/realm';
import { StatusBar } from 'expo-status-bar';
import { Provider } from  'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';
import { CameraView } from './CameraView';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import _ from 'underscore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SingleFeedView, ClusterFeedView, getGeopicDataReady } from './FeedView';
import CachedImage from 'react-native-expo-cached-image';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Cluster = ({ numberOfGeopics, color }) => {
  return(
    <View style={{ display: 'flex', justiftyContent: 'center', alignItems: 'center' }}>
      <View style={{ marginBottom: 3 }}><Text style={{ color: 'red' }}>{numberOfGeopics}</Text></View>
      <FontAwesome5 style={{ marginBottom: 34 }}name="map-marker-alt" size={27} color={color} />
    </View>
  )
}

const DisplayMap = ({ sheetRef, setCurrentGeopic, setComments }) => {
    //const [mapShowing, setMapShowing] = useState(true);
    //const [geopicData, setGeopicData] = useState(null);
    const [geopicDataReady, setGeopicDataReady] = useState(false);
  //queryMongo();
    //setLocation();

    const navigation = useNavigation();
    
    
    
    const location = useSelector(state => state.userReducer);
    const geopics = useSelector(state => state.geopicsReducer);
    

    //console.log(geopics.geopics);

    //console.log(location.currentLocation.latitude);

    useEffect(() => {
      (async () => {
        if(geopics.geopics != null){
          geopics.geopics.map((geopic, index) => {
            return(
            <CachedImage source={{ uri: geopic.pic }} />
            )
          })
        }
      })();

    }, [geopics])

    console.log("refreshed");

    const greaterThan3Days = (geopic) => {
      const currentTime = new Date();
      const geopicTime = new Date(geopic.timestamp);
      const timeDifference = currentTime.getTime() - geopicTime.getTime();
      const threeDays = timeDifference / (1000 * 3600 * 24);
      if(threeDays >= 3){
        hideGeopic(geopic);
        return true;
      }else{
        return false;
      }
    }



    return (
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#222222' }}>
        {/*<NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{headerShown: false}} initialRoute="Map">
            <Stack.Screen title="Map" component={MapDisplay} />
            <Stack.Screen title="Camera" component={CameraView} />
          </Stack.Navigator>
        </NavigationContainer>*/}
        <MapView style={{ flex: 1, borderWidth: 1, borderColor: 'black', borderRadius: 15 }} initialRegion={
            {
              latitude: location.currentLocation.latitude,
              longitude: location.currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
          }>
              <Circle strokeWidth={0.5} fillColor={'rgba(0,0,0,0.1)'} radius={4830} center={
                {
                  latitude: location.currentLocation.latitude, 
                  longitude: location.currentLocation.longitude
                }
              } />
              {geopics.geopics != null ? geopics.geopics.map((geopic, index) => {
                //console.log(geopic.location.coordinates[0]);
                if(geopic.hidden === false && geopic.clustered === false && greaterThan3Days(geopic) === false && geopic.viewed === false){
                  return <Marker centerOffset={{x: 0, y: -20}} onPress={() => {navigation.navigate('singleView', {  geopic: geopic, sheetRef: sheetRef, setComments: setComments, setCurrentGeopic: setCurrentGeopic })}} key={index} coordinate={{ latitude: geopic.location.coordinates[1], longitude: geopic.location.coordinates[0] }} >
                            <Image source={require('./mapPin.png')} style={{ width: 15, height: 40 }}/>
                        </Marker>
                }else if(geopic.viewed) {
                  return <Marker centerOffset={{x: 0, y: -20}} onPress={() => {navigation.navigate('singleView', {  geopic: geopic, sheetRef: sheetRef, setComments: setComments, setCurrentGeopic: setCurrentGeopic })}} key={index} coordinate={{ latitude: geopic.location.coordinates[1], longitude: geopic.location.coordinates[0] }} >
                          <Image source={require('./mapPin.png')} style={{ width: 15, height: 40 }}/>
                        </Marker>
                }
              }) : console.log("no geopics to display")}
              {geopics.clusters != null ? geopics.clusters.map((cluster, index) => {
                //console.log(geopic.location.coordinates[0]);
                  if(cluster.viewed){
                    <Marker onPress={() => {navigation.navigate('scrollView', { cluster: cluster.geopics, sheetRef: sheetRef, setComments: setComments, setCurrentGeopic: setCurrentGeopic })}} key={index} coordinate={{ latitude: cluster.location.coordinates[1], longitude: cluster.location.coordinates[0] }} >
                      <Cluster color="pink" numberOfGeopics={cluster.numberOfGeopics} />
                    </Marker>
                  }
                  return (
                    <Marker onPress={() => {navigation.navigate('scrollView', { cluster: cluster.geopics, sheetRef: sheetRef, setComments: setComments, setCurrentGeopic: setCurrentGeopic })}} key={index} coordinate={{ latitude: cluster.location.coordinates[1], longitude: cluster.location.coordinates[0] }} >
                      <Cluster color="red" numberOfGeopics={cluster.numberOfGeopics} />
                    </Marker>
                  )
              }) : console.log("no clusters to display")}
              <StatusBar />
          </MapView>
          <TouchableOpacity style={{ padding: 0, justiftyContent: 'center', display: 'flex', alignItems: 'center', position: 'absolute',flex: 1, shadowOffset: {width: 0, height: 2}, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 2, top: '92%', left: '85%', width: 50, height: 50, backgroundColor: '#222222', borderRadius: 10 }} onPress={() => {navigation.navigate("Camera")}} >
              <Text style={{ fontSize: 50, color:  'turquoise', marginTop: -5 }}>+</Text>
          </TouchableOpacity>
      </View>
  )
}


export const Map = ({ sheetRef, setCurrentGeopic, setComments }) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }} initialRouteName="displayMap" >
      <Stack.Screen name="displayMap" children={() => <DisplayMap setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef}/>} />
      <Stack.Screen name="singleView" component={SingleFeedView} />
      <Stack.Screen name="scrollView" component={ClusterFeedView} />
      {/*<Stack.Screen name="singleView" children={() => <SingleFeedView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} />} />*/}
      {/*<Stack.Screen name="scrollView" children={() => <ClusterFeedView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} />} />*/}
    </Stack.Navigator> 
  )
}