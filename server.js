import Realm from 'realm';
import {UserSchema} from './UserSchema';

// place your RealmApp ID here
const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });

// can implement inBuilt JWT, Google, Facebook, Apple Authentication Flow.
const credentials = Realm.Credentials.anonymous(); // LoggingIn as Anonymous User. 

getRealm = async () => {

  console.log("this is working");

  // loggedIn as anonymous user
  const loggedInUser = await app.logIn(credentials);
  
  // MongoDB RealmConfiguration
  /*const configuration = {
    schema: [UserSchema], // add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
    }
  };*/

  const mongodb = app.currentUser.mongoClient('mongodb-atlas');
  const geopics = mongodb.db('geopics').collection('public');
  const test = await geopics.findOne({ pic: "urltopic" });
  console.log(test);

  //return Realm.open(configuration);
  return test;
}

export default getRealm;