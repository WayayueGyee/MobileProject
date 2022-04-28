import constants from '../constants';

export const addObjAction = (data) => {
    return {
        type: constants.ADD_OBJECT,
        payload: {
            id: data.id,
            inside: {
                type: data.type,
                name: data.name,
                content: data.content
            }
        }
    }
}
