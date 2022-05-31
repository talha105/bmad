import React, {Component, useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationScreen from './NotificationScreen';
import PostScreen from './PostScreen';
import MessageIcon from '../../Components/MessageIcon';
import {themeRed} from '../../Assets/Colors/Colors';
function NotificationStack({navigation}) {
  const Stack = createStackNavigator();
  return (
    // <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="notification">
      <Stack.Screen
        name="notification"
        options={({route}) => ({
          headerStyle: {
            borderBottomColor: 'grey',
            borderBottomWidth: 0.7,
            backgroundColor: themeRed,
            height: 110,
          },
          headerStatusBarHeight: 32,
          headerTitle: props => (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Notifications
            </Text>
          ),
          headerTransparent: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{}}>
              <View style={{padding: 10, top: 3}}>
                <Image
                  resizeMode="contain"
                  style={{height: 25, width: 25}}
                  source={require('./../../Assets/Images/menu1.png')}
                />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => <MessageIcon navigation={navigation} />,
        })}
        component={NotificationScreen}
      />
      <Stack.Screen
        name="post"
        options={({route}) => ({
          headerStyle: {
            borderBottomColor: 'grey',
            borderBottomWidth: 0.7,
            height: 110,
          },
          headerStatusBarHeight: 32,
          headerTitle: props => (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'black',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Post
            </Text>
          ),
          headerTransparent: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{}}>
              <View style={{padding: 10, top: 3}}>
                <Image
                  resizeMode="contain"
                  style={{height: 25, width: 25}}
                  source={require('./../../Assets/Images/menu.png')}
                />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => <MessageIcon navigation={navigation} />,
        })}
        component={PostScreen}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default NotificationStack;
