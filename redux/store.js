import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {userReducer, geopicsReducer} from './reducers';

const rootReducer = combineReducers({userReducer, geopicsReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));