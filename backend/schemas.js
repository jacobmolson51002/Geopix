import { Realm } from '@realm/react';

export const userSchema = {
    name: "info",
    properties: {
        _id: "objectId",
        _partition: "string",
        email: "string",
        geocash: "int",
        password: "string",
        profilePic: "string",
        userID: "string",
        username: "string",
    },
    primaryKey: '_id'
}