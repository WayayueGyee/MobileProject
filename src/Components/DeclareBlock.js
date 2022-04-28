import React from 'react'
import {StyleSheet, TextInput, View, TouchableOpacity, Text} from "react-native";

export const DeclareBlock = () => {
    return (
        <View style={styles.component}>
            <View style={styles.view}>
                <Text style={styles.text}>Variable</Text>
                <TouchableOpacity style={styles.inputView}>
                    <TextInput style={styles.input} placeholder={'name'}/>
                    <TextInput style={styles.input} placeholder={'value'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    component: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },

    view: {
        backgroundColor: 'grey',
        marginTop: 20,
        padding: 10,
        width: '80%',
    },

    inputView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    text: {
        color: "#000"
    },

    inputFirst: {
        borderWidth: 1,
        backgroundColor: '#fff',
        flex: 1,
        marginLeft: 0
    },

    input: {
        borderWidth: 1,
        backgroundColor: '#fff',
        flex: 1,
        marginLeft: 20,
    },

    button: {
        backgroundColor: 'lightblue',
        flex: 1,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: "center"
    }
})
