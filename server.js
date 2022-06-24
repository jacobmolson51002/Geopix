//import Realm from 'realm';
import { Realm } from '@realm/react';
//import {UserSchema} from './UserSchema';

// place your RealmApp ID here
const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });

// can implement inBuilt JWT, Google, Facebook, Apple Authentication Flow.
/*const credentials = Realm.Credentials.emailPassword(
  "jacobmolson51002@gmail.com",
  "Qweruiop1535!"
); // LoggingIn as Anonymous User. */

//console.log(credentials);
const credentials = Realm.Credentials.anonymous();
getRealm = async () => {


  console.log("this is now working");

  // loggedIn as anonymous user
  try{
    const loggedInUser = await app.logIn(credentials);
  }catch(err){
    console.log(err);
  }

  
  // MongoDB RealmConfiguration
  /*const configuration = {
    schema: [UserSchema], // add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };*/

  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const geopics = await mongodb.db('geopics').collection('public');
  const test = await geopics.findOne({ pic: "urltopic" });
  console.log(test);

  //return Realm.open(configuration);
}

export default getRealm;