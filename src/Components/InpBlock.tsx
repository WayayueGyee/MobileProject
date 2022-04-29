import React, {useState} from 'react'
import {StyleSheet, TextInput, View} from "react-native";
import { StateAPI } from '../DataController/blockStateAPI';

export type Props = {
    value: string | number;
    keys: Array<number | string>;
}

export const InpBlock: React.FC<Props> = (
    value,
    propsKeys
) => {
    const [inputValue, setInputValue] = useState(value.toString());

    const changeText = (text: string) => {
        setInputValue(text);
        let keys = [propsKeys];
        alert(keys);
        StateAPI.changeValue(keys, text);
    }

    return (
        <View>
            <TextInput style={styles.input} onChangeText={(text) => changeText(text)} value={inputValue}/>
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
