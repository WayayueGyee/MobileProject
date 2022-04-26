import constants from '../constants.js';

export const addBlockAction = (data) => {
  return {
    type: constants.SAVE_VARIABLE,
    payload: {
      id: data.id, blockType: data.blockType, type: data.type, name: '',
      content: {type: 'text', value: {[data.count]: {id: data.id, valueId: data.count, value: ''}}}
    }
  }
}
