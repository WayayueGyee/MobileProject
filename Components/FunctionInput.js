import React from 'react'
import { StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AddValueInputAction } from "../redux/Actions/AddValueInputAction";

export const FunctionInput = (props) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.addBlockReducer);

  const addValueInput = (data) => {
    dispatch(AddValueInputAction(data));
  }

  return (
      <TextInput style={styles.input} placeholder={"variable value"}
                 value={data.functionBlocks[props.id].content.value[props.count].value}
                 onChangeText={(text) => {
                   addValueInput({id: props.id, valueId: props.count, value: text})
                 }}
      />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: 20,
    minWidth: 50
  },
})
