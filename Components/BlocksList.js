import React, { useState } from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { addBlockAction } from "../redux/Actions/addBlockAction";

export const BlocksList = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch()

  const onPressEvent = (id, type) => {
    dispatch(addBlockAction({id: id, type: type, count: 1}))
  }

  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={() => setShow(!show)}>
        <Text style={styles.menu}>menu</Text>
      </TouchableOpacity>
      {show &&
        <FlatList
          data={[
            {type: 'variable'},
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
  )
}

const styles = StyleSheet.create({
  view: {
    width: '30%'
  },

  button: {
    backgroundColor: 'lightblue',
  },

  text: {
    fontSize: 18
  }
})
