import React from 'react';
import { View } from "react-native";
import { useTheme, makeStyles } from '@rneui/themed';
import { NameBlock } from './NameBlock';
import { DeclareBlock } from "./DeclareBlock";
import { InputBlock } from './InputBlock';

export type Props = {
    content: Object;
    keys: Array<number | string>;
}

export const FunctionBlock: React.FC<Props> = ({
    content,
    keys
}) => {
    const theme = useTheme();
    const styles = useStyles(theme)
    return (
        <View>
            {
                Object.entries(content).map(([key, value]: [key: string | number, value: any]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View key={key.toString()} style={styles.funcObj}>
                                    <NameBlock text={value.name} keys={[...keys, key]}/>
                                    <FunctionBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View key={key.toString()} style={styles.funcObj}>
                                    <NameBlock text={value.name} keys={[...keys, key]}/>
                                    <DeclareBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "text": {
                            return (
                                <InputBlock key={key.toString()} keys={[...keys, key]} value={value.value}/>
                            )
                        }
                    }

                    return;
                })
            }
        </View>
    )
}

const useStyles = makeStyles((theme) => ({
    funcObj: {
        backgroundColor: theme.colors?.grey5,
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

    declObj: {
        backgroundColor: 'blue',
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
        backgroundColor: theme.colors?.warning,
        color: theme.colors?.white,
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10,
        fontSize: 16
    }
}))
