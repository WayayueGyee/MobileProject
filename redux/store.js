import { legacy_createStore, combineReducers } from "redux";
//import thunk from 'redux-thunk';
import { reducer } from "./Reducers/reducers";
import { addBlockReducer } from './Reducers/addBlockReducer';

const rootReducer = combineReducers({
  colorReducer: reducer,
  addBlockReducer
})

export const Store = legacy_createStore(rootReducer);
