import React, { useContext } from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

const DNDElementsContext = React.createContext();

export function useDNDElements() {
  return useContext(DNDElementsContext);
}

// эта хуйня не работает
function createChildrensObject(childrens) {
  DNDElements = [];

  for (let i = 0; i < childrens.length; i++) {
    let x, y, width, height;

    childrens[0].measure((fx, fy, _width, _height, px, py) => {
      x = px;
      y = py;
      width = _width;
      height = _height;
    });

    let children = childrens[0];
    children.DNDElements.push({ x, y, width, height });
  }
}

function DNDElementsProvider({ children }) {
  return (
    <DNDElementsContext.Provider value={children}>
      <FlatList></FlatList>
    </DNDElementsContext.Provider>
  );
}

DNDElementsProvider.propTypes = {
  children: PropTypes.any,
};

export { DNDElementsContext };
