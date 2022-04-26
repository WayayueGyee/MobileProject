import React, { useRef } from "react";
import { View, Animated, PanResponder } from "react-native";

class DraggableElement extends React.Component {
  constructor(props) {
    super(props);
    this.pan = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: this.pan.x, dy: this.pan.y }],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        this.pan.flattenOffset();
      },
    });
  }

  render() {
    return (
      <Animated.View
        style={{
          transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
        }}
        {...this.panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default DraggableElement;
