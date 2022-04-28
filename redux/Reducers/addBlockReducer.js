import constants from '../constants.js';

const initialState = {}

const removeId = ({ id, valueId, ...rest }) => rest;

export const addBlockReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SAVE_VARIABLE:
      return { ...state, [action.payload.id]: { ...removeId(action.payload) }}
    case constants.ADD_VALUE_INPUT:
      return {
          ...state, [action.payload.id]: {
                  ...state[action.payload.id], content: {
                      ...state[action.payload.id].content, value: {
                          ...state[action.payload.id].content.value,
                            [action.payload.valueId]: { ...removeId(action.payload) }
                          }
                     }
                }
        }
    default:
      return state
  }
}
