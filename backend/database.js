import { Realm } from '@realm/react';
import { userSchema } from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation, setUserId, setGeopics, setClusters, addGeopic, addCluster, updateGeopic, setFriendGeopics } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocation } from './location';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from 'expo-location';
import { app, getViewedGeopicsList, addNewFriend, addPendingFriend, getUserInfo } from './realm';
import {ObjectId} from 'bson';

//export const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });


//initialize database stuff
const mongodb = app.currentUser.mongoClient('mongodb-atlas');

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

export const getGeopics = async () => {
    console.log('getGeopics');
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
          const nearbyGeopics = await geopics.find({clustered: false, "location": { $near: { $geometry: { type: "Point", coordinates: [location.coords.longitude, location.coords.latitude] }, $maxDistance: 4830}}});
          const viewedGeopicsList = await getViewedGeopicsList(nearbyGeopics);
          geopicsToDisplay = [];
          viewedGeopicsList.map((geopic) => {
            if(!greaterThan3Days(geopic.timestamp)){
              geopicsToDisplay.unshift(geopic)
            }else{
              geopics.updateOne({_id: geopic._id}, {$set: {hidden: true}});
            }
          })
          //viewedGeopicsList.reverse();
          //query for clusters
          const clusters = mongodb.db('geopics').collection('clusters');
          const nearbyClusters = await clusters.find({"location": { $near: { $geometry: { type: "Point", coordinates: [location.coords.longitude, location.coords.latitude] }, $maxDistance: 4830}}});
          nearbyClusters.map(async (cluster, index) => {
              const geopicsInCluster = await geopics.find({clusterID: cluster._id})
              const viewedGeopicsInCluster = await getViewedGeopicsList(geopicsInCluster).then((data) => {
                let geopicsDisplay = [];
                let viewedCount = 0
                data.map((geopic) => {
                  if(!greaterThan3Days(geopic.timestamp)){
                    geopicsDisplay.unshift(geopic)
                  }else{
                    geopics.updateOne({_id: geopic._id}, {$set: {hidden: true}});
                  }
                  if(geopic.viewed == true){
                    viewedCount = viewedCount + 1;
                  }
                })
                const length = geopicsDisplay.length;
                cluster.numberOfGeopics = length;
                if(length == viewedCount){
                  cluster.viewed = true;
                }
                cluster.geopics = geopicsDisplay;
                clusters.updateOne({_id: cluster._id}, {$set: {numberOfGeopics: geopicsDisplay.length}});
            });
          })
          
          /*
          nearbyGeopics = [

          ]*/
          
          dispatch(setGeopics(geopicsToDisplay));
          dispatch(setClusters(nearbyClusters));
          
      })();
      }, []);

}

export const deleteManyGeopics = async () => {
  console.log('deleteManyGeopics');
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const geopics = mongodb.db('geopics').collection('public');

  const result = await geopics.deleteMany({_partition: 'geopics'});
  console.log(result);
}

export const uploadManyGeopics = async (location, num) => {
  console.log('uploadManyGeopics');
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
      'pic': 'https://firebasestorage.googleapis.com/v0/b/geopix-295e8.appspot.com/o/62b3a20db7a838d899253844%2FWed%20Jul%2013%202022%2006%3A38%3A35%20GMT-0500%20(CDT)?alt=media&token=f34482b5-4d95-45d6-96b3-296f1e2658c1',
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
  console.log('geopicUploadMongo');
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
      console.log('clusters set');
      dispatch(setClusters(newDispatchClusters));

      newDispatchGeopics = dispatchData.geopics;

      newDispatchGeopics.map((geopic, index) => {
        if(geopic._id === nearbyGeopics[0]._id){
          geopic.clustered = true
          geopic.clusterID = nearbyClusters[0]._id;
        }
      });

      console.log('geopics set');
      dispatch(setGeopics(newDispatchGeopics));
      console.log('addGeopic called');
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


      let geopicDispatchData = dispatchData.geopics;

      let newGeopicDispatch = [];
      console.log(newGeopicDispatch);
      geopicDispatchData.map((geopic) => {
        console.log(geopic._id);
        console.log(nearbyGeopics[0]._id);
        if(geopic._id === nearbyGeopics[0]._id){
          newGeopicDispatch.push(geopic);
        }
      })
      console.log(newGeopicDispatch);
      dispatch(setGeopics(newGeopicDispatch));
      dispatch(addGeopic(queryString));

    }
  } else if(nearbyClusters.length >= 1){
    console.log("only cluster nearby");

    queryString.clustered = true;
    queryString.clusterID = nearbyClusters[0]._id;

    const updateClusterNumber = await clusters.updateOne({_id: nearbyClusters[0]._id}, {$set: {numberOfGeopics: nearbyClusters[0].numberOfGeopics+1, mostRecentGeopic: queryString}});

    const uploadClusteredGeopic = await geopics.insertOne(queryString);

    let dispatchClusters = dispatchData.clusters;
    let newDispatchClusters = [];

    dispatchClusters.map((cluster, index) => {
      if(cluster._id !== nearbyClusters[0]._id){
        let newDispatchCluster = cluster;
        newDispatchCluster.numberOfGeopics = cluster.numberOfGeopics + 1;
        newDispatchCluster.mostRecentGeopic = queryString;
        newDispatchCluster.geopics.push(queryString);
        newDispatchClusters.push(newDispatchCluster);
      }
    });
    dispatch(setClusters(newDispatchClusters));

    //dispatch(addGeopic(queryString));

  } else{
    console.log("doing the normal thing");
    const upload = await geopics.insertOne(queryString);
    //dispatch(setGeopics(upload));
    const addGeopicString = queryString;
    addGeopicString.url = url;
    addGeopicString.viewed = false;
    dispatch(addGeopic(addGeopicString));
  }
  //upload using the passes queryString object

  //console.log(upload);
}

export const getPic = async (url, userID) => {
  let currentTime = new Date();
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
      xhr.open("GET", url, true);
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

  await blob.close();

  const result = await getDownloadURL(storageRef);

  return result;

  //close the blob
  
}

export const geopicUpload = async (geopicInfo, userReducer, dispatch, dispatchData) => {
      console.log('geopicUpload');

      //get current time
      let currentTime = new Date();

      //initialize firebase and firebase storage
      const userID = await AsyncStorage.getItem('userID');

      const result = await getPic(geopicInfo.url, userID);

      console.log(currentTime);

      const username = await AsyncStorage.getItem('username');
      //create the geopic object to store in the database
      const geopic = {
        'clusterID': '',
        'pic': result,
        'caption': geopicInfo.caption,
        'userID': userID,
        'username': username,
        'votes': [0,0,0],
        'flags': [],
        'hidden': false,
        'comments': 0,
        'location': {
          'type': 'Point',
          'coordinates': [userReducer.currentLocation.longitude, userReducer.currentLocation.latitude]
        },
        'timestamp': `${currentTime}`,
        'views': 0,
        'clustered': false,
        '_partition': 'geopics'
      }

      geopicUploadMongo(geopic, dispatch, dispatchData, geopicInfo.url, userReducer);
      
      //call mongo to upload to the databse
}

export const openRealm = async () => {
    console.log('openRealm');
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
  console.log('hideGeopics');
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  await geopics.updateOne({_id: geopic._id}, {$set: {hidden: true}});
}

export const getComments = async (id) => {
  console.log('getComments');
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const allComments = mongodb.db('geopics').collection('comments');
  const comments = await allComments.find({geopicID: id});
  console.log(comments);
  return(comments);
}

export const addComment = async (commentToAdd, geopic) => {
  console.log('addComment');
  const allComments = mongodb.db('geopics').collection('comments');
  const geopics = mongodb.db('geopics').collection('public');

  const addedComment = await allComments.insertOne(commentToAdd);
  commentToAdd._id = addedComment.insertedId;
  commentToAdd.viewed = false;
  commentToAdd.vote = 0;
  await geopics.updateOne({_id: geopic._id}, {$set: {comments: geopic.comments+1}})
  return commentToAdd
}

export const deleteComments = async () => {
  const allComments = mongodb.db('geopics').collection('comments');
  await allComments.deleteMany({username: 'jacobmolson'});

}

export const vote = async (object, vote) => {
  console.log('vote');
  console.log(object.votes);
  console.log(vote);
  let connection;
  const users = mongodb.db('users').collection('info');
  if(object.pic != null){
    connection = mongodb.db('geopics').collection('public');
    let newVotes = object.votes;
    if(vote > 0){
        newVotes[0] = newVotes[0]+vote;
        newVotes[2] = newVotes[2]+vote;
        await connection.updateOne({_id: object._id}, {$set: {votes: newVotes}});
    }else{
        newVotes[1] = newVotes[0]+vote;
        newVotes[2] = newVotes[2]-vote;
        await connection.updateOne({_id: object._id}, {$set: {votes: newVotes}});
    }
  }else{
    connection = mongodb.db('geopics').collection('comments');
    let newVotes = object.votes;
    if(vote > 0){
        newVotes[0] = newVotes[0]+vote;
        newVotes[2] = newVotes[2]+vote;
        await connection.updateOne({_id: object._id}, {$set: {votes: newVotes}});
    }else{
        newVotes[1] = newVotes[1]+vote;
        newVotes[2] = newVotes[2]+vote;
        await connection.updateOne({_id: object._id}, {$set: {votes: newVotes}});
    }
  }
  const user = await users.findOne({username: object.username});
  await users.updateOne({username: object.username}, {$set: {geocash: user.geocash + vote}});
}

export const getTime = (timestamp) => {
  console.log('getTime');
  const currentDateTime = new Date();
  const geopicDateTime = new Date(timestamp);
  const timeDifference = currentDateTime.getTime() - geopicDateTime.getTime();
  let displayTime = timeDifference / (86400000);
  let units = Math.floor(displayTime) > 1 ? "days" : "day";
  if(displayTime < 1){
      displayTime = displayTime * 24;
      units = Math.floor(displayTime) > 1 ? "hrs" : "hr";
      if(displayTime < 1){
          displayTime = displayTime * 60;
          units = Math.floor(displayTime) > 1 ? "mins" : "min";
          if(displayTime < 1){
              units = Math.floor(displayTime) > 1 ? "seconds" : "second";
              displayTime = displayTime * 60;
              if(displayTime < 1){
                  displayTime = "now";
                  units = "";
              } 
          }
      }
  }
  return([displayTime, units]);
}

export const greaterThan3Days = (timestamp) => {
  console.log('greaterThan30Days');
  const currentTime = new Date();
  const geopicTime = new Date(timestamp);
  const timeDifference = currentTime.getTime() - geopicTime.getTime();
  const threeDays = timeDifference / (1000 * 3600 * 24);
  if(threeDays >= 3){
    return true;
  }else{
    return false;
  }
}

export const getUsername = async (userID) => {
  console.log('getUser');
  const users = mongodb.db('users').collection('info');
  const userInfo = await users.findOne({_partition: userID});
  return userInfo
}

export const getUserInformation = async (userID) => {
  console.log('getUserInformation');
  let userInformation = {};
  const geopics = mongodb.db('geopics').collection('public');
  const comments = mongodb.db('geopics').collection('comments');

  const userGeopics = await geopics.find({userID: userID});
  const userComments = await comments.find({userID: userID});
  let contentArray = await userGeopics.concat(userComments);
  contentArray.sort((a, b) => {
    const aTime = new Date(a.timestamp);
    const bTime = new Date(b.timestamp);
    if(aTime.getTime() > bTime.getTime()){
        return -1;
    }
    if(aTime.getTime() < bTime.getTime()){
        return 1;
    }
    return 0;
  });
  return contentArray
}

export const updateRecipientConversation = async (message, userID, lastMessageTimestamp, conversationID, recipients) => {
  console.log('updateRecipientConversation');
  console.log(conversationID);
  const users = mongodb.db('users').collection('conversations');
  if(recipients.length == 1){
    const findConvo = await users.findOne({conversationID: conversationID, _partition: recipients[0]});
    if(findConvo != null){
      await users.updateOne({conversationID: `${conversationID}`, _partition: recipients[0]}, {$set: {lastMessage: message, lastMessageFrom: userID, lastMessageTimestamp: `${lastMessageTimestamp}`, unread: findConvo.unread+1}});
    }else{
      await users.insertOne({_id: new ObjectId(), conversationID: `${conversationID}`, _partition: recipients[0], lastMessage: message, lastMessageFrom: userID, lastMessageTimestamp: `${lastMessageTimestamp}`, unread: 1, recipients: [userID]});
    }
  } //else: send to every recipient in the list

};

export const sendPushNotification = async (expoPushToken) => {
  console.log('sendPushNotification');
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export const sendVerificationText = async (number) => {
  console.log('sendVerificationText');
  const code = await fetch('https://geopix-295e8.web.app/', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
  });
  const verificationCode = await code.json();
  return verificationCode;
}

export const checkUsername = async (credential, username) => {
  console.log('checkUsername');
  const users = mongodb.db('users').collection('info');
  let check;
  if(username){
    check = await users.findOne({username: credential});
    if(check === null){
      return 'invalid'
    }else{
      return check
    }
  }else{
    check = await users.findOne({phoneNumber: credential});
    if(check === null){
      return 'invalid'
    }else{
      return check
    }
  }

}

export const addFriend = async (userID) => {
    const requests = mongodb.db('users').collection('requests');
    const users = mongodb.db('users').collection('info');
    const currentID = await AsyncStorage.getItem('userID');
    let username = '';

    users.findOne({_partition: currentID}).then(async (currentUser) => {
      username = currentUser.username;
      let newFriends;
      if(currentUser.friends == null){
        newFriends = [];
        newFriends.push(`${userID} pending`)
        await users.updateOne({_partition: currentID}, {$set: {friends: newFriends}});
      }else{
        newFriends = currentUser.friends;
        newFriends.push(`${userID} pending`)
        await users.updateOne({_partition: currentID}, {$set: {friends: newFriends}});
      }

      console.log(currentID);
      const currentTime = new Date();
      await requests.insertOne({
        _id: new ObjectId(),
        _partition: `${userID}`,
        userID: currentID,
        timestamp: `${currentTime}`,
        username: username,
  
      });
    });
    //addPendingFriend(realm, userID, currentID);

}

export const acceptRequest = async (userID) => {
    const currentUser = await AsyncStorage.getItem('userID');

    const requests = mongodb.db('users').collection('requests');
    const users = mongodb.db('users').collection('info');

    
    await requests.deleteOne({_partition: currentUser, userID: userID});

    const findUser = await users.findOne({_partition: userID});
    const userFriendList = findUser.friends;

    let newFriends = [];
    userFriendList.map((friend) => {
      if(friend === `${currentUser} pending`){
        newFriends.push(`${currentUser} friend`);
      }else{
        newFriends.push(friend);
      }
    })
    
    await users.updateOne({_partition: userID}, {$set: {friends: newFriends}});

    const findCurrentUser = await users.findOne({_partition: currentUser});
    const friends = findCurrentUser.friends;
    let addFriend;
    if(friends == null){
      console.log('empty');
      addFriend = [];
      addFriend.push(`${userID} friend`);
      await users.updateOne({_partition: currentUser}, {$set: {friends: addFriend}});
    }else{
      console.log('not empty');
      addFriend = friends;
      addFriend.push(`${userID} friend`);
      await users.updateOne({_partition: currentUser}, {$set: {friends: addFriend}});
    }
    

    //addNewFriend(realm, userID, currentUser);

}

export const declineRequest = async (userID) => {
    const currentID = await AsyncStorage.getItem('userID');
    const requests = mongodb.db('users').collection('requests');
    await requests.deleteOne({_partition: currentID, userID: userID});

    const users = mongodb.db('users').collection('info');
    const user = await users.findOne({_partition: userID});
    const newFriends = [];
    user.friends.map((friend) => {
      if(friend !== `${currentID} pending`){
        newFriends.push(friend);
      }
    });
    await users.updateOne({_partition: userID}, {$set: {friends: newFriends}});
}

export const updateUserInformation = async (userID, oldUsername, newUsername, newUrl) => {
  console.log(userID);
  console.log(oldUsername);
  console.log(newUsername);
  console.log(newUrl);
    const users = mongodb.db('users').collection('info');
    if(newUsername == ''){
      if(newUrl !== ''){
        console.log('update url');
        const pic = await getPic(newUrl, userID);
        await users.updateOne({_partition: userID}, {$set: {statusPic: pic}});
      }
    }else{
      if(newUrl !== ''){
        console.log('update both');
        const pic = await getPic(newUrl, userID);
        await users.updateOne({_partition: userID}, {$set: {statusPic: pic, username: newUsername}});
      }else{
        console.log('update username');
        await users.updateOne({_partition: userID}, {$set: {username: newUsername}});
      }
    }
}

export const getFriendGeopics = async (realm) => {
  const userID = await AsyncStorage.getItem('userID');
  const userInfo = await getUserInfo(realm, userID);
  const friends = userInfo.friends;
  console.log(`these are my friends ${friends}`);
  const geopics = mongodb.db('geopics').collection('public');
  if(friends.length > 0){
    const friendGeopics = await geopics.find({ userID: { $in: friends } });
    return friendGeopics;
  }else{
    return 'no friends';
  }

}
