import React from 'react';
import {StyleSheet, TextInput, View} from "react-native";
import {FuncBlock} from "./FuncBlock";
import {InpBlock} from "./InpBlock";

export type Props = {
    keys: Array<number | string>,
    content: any,
}

export const DeclBlock: React.FC<Props> = ({
    keys,
    content
}) => {
    return (
        <View>
            {
                Object.entries(content).map(([key, value]: [key: number | string, value: any]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View style={styles.obj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <FuncBlock content={value.content} keys={[...keys, key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.obj}>
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
                    }

                    return;
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    obj: {
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

    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
