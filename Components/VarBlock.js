import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export const VarBlock = () => {
  return(
    <View style={styles.component}>
      <View style={styles.view}>
        <Text style={styles.text}>Variable</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputFirst} placeholder={"variable name"}/>
          <TextInput style={styles.input} placeholder={"variable value"}/>
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
    marginTop: 30,
    padding: 20,
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
    marginLeft: 20
  },

  button: {
    backgroundColor: 'lightblue',
    flex: 1,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center"
  }
})
