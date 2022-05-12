import React from 'react';
import { View } from "react-native";
import { useTheme, makeStyles } from '@rneui/themed';
import { FunctionBlock } from "./FunctionBlock";
import { InputBlock } from "./InputBlock";
import { NameBlock } from './NameBlock';

export type Props = {
    keys: Array<number | string>,
    content: any,
}

export const DeclareBlock: React.FC<Props> = ({
    keys,
    content
}) => {
    const theme = useTheme();
    const styles = useStyles(theme)
    return (
        <View>
            {
                Object.entries(content).map(([key, value]: [key: number | string, value: any]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View key={key.toString()} style={styles.obj}>
                                    <NameBlock text={value.name} keys={[...keys, key]}/>
                                    <FunctionBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View key={key.toString()} style={styles.obj}>
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
    obj: {
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

    input: {
        backgroundColor: theme.colors?.warning,
        color: theme.colors?.white,
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
}))
