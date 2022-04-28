import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { DeclBlock } from "./DeclBlock";

export const FuncBlock = (props) => {
    return (
        <View style={styles.obj}>
            {
                Object.entries(props.content).map(([key, value]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <TouchableOpacity style={styles.funcObj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <FuncBlock style={styles.funcObj} content={value.content}/>
                                </TouchableOpacity>
                            )
                        }

                        case "declare": {
                            return (
                                <TouchableOpacity style={styles.funcObj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <DeclBlock content={value.content}/>
                                </TouchableOpacity>
                            )
                        }

                        case "text": {
                            return (
                                <TextInput style={styles.input}>{value.value}</TextInput>
                            )
                        }
                    }
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    funcObj: {
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20
    },

    declObj: {
        backgroundColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20
    },

    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
