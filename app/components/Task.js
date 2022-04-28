import React from "react";
import PropTypes from "prop-types";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../config/colors";
import Draggable from "./Draggable";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      id: props.id,
      isDone: false,
      isDragging: false,
    };
  }

  static get propTypes() {
    return {
      text: PropTypes.string,
      id: PropTypes.number,
    };
  }

  render() {
    return (
      <Draggable style={styles.taskContainer}>
        <View style={styles.taskLeftItems}>
          <TouchableOpacity style={styles.square}></TouchableOpacity>

          <TextInput multiline={true} style={styles.taskText}>
            {this.state.text}
          </TextInput>
        </View>
        <View style={styles.taskStatus}></View>
      </Draggable>
    );
  }
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: Colors.surface,
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  taskLeftItems: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: Colors.secondary,
    // Opacity doesn't re-render on change
    opacity: 0.4,
    borderRadius: 5,
    marginEnd: 15,
  },
  taskText: {
    fontSize: 14,
    maxWidth: "80%",
    lineHeight: 16,
    paddingVertical: 0,
  },
  taskStatus: {
    width: 12,
    height: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
});

export default Task;
