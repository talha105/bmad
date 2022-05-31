import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TouchableOpacityBtn from './../../Components/TouchableOpacity';
import auth from '@react-native-firebase/auth';
import * as actions from '../../Store/Actions/index';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MainScreen = ({navigation, coords, userCoordsReducer}) => {
  const moveToTop = useRef(new Animated.ValueXY({x: 10, y: 300})).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hide();
    changePosition();
    fadeChange();

    //  LoginManager.logInWithPermissions(["public_profile",  'email',  'user_friends']).then(
    //     function(result) {
    //       if (result.isCancelled) {
    //         console.log("Login cancelled");
    //       } else {
    //         console.log(
    //           "Login success with permissions: " +
    //             result.grantedPermissions.toString()
    //         );
    //       }
    //     },
    //     function(error) {
    //       console.log("Login fail with error: " + error);
    //     }
    //   );
    //  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //  return subscriber; // unsubscribe on unmount
  }, []);

  const changePosition = () => {
    Animated.timing(moveToTop, {
      toValue: {x: 0, y: 100},
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const fadeChange = async () => {
    // const token = 'sad!#$!@$ASDAD!@#$!@#'
    // await AsyncStorage.setItem('token',token)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };

  async function onFacebookButtonPress() {
    // Attempt login with permissions\

    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]);

    console.log(result);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  useEffect(() => {
    if (userCoordsReducer?.lat == null) {
      getOneTimeLocation();
    }
    console.log(userCoordsReducer, 'userCoordsReducer');
  }, [userCoordsReducer]);

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

  // GoogleSignin.configure({
  //   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
  //   webClientId: '254533762674-l02tkehr2okrsqbuh97vq0qu4150uodh.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //   hostedDomain: '', // specifies a hosted domain restriction
  //   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  //   accountName: '', // [Android] specifies an account name on the device that should be used
  //   iosClientId: '254533762674-ja1fgpm3i3a700ojtsa9totvb4o5eb4c.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //   googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  //   openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  // });

  // const signIn = async () => {
  //   // console.log("dsdsdasdsad")
  //   try {
  //     // await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="stretch"
        source={require('./../../Assets/Images/Bg1.png')}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <Animated.View
            style={[
              {display: 'flex', justifyContent: 'center', alignItems: 'center'},
              moveToTop.getLayout(),
            ]}>
            <Image
              style={styles.imageLogo}
              resizeMode="contain"
              source={require('./../../Assets/Images/brand.png')}
            />
          </Animated.View>
          <Animated.View style={[styles.outerContainer, {opacity: fadeAnim}]}>
            <Animated.View style={styles.innerContainer}>
              <TouchableOpacityBtn
                onPress={() => navigation.navigate('login')}
                title="Sign In"
              />
            </Animated.View>
            <Animated.View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: 30,
                // backgroundColor: 'blue',
                borderWidth: 1,
                borderRadius: 25,
                borderColor: 'white',
              }}>
              <TouchableOpacity
                onPress={() => {
                  // return
                  navigation.navigate('signup');
                }}
                style={{
                  borderWidth: 0,
                  borderColor: 'white',
                  width: wp('60%'),
                  height: hp('6%'),
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Text
                  style={{
                    color: 'white',
                    //   fontFamily: ''
                    fontFamily: 'Poppins-Regular',
                    fontSize: hp('2'),
                    textAlign: 'center',
                  }}>
                  {'Sign Up'}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacityBtn
                onPress={() => {
                  // return
                  navigation.navigate('signup');
                }}
                title="Sign Up"
              /> */}
            </Animated.View>
            <Animated.View style={{padding: 30}}>
              {/* <Text style={styles.touchableOpacityText}>OR</Text> */}
            </Animated.View>
            <Animated.View
              style={{
                // padding: 30,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              {/* <LoginButton
                  onLoginFinished={(error, result) => {
                    if (error) {
                      console.log('login has error: ' + result.error);
                    } else if (result.isCancelled) {
                      console.log('login is cancelled.');
                    } else {
                      if (Platform.OS === 'ios') {
                        AuthenticationToken.getAuthenticationTokenIOS().then((data) => {
                          console.log(data?.authenticationToken);
                        });
                      } else {
                        AccessToken.getCurrentAccessToken().then((data) => {
                          console.log(data?.accessToken.toString());
                        });
                      }
                    }
                  }}
                  onLogoutFinished={() => console.log('logout.')}
                  loginTrackingIOS={'limited'}
                  nonceIOS={'my_nonce'}
                /> */}
              {/* <TouchableOpacity
                onPress={() => {
                  return;
                  onFacebookButtonPress().then(() =>
                    console.log('Signed in with Facebook!'),
                  );
                }}>
                <Image
                  style={styles.icons}
                  resizeMode="contain"
                  source={require('./../../Assets/Images/Facebook.png')}
                />
              </TouchableOpacity> */}
              {/* <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
                /> */}
                {/* // disabled={this.state.isSigninInProgress} */}

              {/* <TouchableOpacity>
                <Image
                  style={styles.icons}
                  resizeMode="contain"
                  source={require('./../../Assets/Images/Instagram.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.icons}
                  resizeMode="contain"
                  source={require('./../../Assets/Images/twitter.png')}
                />
              </TouchableOpacity> */}
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

var styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: hp('100%'),
  },
  touchableOpacity: {
    borderWidth: 2,
    borderColor: 'white',
    width: wp('60%'),
    height: hp('6%'),
    justifyContent: 'center',
    borderRadius: 25,
  },
  touchableOpacityText: {
    color: 'white',
    //   fontFamily: ''
    fontFamily: 'Poppins-Regular',
    fontSize: hp('2'),
    textAlign: 'center',
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backgroundImage: {
    flex: 1,
    // or 'stretch'
  },
  imageLogo: {
    width: wp('35%'),
    height: hp('35%'),
  },
  outerContainer: {
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('70%'),
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  icons: {
    width: 70,
    height: 70,
  },
});

export default connect(null, actions)(MainScreen);
