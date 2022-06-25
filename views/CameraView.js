import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDlW6U80c2hw-dR5Qz1v0fHejHE-V32zY",
  authDomain: "geopix-295e8.firebaseapp.com",
  projectId: "geopix-295e8",
  storageBucket: "geopix-295e8.appspot.com",
  messagingSenderId: "321768973307",
  appId: "1:321768973307:web:221f750a1b5418160c215e",
  measurementId: "G-5RNV8GVDJQ"
};


export const CameraView = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [picUrl, setPicUrl] = useState(null);

    const takePicture = async () => {
      if(camera){
        const pic = await camera.takePictureAsync({quality: 0.5});
        setPicUrl(pic.uri);
        setPreviewVisible(true);
      }
    }


    const uploadPic = async () => {
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      
  
      //const file = new Blob([picUrl], {type: 'image'});
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
      
  
      const storageRef = ref(storage, 'test/testimage.png');
  
      const result = await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      await blob.close();

    }


    const CameraPreview = ({photo}: any) => {
      console.log('sdsfds', photo)
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
              <TouchableOpacity onPress={uploadPic} style={{ flex: 1, width: '100%', height: '100%', right: 0, color: 'black', alignItems: 'flex-end' }}>
                <Text style={{ position: 'absolute', bottom: 0, marginBottom: 40, marginRight: 300, fontWeight: 'bold', fontSize: 15, color: 'blue' }}>upload</Text>
              </TouchableOpacity>
          </ImageBackground>
        </View>
      )
    }
  
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
              </View>
            </View>
          </Camera>
          )}
        </View>
      );
};