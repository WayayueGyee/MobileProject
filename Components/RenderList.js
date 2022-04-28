import React  from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { FunctionBlock } from "./FunctionBlock";
import {DeclareBlock} from "./DeclareBlock";

export const RenderList = () => {
  const data = useSelector(state => state.addBlockReducer);

  return (
    <View style={styles.view}>
      {
        Object.entries(data).map(([key, value]) => {
        switch (value.type) {
          case 'function': {
            return (
              <>
                <Text>{key}</Text>
                <FunctionBlock key={key} id={key}/>
              </>
            )
          }

          case 'variable': {
            return (
                <>
              <DeclareBlock key={key} id={key}/>
              </>
            )
          }
        }
      })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
  },

  text: {
    color: '#000',
    fontSize: 18
  }
})
