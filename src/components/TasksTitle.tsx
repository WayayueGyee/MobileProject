import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

function TasksTitle() {
  return (
    <View style={styles.titleContainer}>
      <TextInput style={styles.titleInput}>Today&apos;s tasks</TextInput>
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
