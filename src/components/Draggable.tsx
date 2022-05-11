import React, { useRef } from "react";
import {
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";

import { Children, IStyle } from "../types/Types";
import useStateCallback from "../hooks/useStateCallback";
// import { DroppablesDataContext } from "./DroppablesData";
// import AnimatedTouchable from "./AnimatedTouchable";

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const ANIMATION_FRICTION = 8;

interface IDraggableProps {
  children?: Children;
  style?: IStyle;
  delayLongPress?: number;
}

const inputRange = [0, 0.5, 0.6, 1];
const outputRange = [1, 0.97, 0.96, 1.05];
const margins = [
  "margin",
  "marginBottom",
  "marginTop",
  "marginEnd",
  "marginStart",
];
const createMargins = (styles: IStyle = {}) => {
  const stylesMargins: IStyle = {};
  margins.forEach(margin => {
    stylesMargins[margin] = styles[margin] ?? 0;
  });

  return stylesMargins;
};
let _animatedValueX = 0;
let _animatedValueY = 0;

function Draggable({ style, children, delayLongPress = 370 }: IDraggableProps) {
  const [state, setState] = useStateCallback({
    isAnimating: false,
    isDragging: false,
    isPicked: false,
    zIndex: 1,
  });

  const animationValue = useRef(new Animated.Value(0)).current;
  const scaleEaseIn = animationValue.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
  });

  const pan = useRef(new Animated.ValueXY()).current;
  pan.x.addListener(value => (_animatedValueX = value.value));
  pan.y.addListener(value => (_animatedValueY = value.value));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () =>
      !state.isAnimating && (state.isDragging || state.isPicked),

    onPanResponderGrant: () => {
      console.log("pan grant: ", +pan.x, +pan.y);
      pan.setOffset({
        x: _animatedValueX,
        y: _animatedValueY,
      });
      pan.setValue({ x: 0, y: 0 });

      setState({ ...state, isDragging: true, isPicked: false }, function () {
        console.log("Grant: ", state);
      });
    },

    onPanResponderMove: (_, gesture) => {
      pan.setValue({
        x: gesture.dx,
        y: gesture.dy,
      });
    },

    // Maybe move code to onTouchEnd
    onPanResponderRelease: (_, gestures) => {
      if (gestures.moveY < 400) {
        setState({ ...state, isDragging: false, isAnimating: true }, function () {
          console.log("Released: ", state);
        });
        // TODO: think about promises to animate using end animation callback
        // Проблема в анимации
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: ANIMATION_FRICTION,
          tension: 20,
          useNativeDriver: true,
        }).start(({}) => {
          pan.setValue({ x: 0, y: 0 });
          pan.flattenOffset();
          setState({ ...state, zIndex: 1, isAnimating: false }, function () {
            console.log("Animated: ", state);
          });
        });
      } else {
        pan.flattenOffset();
        pan.setOffset({ x: 0, y: 0 });
        console.log(
          "After flattening: ",
          _animatedValueX,
          _animatedValueY,
          "x, y: ",
          pan.x,
          pan.y,
        );
        setState({ ...state, isDragging: false });
      }
    },
  });

  const onPressIn = () => {
    Animated.spring(animationValue, {
      toValue: 1,
      friction: ANIMATION_FRICTION,
      useNativeDriver: true,
    }).start();
  };

  const onLongPress = () => {
    setState({ ...state, zIndex: 100, isPicked: true }, function () {
      console.log("onLongPress: ", state);
      console.log(pan.x);
    });
  };

  const onTouchEnd = () => {
    Animated.spring(animationValue, {
      toValue: 0,
      friction: ANIMATION_FRICTION,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleEaseIn },
            { translateX: pan.x },
            { translateY: pan.y },
          ],
          zIndex: state.isAnimating || state.isDragging ? 100 : 1,
        },
        createMargins(style),
      ]}
      {...panResponder.panHandlers}>
      <TouchableWithoutFeedback
        delayLongPress={delayLongPress}
        onLongPress={onLongPress}>
        <View
          style={[style, createMargins()]}
          onTouchStart={onPressIn}
          onTouchEnd={onTouchEnd}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}
// Draggable.defaultProps = {
//   delayLongPress: 370,
//   style: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#8995ef",
//     alignSelf: "center",
//   },
// };
// Draggable.propTypes = {
//   children: PropTypes.any,
//   style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
//   delayLongPress: PropTypes.number,
// };

export default Draggable;
