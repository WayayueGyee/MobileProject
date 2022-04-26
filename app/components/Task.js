import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";

import Colors from "../config/colors";
import DraggableElement from "./DraggableElement";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      id: props.id,
      isDone: false,
      isDragging: false,
    };

    this.pan = new Animated.ValueXY();
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        Animated.event([null, { dx: this.pan.x, dy: this.pan.y }], {
          useNativeDriver: false,
        });
      },
      // onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.pan.flattenOffset();
      },
      // onPanResponderTerminate: (evt, gestureState) => {
      //   // Another component has become the responder, so this gesture
      //   // should be cancelled
      // },
      // onShouldBlockNativeResponder: (evt, gestureState) => {
      //   // Returns whether this component should block native components from becoming the JS
      //   // responder. Returns true by default. Is currently only supported on android.
      //   return true;
      // },
    });
  }

  render() {
    return (
      <DraggableElement>
        <TouchableOpacity>
          <View style={styles.taskContainer}>
            <View style={styles.taskLeftItems}>
              <TouchableOpacity style={styles.square}></TouchableOpacity>

              <TextInput multiline={true} style={styles.taskText}>
                {this.state.text}
              </TextInput>
            </View>
            <View style={styles.taskStatus}></View>
          </View>
        </TouchableOpacity>
      </DraggableElement>
    );
  }
}

function handleDragStart() {}

function handleDragLeave() {}

function handleDragOver() {}

function handleDragEnd() {}

function handleDrop() {}

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
