import { Realm } from '@realm/react';
import { userSchema } from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setGeopics } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocation } from './location';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from 'expo-location';
import { setCurrentLocation } from '../redux/actions';
import * as firebase from './firebaseConfig';

//initialize realm app
const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });

//initialize firebase app
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
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

/*const credentials = Realm.Credentials.emailPassword(
  "jacobmolson51002@gmail.com",
  "Qweruiop1535!"
); // LoggingIn as Anonymous User. */

//login anonymously
const credentials = Realm.Credentials.anonymous();

//function to login the user
export const logUserIn = async (email, password) => {
      //const dispatch = useDispatch();
      //login the user
      //const credentials = await Realm.Credentials.emailPassword("jacobmolson");
      const credentials = Realm.Credentials.emailPassword(
        email,
        password
      );
      try {
        const loggedInUser = await app.logIn(credentials);
        await AsyncStorage.setItem('userID', loggedInUser.id);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        return (
          "successful login"
        );
      } catch (e) {
        return (
          e
        );
      }
      

      console.log(loggedInUser);



      //set the redux userID variable
      //dispatch(setUserId(loggedInUser.id));
}

export const logUserOut = async () => {
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('userID');
    await AsyncStorage.removeItem('password');
}

export const registerUser = async (email, password) => {
    try {
      const registeredUser = await app.emailPasswordAuth.registerUser({ email, password });
      logUserIn(email, password);
      return (
        "successful register"
      );

    } catch (e) {
      return (
        e
      );
    }
    

    
}

export const getGeopics = async () => {
    const dispatch = useDispatch();
    useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              console.log("error")
          return;
          }
  
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low, distanceInterval: 0, timeInterval: 500 });
          //setLocation(location);
          //locationSet = true;
          dispatch(setCurrentLocation(location.coords));
          console.log(location);

          const mongodb = app.currentUser.mongoClient('mongodb-atlas');
          const geopics = mongodb.db('geopics').collection('public');
          const nearbyGeopics = await geopics.find({"location": { $near: { $geometry: { type: "Point", coordinates: [location.coords.longitude, location.coords.latitude] }, $maxDistance: 11270}}});
          /*
          nearbyGeopics = [

          ]*/
            
          dispatch(setGeopics(nearbyGeopics));
          
      })();
      }, []);

}

//function to write a geopic to mongo
export const geopicUploadMongo = async (queryString) => {

  //connect to databse with credentials
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  //upload using the passes queryString object
  const upload = await geopics.insertOne(queryString);
  //dispatch(setGeopics(upload));
  //console.log(upload);
}

export const geopicUpload = async (geopicInfo, location) => {

      //get current time
      let currentTime = new Date();

      //initialize firebase and firebase storage
      const userID = await AsyncStorage.getItem('userID');
      
      
  
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
          xhr.open("GET", geopicInfo.url, true);
          xhr.send(null);
      });
      
      //create the storage url for firebase storage
      const storageUrl = userID + '/' + currentTime;

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
        'caption': geopicInfo.caption,
        'userID': userID,
        'username': 'jacobmolson',
        'votes': [0,0,0],
        'flags': [],
        'hidden': false,
        'comments': 0,
        'location': {
          'type': 'Point',
          'coordinates': [location.currentLocation.longitude, location.currentLocation.latitude]
        },
        'timestamp': `${currentTime}`,
        'views': 0,
        '_partition': 'geopics'
      }

      geopicUploadMongo(geopic);
      
      //call mongo to upload to the databse
}

export const openRealm = async () => {
    const partition = app.currentUser.id;
    const config = {
      schema: [userSchema],
      sync: {
        user: app.currentUser,
        partitionValue: partition
      }
    }
    try {
      const realm = await Realm.open(config);
      
      const userInfo = await realm.objects("info");


      /*realm.write(() => {
          const id = new Realm.BSON.ObjectID();
          newUser = realm.create("info", {_id: id, _partition: partition, email: "test", password: "test", geocash: 40, profilePic: 'link', userID: 'id', username: 'jacobmolson'})
      });*/
      
      console.log(userInfo);


      realm.close();
    } catch (err) {
      console.error("failed to open realm", err.message);
    }
}

/*
export const getRealm = () => {
  // MongoDB RealmConfiguration
  const configuration = {
    schema: [UserSchema], // add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };

  //return Realm.open(configuration);
}*/