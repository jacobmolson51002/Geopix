import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export const CameraView = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
  
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
      return (
        <View style={{ flex: 1 }}>
          <Camera type={type} style={{ flex: 1 }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }}>
                <Text> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
};