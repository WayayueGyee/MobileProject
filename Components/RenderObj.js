import React  from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { useSelector } from "react-redux";
import { FunctionBlock } from "./FunctionBlock";
import {DeclareBlock} from "./DeclareBlock";
import { FuncBlock } from "./FuncBlock";

export const RenderObj = () => {
    const data = useSelector(state => state.addObjReducer);
    return (
        <View style={styles.view}>
            {
                Object.entries(data).map(([key, value]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <>
                                    <View style={styles.obj}>
                                        <TextInput style={styles.input} value={value.name}/>
                                        <FuncBlock content={value.content} keys={[key]}/>
                                    </View>
                                </>
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
        backgroundColor: 'grey',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },

    button: {
        backgroundColor: 'lightblue',
    },

    text: {
        color: '#000',
        fontSize: 18
    },

    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginTop: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
