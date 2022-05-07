import React, { useState } from 'react'
import { TextInput, View} from "react-native";
import { makeStyles, useTheme } from '@rneui/themed';
import { StateAPI } from '../DataController/blockStateAPI';

export type Props = {
    value: string | undefined;
    keys: Array<number | string>;
}

export const InputBlock: React.FC<Props> = ({
    value,
    keys
}) => {
    const [inputValue, setInputValue] = useState(value);
    
    const { theme } = useTheme();
    const styles = useStyles(theme);

    const changeText = (text: string) => {
        setInputValue(text);
        let keysCopy = [...keys];
        StateAPI.changeValue(keysCopy, text);
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} onChangeText={(text) => changeText(text)} value={inputValue}/>
        </View>
    )
}

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.colors?.primary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10
    },

    input: {
        color: theme.colors?.white,
        minWidth: 50,
        borderRadius: 10,
        fontSize: 16
    },
}))
