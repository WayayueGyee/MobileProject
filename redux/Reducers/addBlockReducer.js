import constants from '../constants.js';

const initialState = {
  functionBlocks: {}
}


export const addBlockReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SAVE_VARIABLE:
      return { ...state, [action.payload.blockType]: {...state[action.payload.blockType],
          [action.payload.id]: { ...action.payload }}}
    case constants.ADD_VALUE_INPUT:
      return {
          ...state,
          functionBlocks: {
              ...state.functionBlocks,
              [action.payload.id]: {
                  ...state.functionBlocks[action.payload.id],
                  content: {
                      ...state.functionBlocks[action.payload.id].content,
                      value: {
                          ...state.functionBlocks[action.payload.id].content.value,
                          [action.payload.valueId]: { ...action.payload }
                      }
                  }
              }
          }
      }
    default:
      return state
  }
}
