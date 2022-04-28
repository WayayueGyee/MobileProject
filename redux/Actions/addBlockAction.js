import constants from '../constants.js';

export const addBlockAction = (data) => {
  return {
    type: constants.SAVE_VARIABLE,
    payload: {
      id: data.id, type: data.type, name: '',
      content: {type: 'text', value: {[data.count]: { value: ''}}}
    }
  }
}
