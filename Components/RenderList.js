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
        Object.values(data.functionBlocks).map((item) => {
        switch (item.type) {
          case 'function': {
            return (
              <>
                <Text>{item.id}</Text>
                <FunctionBlock key={item.id} id={item.id}/>
              </>
            )
          }

          case 'variable': {
            return (
                <>
              <DeclareBlock key={item.id} id={item.id}/>
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
