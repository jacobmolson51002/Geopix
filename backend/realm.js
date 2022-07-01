import { Realm } from '@realm/react';
import { userSchema } from './schemas';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//initialize realm app
const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });

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

//function to write a geopic to mongo
export const geopicUpload = async (queryString) => {

  //connect to databse with credentials
  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  //access the geopics collection
  const geopics = mongodb.db('geopics').collection('public');
  //upload using the passes queryString object
  const upload = await geopics.insertOne(queryString);
  console.log(upload);
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