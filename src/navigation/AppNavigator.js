import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import React from 'react';
import ToDoListScreen from '../screens/TodoScreen/TodoList';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName="ToDoList"
    screenOptions={({route}) => ({
      headerShown: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'ToDoList') {
          iconName = 'list';
        } else if (route.name === 'Profile') {
          iconName = 'user-o';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    }}>
    <Tab.Screen name="ToDoList" component={ToDoListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default AppNavigator;
