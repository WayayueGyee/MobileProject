import constants from '../constants.js';

const initialState = {
  color: '',
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SAVE_COLOR:
      return { ...state, color: action.payload }
    default:
      return state
  }
}
