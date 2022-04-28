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
    },

    3: {
        type: "function",
        name: "userFoo2",

        content: {
            1: {
                type: "declare",
                name: "userFoo2Var1",
                content: {
                    1: {
                        type: "text", value: "val1"
                    }
                },
            },
            2: {
                type: "declare",
                name: "userFoo2Var2",
                content: {
                    1: {
                        type: "text", value: "val2"
                    }
                },
            }
        }
    },
    4: {
        type: "function",
        name: "userFoo3",

        content: {
            1: {
                type: "declare",
                name: "userFoo3Var1",
                content: {
                    1: {
                        type: "text", value: "val1"
                    }
                },
            },
            2: {
                type: "declare",
                name: "userFoo3Var2",
                content: {
                    1: {
                        type: "text", value: "val2"
                    }
                },
            },
            3: {
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
            }
        }
    }
}

export const addObjReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.ADD_OBJECT: {
            return {...state, ...action.payload};
        }
        case constants.CHANGE_OBJECT: {
            let keys = action.payload.keys;
            let actionState = state;

            function recursiveChange(keys, object) {
                if (keys.length === 0) return;
                let k = keys.shift();
                Object.entries(object).map(([key, value]) => {
                    if (key === k) {
                        if (keys.length === 0) {
                            value.value = action.payload.value;
                        }

                        return recursiveChange(keys, value.content);
                    }
                })
            }

            recursiveChange(keys, actionState)
            alert(actionState[1].content[1].content[1].content[1].value)
            return actionState;
        }
        default: {
            return state
        }
    }

    return state
}
