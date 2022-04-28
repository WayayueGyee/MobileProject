import React, { useState } from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from "react-native";
import blocksState from "../Data/blocksState"; 
import {RenderObj} from "./RenderObj";

export const BlocksList: React.FC = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(<RenderObj/>);
  const block: any = blocksState;
  
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
    <View>
      <View style={styles.view}>
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Text>menu</Text>
        </TouchableOpacity>
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
      </View>
      {state}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    width: '30%'
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
})
