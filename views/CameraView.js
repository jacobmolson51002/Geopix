import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, TextInput, View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { geopicUpload, loginUser } from '../backend/database';
import { setLocation } from '../backend/location';
import moment from 'moment';
import { Provider, useDispatch } from 'react-redux';
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
    borderRadius: 50, 
    width: 100, 
    height: 100, 
    backgroundColor: 'fff',
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
    marginTop: 100,
    marginBottom: 50
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
          <TouchableOpacity onPress={() => {navigation.navigate("reviewAndUpload", { url: picUrl })}} style={styles.uploadButtonContainer}>
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
        <View style={{ position: 'absolute', bottom: 30, width: '100%', display: 'flex', alignItems: 'center', justiftyContent: 'center' }}>
        <TouchableOpacity 
                style={styles.captureButtonContainer}
                onPress={takePicture} >
        </TouchableOpacity>
        </View>
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
    
      <KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black'}} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'space-around' }} >
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
  const dispatchData = useSelector(state => state.geopicsReducer);
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  
  //upload the pic to firebase storage and mongodb
  const { url } = route.params;

  const uploadGeopic = async () => {
    await geopicUpload({url: url, caption: caption}, location, dispatch, dispatchData);
    navigation.navigate('AppHome');
  }

  const backButton = "<-";
  return (
    <KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black'}} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }} >
          <Image style={{ width: '100%', height: '77%' }} source={{uri: url}} />
          <View style={{ width: '100%', height: '13%', backgroundColor: 'black', padding: 15 }} >
            <TextInput defaultValue={caption} onChangeText={newText => setCaption(newText)} placeholder="Enter caption..." placeholderTextColor='white' style={{ color:'white', fontSize: 15 }}/>
          </View> 
          <View style={{ width: '100%', height: '10%', backgroundColor: 'black' }} >
            <Button title="upload" onPress={uploadGeopic} style={{ margin: 20, color: 'turquoise' }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => {navigation.navigate("takePicture")}} style={styles.retakeButtonContainer}>
            <Text style={styles.retakeButton}>{backButton}</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
  )
}


export const CameraView = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="takePicture" >
        <Stack.Screen name="takePicture" component={TakePicture} />
        <Stack.Screen name="options" component={Options} />
        <Stack.Screen name="reviewAndUpload" component={ReviewAndUpload} />
      </Stack.Navigator>

    );
};