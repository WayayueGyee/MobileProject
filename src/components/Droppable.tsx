import React, { useState, useCallback, useRef, useContext } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
// import { DroppablesDataContext } from "./DroppablesData";
// import { DroppablesData } from "./DroppablesData";

declare interface DroppableProps {
  style?: Array<object> | object;
  children?: React.ReactNode | undefined;
}

type MeasureData = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

const useComponentData = () => {
  const [data, setData] = useState<MeasureData>(null);

  const onLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setData({ x, y, width, height });
  }, []);

  return [data, onLayout];
};

//
// Структура хранения данных droppable и draggable компонент
// const obj = [
//   {
//     coordinates: { x: 0, y: 0 },
//     size: { width: 100, height: 300 },
//     children: [
//       {
//         coordinates: { x: 10, y: 20 },
//         size: { width: 80, height: 280 },
//       },
//     ],
//   },
//   {
//     coordinates: { x: 0, y: 320 },
//     size: { width: 100, height: 100 },
//     children: [
//       { coordinates: { x: 10, y: 340 }, size: { width: 80, height: 30 } },
//       { coordinates: { x: 10, y: 360 }, size: { width: 80, height: 30 } },
//     ],
//   },
// ];

// // 0-0
// obj[0].children[0];

//console.log(obj[0].children[0]);

function Droppable({ style, children }: DroppableProps) {
  const reference = useRef(null);

  const logPropsChildrens = () => {
    console.log();
  };

  const logRef = () => {
    // console.log(
    //   reference.current._children[0].measure((fx, fy, width, height, px, py) => {
    //     console.log({ fx, fy, width, height, px, py });
    //   }),
    // );

    // console.log(reference.current);
    console.log(React.Children.toArray(children));
  };

  const renderChildren = () => {
    const newPositions: Array<React.ReactNode> = [];

    React.Children.map(children, children => {
      newPositions.push(
        // React.createElement(children.type.displayName, children.props,),
        children,
      );
    });

    console.log(newPositions);

    return newPositions;
  };

  return (
    <View ref={reference} onTouchStart={logRef} style={style}>
      {renderChildren()}
    </View>
  );
}

// Droppable.defaultProps = {
//   style: {
//     justifyContent: "center",
//     alignSelf: "center",
//     padding: 20,
//     backgroundColor: "#f58181",
//     width: 300,
//     height: 200,
//   },
// };
Droppable.propTypes = {
  children: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Droppable;
