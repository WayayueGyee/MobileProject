import React, {useState} from 'react'
import { TextInput, View} from "react-native";
import { StateAPI } from '../DataController/blockStateAPI';
import { makeStyles, useTheme } from '@rneui/themed';

export type Props = {
    value: string | undefined;
    keys: Array<number | string>;
}

export const InpBlock: React.FC<Props> = ({
    value,
    keys
}) => {
    const [inputValue, setInputValue] = useState(value);
    const { theme } = useTheme();
    const styles = useStyles(theme);

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

const useStyles = makeStyles((theme) => ({
    input: {
        background: theme.colors?.white,
        color: theme.colors?.black,
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
}))
