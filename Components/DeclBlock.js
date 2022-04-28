import React from 'react';
import {StyleSheet, TextInput, View} from "react-native";
import {FuncBlock} from "./FuncBlock";
import {InpBlock} from "./InpBlock";

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
                                    {props.keys.push(key)}
                                    <FuncBlock style={styles.obj} keys={[...props.keys, key]} content={value.content}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.obj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <DeclBlock style={styles.obj} keys={[...props.keys, key]} content={value.content}/>
                                </View>
                            )
                        }

                        case "text": {
                            return (
                                <InpBlock keys={[...props.keys, key]} value={value.value}/>
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
