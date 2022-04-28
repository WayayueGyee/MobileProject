import { legacy_createStore, combineReducers } from "redux";
import { reducer } from "./Reducers/reducers";
import { addBlockReducer } from './Reducers/addBlockReducer';
import {addObjReducer} from "./Reducers/addObjReducer";

const rootReducer = combineReducers({
  colorReducer: reducer,
  addBlockReducer: addBlockReducer,
  addObjReducer: addObjReducer
})

export const Store = legacy_createStore(rootReducer);
