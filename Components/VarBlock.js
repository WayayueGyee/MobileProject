import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AddValueInputAction } from "../redux/Actions/AddValueInputAction";

export const VarBlock = (props) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.addBlockReducer);

  const addValueInput = (data) => {
    dispatch(AddValueInputAction(data));
  }

  return(
    <View style={styles.component}>
      <View style={styles.view}>
        <Text style={styles.text}>Variable</Text>
        <View style={styles.inputView}>
          <TextInput blockId={props.id} style={styles.inputFirst} placeholder={"variable name"}/>
          <TextInput blockId={props.id} value={data.blockArray[props.id].value[props.count].value} style={styles.inputFirst} placeholder={"variable value"}
                     onChangeText={(text) => addValueInput({id: props.id, valueId: 1, value: text})}/>
          <TouchableOpacity style={styles.button}>
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
