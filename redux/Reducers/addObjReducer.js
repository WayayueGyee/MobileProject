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
        case constants.ADD_OBJECT: {
            return {...state, ...action.payload};
        }
        case "CHANGE_OBJ": {
            let keys = action.payload.keys;

            function recursiveChange(keys, object) {
                if (keys.length === 0) return;
                let k = keys.shift();
                Object.entries(object).map(([key, value]) => {
                    if (key === k) {
                        console.log(value)

                        if (keys.length === 0) {
                            value.value = action.payload.value;
                        }

                        return recursiveChange(keys, value.content);
                    }
                })
            }

            recursiveChange(keys, initialState)
            break;
        }
        default: {
            return state
        }
    }
}
