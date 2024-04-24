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
import { ToastAndroid } from 'react-native';
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
  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  
  const handleAddOrUpdateTask = async () => {
    if (task.length === 0) {
      showToast("Please enter a task.");
      return;
    }
    let updatedTasks;
    if (editIndex >= 0) {
      updatedTasks = [...taskList];
      updatedTasks[editIndex] = task;
      setEditIndex(-1);
      showToast("Task updated successfully.");
    } else {
      updatedTasks = [...taskList, task];
      showToast("Task added successfully.");
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
            showToast("Task deleted successfully.");
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
  
  const handleDeleteAllTasks = () => {
    Alert.alert(
      "Delete All Tasks",
      "Are you sure you want to delete all tasks?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            setTaskList([]);
            await AsyncStorage.setItem('tasks', JSON.stringify([]));
            showToast("All tasks deleted successfully.");
          }
        }
      ],
      { cancelable: false }
    );
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
            placeholderTextColor={isDarkMode ? '#f8f5f4' : '#f7f8fb'}
          />
          <TouchableOpacity onPress={handleAddOrUpdateTask} style={styles.buttonStyle}>
            <Text style={styles.textStyle}>{editIndex >= 0 ? 'Update Task' : 'Add Task'}</Text>
          </TouchableOpacity>
          {taskList.map((item, index) => (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskNumber}>{index + 1}:</Text>
              <Text style={styles.taskText}>{item}</Text>
              <TouchableOpacity onPress={() => handleEditTask(item, index)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {taskList.length > 1 && (
        <TouchableOpacity onPress={handleDeleteAllTasks} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Delete All Tasks</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#333652',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  inputStyle: {
    backgroundColor: '#454B66',
    padding: 14,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    fontSize: 18,
    color: '#FFFFFF',
  },
  buttonStyle: {
    backgroundColor: '#4ECDC4',
    padding: 14,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  textStyle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  taskNumber: {
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginRight: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555B6E',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 8,
    marginHorizontal: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#EF233C',
    padding: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#333652',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  footerButton: {
    backgroundColor: '#EF233C',
    padding: 16,
    alignItems: 'center',
    width: '100%'
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500'
  }
});

export default App;
