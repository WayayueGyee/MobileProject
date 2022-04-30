export default {
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
    },
    5: {
        type: "declare",
        name: "firstVar",

        content: {
            1: {
                type: "text", value: "var"
            }
        }
    },
    6: {
        type: "declare",
        name: "var",

        content: {
            1: {
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
            }
        }
    }
}
