import 'expo-dev-client';
import 'react-native-get-random-values';
import React from 'react';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import {Map} from './views/Map';
import {CameraView} from './views/CameraView';
//import {MainApp} from './MainApp'; 
import { View, Text } from 'react-native';

//import {MapView} from 'react-native-maps';

const App = () =>
  /*SYNC_CONFIG.enabled ? (
    <AppWrapperSync appId={SYNC_CONFIG.appId} />
  ) : (
    <AppWrapperNonSync />
  );*/
  (<Map />);
registerRootComponent(App);
