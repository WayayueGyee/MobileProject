import constants from '../constants.js';

export const addBlockAction = (data) => {
  return {
    type: constants.SAVE_VARIABLE,
    payload: {
      type: data.type, name: data.name, value: data.value
    }
  }
}
