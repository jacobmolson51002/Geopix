import { CURRENT_LOCATION, USER_ID, GEOPICS, ADD_GEOPIC, SET_CLUSTERS } from './actions';

const initializeUserState = {
    userID: 'this is something',
    currentLocation: {
        latitude: 0,
        longitude: 0
    },
    geopics: null
};

const initilizeGeopicsState = {
    geopics: null,
    clusters: null
}


export function userReducer(state = initializeUserState, action){
    switch(action.type){
        case USER_ID:
            return {...state, userID: action.payload};
        case CURRENT_LOCATION:
            return {...state, currentLocation: action.payload};
        default:
            return state;
    }
}

export function geopicsReducer(state = initilizeGeopicsState, action){
    switch(action.type){
        case GEOPICS:
            return{...state, geopics: action.payload};
        case SET_CLUSTERS:
            return{...state, clusters: action.payload};
        case ADD_GEOPIC:
            return{...state, geopics: [...state.geopics, action.payload]}
        default: 
            return state;
    }
}
