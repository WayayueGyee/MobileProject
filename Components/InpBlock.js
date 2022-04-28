import React, {useState} from 'react'
import {StyleSheet, TextInput, View} from "react-native";
import { StateAPI } from '../DataController/blockStateAPI';

export const InpBlock = (props) => {
    const [value, setValue] = useState(props.value);

    const changeText = (text) => {
        setValue(text)
        let keys = [...props.keys]
        StateAPI.changeValue(keys, text)
    }

    return (
        <View>
            <TextInput style={styles.input} onChangeText={(text) => changeText(text)} value={value}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
