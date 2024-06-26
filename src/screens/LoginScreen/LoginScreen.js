import {
  BackHandler,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Disable hardware back press when on this screen
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must only contain numbers');
      return;
    } else {
      setPasswordError('');
    }

    await AsyncStorage.setItem('token', 'dummy-token');
    navigation.navigate('Main');
  };

  const validateEmail = email => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const validatePassword = password => {
    const passwordPattern = /^[0-9]+$/;
    return passwordPattern.test(password);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logoImage}
      />
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: '#E6E6FA',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    borderRadius: 10,
    borderColor: 'purple',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  loginButton: {
    height: 40,
    backgroundColor: 'purple',
    marginTop: 20,
    paddingLeft: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 50,
    alignSelf: 'center',
  },
});

export default LoginScreen;
