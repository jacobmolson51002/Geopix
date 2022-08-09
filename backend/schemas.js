import { Realm } from '@realm/react';

export const userSchema = {
    name: "info",
    properties: {
        _id: "objectId",
        _partition: "string",
        phoneNumber: "int",
        geocash: "int",
        username: 'string',
        expoPushToken: 'string',
        password: 'string',
        commented: {
            type: "list",
            objectType: 'string'
        },
        downvoted: {
            type: "list",
            objectType: 'string'
        },
        upvoted: {
            type: "list",
            objectType: 'string'
        },
        friends: {
            type: "list",
            objectType: 'string'
        },
        lastLoggedIn: 'string',
        lastLoggedOut: 'string',
        statusPic: 'string',
        usernameLastChanged: 'string'
    },
    primaryKey: '_id'
}

export const Conversation = {
    name: "conversations",
    properties: {
        _id: "objectId",
        _partition: "string",
        conversationID: "string",
        unread: "int",
        recipients: {
            type: 'list',
            objectType: 'string'
        },
        usernames: {
            type: 'list',
            objectType: 'string'
        },
        lastMessage: "string",
        lastMessageFrom: "string",
        lastMessageTimestamp: "string",
    },
    primaryKey: '_id'
}
export const Request = {
    name: "requests",
    properties: {
        _id: "objectId",
        _partition: "string",
        userID: "string",
        timestamp: 'string',
        username: 'string',
    },
    primaryKey: '_id'
}

export const Message = {
    name: 'messages',
    properties: {
        _id: "objectId",
        _partition: "string",
        message: "string",
        to: "string",
        from: "string",
        timestamp: "string"
    },
    primaryKey: "_id"
}

/*
        conversations: {
            type: 'list',
            ojectType: {
                unread: 'int',
                recipients:{
                    type: 'list',
                    objectType: 'string'
                },
                lastMessage: {
                    from: 'string',
                    message: 'string',
                    timestamp: 'string'
                }
            }
        }
*/


export const viewedSchema = {
    name: 'viewed',
    properties: {
        viewedObjectID: 'objectId',
        vote: 'int'
    },
    primaryKey: 'viewedObjectID'
}