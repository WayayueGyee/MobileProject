import React  from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { VarBlock } from "./VarBlock";

export const RenderList = () => {
  const data = useSelector(state => state.addBlockReducer);

  return (
    <View style={styles.view}>
      {data.blockArray.map((item) => {
        switch (item.type) {
          case 'variable': {
            return (
              <VarBlock/>
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
    fontSize: 18
  }
})
