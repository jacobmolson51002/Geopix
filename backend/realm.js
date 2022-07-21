import { Realm } from '@realm/react';
import { userSchema , viewedSchema, Conversation, Message} from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setGeopics, setClusters, addGeopic, addCluster, updateGeopic } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocation } from './location';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from 'expo-location';
import { setCurrentLocation, setMessageData, setUnreadCount, setUserRealm } from '../redux/actions';
import {ObjectId} from 'bson';

//initialize realm app
export const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });




/*const credentials = Realm.Credentials.emailPassword(
  "jacobmolson51002@gmail.com",
  "Qweruiop1535!"
); // LoggingIn as Anonymous User. */

//login anonymously
//const credentials = Realm.Credentials.anonymous();
const sortByTime = (conversations) => {
  console.log(conversations[0]);
  let SortedConversations = conversations;
  SortedConversations.sort((a, b) => {
    const aTime = new Date(a.lastMessageTimestamp);
    const bTime = new Date(b.lastMessageTimestamp);
    if(aTime.getTime() > bTime.getTime()){
        return -1;
    }
    if(aTime.getTime() < bTime.getTime()){
        return 1;
    }
    return 0;
  });
  return SortedConversations;
}

export const openUserRealm = async (dispatch) => {
  console.log(app.currentUser.id);
  const configuration = {
    schema: [userSchema, Conversation],// add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: `${app.currentUser.id}`, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };
  //const userRealm = await Realm.open(configuration);
  const userRealm = await Realm.open(configuration).then(async (realm) => {
    dispatch(setUserRealm(realm));

    const conversations = await realm.objects('conversations');

    //let sortedConversations = await sortByTime(conversations);

    dispatch(setMessageData(conversations));

    let unreadCount = 0;
    conversations.map((conversation) => {
      unreadCount += conversation.unread;
    });
    console.log(`unread count: ${unreadCount}`);

    dispatch(setUnreadCount(unreadCount));

    try{
      conversations.addListener(() => {
        console.log(conversations);
        dispatch(setMessageData(conversations));

        let unreadCount = 0;
        conversations.map((conversation) => {
          unreadCount += conversation.unread;
        });

        console.log(`unread count: ${unreadCount}`);
        dispatch(setUnreadCount(unreadCount));
      })
    }catch (error) {
      console.warn(`unable to add listener: ${error}`);
    }
  });
}

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
      geopic.vote = checkForView.vote;
    }else{
      geopic.viewed = false;
    }
  });
  localRealm.close();
  return geopics;
}

export const setLocalVote = async (viewed, id, vote) => {
  console.log(id);
  console.log(viewed);
  console.log(vote);
  const configuration = {
    schema: [viewedSchema]
  }
  const localRealm = await Realm.open(configuration);
  if(viewed){
    const item = localRealm.objectForPrimaryKey('viewed', id);
    console.log(item);
    localRealm.write(() => {
      item.vote = vote;
      console.log(item);
    });
  }else{
    let item;
    localRealm.write(() => {
      item = localRealm.create('viewed', { viewedObjectID: id, vote: vote });
    })
  }
  localRealm.close();
}

export const getViewedComments = async (comments) => {
  const configuration = {
    schema: [viewedSchema]
  }
  const localRealm = await Realm.open(configuration);
  comments.map((comment) => {
    const checkForView = localRealm.objectForPrimaryKey('viewed', comment._id);
    if(checkForView != null){
      comment.viewed = true;
      comment.vote = checkForView.vote;
    }else{
      comment.viewed = false;
    }
  });
  localRealm.close();
  return comments;
}

export const getMessages = async (conversationID, setMessages) => {
  console.log("this is a test");
  const configuration = {
    schema: [Message],
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: `${conversationID}`, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  }
  const localRealm = await Realm.open(configuration).then((realm) => {
    const messages = realm.objects('messages');
    //console.log(messages);
    setMessages(messages);
    try{
      messages.addListener(() => {
        setMessages(messages);
      })
    }catch (error) {
      console.warn(`unable to add listener: ${error}`);
    }
    return (() => {realm.close()})
  });

}

export const updateConversation = async (realm, conversationID) => {
  const convo = realm.objectForPrimaryKey('conversations', conversationID);
  if(convo.unread > 0){
      realm.write(() => {
          console.log('working');
          const converationToUpdate = realm.objectForPrimaryKey('conversations', conversationID);
          converationToUpdate.unread = 0;
        });
  }
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