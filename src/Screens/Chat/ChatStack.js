import React, {Component, useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {imageUrl} from '../../Config/Apis.json';
import {connect} from 'react-redux';
import Chat from './Chat';
import {themeRed} from '../../Assets/Colors/Colors';

const {width, height} = Dimensions.get('window');

function ChatStack({navigation, messagesReducer}) {
  const Stack = createStackNavigator();
  const isIos = Platform.OS === 'ios';
  const IMAGE_USER = messagesReducer?.currentChat?.chatPerson?.user_image;

  return (
    <Stack.Navigator initialRouteName="chatStack">
      <Stack.Screen
        name="chat"
        options={({navigation, route}) => ({
          headerStyle: {
            borderBottomColor: 'grey',
            borderBottomWidth: 0.7,
            height: height * 0.13,
            backgroundColor: themeRed,
          },
          headerStatusBarHeight: 32,
          headerTitle: props => (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'black',
                fontFamily: 'Poppins-SemiBold',
              }}></Text>
          ),
          headerTransparent: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo name="chevron-small-left" size={35} color="white" />
              {/* <View style={{padding: 10, top: 3}}> */}
              <Image
                // resizeMode="contain"
                style={{
                  height: height * 0.055,
                  width: isIos ? width * 0.12 : width * 0.1,
                  borderRadius: width * 0.1,
                }}
                source={
                  IMAGE_USER !== null &&
                  IMAGE_USER !== '' &&
                  IMAGE_USER !== undefined
                    ? {uri: `${imageUrl}/${IMAGE_USER}`}
                    : require('./../../Assets/Images/dp.png')
                }
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: width * 0.045,
                  marginLeft: width * 0.03,
                  color: 'white',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {messagesReducer?.currentChat?.chatPerson?.user_name?.substring(
                  0,
                  20,
                )}
              </Text>
              {/* </View> */}
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <Icon name="dots-vertical" size={35} color="#B01125" />
          // ),
        })}
        component={Chat}
      />
    </Stack.Navigator>
  );
}
const mapStateToProps = ({messagesReducer}) => {
  return {messagesReducer};
};

export default connect(mapStateToProps, null)(ChatStack);
