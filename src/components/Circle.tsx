import React from "react";
import { StyleSheet } from "react-native";

import Draggable from "./Draggable";

function Circle() {
  return <Draggable style={styles.circle}></Draggable>;
}

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8995ef",
    alignSelf: "center",
  },
});

export default Circle;
