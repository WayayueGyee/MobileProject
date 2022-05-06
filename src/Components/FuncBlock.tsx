import React from 'react';
import { View} from "react-native";
import { DeclBlock } from "./DeclBlock";
import { InpBlock } from './InpBlock';
import { useTheme, makeStyles } from '@rneui/themed';
import { NameBlock } from './NameBlock';

export type Props = {
    content: Object;
    keys: Array<number | string>;
}

export const FuncBlock: React.FC<Props> = ({
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
                                <View style={styles.funcObj}>
                                    <NameBlock text={value.name} keys={[...keys, key]}/>
                                    <FuncBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.funcObj}>
                                    <NameBlock text={value.name} keys={[...keys, key]}/>
                                    <DeclBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "text": {
                            return (
                                <InpBlock keys={[...keys, key]} value={value.value}/>
                            )
                        }

                        default: {
                            return;
                        }
                    }
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
