import constants from '../constants.js';

const initialState = {
  blockArray: []
}


export const addBlockReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SAVE_VARIABLE:
      return { ...state, blockArray: [...state.blockArray, { ...action.payload }] }
    default:
      return state
  }
}
