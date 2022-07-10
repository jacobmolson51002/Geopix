import { Realm } from '@realm/react';
import { userSchema } from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setGeopics, setClusters, addGeopic, addCluster, updateGeopic } from '../redux/actions';
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

          //query for geopics
          const geopics = mongodb.db('geopics').collection('public');
          const nearbyGeopics = await geopics.find({clustered: false, "location": { $near: { $geometry: { type: "Point", coordinates: [location.coords.longitude, location.coords.latitude] }, $maxDistance: 11270}}});
          nearbyGeopics.reverse();
          //query for clusters
          const clusters = mongodb.db('geopics').collection('clusters');
          const nearbyClusters = await clusters.find({"location": { $near: { $geometry: { type: "Point", coordinates: [location.coords.longitude, location.coords.latitude] }, $maxDistance: 11270}}});
          nearbyClusters.map(async (cluster, index) => {
              const geopicsInCluster = await geopics.find({clusterID: cluster._id}).then((data) => {
              cluster.geopics = data.reverse();
            });
          })
          
          /*
          nearbyGeopics = [

          ]*/
          
          dispatch(setGeopics(nearbyGeopics));
          dispatch(setClusters(nearbyClusters));
          
      })();
      }, []);

}

export const deleteManyGeopics = async () => {
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const geopics = mongodb.db('geopics').collection('public');

  const result = await geopics.deleteMany({_partition: 'geopics'});
  console.log(result);
}

export const uploadManyGeopics = async (location, num) => {
  //connect to databse with credentials
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');

  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  const clusters = mongodb.db('geopics').collection('clusters');
  for(let i = 0; i < num; i++){

    let longitude = String(location.currentLocation.longitude).slice("");
    let latitude = String(location.currentLocation.latitude).slice("");

    //console.log(longitude);
    //console.log(latitude);
    //console.log("space");
  
    let newLatitude = "";
    let newLongitude = "";
  
    for(let i = 0; i < longitude.length; i++){
      if( i === longitude.length-12 || i === longitude.length-11 || i === longitude.length-10 || i === longitude.length-9 || i === longitude.length-8 || i === longitude.length-7 || i === longitude.length-6 || i === longitude.length-5 || i === longitude.length-4 || i === longitude.length-3 || i === longitude.length-2 || i === longitude.length-1){
        newLongitude += String(Math.floor(Math.random() * 9));
      }else{
        newLongitude += longitude[i];
      }
    }
    for(let i = 0; i < latitude.length; i++){
      if( i == latitude.length-11 || i == latitude.length-10 || i == latitude.length-9 || i == latitude.length-8 || i == latitude.length-7 || i == latitude.length-6 || i == latitude.length-5 || i == latitude.length-4 || i == latitude.length-3 || i == latitude.length-2 || i == latitude.length-1){
        newLatitude += String(Math.floor(Math.random() * 9));
      }else{
        newLatitude += latitude[i];
      }
    }

    latitude = parseFloat(newLatitude);
    longitude = parseFloat(newLongitude);

    //console.log(longitude);
    //console.log(latitude);
    

    const caption = 'funny caption';
    const currentTime = new Date();

    const queryString = {
      'clusterID': '',
      'pic': 'https://firebasestorage.googleapis.com/v0/b/geopix-295e8.appspot.com/o/62b3a20db7a838d899253844%2FSat%20Jul%2009%202022%2009%3A08%3A38%20GMT-0500%20(CDT)?alt=media&token=6dd10eb0-2b8f-4082-b37c-a41802461974',
      'caption': caption,
      'userID': '62b3a20db7a838d899253844',
      'username': 'jacobmolson',
      'votes': [0,0,0],
      'flags': [],
      'hidden': false,
      'comments': 0,
      'location': {
        'type': 'Point',
        'coordinates': [longitude, latitude]
      },
      'timestamp': `${currentTime}`,
      'views': 0,
      'clustered': false,
      '_partition': 'geopics'
    }

    const nearbyGeopics = await geopics.find({clustered: false, "location": { $near: { $geometry: { type: "Point", coordinates: [longitude, latitude] }, $maxDistance: 25}}});
    const nearbyClusters = await clusters.find({"location": { $near: { $geometry: { type: "Point", coordinates: [longitude, latitude] }, $maxDistance: 25}}});
    
    //console.log(nearbyGeopics);
    //console.log(nearbyClusters);

    if (nearbyGeopics.length >= 1) {
      if(nearbyClusters.length >= 1){
        console.log("geopics and clusters nearby");


        queryString.clustered = true;
        queryString.clusterID = nearbyClusters[0]._id;

        const updateClusterNumber = await clusters.updateOne({_id: nearbyClusters[0]._id}, {$set: {numberOfGeopics: nearbyClusters[0].numberOfGeopics+2, mostRecentGeopic: queryString}});

        const updateNearbyGeopic = await geopics.updateOne({_id: nearbyGeopics[0]._id}, {$set: {clustered: true, clusterID: nearbyClusters[0]._id}});

        const uploadClusteredGeopic = await geopics.insertOne(queryString);

      }else{

        console.log("creating new cluster");
        //creating new cluster
        //const clusterCoordinate = [(queryString.location.coordinates[0]) + (nearbyGeopics[0].location.coordinates[0]) / 2.0, (queryString.location.coordinates[1]) + (nearbyGeopics[0].location.coordinates[1]) / 2.0];

        const cluster = {
          location: {type: "Point", coordinates: queryString.location.coordinates},
          mostRecentGeopic: queryString,
          numberOfGeopics: 2
        }
        const newCluster = await clusters.insertOne(cluster);

        queryString.clustered = true;
        queryString.clusterID = newCluster.insertedId;


        const updateNearbyGeopic = await geopics.updateOne({_id: nearbyGeopics[0]._id}, {$set: {clustered: true, clusterID: newCluster.insertedId}});

        const uploadClusteredGeopic = await geopics.insertOne(queryString);

        /*newDispatchGeopics.map((geopic, index) => {
          if(geopic._id === nearbyGeopics[0]._id){
            console.log('geopic found');
            geopic.clustered = true
            geopic.clusterID = nearbyClusters[0]._id;
          }
        });*/

      }
    } else if(nearbyClusters.length >= 1){
      console.log("only cluster nearby");

      queryString.clustered = true;
      queryString.clusterID = nearbyClusters[0]._id;

      const updateClusterNumber = await clusters.updateOne({_id: nearbyClusters[0]._id}, {$set: {numberOfGeopics: nearbyClusters[0].numberOfGeopics+1, mostRecentGeopic: queryString}});

      const uploadClusteredGeopic = await geopics.insertOne(queryString);

    } else{
      console.log("doing the normal thing");
      const upload = await geopics.insertOne(queryString);
    }
  }
  //upload using the passes queryString object

  //console.log(upload);
}

//function to write a geopic to mongo
export const geopicUploadMongo = async (queryString, dispatch, dispatchData, url, location) => {
  //connect to databse with credentials
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  const clusters = mongodb.db('geopics').collection('clusters');

  const nearbyGeopics = await geopics.find({clustered: false, "location": { $near: { $geometry: { type: "Point", coordinates: [location.currentLocation.longitude, location.currentLocation.latitude] }, $maxDistance: 25}}});
  const nearbyClusters = await clusters.find({"location": { $near: { $geometry: { type: "Point", coordinates: [location.currentLocation.longitude, location.currentLocation.latitude] }, $maxDistance: 25}}});
  
  //console.log(nearbyGeopics);
  //console.log(nearbyClusters);

  if (nearbyGeopics.length >= 1) {
    if(nearbyClusters.length >= 1){
      console.log("geopics and clusters nearby");


      queryString.clustered = true;
      queryString.clusterID = nearbyClusters[0]._id;

      const updateClusterNumber = await clusters.updateOne({_id: nearbyClusters[0]._id}, {$set: {numberOfGeopics: nearbyClusters[0].numberOfGeopics+2, mostRecentGeopic: queryString}});

      const updateNearbyGeopic = await geopics.updateOne({_id: nearbyGeopics[0]._id}, {$set: {clustered: true, clusterID: nearbyClusters[0]._id}});

      const uploadClusteredGeopic = await geopics.insertOne(queryString);

      newDispatchClusters = dispatchData.clusters;

      newDispatchClusters.map((cluster, index) => {
        if(cluster._id === nearbyClusters[0]._id){
          cluster.numberOfGeopics = cluster.numberOfGeopics + 2;
          cluster.mostRecentGeopic = queryString;
          cluster.geopics.push(queryString, nearbyGeopics[0]);
        }
      });
      dispatch(setClusters(newDispatchClusters));

      newDispatchGeopics = dispatchData.geopics;

      newDispatchGeopics.map((geopic, index) => {
        if(geopic._id === nearbyGeopics[0]._id){
          geopic.clustered = true
          geopic.clusterID = nearbyClusters[0]._id;
        }
      });

      dispatch(setGeopics(newDispatchGeopics));
      dispatch(addGeopic(queryString));

    }else{

      console.log("creating new cluster");
      //creating new cluster
      //const clusterCoordinate = [(queryString.location.coordinates[0]) + (nearbyGeopics[0].location.coordinates[0]) / 2.0, (queryString.location.coordinates[1]) + (nearbyGeopics[0].location.coordinates[1]) / 2.0];

      const cluster = {
        location: {type: "Point", coordinates: queryString.location.coordinates},
        mostRecentGeopic: queryString,
        numberOfGeopics: 2
      }
      const newCluster = await clusters.insertOne(cluster);

      queryString.clustered = true;
      queryString.clusterID = newCluster.insertedId;


      const updateNearbyGeopic = await geopics.updateOne({_id: nearbyGeopics[0]._id}, {$set: {clustered: true, clusterID: newCluster.insertedId}});

      const uploadClusteredGeopic = await geopics.insertOne(queryString);

      cluster.geopics = [queryString, nearbyGeopics[0]];

      dispatch(addCluster(cluster));

      /*newDispatchGeopics.map((geopic, index) => {
        if(geopic._id === nearbyGeopics[0]._id){
          console.log('geopic found');
          geopic.clustered = true
          geopic.clusterID = nearbyClusters[0]._id;
        }
      });*/



      dispatch(updateGeopic({geopic: nearbyGeopics[0], clusterID: newCluster.insertedId}));
      dipatch(addGeopic(queryString));

    }
  } else if(nearbyClusters.length >= 1){
    console.log("only cluster nearby");

    queryString.clustered = true;
    queryString.clusterID = nearbyClusters[0]._id;

    const updateClusterNumber = await clusters.updateOne({_id: nearbyClusters[0]._id}, {$set: {numberOfGeopics: nearbyClusters[0].numberOfGeopics+1, mostRecentGeopic: queryString}});

    const uploadClusteredGeopic = await geopics.insertOne(queryString);

    newDispatchClusters = dispatchData.clusters;

    newDispatchClusters.map((cluster, index) => {
      if(cluster._id === nearbyClusters[0]._id){
        cluster.numberOfGeopics = cluster.numberOfGeopics + 1;
        cluster.mostRecentGeopic = queryString;
        cluster.geopics.push(queryString);
      }
    });
    dispatch(setClusters(newDispatchClusters));

    dispatch(addGeopic(queryString));

  } else{
    console.log("doing the normal thing");
    const upload = await geopics.insertOne(queryString);
    //dispatch(setGeopics(upload));
    const addGeopicString = queryString;
    addGeopicString.url = url;
    dispatch(addGeopic(addGeopicString));
  }
  //upload using the passes queryString object

  //console.log(upload);
}

export const geopicUpload = async (geopicInfo, location, dispatch, dispatchData) => {

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
      await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('succesfully uploaded pic');
      });

      const result = await getDownloadURL(storageRef);

      //close the blob
      await blob.close();

      console.log(currentTime);


      //create the geopic object to store in the database
      const geopic = {
        'clusterID': '',
        'pic': result,
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
        'clustered': false,
        '_partition': 'geopics'
      }

      geopicUploadMongo(geopic, dispatch, dispatchData, geopicInfo.url, location);
      
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

export const hideGeopic = async (geopic) => {
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  await geopics.updateOne({_id: geopic._id}, {$set: {hidden: true}});
}

export const getComments = async (id) => {
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const allComments = mongodb.db('geopics').collection('comments');
  const comments = await allComments.find({geopicID: id});
  console.log(comments);
  return(comments);
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