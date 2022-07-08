import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, TextInput, View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { geopicUpload, loginUser } from '../backend/realm';
import { setLocation } from '../backend/location';
import moment from 'moment';
import { Provider } from 'react-redux';
import { Store } from '../redux/store';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import LinearGradient from 'react-native-linear-gradient';
//import { Icon } from 'react-native-elements'



const styles = StyleSheet.create({
  backButtonContainer: {
    backgroundColor: 'none',
    color: 'white',
    position: 'absolute',
    top: 70,
    left: 15
  },
  backButton: {
    color: 'white'
  },
  captureButtonContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    display: 'flex', 
    position: 'absolute', 
    bottom: 30, 
    borderRadius: 50, 
    width: 100, 
    height: 100, 
    backgroundColor: 'fff',
    left: '40%',
    borderWidth: 6,
    borderColor: 'white'
  },
  uploadButtonContainer: {
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
  uploadButton: {
    color: 'turquoise',
    fontSize: 30
  },
  retakeButton: {
    color: 'white',
    fontSize: 25
  },
  retakeButtonContainer: {
    position: 'absolute',
    top: 70,
    left: 15
  },
  captionBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    width: '90%',
    marginLeft: '5%',
    padding: 15,
    fontSize: 20,
    color: 'white',
    marginTop: 100
  },
  optionsPreviewImage: {
    width: 'auto',
    height: 500,
    marginTop: 100,
  }
})


const TakePicture = ({ navigation }) => {

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
          <TouchableOpacity onPress={() => {navigation.navigate("options", { url: picUrl })}} style={styles.uploadButtonContainer}>
            <Text style={styles.uploadButton}>-></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setPreviewVisible(false);}} style={styles.retakeButtonContainer}>
            <Text style={styles.retakeButton}>X</Text>
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

    return (
      <View style={{ flex: 1 }}>
      {previewVisible ? (
        <CameraPreview photo={picUrl} />
        ) : (
        <View style={{ flex: 1 }}>
        <Camera  style={{ flex: 1 }}
          ref={(r) => {
            camera = r
          }}>
        </Camera>
        <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.backButtonContainer}>
          <Text style={styles.backButton} ><Ionicons name="chevron-back" size={24} color="white" /></Text>
        </TouchableOpacity>
        <TouchableOpacity 
                style={styles.captureButtonContainer}
                onPress={takePicture} >
        </TouchableOpacity>

        </View>
        )}
      </View>
    )
}

const Options = ({ route, navigation }) => {
  const [caption, setCaption] = useState("");
  const { url } = route.params;
  console.log(url);
  return(
      <KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black'}} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
          <Image style={styles.optionsPreviewImage} source={{uri: url}} />
          <TextInput defaultValue={caption} onChangeText={newText => setCaption(newText)} placeholder="caption" style={styles.captionBox}/>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={() => {navigation.navigate("reviewAndUpload", { url: url, caption: caption })}} style={styles.uploadButtonContainer}>
          <Text style={styles.uploadButton}>-></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    
  )
}

const ReviewAndUpload = ({ route, navigation }) => {
  const location = useSelector(state => state.userReducer);
  //upload the pic to firebase storage and mongodb
  const uploadGeopic = async () => {
    geopicUpload({url: url, caption: caption}, location);
  }
  const { url, caption } = route.params;
  return (
    <View style={{ flex: 1 }} >
      <Image style={{ width: '100%', height: '80%' }} source={{uri: url}} />
      <View style={{ width: '100%', height: '10%', backgroundColor: 'gray', padding: 15 }} >
        <Text style={{ fontSize: 20, color: 'white' }}>{caption}</Text>
      </View> 
      <View style={{ width: '100%', height: '10%', backgroundColor: 'black' }} >
        <Button title="upload" onPress={uploadGeopic} style={{ margin: 20, color: 'turquoise' }} />
      </View>
    </View>
  )
}


export const CameraView = ({ navigation }) => {
    //call login user and setLocation hooks to set the redux variables
    //setLocation();
    const Stack = createNativeStackNavigator();

    //initialize hooks
    
    //const user = useSelector(state => state.userReducer);

    const [editVisible, setEditVisible] = useState(false);
    
    
    const backButton = '<';



    const EditView = () => {
      const backButton = "<-";
      return (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: picUrl }} style={{ width: '100%', height: '100%',flex: 1, position: 'absolute' }} />
          <TouchableOpacity onPress={() => {setEditVisible(false); setPreviewVisible(true)}} style={styles.retakeButtonContainer}>
            <Text style={styles.retakeButton}>{backButton}</Text>
          </TouchableOpacity>
          <ScrollView style={{ flex: 1, width: '100%', height: '100%', position: 'absolute' }}>
            <View style={{ width: '100%', height: '85%' }} ><Text>something</Text></View>
            <TextInput style={{ width: '100%', height: '15%', backgroundColor: 'blue' }} />
          </ScrollView>

        </View>
        
        
      )
    }
  

    //show the camera screen
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="takePicture" >
        <Stack.Screen name="takePicture" component={TakePicture} />
        <Stack.Screen name="options" component={Options} />
        <Stack.Screen name="reviewAndUpload" component={ReviewAndUpload} />
      </Stack.Navigator>

    );
};