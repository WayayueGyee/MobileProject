import constants from '../constants.js';

const initialState = {
    1: {
        type: "function",
        name: "main",
        content: {
            1: {
                type: "function",
                name: "foo",
                content: {
                    1: {
                        type: "declare",
                        name: "fooVariable1",
                        content: {
                            1: {
                                type: "text", value: "value1"
                            }
                        },
                    },
                    2: {
                        type: "declare",
                        name: "fooVariable2",
                        content: {
                            1: {
                                type: "text", value: "value2"
                            }
                        },
                    }
                },
            },
            2: {
                type: "declare",
                name: "secondDeclare",
                content: {
                    1: {
                        type: "text", value: "value3"
                    }
                },
            }
        }
    },

    2: {
        type: "function",
        name: "userFoo",

        content: {
            1: {
                type: "declare",
                name: "userFooVar1",
                content: {
                    1: {
                        type: "text", value: "val1"
                    }
                },
            },
            2: {
                type: "declare",
                name: "userFooVar2",
                content: {
                    1: {
                        type: "text", value: "val2"
                    }
                },
            }
        }
    }
}

export const addObjReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_OBJ": {
            return {...state, ...action.payload};
        }
        default: {
            return state
        }
    }
}
