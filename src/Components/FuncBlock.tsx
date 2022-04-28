import React from 'react';
import {StyleSheet, TextInput, View} from "react-native";
import { DeclBlock } from "./DeclBlock";
import { InpBlock } from './InpBlock';

export type Props = {
    content: Object;
    keys: Array<number | string>;
}

export const FuncBlock: React.FC<Props> = ({
    content,
    keys
}) => {
    return (
        <View>
            {
                Object.entries(content).map(([key, value]: [key: string | number, value: any]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View style={styles.funcObj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <FuncBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.funcObj}>
                                    <TextInput style={styles.input} value={value.name}/>
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

const styles = StyleSheet.create({
    funcObj: {
        backgroundColor: 'black',
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
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
