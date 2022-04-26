import constants from '../constants.js';

export const AddValueInputAction = (data) => {
  return {
    type: constants.ADD_VALUE_INPUT,
    payload: {
      id: data.id, valueId: data.valueId, value: data.value
    }
  }
}
