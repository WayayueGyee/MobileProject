import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";

// import { DroppablesDataContext } from "./DroppablesData";
// import AnimatedTouchable from "./AnimatedTouchable";

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const ANIMATION_FRICTION = 8;

class Draggable extends React.Component {
  // TODO: deal with Animated.createAnimatedComponent(TouchableOpacity). This component disables animations
  #inputRange;
  #outputRange;
  #margins;
  #prevValue;

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
    this.#prevValue = { x: this.pan.x._value, y: this.pan.y._value };
    this.panResponder = this.createPanResponders();
  }

  createPanResponders() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () =>
        !this.state.isAnimating && (this.state.isDragging || this.state.isPicked),

      onPanResponderGrant: () => {
        console.log(this.pan.x._value, this.pan.y._value);
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        });
        this.pan.setValue({ x: 0, y: 0 });

        this.setState(
          { ...this.state, isDragging: true, isPicked: false },
          function () {
            console.log("Grant: ", this.state);
          },
        );
      },

      onPanResponderMove: (_, gesture) => {
        this.pan.setValue({
          x: gesture.dx,
          y: gesture.dy,
        });
      },

      // Maybe move this code to onTouchEnd
      onPanResponderRelease: (_, gestures) => {
        if (gestures.moveY < 400) {
          this.setState(
            { ...this.state, isDragging: false, isAnimating: true },
            function () {
              console.log("Released: ", this.state);
            },
          );
          // TODO: think about promises to animate using end animation callback
          // Проблема в анимации
          Animated.spring(this.pan, {
            toValue: { x: 0, y: 0 },
            friction: ANIMATION_FRICTION,
            tension: 20,
            useNativeDriver: true,
          }).start(({}) => {
            console.log(this.pan.x._value, this.pan.y._value);
            this.pan.setValue({ x: 0, y: 0 });
            this.pan.flattenOffset();
            this.setState(
              { ...this.state, zIndex: 1, isAnimating: false },
              function () {
                console.log("Animated: ", this.state);
              },
            );
          });
        } else {
          this.pan.flattenOffset();
          this.#prevValue = { x: this.pan.x._value, y: this.pan.y._value };
          this.setState({ ...this.state, isDragging: false });
        }
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
    }).start();
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
            zIndex: this.state.isAnimating || this.state.isDragging ? 100 : 1,
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
  droppables: PropTypes.array,
};

export default Draggable;
