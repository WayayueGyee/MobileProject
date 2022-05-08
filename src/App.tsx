import React, { useState } from "react";
import { ScrollView } from "react-native";
import { BlocksList } from './Components/BlocksList';
import { testBchFile } from "./Butch/main"
import { ButchBuilder } from "./Butch/Butch";
import Console from "./Components/Console";

export const App: React.FC = () => {
  const [mainBuilder, setMainBuilder] = useState<ButchBuilder | undefined>(undefined)

  if (!mainBuilder) {
    ButchBuilder.initDefaultBuilder().then(builder => {
      setMainBuilder(builder);
      testBchFile(builder);
    });
  }

  return (
    <ScrollView>
      <>
        {
          mainBuilder ? <Console builder={mainBuilder}/> : undefined
        }
        <BlocksList/>
      </>
    </ScrollView>
  )
}
