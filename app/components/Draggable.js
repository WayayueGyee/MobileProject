import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
// import AnimatedTouchable from "./AnimatedTouchable";

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const ANIMATION_FRICTION = 8;

class Draggable extends React.Component {
  // TODO: deal with Animated.createAnimatedComponent(TouchableOpacity). This component disables animations
  #inputRange;
  #outputRange;
  #margins;

  constructor(props) {
    super(props);

    this.#margins = [
      "margin",
      "marginBottom",
      "marginTop",
      "marginEnd",
      "marginStart",
    ];
    this.state = {
      isAnimating: false,
      isDragging: false,
      isPicked: false,
      zIndex: 1,
    };

    this.animationValue = new Animated.Value(0);
    this.#inputRange = [0, 0.5, 0.6, 1];
    this.#outputRange = [1, 0.97, 0.96, 1.05];
    this.scaleEaseIn = this.animationValue.interpolate({
      inputRange: this.#inputRange,
      outputRange: this.#outputRange,
    });

    this.pan = new Animated.ValueXY(0);
    this.panResponder = this.createPanResponders();
  }

  createPanResponders() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () =>
        this.state.isPicked || (!this.state.isAnimating && this.state.isDragging),

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

        this.setState(
          { ...this.state, isDragging: true, isPicked: false },
          function () {
            console.log("Grant: ", this.state);
          },
        );
      },

      onPanResponderMove: (_, gestures) => {
        this.pan.setValue({
          x: gestures.dx,
          y: gestures.dy,
        });
      },

      onPanResponderRelease: () => {
        this.setState(
          { ...this.state, isAnimating: true, isDragging: false },
          function () {
            console.log("Released: ", this.state);
          },
        );

        // TODO: think about promises to animate using end animation callback
        Animated.spring(this.pan, {
          toValue: { x: 0, y: 0 },
          friction: ANIMATION_FRICTION,
          useNativeDriver: true,
        }).start(({}) => {
          this.pan.setValue({ x: 0, y: 0 });
          this.setState({ ...this.state, isAnimating: false }, function () {
            console.log("Animated: ", this.state);
          });
        });
      },
    });
  }

  createMargins(styles = {}) {
    let stylesMargins = {};
    this.#margins.forEach(margin => {
      stylesMargins[margin] = styles[margin] ?? 0;
    });

    return stylesMargins;
  }

  onPressIn() {
    Animated.spring(this.animationValue, {
      toValue: 1,
      duration: this.props.delayLongPress,
      friction: ANIMATION_FRICTION,
      useNativeDriver: true,
    }).start();
  }

  onLongPress() {
    this.setState({ ...this.state, zIndex: 100, isPicked: true }, function () {
      console.log("onLongPress: ", this.state);
    });
  }

  onTouchEnd() {
    Animated.spring(this.animationValue, {
      toValue: 0,
      duration: this.props.delayLongPress,
      friction: ANIMATION_FRICTION,
      useNativeDriver: true,
    }).start(({}) => {
      this.setState({ ...this.state, zIndex: 1, isDragging: false }, function () {
        console.log("onTouchEnd: ", this.state);
      });
    });
  }

  render() {
    return (
      <Animated.View
        style={[
          {
            transform: [
              { scale: this.scaleEaseIn },
              { translateX: this.pan.x },
              { translateY: this.pan.y },
            ],
            borderRadius: 10,
            overflow: "hidden",
            zIndex: this.state.zIndex,
          },
          this.createMargins(this.props.style),
        ]}
        {...this.panResponder.panHandlers}>
        <TouchableWithoutFeedback
          delayLongPress={this.props.delayLongPress}
          onLongPress={this.onLongPress.bind(this)}
          /* onPressIn={this.onPressIn.bind(this)}
          onPressOut={this.onPressOut.bind(this)} */
        >
          <View
            style={[this.props.style, this.createMargins()]}
            onTouchStart={this.onPressIn.bind(this)}
            onTouchEnd={this.onTouchEnd.bind(this)}>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

Draggable.defaultProps = {
  delayLongPress: 370,
  style: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8995ef",
    alignSelf: "center",
  },
};
Draggable.propTypes = {
  children: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  delayLongPress: PropTypes.number,
};

export default Draggable;
