import React, { useState } from "react";
import { ScrollView } from "react-native";
import { BlocksList } from './Components/BlocksList';
import { initDefaultBuilder, testBchFile } from "./Butch/main"
import Console from "./Components/Console";

const App: React.FC = () => {
  const [ consoleComp, setConsole ] = useState<any>(undefined);

  if (!consoleComp) {
    initDefaultBuilder()
      .then(builder => {
        setConsole(<Console builder={builder}/>);
        testBchFile(builder);
      });
  }

  return (
    <ScrollView>
      <>
        { consoleComp }
        <BlocksList/>
      </>
    </ScrollView>
  )
};

export default App;
