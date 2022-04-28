import { legacy_createStore, combineReducers } from "redux";
import { reducer } from "./Reducers/reducers";
import { addBlockReducer } from './Reducers/addBlockReducer';

const rootReducer = combineReducers({
  colorReducer: reducer,
  addBlockReducer: addBlockReducer,
})

export const Store = legacy_createStore(rootReducer);
