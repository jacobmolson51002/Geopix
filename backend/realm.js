import { Realm } from '@realm/react';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/actions';
import { useEffect } from 'react';

//initialize realm app
const app = new Realm.App({ id: "geopix-xpipz", timeout: 10000 });

/*const credentials = Realm.Credentials.emailPassword(
  "jacobmolson51002@gmail.com",
  "Qweruiop1535!"
); // LoggingIn as Anonymous User. */

//login anonymously
const credentials = Realm.Credentials.anonymous();

//function to login the user
export const loginUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      //login the user
      const loggedInUser = await app.logIn(credentials);

      //set the redux userID variable
      dispatch(setUserId(loggedInUser.id));
    })();
    }, []);
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