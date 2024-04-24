import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks !== null) {
          setTaskList(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load the tasks.');
      }
    };

    loadTasks();
  }, []);

  const handleAddOrUpdateTask = async () => {
    if (task.length === 0) {
      return;
    }
    let updatedTasks;
    if (editIndex >= 0) {
      updatedTasks = [...taskList];
      updatedTasks[editIndex] = task;
      setEditIndex(-1);
    } else {
      updatedTasks = [...taskList, task];
    }
    setTaskList(updatedTasks);
    setTask('');
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save the tasks.');
    }
  };

  const handleDeleteTask = index => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            const newTaskList = taskList.filter((_, i) => i !== index);
            setTaskList(newTaskList);
            await AsyncStorage.setItem('tasks', JSON.stringify(newTaskList));
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleEditTask = (item, index) => {
    setTask(item);
    setEditIndex(index);
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#282c34' : '#f7f7f7',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily Task Manager</Text>
      </View>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={{ padding: 20 }}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTask}
            value={task}
            placeholder="Enter a new task"
            placeholderTextColor={isDarkMode ? '#c9ada7' : '#4a4e69'}
          />
          <TouchableOpacity onPress={handleAddOrUpdateTask} style={styles.buttonStyle}>
            <Text style={styles.textStyle}>{editIndex >= 0 ? 'Update Task' : 'Add Task'}</Text>
          </TouchableOpacity>
          {taskList.map((item, index) => (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskText}>{item}</Text>
              <TouchableOpacity onPress={() => handleEditTask(item, index)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#4a4e69',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputStyle: {
    backgroundColor: '#85300f',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    fontSize: 16,
  },
  buttonStyle: {
    backgroundColor: '#9a8c98',
    padding: 12,
    margin: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  textStyle: {
    color: '#22223b',
    fontSize: 18,
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#85300f',
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#f2e9e4',
    padding: 6,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#c71f37',
    padding: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#333',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default App;
