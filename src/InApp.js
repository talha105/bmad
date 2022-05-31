import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, LogBox, Text} from 'react-native';
import Home from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import Location from 'react-native-vector-icons/MaterialIcons';
import Notification from 'react-native-vector-icons/Ionicons';
import HomeStack from './Screens/Home/HomeStack';
import BmadStack from './Screens/BMAD/BmadStack';
import NewPostStack from './Screens/NewPost/NewPostStack';
import NotificationStack from './Screens/Notification/NotificationStack';
import NearMeStack from './Screens/NearMe/NearMeStack';
import UserStack from './Screens/Users/UsersStack';
import MessageStack from './Screens/Messages/MessageStack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OfferADrink from './Screens/Offer/OfferADrink';
import OutOfDrink from './Screens/Offer/OutOfDrink';
import ProceedToPay from './Screens/Offer/ProceedToPay';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Animated, {interpolate} from 'react-native-reanimated';
import {withFancyDrawer} from './withFancyHeader';
import DrawerContent from './CustomDrawer';
import {CreditCards} from './Screens/Offer/AddCard/CreditCards';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileStack from './Screens/Home/Profile/ProfileStack';
import PushNotification from 'react-native-push-notification';
import {connect} from 'react-redux';
import ChatStack from './Screens/Chat/ChatStack';
import * as actions from './Store/Actions';
import {NavigationContainer} from '@react-navigation/native';
import Connections from './Screens/Connections/Connections';
import ConnectionStack from './Screens/Connections/ConnectionStack';
import messaging from '@react-native-firebase/messaging';
import {io} from 'socket.io-client';
import MyProfileScreen from './Screens/Home/Profile/MyProfileScreen';
import Geolocation from '@react-native-community/geolocation';

LogBox.ignoreLogs([
  'Warning: Cannot update a component (`MainAppScreens`) while rendering a different component (`DrawerView`). To locate the bad setState() call inside `DrawerView`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render',
]);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export const AnimatedContext = React.createContext(void 0);
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const STACK = createStackNavigator();

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('FCM Authorization:', authStatus);
  }
};

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HOME"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        // inactiveTintColor:'red',
        tabStyle: {
          borderBottomLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 70,
          // commented for android mobiles
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 3.84,
          // elevation: 5,
          backgroundColor: '#F8F8F8',
        },

        // inactiveBackgroundColor:'#F8F8F8',
        activeBackgroundColor: '#F8F8F8',
        activeTintColor: '#B01125',

        style: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          borderBottomLeftRadius: 14,
          borderTopRightRadius: 14,
          height: 70,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: '#F8F8F8',
        },
        iconStyle: {
          marginTop: 0,
        },
        labelStyle: {
          marginBottom: 0,
          paddingBottom: 7,
        },
      }}>
      <Tab.Screen
        name="HOME"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Home name="home" style={{}} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="nearme"
        component={NearMeStack}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            // if (route.state && route.state.routeNames.length > 0) {
            navigation.navigate('nearme');
            // }
          },
        })}
        options={({navigation}) => ({
          tabBarLabel: 'Nearby Me',
          tabBarIcon: ({color, size}) => {
            // console.log(navigation)
            return (
              <Location
                name="location-on"
                style={{}}
                size={size}
                color={color}
                // onPress={() => {
                //   navigation.navigate('nearme', {
                //     screen: 'nearme',
                //     initial: false,
                //   });
                // }}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="newpost"
        component={NewPostStack}
        options={{
          tabBarLabel: 'New Post',
          tabBarIcon: ({color, size}) => (
            <Home name="plus-square" style={{}} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="notification"
        component={NotificationStack}
        options={({navigation}) => ({
          tabBarLabel: 'Notification',
          tabBarIcon: ({color, size}) => (
            <Notification
              name="notifications-outline"
              style={{}}
              size={size}
              color={color}
              onPress={() => {
                navigation.navigate('notification', {
                  screen: 'notification',
                  initial: false,
                });
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="BMAD"
        component={ProfileStack}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            // if (route.state && route.state.routeNames.length > 0) {
            navigation.navigate('BMAD');
            // }
          },
        })}
        options={({navigation}) => ({
          tabBarLabel: 'BMAD',
          tabBarIcon: ({color, size}) => (
            <Notification
              name="fast-food-outline"
              style={{}}
              size={size}
              color={color}
              // onPress={() => {
              //   navigation.navigate('BMAD', {
              //     screen: 'BMAD',
              //     initial: false,
              //   });
              // }}
            />
          ),
        })}
      />
      {/* <Tab.Screen
        name="userStack"
        component={UserStack}
        options={{
          tabBarLabel: 'BMAD',
          tabBarIcon: ({color, size}) => (
            <Notification
              name="fast-food-outline"
              style={{}}
              size={size}
              color={color}
            />
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="bmad"
        component={BmadStack}
        options={{
          tabBarVisible: true,
          tabBarIcon: () => null,
          tabBarLabel: '',
          tabBarAccessibilityLabel: '',
          tabBarVisibilityAnimationConfig: () => null,
          tabBarButton: () => null,
        }}
      /> */}
      <Tab.Screen
        name="message"
        component={MessageStack}
        options={{
          tabBarVisible: true,
          tabBarIcon: () => null,
          tabBarLabel: '',
          tabBarAccessibilityLabel: '',
          tabBarVisibilityAnimationConfig: () => null,
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const BottomTab = ({navigation}) => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <MyTabs Navi={navigation} />;
};

const MainAppScreens = ({
  userGet,
  userReducer,
  getNotifications,
  saveSocketRef,coords
}) => {
  const socket = useRef();
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const USER_ID = userReducer?.data?.user_id;
  socket.current = io('http://webprojectmockup.com:9444');

  useEffect(() => {
    // console.log("=================",socket.current)
    saveSocketRef(socket.current);
    // registerAppWithFCM()
    messaging()
      .subscribeToTopic('bmad' + userReducer?.data?.user_id?.toString())
      .then(() => {
        // console.log('NOTIFICATIONS SUBSCRIBED');
      });

    try {
      messaging()
        .getToken()
        .then(token => {
          // console.log('TOKEN: : : : :  :', token);
          // setFCMToken(token);
        });
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
          }
        });

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log(remoteMessage, 'sadasdasd');

        // Call api to get notifications data
        if (remoteMessage?.data?.type == 'likePost') {
          getNotifications(USER_ID);
        }
        // if (remoteMessage?.data?.type == 'reject') {
        // }

        if (remoteMessage.notification) {
          PushNotification.localNotification({
            channelId: 'channel-id',
            channelName: 'My channel',
            message: remoteMessage.notification.body,
            playSound: true,
            title: remoteMessage.notification.title,
            priority: 'high',
            soundName: 'default',
          });
        }
      });
      return unsubscribe;
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    requestUserPermission();
    getOneTimeLocation();
  }, []);

  const getOneTimeLocation = () => {
    // console.log('one time==================');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        // setLocationStatus('You are Here');
        // console.log("----------------- get one time")
        coords(position.coords.latitude, position.coords.longitude);

        console.log('getting one time location coords...');
      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  return (
    <AnimatedContext.Provider value={animatedValue}>
      <View style={{backgroundColor: '#B01125', flex: 1}}>
        <NavigationContainer>
          <Drawer.Navigator
            statusBarAnimation="slide"
            minSwipeDistance={12}
            drawerStyle={{
              backgroundColor: 'transparent',
            }}
            drawerType={'slide'}
            initialRouteName="home"
            overlayColor="transparent"
            drawerContent={props => {
              setAnimatedValue(props.progress);
              return <DrawerContent {...props} />;
            }}>
            <Drawer.Screen name="home" component={withFancyDrawer(BottomTab)} />
            {/* <Drawer.Screen
              name="cards"
              component={withFancyDrawer(CreditCards)}
            /> */}
            <Drawer.Screen
              name="connections"
              component={withFancyDrawer(ConnectionStack)}
            />
            <Drawer.Screen
              name="profile"
              component={withFancyDrawer(MyProfileScreen)}
            />

            {/* <Drawer.Screen
              name="Change Password"
              component={withFancyDrawer(MyProfileScreen)}
            /> */}

            <STACK.Screen
              name="OfferADrink"
              options={{headerShown: false}}
              component={withFancyDrawer(OfferADrink)}
            />
            <STACK.Screen
              name="OutOfDrink"
              options={{headerShown: false}}
              component={withFancyDrawer(OutOfDrink)}
            />
            <STACK.Screen
              name="ProceedToPay"
              options={{headerShown: false}}
              component={withFancyDrawer(ProceedToPay)}
            />
            <STACK.Screen
              name="chats"
              options={{headerShown: false}}
              component={withFancyDrawer(ChatStack)}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    </AnimatedContext.Provider>
  );
};

// function mapStateToProps({getNearMeUsers}) {
//   return {getNearMeUsers};
// }
const mapStateToProps = ({userReducer}) => {
  return {userReducer};
};
export default connect(mapStateToProps, actions)(MainAppScreens, MyTabs);
// export default MainAppScreens;
var styles = StyleSheet.create({
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
});
