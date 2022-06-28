import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { geopicUpload, loginUser } from '../backend/realm';
import { setLocation } from '../backend/location';
import moment from 'moment';
import { Provider } from 'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';

//firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBDlW6U80c2hw-dR5Qz1v0fHejHE-V32zY",
  authDomain: "geopix-295e8.firebaseapp.com",
  projectId: "geopix-295e8",
  storageBucket: "geopix-295e8.appspot.com",
  messagingSenderId: "321768973307",
  appId: "1:321768973307:web:221f750a1b5418160c215e",
  measurementId: "G-5RNV8GVDJQ"
};


export const CameraView = ({ navigation }) => {
    //call login user and setLocation hooks to set the redux variables
    loginUser();
    setLocation();

    //initialize hooks
    const location = useSelector(state => state.userReducer);
    const user = useSelector(state => state.userReducer);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [picUrl, setPicUrl] = useState(null);

    //take a picture with camera and set the pic url and pic preview hooks
    const takePicture = async () => {
      if(camera){
        const pic = await camera.takePictureAsync({quality: 0.5});
        setPicUrl(pic.uri);
        setPreviewVisible(true);
      }
    }

    //upload the pic to firebase storage and mongodb
    const uploadGeopic = async () => {

      //get current time
      let currentTime = new Date();

      //initialize firebase and firebase storage
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      
  
      //create new blob to upload pic
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
    
        // on load
        xhr.onload = function () {
          resolve(xhr.response);
      };
          // on error
          xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
      };
          // on complete
          xhr.responseType = "blob";
          xhr.open("GET", picUrl, true);
          xhr.send(null);
      });
      
      //create the storage url for firebase storage
      const storageUrl = user.userID + '/' + currentTime;

      //define the storage reference
      const storageRef = ref(storage, storageUrl);
  
      //upload the pic to firebase storage
      const result = await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('succesfully uploaded pic');
      });

      //close the blob
      await blob.close();

      console.log(currentTime);

      //create the geopic object to store in the database
      const geopic = {
        'pic': storageUrl,
        'caption': 'test caption',
        'userID': user.userID,
        'username': 'jacobmolson',
        'votes': [0,0,0],
        'flags': [],
        'hidden': false,
        'comments': 0,
        'location': {
          'type': 'Point',
          'coordinates': [location.currentLocation.latitude, location.currentLocation.longitude]
        },
        'timestamp': `${currentTime}`,
        'views': 0,
        '_partition': 'geopics'
      }
      
      //call mongo to upload to the databse
      geopicUpload(geopic);

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
              <TouchableOpacity 
                style={{ bottom: 0, borderRadius: 50, width: 50, height: 50, backgroundColor: 'fff' }}
                onPress={takePicture} >
                <Text style={{ color: 'white' }}>This is working</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Map')} style={{ bottom: 10, paddingLeft: 100 }}>
                <Text style={{ fontSize: 100, fontWeight: 'bold' }} >hello</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
        )}
      </View>
    );
};