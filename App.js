/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Task from "./app/components/Task";
import TasksTitle from "./app/components/TasksTitle";

import Colors from "./app/config/colors";

const App = () => {
  const [taskList, setTaskList] = useState([
    { text: "Implement drag and drop", id: 1 },
    { text: "Do something cool", id: 2 },
  ]);

  return (
    <View style={styles.background}>
      <View style={styles.tasksTitleAndTasks}>
        <TasksTitle />
        {taskList.map(task => (
          <Task key={task.id} text={task.text}></Task>
        ))}
      </View>
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
