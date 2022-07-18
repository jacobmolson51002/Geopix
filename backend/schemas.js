import { Realm } from '@realm/react';

export const userSchema = {
    name: "info",
    properties: {
        _id: "objectId",
        _partition: "string",
        phoneNumber: "int",
        geocash: "int",
        username: "string",
    },
    primaryKey: '_id'
}

export const Conversation = {
    name: "conversations",
    properties: {
        _id: "objectId",
        _partition: "string",
        unread: "int",
        recipients: {
            type: 'list',
            objectType: 'string'
        },
        lastMessage: "string",
        lastMessageFrom: "string",
        lastMessageTimestamp: "string",
        conversationID: 'string'
    },
    primaryKey: '_id'
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