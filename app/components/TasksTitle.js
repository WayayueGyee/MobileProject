import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

function TasksTitle(props) {
  return (
    <View style={styles.titleContainer}>
      <TextInput style={styles.titleInput}>Today's tasks</TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 30,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default TasksTitle;
