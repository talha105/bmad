import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import {Badge} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
  markers,
  mapDarkStyle,
  mapStandardStyle,
} from './../../../model/mapData';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../../Components/AppText';
import {Rating} from 'react-native-elements';
import {connect} from 'react-redux';
import {imageUrl} from '../../Config/Apis.json';
import * as actions from '../../Store/Actions';
import UserProfileMarker from './../../Components/UserProfileMarker';
import YourImage from './../../Assets/Images/pic5.png';
import {Avatar} from 'react-native-elements';
import {googleMapKey, deploy_API} from './../../Config/Apis.json';
import LottieView from 'lottie-react-native';
import {themeRed} from '../../Assets/Colors/Colors';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.42;
const SPACING_FOR_CARD_INSET = width * 0.055 - 10;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01725;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const NearMeScreen = ({
  navigation,
  route,
  props,
  nearMeUsers,
  userCoordsReducer,
  saveNearmeUserData,
  usersNearmeReducer,
  userReducer,
}) => {
  // console.log(typeof userCoordsReducer?.lat, '____________________COORDINATES');
  const _map = useRef(null);
  const USER_ID = userReducer?.data?.user_id;
  const _scrollView = useRef(null);
  const isIOS = Platform.OS === 'ios';
  const isFocused = useIsFocused();
  const isIos = Platform.OS === 'ios';

  const [nearmeUsers, setNearmeUsers] = useState([]);
  // const initialMapState = {
  //   users: usersNearmeReducer?.allUsers,
  //   region: {
  //     latitude: userCoordsReducer?.lat,
  //     longitude: userCoordsReducer?.long,
  //     latitudeDelta: 0.0925,
  //     longitudeDelta: 0.0925,
  //   },
  // };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      nearMeUsers(userCoordsReducer?.lat, userCoordsReducer?.long, USER_ID);
    });
  }, []);
  const [state, setState] = useState(null);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    if (usersNearmeReducer?.allUsers?.length > 0) {
      const initialMapState = {
        users: usersNearmeReducer?.allUsers,
        region: {
          latitude:
            Platform.OS != 'ios'
              ? parseFloat(userCoordsReducer?.lat, 10)
              : userCoordsReducer?.lat,
          longitude:
            Platform.OS != 'ios'
              ? parseFloat(userCoordsReducer?.long, 10)
              : userCoordsReducer?.long,
          latitudeDelta: 0.0925,
          longitudeDelta: 0.0925,
        },
      };
      setState(initialMapState);
    }
  }, [usersNearmeReducer?.allUsers]);

  useEffect(() => {
    if (state?.users?.length > 0) {
      mapAnimation.addListener(({value}) => {
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= state?.users?.length) {
          index = state?.users?.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
        clearTimeout(regionTimeout);
        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index) {
            mapIndex = index;
            const {coordinate} = state?.users[index];

            _map.current.animateToRegion(
              {
                ...coordinate,
                latitudeDelta: state?.region?.latitudeDelta,
                longitudeDelta: state?.region?.longitudeDelta,
              },
              350,
            );
          }
        }, 10);
      });
    }
  });

  useEffect(() => {
    if (userCoordsReducer?.lat !== null && userCoordsReducer?.long !== null) {
      // console.log(userCoordsReducer)
      nearMeUsers(userCoordsReducer?.lat, userCoordsReducer?.long, USER_ID);
    }
  }, [userCoordsReducer]);

  const GETNearPlace = () => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${state?.region?.latitude},${state?.region?.longitude}&radius=300&type=restaurant&key=${googleMapKey}`;
    fetch(url)
      .then(response => response.json())
      .then(JsonResponse => {
        // console.log(JsonResponse)
      })
      .catch(error => {
        alert('error');
      });
  };

  const onMarkerPress = mapEventData => {
    const markerID = mapEventData._targetInst.return.key;
    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }
    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  };

  const interpolations = state?.users?.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: 'clamp',
    });
    return {scale};
  });

  const onRegionChange = mark => {
    const Delta = 0.025;
    changeCoords({
      latitude: mark?.nativeEvent?.coordinate?.latitude,
      longitude: mark?.nativeEvent?.coordinate?.longitude,
      latitudeDelta: Delta,
      longitudeDelta: Delta,
    });
  };

  // const size = zoomLevel <= 10 ? 40 : 80;
  useEffect(() => {
    if (isFocused) {
      setNearmeUsers(usersNearmeReducer?.allUsers);
    }
  }, [isFocused, usersNearmeReducer?.allUsers]);
  if (state?.users?.length > 0) {
    return (
      <View style={styles.container}>
        <MapView
          optimizeWaypoints={true}
          minZoomLevel={18} // revert it back to 16 !!
          onMarkerDragEnd={onRegionChange}
          ref={_map}
          initialRegion={state?.region}
          style={{flex: 1}}
          provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : null}>
          <Marker
            stopPropagation={false}
            style={{position: 'absolute'}}
            coordinate={{
              latitude: isIos ? parseFloat(state?.region?.latitude) : state?.region?.latitude,
              longitude: isIos ? parseFloat(state?.region?.longitude) : state?.region?.longitude,
            }}
            // image={require('./../../Assets/Images/maroon-dp2.jpeg')}
            title={'Your Location'}>
            {userReducer?.data?.user_image == null ||
            userReducer?.data?.user_image == undefined ? (
              <Avatar
                rounded
                size="medium"
                // containerStyle={{borderWidth: 1, borderColor: themeRed}}
                source={require('./../../Assets/Images/maroon-dp2.jpeg')}
              />
            ) : (
              <Avatar
                rounded
                size="small"
                source={{uri: `${imageUrl}/${userReducer?.data?.user_image}`}}
              />
            )}
          </Marker>
          <MapView.Circle
            key={(
              isIos 
              ? 
              (parseFloat(state?.region?.latitude) + parseFloat(state?.region?.longitude))
              :
              state?.region?.latitude + state?.region?.longitude
            ).toString()}
            center={state?.region}
            radius={100}
            strokeWidth={2}
            strokeColor={themeRed}
            fillColor={'rgba(176,17,37,0.2)'}
          />
          {/* Maps Users Location on Map  */}
          {state?.users?.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude:
                    Platform.OS != 'ios'
                      ? parseFloat(marker.user_latitude, 10)
                      : marker.user_latitude,
                  longitude:
                    Platform.OS != 'ios'
                      ? parseFloat(marker.user_longitude, 10)
                      : marker.user_longitude,
                }}
                title={marker.user_name}
                onPress={e => onMarkerPress(e)}>
                {/* <Animated.View style={styles.markerWrap}>
                  <Animated.View
                    style={{
                      borderColor: '#EA2C2E',
                      borderRadius: 50,
                      padding: 0,
                      alignItems: 'center',
                      // width: width *0.02,
                      // height: '100%',
                      justifyContent: 'center',
                    }}>
                    {marker?.user_image ? (
                      <Animated.Image
                        source={{uri: `${imageUrl}/${marker?.user_image}`}}
                        style={[styles.marker, scaleStyle]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Animated.Image
                        source={require('./../../Assets/Images/maroon-dp2.jpeg')}
                        style={[styles.marker, scaleStyle]}
                        resizeMode="cover"
                      />
                    )}
                  </Animated.View>
                </Animated.View> */}
              </MapView.Marker>
            );
          })}
        </MapView>

        {/* Users Near Me Cards  */}
        <Animated.ScrollView
          ref={_scrollView}
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={styles.scrollView}
          contentInset={{
            top: 0,
            left: SPACING_FOR_CARD_INSET,
            bottom: 0,
            right: SPACING_FOR_CARD_INSET,
          }}
          contentContainerStyle={{
            paddingHorizontal:
              Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: mapAnimation,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}>
          {state?.users?.map((marker, index) => {
            // console.log(marker?.distance*1000)
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => {
                  // Save User Profile Data In Redux
                  // saveNearmeUserData(marker);
                  navigation.push('profile', {userData: marker});
                }}
                style={styles.card}>
                <View style={styles.imageView}>
                  {marker?.user_image ? (
                    <Image
                      source={{uri: `${imageUrl}/${marker?.user_image}`}}
                      style={{width: width * 0.5, height: height * 0.18}}
                    />
                  ) : (
                    <Image
                      source={require('./../../Assets/Images/placeholderImage.png')}
                      style={{width: width * 0.53, height: height * 0.18}}
                    />
                  )}

                  {/* <Badge
                    badgeStyle={{
                      height: 12,
                      width: 12,
                      borderRadius: 50,
                      borderColor: 'white',
                      borderWidth: 1,
                      position: 'absolute',
                    }}
                    status="success"
                    containerStyle={{position: 'absolute', top: height * 0.042, right: 55}}
                  /> */}
                </View>
                <View style={styles.textContent}>
                  <AppText
                    nol={1}
                    textAlign="left"
                    family="Poppins-Medium"
                    size={height * 0.02}
                    color="black"
                    Label={marker?.user_name}
                  />
                  <View style={styles.addressAndDist}>
                    <AppText
                      nol={3}
                      family="Poppins-SemiBold"
                      size={hp('1.4%')}
                      color="grey"
                      Label={marker?.user_gender}
                    />
                  </View>
                  <AppText
                    nol={1}
                    family="Poppins-Regular"
                    size={isIOS ? width * 0.032 : width * 0.032}
                    color={'grey'}
                    Label={
                      parseFloat(marker?.distance * 1000).toFixed(2) +
                      'm far away'
                    }
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>
    );
  } else {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => (
          <View
          style={[
            styles.lottieStyleView,
            isIos && {marginTop: height * 0.33},
          ]}>
          <LottieView
            style={[styles.lottie, isIos && {height: height * 0.1}]}
            source={require('./../../Assets/Lottie/test2.json')}
            autoPlay
            loop
          />
          <View
            style={[
              styles.noPeopleFound,
              isIos && {marginTop: height * 0.02},
            ]}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-SemiBold"
                size={hp('2.7%')}
                color="black"
                Label={'No People Around You :('}
              />
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-Regular"
                size={hp('2.5%')}
                color="black"
                Label={'Swipe Down to Refresh'}
              />
            </View>
          </View>
        )}
      />
    );
  }
};
function mapStateToProps({userCoordsReducer, usersNearmeReducer, userReducer}) {
  return {userCoordsReducer, usersNearmeReducer, userReducer};
}

export default connect(mapStateToProps, actions)(NearMeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPeopleFound: {
    marginTop: height * -0.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieStyleView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: height * 0.2,
    // backgroundColor:'red'
  },
  imageView: {
    padding: 5,
    borderRadius: 6,
    height: hp('17%'),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: themeRed,
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  addressAndDist: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  lottie: {
    width: width * 0.3,
    height: height * 0.3,
    alignItems: 'center',
    // backgroundColor:'green'
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 7,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 0,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: height * 0.27,
    width: width * 0.35,
    overflow: 'hidden',
    marginBottom: 100,
    borderRadius: 8,
  },
  cardImage: {
    flex: 3,
    margin: 2,
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
    textAlign: 'left',
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    // alignItems: "center",
    // justifyContent: "center",
    // width:50,
    // height:50,
    backgroundColor: themeRed,
    borderWidth: 1,
    borderColor: themeRed,
    borderRadius: 50,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    // width: 10,
    // height: 10,
    borderRadius: 50,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
