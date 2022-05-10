/**
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Task from "./src/components/Task";
import TasksTitle from "./src/components/TasksTitle";
import Circle from "./src/components/Circle";
import Colors from "./src/config/colors";

const App = () => {
  const [taskList] = useState([
    { text: "Implement drag and drop 🤯", id: 1 },
    { text: "Do something cool 😎", id: 2 },
    { text: "This block needs to check blocks collision 🤣", id: 3 },
  ]);

  return (
    <View style={styles.background}>
      <View style={styles.tasksTitleAndTasks}>
        <TasksTitle />
        {taskList.map(task => (
          <Task key={task.id} text={task.text}></Task>
        ))}
      </View>
      <Circle></Circle>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tasksTitleAndTasks: {
    paddingHorizontal: 20,
    paddingTop: 94,
  },
});

export default App;
