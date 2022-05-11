import React, { useState } from "react";
import { ActivityIndicator, View} from "react-native";
import { useTheme, makeStyles } from "@rneui/themed"


import { BlocksList } from './Components/BlocksList';
import Console from "./Components/Console";
// import NavMenu from "./Components/NavMenu";

import { testBchFile } from "./Butch/main"
import { ButchBuilder } from "./Butch/Butch";

type AppData = { builder: ButchBuilder, new?: string }; 

function initApp(): Promise<AppData> {
  let appData: AppData;
  const tasks = [
    ButchBuilder.initDefaultBuilder().then(builder => {
      appData = { ...appData, builder };
    }),
  ]

  return Promise.all(tasks).then(() => appData)
}

export const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData | undefined>();
  
  const { theme } = useTheme();
  const styles = useStyles(theme);

  if (!appData) {
    initApp().then(data => {
      setAppData(data);
      
      // for debugging
      testBchFile(data.builder);
    })

    return <View style={styles.loadScreen}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>   
  } 
  else return (
    <View style={{ zIndex: 0 }}>

      {/* <Console builder={appData.builder}/> */}
      <BlocksList/>
    </View>
  )
}

const useStyles = makeStyles(theme => ({
  loadScreen: {
    backgroundColor: theme.colors?.background,
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%",
  }
}))

export default App
