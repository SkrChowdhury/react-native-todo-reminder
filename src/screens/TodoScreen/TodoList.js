import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import {launchImageLibrary} from 'react-native-image-picker';
import {scheduleNotification} from '../../utils/notifications';

const ToDoListScreen = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [image, setImage] = useState(null);
  const [dueTime, setDueTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };

    getTasks();
  }, []);

  const addTask = () => {
    if (!task || !dueTime) {
      Alert.alert('Error', 'Please enter a task and due time');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task,
      completed: false,
      image: image,
      dueTime: dueTime,
    };
    setTasks([...tasks, newTask]);
    setTask('');
    setImage(null);
    setDueTime('');
    AsyncStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
    scheduleNotification(newTask);
  };

  const toggleTaskCompletion = id => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? {...task, completed: !task.completed} : task,
    );
    setTasks(updatedTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = id => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
          },
        },
      ],
      {cancelable: true},
    );
  };

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  const handleLogout = () => {
    AsyncStorage.setItem('token', '');
    navigation.navigate('Auth');
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      setDueTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={task}
        placeholderTextColor="#ccc"
        onChangeText={setTask}
      />
      <TouchableOpacity onPress={showTimePickerHandler}>
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            placeholder="Due Time (HH:MM)"
            placeholderTextColor="#ccc"
            value={dueTime}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      {image && <Image source={{uri: image}} style={styles.image} />}
      <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
        <Text style={styles.selectImageButtonText}>SELECT IMAGE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.selectImageButton}
        onPress={addTask}
        disabled={!task || !dueTime}>
        <Text style={styles.selectImageButtonText}>ADD TASK</Text>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.taskListContainer}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Text style={item.completed ? styles.completedTask : styles.task}>
                {item.title}
              </Text>
            </TouchableOpacity>
            {item.image && (
              <Image source={{uri: item.image}} style={styles.image} />
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButtonText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.selectImageButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    height: 40,
    borderColor: 'purple',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#E6E6FA',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  task: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: 'purple',
    width: 150,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  selectImageButton: {
    backgroundColor: 'purple',
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  selectImageButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  taskListContainer: {
    backgroundColor: '#E6E6FA',
    margin: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#9B0707',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ToDoListScreen;
