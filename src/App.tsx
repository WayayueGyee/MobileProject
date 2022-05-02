// import 'react-native-gesture-handler'
import React from "react";
import { ScrollView } from "react-native";
import { BlocksList } from './Components/BlocksList';
import "./Butch/main";

const App: React.FC = () => {
  return (
    <ScrollView>
      <BlocksList/>
    </ScrollView>
  );
};

export default App;
