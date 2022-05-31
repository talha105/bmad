import React, {Component, useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import NewPostScreen from './NewPostScreen';
import MessageIcon from '../../Components/MessageIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import {themeRed} from '../../Assets/Colors/Colors';

const NewPostStack = ({navigation}) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="newpost">
      <Stack.Screen
        name="newpost"
        options={({route}) => ({
          headerStyle: {height: 110, backgroundColor: themeRed},
          headerStatusBarHeight: 32,
          headerTitle: props => (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
              }}>
              New Post
            </Text>
          ),
          headerTransparent: false,
          headerLeft: () => (
            <View style={{left: 20}}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={25} color="white" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                backgroundColor: themeRed,
                borderRadius: 50,
                borderColor: themeRed,
                borderWidth: 1,
                right: 20,
              }}>
              {/* <Image
                resizeMode="contain"
                source={require('./../../Assets/Images/Check.png')}
                style={{width: 20, height: 20, margin: 4}}
              /> */}
            </View>
          ),
        })}
        component={NewPostScreen}
      />
    </Stack.Navigator>
  );
};

export default NewPostStack;
