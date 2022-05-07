import React, { useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import blocksState from "../Data/blocksState"; 
import {RenderObj} from "./RenderObj";
import { useTheme, makeStyles } from '@rneui/themed';
import { HeaderMenu } from "./HeaderMenu";

export const BlocksList: React.FC = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(<RenderObj/>);
  const block: any = blocksState;
  const { theme } = useTheme();
  const styles = useStyles(theme);
  
  const onPressEvent = (id: number | string, type: string) => {
    block[id] = {
      type: type,
      name: '123',
      content: {
        1: {
          type: 'text', value: '123'
        }
      }
    }

    setState(<RenderObj/>);
  }

  return (
    <View style={styles.commonView}>
        <HeaderMenu/>
        {show &&
          <FlatList
            data={[
              {type: 'declare'},
              {type: 'operation'},
              {type: 'function'}
            ]}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => onPressEvent(Date.now(), item.type)} style={styles.button}>
                  <Text style={styles.text}>{item.type}</Text>
                </TouchableOpacity>
              )
            }
          />
        }
      {state}
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  commonView: {
    backgroundColor: theme.colors?.grey0
  },

  renderView: {
    width: '100%'
  },

  button: {
    backgroundColor: 'lightblue',
  },

  text: {
    fontSize: 18
  }
}));
