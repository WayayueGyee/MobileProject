import React from 'react'
import { StyleSheet, TextInput } from "react-native";

export const VarInputValue = () => {
  return (
    <TextInput style={styles.input} placeholder={"variable value"}/>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: 20,
  }
})
