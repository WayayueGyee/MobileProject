import React  from "react";
import {StyleSheet, TextInput, View} from "react-native";
import { FuncBlock } from "./FuncBlock";
import { DeclBlock } from "./DeclBlock";
import { Input, Icon, useTheme } from '@rneui/themed';
import state from '../Data/blocksState';

export const RenderObj = () => {
    const data = state;
    const { theme } = useTheme();
    
    return (
        <View style={styles.view}>
            {
                Object.entries(data).map(([key, value]) => {
                    switch (value.type) {
                        case "function": {
                            return (
                                <View style={styles.obj}>
                                    <Input
                                        placeholder="name"
                                        leftIcon={
                                            <Icon
                                                name='edit-3'
                                                type='feather'
                                                color={theme.colors.primary}
                                            />
                                        }
                                        value={value.name}
                                        />
                                    <FuncBlock content={value.content} keys={[key]}/>
                                </View>
                            )
                        }

                        case "declare": {
                            return (
                                <View style={styles.obj}>
                                    <TextInput style={styles.input} value={value.name}/>
                                    <DeclBlock content={value.content} keys={[key]}/>
                                </View>
                            )
                        }
                    }
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    obj: {
        backgroundColor: 'grey',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },

    button: {
        backgroundColor: 'lightblue',
    },

    text: {
        color: '#000',
        fontSize: 18
    },

    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginTop: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
