import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import AppText from './Components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from './Store/Actions';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DrawerContent = ({
  props,
  userReducer,
  SignOut,
  navigation,
  userLogin,
}) => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Image
              resizeMode="contain"
              source={require('./Assets/Images/brand.png')}
              style={{
                width: 180,
                height: 200,
              }}
            />
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Feather name="home" color="white" size={30} />
              )}
              labelStyle={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: hp('2%'),
              }}
              label="Home"
              onPress={() =>
                navigation.navigate('HOME', {
                  screen: 'home',
                  initial: false,
                })
              }
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <FontAwesome name="user-o" color="white" size={30} />
              )}
              labelStyle={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: hp('2%'),
              }}
              label=" Profile"
              // onPress={() => navigation.navigate('MyProfile')}
              onPress={() =>
                navigation.navigate('Drinks', {
                  screen: 'MyProfile',
                  initial: false,
                })
              }
            /> */}

            <DrawerItem
              icon={({color, size}) => (
                <MaterialCommunityIcons
                  name="message-processing-outline"
                  color="white"
                  size={30}
                />
              )}
              labelStyle={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: hp('2%'),
              }}
              label="Messages"
              onPress={() => navigation.navigate('message')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <MaterialIcons
                  name="connect-without-contact"
                  color="white"
                  size={30}
                />
              )}
              labelStyle={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: hp('2%'),
              }}
              label="Connections"
              onPress={() =>
                navigation.navigate('connections', {
                  screen: 'connections',
                  initial: false,
                })
              }
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Ionicons name="card-outline" color="white" size={30} />
              )}
              labelStyle={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: hp('2%'),
              }}
              label="Credit Cards"
              onPress={() => navigation.navigate('cards')}
            /> */}
            {/* <DrawerItem
              icon={({ color, size }) => (
                <Feather
                name="settings"
                color='white'
                size={30}
                />
              )}
              labelStyle={{fontFamily: 'Poppins-Regular', color: 'white', fontSize: hp('2%')}}
              label="Settings"
              onPress={() => navigation.navigate('message')}
            /> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <MaterialIcons name="logout" color="white" size={30} />
          )}
          labelStyle={{
            fontFamily: 'Poppins-Regular',
            color: 'white',
            fontSize: hp('2%'),
          }}
          onPress={() => SignOut()}
          label="Sign Out"
        />
      </Drawer.Section>
    </View>
  );
};
function mapStateToProps({userReducer, userLogin}) {
  return {userReducer, userLogin};
}
export default connect(mapStateToProps, actions)(DrawerContent);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bottomDrawerSection: {
    marginBottom: 30,
  },
});
