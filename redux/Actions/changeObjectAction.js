import constants from '../constants';

export const changeObjectAction = (data) => {
    return {
        type: constants.CHANGE_OBJECT,
        payload: {
            keys: data.keys,
            value: data.value
        }
    }
}

