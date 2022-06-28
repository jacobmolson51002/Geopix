import { CURRENT_LOCATION, USER_ID } from './actions';

const initializeState = {
    userID: 'this is something',
    currentLocation: {
        latitude: 0,
        longitude: 0
    }
};


function userReducer(state = initializeState, action){
    switch(action.type){
        case USER_ID:
            return {...state, userID: action.payload};
        case CURRENT_LOCATION:
            return {...state, currentLocation: action.payload};
        default:
            return state;
    }
}

export default userReducer;