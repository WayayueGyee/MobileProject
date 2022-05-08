import React, { useState } from 'react'
import { TextInput } from "react-native";
import { makeStyles, useTheme } from '@rneui/themed';
import { StateAPI } from '../DataController/blockStateAPI';

export type Props = {
    text: string | undefined;
    keys: Array<number | string>;
}

export const NameBlock: React.FC<Props> = ({
    text,
    keys
}) => {
    const [inputValue, setInputValue] = useState(text);
    
    const { theme } = useTheme();
    const styles = useStyles(theme);

    const changeText = (text: string) => {
        setInputValue(text);
        const keysCopy = [...keys];
        StateAPI.changeName(keysCopy, text);
    }

    return (
        <>
            <TextInput style={styles.input} onChangeText={(text) => changeText(text)} value={inputValue}/>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    input: {
        backgroundColor: theme.colors?.warning,
        color: theme.colors?.white,
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10,
        fontSize: 16
    }
}))
