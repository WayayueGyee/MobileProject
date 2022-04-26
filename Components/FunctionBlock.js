import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FunctionInput } from "./FunctionInput";
import { AddValueInputAction } from "../redux/Actions/AddValueInputAction";

export const FunctionBlock = (props) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.addBlockReducer);
  const [count, setCount] = useState(2);

  const addButtonEvent = (data) => {
    setCount(count + 1);
    dispatch(AddValueInputAction(data));
  }

  return(
    <View style={styles.component}>
      <View style={styles.view}>
        <Text style={styles.text}>Variable</Text>
        <View style={styles.inputView}>
          <TextInput blockId={props.id} style={styles.inputFirst} placeholder={"variable name"}/>
          {Object.values(data.functionBlocks[props.id].content.value).map((item) => {
            return (
              <FunctionInput id={props.id} count={item.valueId}/>
            )
          })}
          <TouchableOpacity style={styles.button}
            onPress={() => addButtonEvent({id: props.id, valueId: count, text: ''})}>
            <Text>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },

  view: {
    backgroundColor: 'grey',
    marginTop: 20,
    padding: 10,
    width: '80%',
  },

  inputView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  text: {
    color: "#000"
  },

  inputFirst: {
    borderWidth: 1,
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: 0
  },

  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: 20,
  },

  button: {
    backgroundColor: 'lightblue',
    flex: 1,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center"
  }
})
