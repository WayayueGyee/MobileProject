import constants from '../constants.js';

const initialState = {
  blockArray: {}
}


export const addBlockReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SAVE_VARIABLE:
      return { ...state, blockArray: {...state.blockArray, [action.payload.id]: { ...action.payload }}}
    case constants.ADD_VALUE_INPUT:
      return {
        ...state,
          blockArray: {...state.blockArray,
            [action.payload.id]: { ...state.blockArray[action.payload.id],
            value: {...state.blockArray[action.payload.id]['value'],
              [action.payload.valueId]: { ...action.payload }
            }
          }
        }
      }
    default:
      return state
  }
}
