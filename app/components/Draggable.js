import React from "react";
import PropTypes from "prop-types";
import { Animated, PanResponder, TouchableOpacity } from "react-native";
// import AnimatedTouchable from "./AnimatedTouchable";

const ANIMATION_FRICTION = 8;
// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class Draggable extends React.Component {
  // TODO: deal with Animated.createAnimatedComponent(TouchableOpacity). This component disables animations
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      isDragging: false,
    };
    this.pan = new Animated.ValueXY(0);
    this.panResponder = this.createPanResponders();
  }

  createPanResponders() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () =>
        !this.state.isAnimating && this.state.isDragging,

      onPanResponderGrant: () => {
        /*
         * We can either lock dragging of the element during the animation or
         * set element value to (0, 0) on start dragging event
         */
        // this.pan.setValue({ x: 0, y: 0 });
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        });
      },

      onPanResponderMove: (_, gestures) => {
        this.pan.setValue({
          x: gestures.dx,
          y: gestures.dy,
        });
      },

      onPanResponderRelease: () => {
        this.setState({ ...this.state, isDragging: false });
        this.setState({ ...this.state, isAnimating: true });

        Animated.spring(this.pan, {
          toValue: { x: 0, y: 0 },
          friction: ANIMATION_FRICTION,
          useNativeDriver: true,
        }).start(({}) => {
          this.pan.setValue({ x: 0, y: 0 });
          this.setState({ ...this.state, isAnimating: false });
        });
      },
    });
  }

  static get propTypes() {
    return {
      children: PropTypes.any,
      style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    };
  }

  onLongPress() {
    this.setState({ ...this.state, isDragging: true }, function () {
      console.log("onLongPress: ", this.state);
    });
  }

  onPressOut() {
    this.setState({ ...this.state, isDragging: false }, function () {
      console.log("onPressOut: ", this.state);
    });
  }

  render() {
    return (
      <Animated.View
        style={{
          transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
        }}
        {...this.panResponder.panHandlers}>
        <TouchableOpacity
          onLongPress={this.onLongPress.bind(this)}
          onPressOut={this.onPressOut.bind(this)}
          style={this.props.style}>
          {this.props.children}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default Draggable;
