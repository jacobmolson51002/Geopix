import { Realm } from '@realm/react';
import { userSchema , viewedSchema, Conversation, Message, Request} from './schemas';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setGeopics, setClusters, addGeopic, addCluster, updateGeopic, setRequests } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocation } from './location';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from 'expo-location';
import { setCurrentLocation, setMessageData, setUnreadCount, setUserRealm, setCurrentConversation, setMessagesRealm } from '../redux/actions';
import {ObjectId} from 'bson';
import { updateRecipientConversation, getUser, getPic } from './database';

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

export const openUserRealm = async (dispatch, register, login, userID, expoPushToken, username, password, phoneNumber, statusPic) => {
  if(register){
    userID = new ObjectId();
  }
  const credentials = Realm.Credentials.anonymous();
  await app.logIn(credentials);
  const OpenRealmBehaviorConfiguration = {
    type: "openImmediately",
  }
  const configuration = {
    schema: [userSchema, Conversation, Request],// add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: `${userID}`,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };
  //const userRealm = await Realm.open(configuration);
  const userRealm = await Realm.open(configuration).then(async (realm) => {
    dispatch(setUserRealm(realm));

    if(register){
      const pic = await getPic(statusPic, userID);
      const date = new Date();
      const newUser = {
        _id: userID,
        _partition: `${userID}`,
        geocash: 0,
        username: username,
        phoneNumber: phoneNumber,
        expoPushToken: expoPushToken,
        password: password,
        commented: [],
        downvoted: [],
        upvoted: [],
        lastLoggedIn: `${date}`,
        lastLoggedOut: '',
        statusPic: pic,
        usernameLastChanged: `${date}`
      }
      realm.write(async () => {
        realm.create('info', newUser);
      });
      await AsyncStorage.setItem('userID', `${userID}`);
      await AsyncStorage.setItem('username', username);
    }else if(login){
      await AsyncStorage.setItem('userID', userID);
      await AsyncStorage.setItem('username', username);
    }
    const user = realm.objectForPrimaryKey('info', ObjectId(userID));
    if(user.expoPushToken !== expoPushToken){
      realm.write(() => {
        user.expoPushToken = expoPushToken;
      })
    }

    const conversations = await realm.objects('conversations');
    const requests = await realm.objects('requests');



    //let sortedConversations = await sortByTime(conversations);

    dispatch(setMessageData(conversations));
    dispatch(setRequests(requests));

    let unreadCount = 0;
    conversations.map((conversation) => {
      unreadCount += conversation.unread;
    });
    unreadCount += requests.length;
    console.log(`unread count: ${unreadCount}`);

    dispatch(setUnreadCount(unreadCount));

    try{
      conversations.addListener(() => {
        dispatch(setMessageData(conversations));

        let unreadCount = 0;
        conversations.map((conversation) => {
          unreadCount += conversation.unread;
        });
        console.log(`unread count: ${unreadCount}`);
        dispatch(setUnreadCount(unreadCount));
      });
      requests.addListener(() => {
        dispatch(setRequests(requests));

        let unreadCount = 0;
        conversations.map((conversation) => {
          unreadCount += conversation.unread;
        });
        unreadCount += requests.length;
        console.log(`unread count: ${unreadCount}`);
        dispatch(setUnreadCount(unreadCount));
      })
    }catch (error) {
      console.warn(`unable to add listener: ${error}`);
    }
  });
}

//function to login the user
export const logUserIn = async (username, phoneNumber, password, userID, dispatch) => {
      //const dispatch = useDispatch();
      //login the user
      //const credentials = await Realm.Credentials.emailPassword("jacobmolson");

      
      openUserRealm(dispatch, newUser, true);
      return (
        "successful login"
      );
      

      console.log(loggedInUser);



      //set the redux userID variable
      //dispatch(setUserId(loggedInUser.id));
}

export const logUserOut = async () => {
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('userID');
    await AsyncStorage.removeItem('password');
}

export const registerUser = async (email, password, dispatch) => {
    try {
      const registeredUser = await app.emailPasswordAuth.registerUser({ email, password });

      logUserIn(email, password, true, dispatch);
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

export const getMessages = async (conversationID, dispatch) => {
  console.log('ran');
  const OpenRealmBehaviorConfiguration = {
    type: "openImmediately",
  }
  const configuration = {
    schema: [Message],
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: `${conversationID}`,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  }
  const localRealm = await Realm.open(configuration).then((realm) => {
    dispatch(setMessagesRealm(realm));
    const messages = realm.objects('messages');
    //console.log(messages);
    dispatch(setCurrentConversation(messages));
    try{
      messages.addListener((newMessages) => {
        console.log(newMessages);
        dispatch(setCurrentConversation(newMessages));
      })
    }catch (error) {
      console.warn(`unable to add listener: ${error}`);
    }
    return (() => {realm.close()})
  });

}

export const sendNewMessage = async (conversationID, timestamp, dispatch, message, messagesRealm, userRealm, userID, recipients) => {
  console.log(conversationID);
  const configuration = {
    schema: [Message],
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: `${conversationID}`, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  }
  const localRealm = await Realm.open(configuration).then((realm) => {
    dispatch(setMessagesRealm(realm));
    const messages = realm.objects('messages');
    realm.write(() => {
      realm.create('messages', {
        _id: new ObjectId(),
        _partition: `${conversationID}`,
        message: message,
        to: "",
        from: userID,
        timestamp: `${timestamp}`
      });
    });

    try{
      messages.addListener((newMessages) => {
        console.log(newMessages);
        dispatch(setCurrentConversation(newMessages));
      })
    }catch (error) {
      console.warn(`unable to add listener: ${error}`);
    }
    return (() => {realm.close()})
  });
  updateRecipientConversation(message, userID, timestamp, conversationID, recipients);

}

export const createNewConversation = async (conversationID, timestamp, userRealm, recipients, usernames, message, userID) => {
  userRealm.write(() => {
    userRealm.create('conversations', {
      _id: new ObjectId(),
      _partition: `${userID}`,
      conversationID: `${conversationID}`,
      unread: 0,
      recipients: recipients,
      usernames: usernames,
      lastMessage: message,
      lastMessageFrom: `${userID}`,
      lastMessageTimestamp: `${timestamp}`,
    });
  });
}

export const updateConversation = async (realm, conversationID) => {
  if(conversationID != null){
    const convo = await realm.objectForPrimaryKey('conversations', conversationID);
    if(convo.unread > 0){
      realm.write(() => {
          console.log('working');
          convo.unread = 0;
        });
    }
  }
}

export const sendMessage = (message, realm, userRealm, conversationID, conversationPrimaryID, userID, recipients) => {
  console.log('registered');
  const messageTimeStamp = new Date();
  realm.write(() => {
    realm.create('messages', {
      _id: new ObjectId(),
      _partition: `${conversationID}`,
      message: message,
      to: "",
      from: userID,
      timestamp: `${messageTimeStamp}`
    });
  });
  userRealm.write(() => {
    let currentConversation = userRealm.objectForPrimaryKey('conversations', conversationPrimaryID);
    currentConversation.lastMessage = message;
    currentConversation.lastMessageFrom = userID;
    currentConversation.lastMessageTimestamp = `${messageTimeStamp}`;
  })
  updateRecipientConversation(message, userID, messageTimeStamp, conversationID, recipients);
}

export const addNewFriend = async (realm, userID, currentID) => {
  const user = await realm.objectForPrimaryKey('info', ObjectId(currentID));
  const newFriends = await user.friends;
  newFriends.push(`${userID} friend`);
  realm.write(async () => {
    user.friends = newFriends;
  })
}

export const addPendingFriend = async (realm, userID, currentID) => {
  realm.write(() => {
    const user = realm.objectForPrimaryKey('info', ObjectId(currentID));
    if(user.friends === null){
      const newFriends = [];
      newFriends.push(`${userID} pending`);
      user.friends = newFriends;
    }else{
      const currentFriends = user.friends;
      currentFriends.push(`${userID} pending`);
      user.friends = currentFriends;
    }
  })
}

export const checkFriendStatus = async (realm, userID) => {
    const currentUser = await AsyncStorage.getItem('userID');
    console.log(currentUser);
    const user = await realm.objectForPrimaryKey('info', ObjectId(currentUser));
    console.log(user);
    let status = 'none';
    if(user.friends === null){
      console.log('dont know')
    }else{
      user.friends.map((friend) => {
        const friendArray = friend.split(' ');
        console.log(friendArray);
        if(friendArray[0] === userID){
          console.log('yup')
          status = friendArray[1];
        }
      })
    }

    return status;

    
}

export const getUserInfo = async (realm, userID) => {
  const userInfo = await realm.objectForPrimaryKey('info', ObjectId(userID));
  return userInfo;
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