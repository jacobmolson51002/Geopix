import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, TextInput, View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Button } from 'react-native';
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
  const [buttonClicked, setButtonClicked] = useState(false);
  
  //upload the pic to firebase storage and mongodb
  const { url } = route.params;

  const uploadGeopic = async () => {
    console.log('buttonClicked');
    setButtonClicked(true);
    await geopicUpload({url: url, caption: caption}, location, dispatch, dispatchData).then(() => {
      console.log('uploaded');
      setButtonClicked(false);
      navigation.navigate('AppHome');
    });
    
  }

  console.log('rerendered');

  const backButton = "<-";
  const styles = {
      bottomBox: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 5,
        flexDirection: 'row',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
      },
      captionBox: {
        width: '75%'
      },
      captionTextBox: {
          flexDirection: 'row',
          width: '100%',
          flex: 1,
          marginBottom: 5,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: {width: -1, height: 1},
          textShadowRadius: 10
      },
      captionText: {
          fontSize: 15,
          color: 'white',
          flexWrap: 'wrap',
          paddingLeft: 15,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: {width: -1, height: 1},
          textShadowRadius: 10
      },
      geopicInfo: { 
          fontWeight: 'bold', 
          color: 'white', 
          paddingTop: 5,
          paddingLeft: 15,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: {width: -1, height: 1},
          textShadowRadius: 10
      },
      viewCommentsButton: {
          color: 'white',
          paddingBottom: 10,
          paddingLeft: 15,
          textShadowColor: 'rgba(0, 0, 0, 1)',
          textShadowOffset: {width: -1, height: 1},
          textShadowRadius: 5
      },
      uploadButton: {
        width: '90%',
        height: '65%',
        borderRadius: 10,
        backgroundColor: 'turquoise',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      navSimulator: {
        width: '100%', 
        height: '10%',
        backgroundColor: '#222222',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 10
      },
      retakeButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 20
      },
      retakeButton: {
        color: 'white',
        fontSize: 20
      }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#222222'}} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={{ width: '100%', height: '90%'}} >
          <Image style={{ width: '100%', height: '100%' }} source={{uri: url}} />
          <View style={styles.bottomBox} >
              <View  style={styles.captionBox}>
                  <Text style={styles.geopicInfo}><View style={{ margin: 0,padding: 0 }}><Text style={styles.geopicInfo}>jacobmolson</Text></View><View style={{ margin: 0,padding:0 }}><Text style={styles.geopicInfo}>•    now</Text></View></Text>
                  <View style={styles.captionTextBox} ><TextInput value={caption} onChangeText={newText => setCaption(newText)} placeholder="Enter caption..." placeholderTextColor='white' style={styles.captionText}/></View>
                  <View ><Text style={styles.viewCommentsButton}>0 comments</Text></View>
              </View>
          </View>
        </View>
        <View style={styles.navSimulator} >
          <TouchableOpacity onPress={uploadGeopic} style={styles.uploadButton} >
              {buttonClicked === false ? (
                <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Upload to Geopix</Text>
              ) : (
                <ActivityIndicator size='small' color="#222222" />
              )}
          </TouchableOpacity>
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