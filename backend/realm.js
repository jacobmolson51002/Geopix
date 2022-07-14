import { Realm } from '@realm/react';
import { userSchema , viewedSchema} from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setGeopics, setClusters, addGeopic, addCluster, updateGeopic } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocation } from './location';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from 'expo-location';
import { setCurrentLocation } from '../redux/actions';

//initialize realm app
export const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });




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

export const geopicViewed = async (id) => {
  const configuration = {
    schema: [viewedSchema]
  }
  const localRealm = await Realm.open(configuration);
  let newViewedObject;
  localRealm.write(async () => {
    newViewedObject = localRealm.create('viewed', { viewedObjectID: id, vote: 0 });
  })
}

export const getViewedGeopicsList = async (geopics) => {
  const configuration = {
    schema: [viewedSchema]
  }
  const localRealm = await Realm.open(configuration);
  geopics.map((geopic) => {
    const checkForView = localRealm.objectForPrimaryKey('viewed', geopic._id);
    if(checkForView != null){
      geopic.viewed = true;
    }else{
      geopic.viewed = false;
    }
  });
  localRealm.close();
  return geopics;
}

/*
export const getRealm = () => {
  // MongoDB RealmConfiguration
  const configuration = {
    schema: [UserSchema], [viewedSchema]// add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };

  //return Realm.open(configuration);
}*/