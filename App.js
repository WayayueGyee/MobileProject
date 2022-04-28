import React from "react";
import {ScrollView, View} from "react-native";
import { Provider } from "react-redux";
import { Store } from './redux/store';
import { BlocksList } from './Components/BlocksList';
import { RenderList } from "./Components/RenderList";
import {RenderObj} from "./Components/RenderObj";


const App = () => {
  return (
    <Provider store={Store}>
      <ScrollView>
        {/*<BlocksList/>
        <RenderList/>*/}
        <RenderObj/>
      </ScrollView>
    </Provider>
  );
};

export default App;
