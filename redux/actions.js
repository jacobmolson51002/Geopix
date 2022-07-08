export const USER_ID = 'USER_ID';
export const CURRENT_LOCATION = 'CURRENT_LOCATION';
export const CHANGE_NAV_STATE = 'CHANGE_NAV_STATE';
export const GEOPICS = 'GEOPICS';
export const ADD_GEOPIC = 'ADD_GEOPIC';

export const setUserId = userID => dispatch => {
    dispatch({
        type: USER_ID,
        payload: userID
    });
};

export const setCurrentLocation = currentLocation => dispatch => {
    dispatch({
        type: CURRENT_LOCATION,
        payload: currentLocation
    });
};

export const setGeopics = geopics => dispatch => {
    dispatch({
        type: GEOPICS,
        payload: geopics
    })
}

export const addGeopic = geopic => dispatch => {
    dispatch({
        type: ADD_GEOPIC,
        payload: geopic
    })
}
