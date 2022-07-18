export const USER_ID = 'USER_ID';
export const CURRENT_LOCATION = 'CURRENT_LOCATION';
export const CHANGE_NAV_STATE = 'CHANGE_NAV_STATE';
export const SET_GEOPICS = 'GEOPICS';
export const SET_CLUSTERS = 'SET_CLUSTERS';
export const ADD_GEOPIC = 'ADD_GEOPIC';
export const ADD_CLUSTER = 'ADD_CLUSTER';
export const UPDATE_GEOPIC = 'UPDATE_GEOPIC';
export const SET_MESSAGE_DATA = 'SET_MESSAGE_DATA';
export const SET_UNREAD_COUNT = 'SET_UNREAD_COUNT';

export const setMessageData = messageData => dispatch => {
    dispatch({
        type: SET_MESSAGE_DATA,
        payload: messageData
    });
};

export const setUnreadCount = unreadCount => dispatch => {
    dispatch({
        type: SET_UNREAD_COUNT,
        payload: unreadCount
    });
};

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
        type: SET_GEOPICS,
        payload: geopics
    })
}

export const setClusters = clusters => dispatch => {
    dispatch({
        type: SET_CLUSTERS,
        payload: clusters
    })
}

export const addGeopic = geopic => dispatch => {
    dispatch({
        type: ADD_GEOPIC,
        payload: geopic
    })
}

export const addCluster = cluster => dispatch => {
    dispatch({
        type: ADD_CLUSTER,
        payload: cluster
    })
}

export const updateGeopic = newGeopicInfo => dispatch => {
    dispatch({
        type: UPDATE_GEOPIC,
        payload: newGeopicInfo
    })
}
