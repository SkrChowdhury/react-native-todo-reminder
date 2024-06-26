import AppNavigator from './AppNavigator';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Main" component={AppNavigator} />
    <Stack.Screen name="Auth" component={AuthNavigator} />
  </Stack.Navigator>
);

export default AuthNavigator;
