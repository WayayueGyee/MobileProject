import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import { Store } from './redux/store';
import { BlocksList } from './Components/BlocksList';
import { RenderList } from "./Components/RenderList";


const App = () => {
  return (
    <Provider store={Store}>
      <View>
        <BlocksList/>
        <RenderList/>
      </View>
    </Provider>
  );
};

export default App;
