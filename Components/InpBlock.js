import React from 'react'
import {useDispatch} from "react-redux";
import {changeObjectAction} from "../redux/Actions/changeObjectAction";
import {StyleSheet, TextInput, View} from "react-native";

export const InpBlock = (props) => {
    const dispatch = useDispatch();

    const changeText = (text) => {
        //alert(props.keys)
        dispatch(changeObjectAction({keys: props.keys, value: text}))
    }

    return (
        <View>
            <TextInput style={styles.input} onChangeText={(text) => changeText(text)} value={props.value}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        color: 'black',
        marginLeft: 10,
        marginRight: 10,
        minWidth: 50,
        borderRadius: 10
    }
})
