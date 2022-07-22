import { CURRENT_LOCATION, SET_MESSAGE_DATA, SET_UNREAD_COUNT, USER_ID, SET_GEOPICS, ADD_GEOPIC, SET_CLUSTERS, ADD_CLUSTER, UPDATE_GEOPIC, SET_USER_REALM, SET_CURRENT_CONVERSATION } from './actions';

const initializeUserState = {
    userID: 'this is something',
    currentLocation: {
        latitude: 0,
        longitude: 0
    },
    messages: [],
    unreadCount: 0,
    userRealm: null,
    currentConversation: null,
};

const initilizeGeopicsState = {
    geopics: null,
    clusters: null
}


export function userReducer(state = initializeUserState, action){
    switch(action.type){
        case SET_MESSAGE_DATA:
            return {...state, messages: action.payload};
        case SET_UNREAD_COUNT:
            return {...state, unreadCount: action.payload};
        case USER_ID:
            return {...state, userID: action.payload};
        case CURRENT_LOCATION:
            return {...state, currentLocation: action.payload};
        case SET_USER_REALM:
            return {...state, userRealm: action.payload}
        case SET_CURRENT_CONVERSATION:
            return {...state, currentConversation: action.payload}
        default:
            return state;
    }
}

function editGeopicState(geopics, action){
    newGeopics = geopics;
    newGeopics.geopics.map((geopic) => {
        if(geopic._id === action.payload.geopic._id){
            console.log('geopic found');
            geopic.clustered = true
            geopic.clusterID = action.payload.clusterID;
        }
    });
    return newGeopics
}

export function geopicsReducer(state = initilizeGeopicsState, action){
    switch(action.type){
        case SET_GEOPICS:
            return{...state, geopics: action.payload};
        case SET_CLUSTERS:
            return{...state, clusters: action.payload};
        case ADD_GEOPIC:
            return{...state, geopics: [...state.geopics, action.payload]}
        case ADD_CLUSTER:
            return{...state, clusters: [...state.clusters, action.payload]}
        case UPDATE_GEOPIC:
            return {...state, geopics: editGeopicState(...state, action)};
        default: 
            return state;
    }
}
