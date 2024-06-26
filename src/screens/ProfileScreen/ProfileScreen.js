import {Image, StyleSheet, Text, View} from 'react-native';

import React from 'react';

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>John Doe</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
