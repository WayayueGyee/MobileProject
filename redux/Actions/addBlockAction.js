import constants from '../constants.js';

export const addBlockAction = (data) => {
  return {
    type: constants.SAVE_VARIABLE,
    payload: {
      id: data.id, type: data.type, name: '', value: {[data.count]: {id: data.id, valueId: data.count, value: ''}}
    }
  }
}
