import React, {useState} from 'react'
import {StyleSheet, TextInput, View} from "react-native";
import { StateAPI } from '../DataController/blockStateAPI';

export type Props = {
    value: string | undefined;
    keys: Array<number | string>;
}

export const InpBlock: React.FC<Props> = ({
    value,
    keys
}) => {
    const [inputValue, setInputValue] = useState(value);

    const changeText = (text: string) => {
        setInputValue(text);
        let keysCopy = [...keys];
        alert(keys);
        StateAPI.changeValue(keysCopy, text);
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
