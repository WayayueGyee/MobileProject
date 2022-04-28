import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

class Droppable extends React.Component {
  constructor() {}

  static get propTypes() {
    return {
      children: PropTypes.any,
    };
  }

  render() {
    return <View></View>;
  }
}

export default Droppable;
