import React  from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { VarBlock } from "./VarBlock";

export const RenderList = () => {
  const data = useSelector(state => state.addBlockReducer);

  return (
    <View style={styles.view}>
      {
        Object.values(data.blockArray).map((item) => {
        switch (item.type) {
          case 'variable': {
            return (
              <>
                <Text>{item.id}</Text>
                <VarBlock key={item.id} id={item.id}/>
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
