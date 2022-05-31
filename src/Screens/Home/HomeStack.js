import React, {Component, useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  Image,
  LogBox,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MainPost from './MainPost';
import MessageIcon from '../../Components/MessageIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {themeRed} from '../../Assets/Colors/Colors';
LogBox.ignoreAllLogs([
  'Non-serializable values were found in the navigation state',
]);
function HomeStack({navigation}) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        options={({route}) => ({
          headerStyle: {
            borderBottomColor: 'grey',
            // borderBottomWidth: 0.7,
            height: 110,
            backgroundColor: themeRed,
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
              News Feed
            </Text>
          ),
          // 'start'
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
        component={HomeScreen}
      />
      <Stack.Screen
        name="mainpost"
        options={({route}) => ({
          headerStyle: {
            borderBottomColor: 'grey',
            borderBottomWidth: 0.7,
            height: 110,
            backgroundColor: themeRed,
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
                  source={require('./../../Assets/Images/menu1.png')}
                />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => <MessageIcon navigation={navigation} />,
        })}
        component={MainPost}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
