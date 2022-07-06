import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { geopicUpload, loginUser } from '../backend/realm';
import { setLocation } from '../backend/location';
import moment from 'moment';
import { Provider } from 'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';




export const CameraView = ({ navigation }) => {
    //call login user and setLocation hooks to set the redux variables
    //setLocation();

    //initialize hooks
    const location = useSelector(state => state.userReducer);
    //const user = useSelector(state => state.userReducer);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [picUrl, setPicUrl] = useState(null);

    //take a picture with camera and set the pic url and pic preview hooks
    const takePicture = async () => {
      console.log("working");
      if(camera){
        const pic = await camera.takePictureAsync({quality: 0.5});
        setPicUrl(pic.uri);
        setPreviewVisible(true);
        console.log("working");
      }
    }

    //upload the pic to firebase storage and mongodb
    const uploadGeopic = async () => {
      geopicUpload(picUrl, location);
    }

    //display the taken picture on the screen with options (upload, cancel, etc) 
    const CameraPreview = ({photo}: any) => {
      return (
        <View
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            width: '100%',
            height: '100%'
          }}
        >
          <ImageBackground
            source={{uri: photo}}
            style={{
              flex: 1
            }}
          >
              <TouchableOpacity onPress={uploadGeopic} style={{ flex: 1, width: '100%', height: '100%', right: 0, color: 'black', alignItems: 'flex-end' }}>
                <Text style={{ position: 'absolute', bottom: 0, marginBottom: 40, marginRight: 300, fontWeight: 'bold', fontSize: 15, color: 'blue' }}>upload</Text>
              </TouchableOpacity>
          </ImageBackground>
        </View>
      )
    }
  
    //ask the user for camera permissions
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
    //if they haven't answered, show nothing
    if (hasPermission === null) {
      return <View />;
    }
    //if they declined, tell them they can't access the camera
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    //show the camera screen
    return (
      <View style={{ flex: 1 }}>
      {previewVisible && picUrl ? (
        <CameraPreview photo={picUrl} />
        ) : (
        <View style={{ flex: 1 }}>
        <Camera  style={{ flex: 1 }}
          ref={(r) => {
            camera = r
          }}>
            <View
              style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between'
              }}
            >
            <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center' }}>

            </View>
          </View>
        </Camera>
          <TouchableOpacity 
                  style={{position: 'absolute',top: 50, borderRadius: 50, width: 50, height: 50, backgroundColor: 'fff' }}
                  onPress={takePicture} >
                  <Text style={{ color: 'white' }}>This is working</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Map')} style={{ width: 50, height: 50, position: 'absolute',bottom: 10, paddingLeft: 100 }}>
            <Text style={{ fontSize: 100, fontWeight: 'bold' }} >hello</Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
    );
};