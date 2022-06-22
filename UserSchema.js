
const UserSchema = {
    "title": "info",
    "properties": {
      "_id": {
        "bsonType": "objectId"
      },
      "email": {
        "bsonType": "string"
      },
      "geocash": {
        "bsonType": "string"
      },
      "password": {
        "bsonType": "string"
      },
      "username": {
        "bsonType": "string"
      }
    }
  };


export default UserSchema;