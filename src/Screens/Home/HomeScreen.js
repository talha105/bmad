import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  DeviceEventEmitter,
  BackHandler,
  Platform,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AppText from '../../Components/AppText';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import {Avatar} from 'react-native-elements';
import {imageUrl} from '../../Config/Apis.json';
import PostList from './PostList';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import * as actions from '../../Store/Actions';
import {connect} from 'react-redux';
import {themeRed} from '../../Assets/Colors/Colors';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = ({
  coords,
  navigation,
  nearMeUsers,
  getFeedData,
  userReducer,
  postsReducer,
  usersNearmeReducer,
  userCoordsReducer,
  likePost,
  updateLocation,
}) => {
  const USER_ID = userReducer?.data?.user_id;
  const [posts, setPosts] = useState(postsReducer?.feedPosts);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [nearmeUsers, setNearmeUsers] = useState([]);
  const isIos = Platform.OS === 'ios';
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(async () => {
      setRefreshing(false);
      setLoading(true);
      await getFeedData(USER_ID);
      await nearMeUsers(userCoordsReducer.lat, userCoordsReducer.long, USER_ID);

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<div style='background-color: #f5fcff; border-radius: 100px;'> <h3 style='font-color:#31a4de'>This App access to your Location</h3>This App wants to change your device settings:<br/><br/>Use GPS for Location<br/></div>",
        ok: 'YES',
        cancel: 'NO',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      })
        .then(
          function (success) {
            getOneTimeLocation();
          }.bind(this),
        )
        .catch(error => {
          console.log(error.message);
        });

      BackHandler.addEventListener('hardwareBackPress', () => {
        LocationServicesDialogBox.forceCloseDialog();
      });

      DeviceEventEmitter.addListener(
        'locationProviderStatusChange',
        function (status) {
          console.log(status);
        },
      );
    } else {
      getOneTimeLocation();
    }
    if (Platform.OS === 'android') {
      return () => {
        // Anything in here is fired on component unmount.
        LocationServicesDialogBox.stopListener();
      };
    }
  }, []);

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        setLoading(true);
        coords(position?.coords?.latitude, position?.coords?.longitude);
        await nearMeUsers(
          position?.coords?.latitude,
          position?.coords?.longitude,
          USER_ID,
        );
        await getFeedData(USER_ID);
        await updateLocation({
          user_id: USER_ID,
          user_latitude: position?.coords?.latitude,
          user_longitude: position?.coords?.longitude,
        });
        setLoading(false);
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

  // useEffect(() => {
  //   if (userCoordsReducer?.lat !== null && userCoordsReducer?.long !== null) {
  //     nearMeUsers(userCoordsReducer?.lat, userCoordsReducer?.long, USER_ID);

  //     getFeedData(USER_ID);

  //     coords(userCoordsReducer?.lat, userCoordsReducer?.long);
  //   }
  // }, [userReducer?.data?.id,userCoordsReducer]);

  useEffect(() => {
    setNearmeUsers(usersNearmeReducer?.allUsers);
  }, [usersNearmeReducer?.allUsers, isFocused]);

  useEffect(() => {
    setPosts(postsReducer?.feedPosts);
  }, [postsReducer?.feedPosts]);

  const _onPressHeart = item => {
    const apiData = {
      post_id: item?.post_id,
      user_id: USER_ID,
    };
    likePost(apiData);
  };
  if (loading) {
    return (
      <View style={styles.loaderView}>
        <StatusBar translucent backgroundColor="transparent" />
        <LottieView
          style={{
            width: width * 0.3,
            height: height * 0.35,
          }}
          source={require('../../Assets/Lottie/loading-heart.json')}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />

        {
          // !!!! FlatList For All Posts !!!!!
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            showsVerticalScrollIndicator={false}
            data={posts}
            contentContainerStyle={{paddingBottom: 100}}
            ListFooterComponentStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // !!!! Will Be Viewed When No Posts To Show !!!!
            ListFooterComponent={() =>
              posts?.length === 0 && (
                <>
                  <View style={{height: 30}}></View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop:
                        nearMeUsers?.length === 0 && isIos
                          ? height * 0.16
                          : height * 0.05,
                    }}>
                    <LottieView
                      style={{
                        width: width * 0.5,
                        height: isIos ? height * 0.27 : height * 0.35,
                      }}
                      source={require('./../../Assets/Lottie/no-posts.json')}
                      autoPlay
                      loop
                    />
                    <View
                      style={{
                        marginTop: height * -0.07,
                        width: width * 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <AppText
                        nol={1}
                        family="Poppins-Bold"
                        size={width * 0.06}
                        style={{alignSelf: 'center'}}
                        color="black"
                        Label={'No Posts'}
                      />
                      <AppText
                        nol={3}
                        family="Poppins-Medium"
                        size={width * 0.05}
                        style={{alignSelf: 'center'}}
                        color="black"
                        Label={'Offer drinks and connect'}
                      />
                      <AppText
                        style={{marginTop: -5}}
                        nol={1}
                        family="Poppins-Medium"
                        size={width * 0.05}
                        color="black"
                        Label={' to see their posts.'}
                      />
                    </View>
                  </View>
                </>
              )
            }
            stickyHeaderIndices={[0]}


            // !!!! Header Showing Near Users !!!!
            ListHeaderComponent={
              nearmeUsers?.length > 0 ? (
                <View
                  style={[
                    styles.cardContainer,
                    isIos && {height: height * 0.15},
                  ]}>
                  <View style={styles.peopleNearContainer}>
                    <AppText
                      nol={1}
                      family="Poppins-Bold"
                      size={hp('2%')}
                      color="black"
                      Label={'People Near You'}
                    />
                    {/* <AppText
                    nol={1}
                    family="Poppins-Regular"
                    size={hp('1.5%')}
                    color="black"
                    Label={'View More'}
                  /> */}
                  </View>
                  <FlatList
                    contentContainerStyle={styles.innerFlatlistContentStyle}
                    showsHorizontalScrollIndicator={false}
                    data={nearmeUsers}
                    horizontal
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => {
                      // console.log(`${imageUrl}/${item?.user_image}`)
                      return (
                        <View key={index} style={styles.cardHeaderStyle}>
                          {/* <View style={{bottom: 10, width: 50}}>
                      <AppText
                        nol={1}
                        textAlign="center"
                        family="Poppins-Regular"
                        size={hp('1.5%')}
                        color="black"
                        Label={item?.user_name}
                      />
                    </View> */}
                          {item?.user_image === undefined ||
                          item?.user_image === null ? (
                            <Avatar
                              size="medium"
                              rounded
                              source={require('./../../Assets/Images/maroon-dp2.jpeg')}
                              containerStyle={
                                {
                                  // borderColor: 'grey',
                                  // borderWidth: 1,
                                }
                              }
                            />
                          ) : (
                            <Avatar
                              size="medium"
                              rounded
                              containerStyle={{borderColor: 'grey'}}
                              source={{
                                uri: `${imageUrl}/${item?.user_image}`,
                              }}
                            />
                          )}
                          {item?.distance != undefined ? (
                            <View style={{top: 7}}>
                              <AppText
                                nol={1}
                                textAlign="left"
                                family="Poppins-Regular"
                                size={hp('1.3%')}
                                color="black"
                                Label={
                                  (item?.distance * 1000).toPrecision(2) + 'm'
                                }
                                // Label={item?.distance?.toPrecision(2) + ' km'}
                              />
                            </View>
                          ) : null}
                        </View>
                      );
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: themeRed,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    padding: 5,
                  }}>
                  <AppText
                    nol={1}
                    family="Poppins-Bold"
                    size={hp('2%')}
                    color="white"
                    Label={'PEOPLE NEAR BY'}
                  />
                  <AppText
                    nol={1}
                    family="Poppins-Bold"
                    size={hp('2%')}
                    color="white"
                    Label={'NO PEOPLE FOUND'}
                  />
                </View>
              )
            }
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
              return (
                <PostList
                  item={item}
                  Img={item?.post_url}
                  Name={item?.user_id?.user_name}
                  Description={item?.post_desc}
                  ProfileImg={item?.user_id?.user_image}
                  UploadTime={item?.post_created_at}
                  TotalLike={item?.count_likes}
                  Comment={item?.count_comments}
                  Navigation={navigation}
                  _onPressHeart={_onPressHeart}
                />
              );
            }}
          />
        }
      </View>
    );
  }
};

// nearMeUsers
function mapStateToProps({
  usersNearmeReducer,
  userReducer,
  postsReducer,
  userCoordsReducer,
}) {
  return {usersNearmeReducer, userReducer, postsReducer, userCoordsReducer};
}

export default connect(mapStateToProps, actions)(HomeScreen);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: height,
    backgroundColor: '#F7F3F2',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignSelf: 'center',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    // borderWidth: 1,
    borderColor: 'white',
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    width: width,
    elevation: 8,
    backgroundColor: 'white',
    height: height * 0.17,
    marginBottom: 10,
  },
  peopleNearContainer: {
    justifyContent: 'space-between',
    paddingTop: 10,
    flexDirection: 'row',
    width: width * 0.92,
    alignContent: 'space-between',
  },
  innerFlatlistContentStyle: {
    alignSelf: 'flex-start',
    marginVertical: 5,
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  cardHeaderStyle: {
    paddingBottom: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
