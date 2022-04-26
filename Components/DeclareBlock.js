import React from 'react'
import {TextInput, View} from "react-native";

export const DeclareBlock = () => {
    return (
        <View>
            <TextInput placeholder={'name'}/>
            <TextInput placeholder={'value'}/>
        </View>
    )
}
