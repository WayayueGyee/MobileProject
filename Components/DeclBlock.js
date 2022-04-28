import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FuncBlock} from "./FuncBlock";

export const DeclBlock = (props) => {
    return (
        <View>
            {
                Object.entries(props.content).map(([key, value]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View style={styles.obj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <FuncBlock style={styles.obj} content={value.content}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.obj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <DeclBlock style={styles.obj} content={value.content}/>
                                </View>
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
    obj: {
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

    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
