import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../../Components/AppText';
import {api, deploy_API} from '../../Config/Apis.json';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
//  import {useNavigation} from "@react-navigation/native"

const ProfileScreen = ({navigation, route}) => {
  // console.log('Profile SCREEN-===---', JSON.stringify(route, null, 2));
  // const [Data, onChangeData] = React.useState(route.params);
  // const navigation=useNavigation()
  const [lines, onChangeLines] = React.useState(2);
  const [linesCondition, onChangeLinesCondition] = React.useState(false);
  const [likeStatus, onChangeLikeStatus] = React.useState(route?.params?.like);
  const [connect, onChangeConnect] = React.useState(route?.params?.connect);

  useEffect(() => {
    const checklikeStatus = async () => {
      await axios
        .get(`${deploy_API}/api/user/userstatus`, {
          user_id: route?.params.userId,
          like_by: route?.params.id,
        })
        .then(res => {
          if (res.data.status) {
            console.log(res.data.like_status, ' API LIKE STATUS');
            onChangeLikeStatus(res.data.like_status);
          }
        })
        .catch(err => {
          console.log(err, 'ERROR LIKE STATUS');
        });
    };
    const checkConnectStatus = async () => {
      console.log(
        route?.params.userId,
        'USER ID',
        route?.params.id,
        'followingto',
      );
      await axios
        .get(`${deploy_API}/api/user/followstatus`, {
          user_id: route?.params.userId,
          following_to: route?.params.id,
        })
        .then(res => {
          console.log(res.data, 'API RESPONSE');
          console.log(res.data.follow_status, ' API CONNECT STATUS');
          if (res.data.status) {
            onChangeConnect(res.data.follow_status);
          }
        })
        .catch(err => {
          console.log(err, 'ERROR CONNECT STATUS');
        });
    };
    // checklikeStatus()
    checkConnectStatus();
  }, []);

  // const connect = async () => {
  //     await axios.post
  // }

  const ReadMore = () => {
    onChangeLines(20);
    onChangeLinesCondition(true);
  };
  const ShowLess = () => {
    onChangeLines(2);
    onChangeLinesCondition(false);
  };

  const connectFunction = async () => {
    // follow
    console.log(
      'USER ID: ' + route?.params.userId,
      'FOLLOW ID: ' + route?.params.id,
    );
    await axios
      .post(`${deploy_API}/api/user/follow`, {
        user_id: route?.params.userId,
        follow_id: route?.params.id,
        status: 2,
      })
      .then(res => {
        console.log(res.data);
        if (res.data.status) {
          // if(res.data.follow_status == 1){
          onChangeConnect(res.data.follow_status);
          // }
          // onChangeConnect(res.data.follow_status)
        }
      })
      .catch(err => {
        console.log(err, 'FOLLOW');
      });
    // console.log('follow')
  };

  const requestFunction = () => {
    // request
    console.log('request');
  };

  const connectedFunction = () => {
    // unfollow
    console.log('unfollow');
  };

  const like = () => {
    console.log('like');
  };

  const unlike = () => {
    console.log('unlike');
  };

  const error = () => {
    console.log('Network Error');
  };

  // console.log(route?.params);
  // const [image] = route?.params
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* User Profile Section  */}
      {route?.params?.image === undefined ? (
        <Image
          style={styles.userProfilePic}
          source={require('./../../Assets/Images/dp.png')}
          resizeMode="cover"
          resizeMethod="auto"
        />
      ) : (
        <Image
          style={styles.userProfilePic}
          source={{uri: route?.params?.image}}
          resizeMode="cover"
          resizeMethod="auto"
        />
      )}

      {/* Total Profile Likes  */}
      <View style={styles.heartContainer}>
        <AntDesign name="heart" style={{padding: 2}} size={50} color="red" />
        <Text style={styles.totalLike}>{route?.params?.totalLike}</Text>
      </View>

      {/* User Info Section  */}
      <View style={styles.userInfoSection}>
        <ScrollView showsVerticalScrollIndicator={false} style={{}}>
          {/* Age and Name View  */}
          <View style={styles.ageAndNameView}>
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-SemiBold"
              size={hp('3%')}
              color="white"
              Label={route?.params?.name}
            />
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-SemiBold"
              size={hp('3%')}
              color="white"
              Label={route?.params?.age}
            />
          </View>

          {/* Profession View  */}
          <View style={styles.professionView}>
            {route?.params?.profession != null && route?.params?.city != null && (
              <View style={styles.professionInnerView}>
                <AppText
                  nol={1}
                  textAlign="left"
                  family="Poppins-SemiBold"
                  size={hp('2%')}
                  color="white"
                  Label={route?.params?.profession}
                />
                {(route?.params?.profession != null ||
                  route?.params?.city != null) && (
                  <View style={styles.noProfessions} />
                )}
                <AppText
                  nol={1}
                  textAlign="left"
                  family="Poppins-SemiBold"
                  size={hp('2%')}
                  color="white"
                  Label={route?.params?.city}
                />
              </View>
            )}

            {/* Address View */}
            {route?.params?.address != null && (
              <View style={styles.addressView}>
                <AppText
                  nol={3}
                  textAlign="left"
                  family="Poppins-Regular"
                  size={hp('2%')}
                  color="white"
                  Label={route?.params?.address}
                />
              </View>
            )}

            {/* Kilometers Far Away  */}
            <View style={styles.kilometerView}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-Regular"
                size={hp('1.5%')}
                color="white"
                Label={
                  parseFloat(route?.params?.distance).toFixed(2) +
                  ' Km far away'
                }
              />
            </View>
          </View>

          {/* Buttons View  */}
          <View style={styles.buttonsView}>
            {/* Connect Button  */}
            <TouchableOpacity
              disabled={connect == 2 ? true : false}
              onPress={
                connect == 0
                  ? connectFunction
                  : connect == 2
                  ? requestFunction
                  : connect == 1
                  ? connectedFunction
                  : error
              }
              style={styles.touchableOpacity}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-SemiBold"
                size={hp('1.4%')}
                color="black"
                Label={
                  connect == 0
                    ? 'Connect'
                    : connect == 2
                    ? 'Requested'
                    : connect == 1
                    ? 'Connected'
                    : 'Error'
                }
              />
            </TouchableOpacity>
            <View style={{width: 10}} />

            {/* Like Button  */}
            <TouchableOpacity
              onPress={
                likeStatus == false ? like : likeStatus == true ? unlike : error
              }
              // onPress={() => navigation.navigate('OfferADrink')}
              style={styles.touchableOpacity}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-SemiBold"
                size={hp('1.4%')}
                color="black"
                Label={
                  likeStatus == false
                    ? 'Like'
                    : likeStatus == true
                    ? 'Liked'
                    : 'Error'
                }
              />
            </TouchableOpacity>
          </View>

          {/* Favorite Heading  */}
          <View style={styles.FavoriteTextView}>
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-SemiBold"
              size={hp('3%')}
              color="white"
              Label={'Favourites'}
            />
          </View>

          {/* Favorites Flatlist */}
          <View style={styles.favoritesFlatlistView}>
            <FlatList
              contentContainerStyle={styles.contentContainerStyle}
              showsHorizontalScrollIndicator={false}
              data={route?.params?.favorite}
              horizontal
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <View
                  style={{
                    margin: 10,
                  }}>
                  <ImageBackground
                    style={{width: 120, height: 120}}
                    resizeMode="contain"
                    imageStyle={{borderRadius: 5}}
                    source={
                      item == 'Old Fashioned'
                        ? require('../../Assets/Images/1.png')
                        : item == 'Margarita'
                        ? require('../../Assets/Images/2.png')
                        : item == 'Dark & Stormy'
                        ? require('../../Assets/Images/3.png')
                        : item == 'Mimosa'
                        ? require('../../Assets/Images/4.png')
                        : item == 'Manhattan'
                        ? require('../../Assets/Images/5.png')
                        : item == 'Whiskey Sour'
                        ? require('../../Assets/Images/6.png')
                        : item == 'Cosmopolitan'
                        ? require('../../Assets/Images/7.png')
                        : item == 'Martini'
                        ? require('../../Assets/Images/8.png')
                        : null
                    }>
                    <View style={styles.flatTextStyle}>
                      <Text numberOfLines={2} style={styles.flatText}>
                        {item}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              )}
            />
          </View>

          {/* Interest Section  */}
          <View style={styles.FavoriteTextView}>
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-SemiBold"
              size={hp('3%')}
              color="white"
              Label={'Interest'}
            />
          </View>

          {/* Interest FlatList  */}
          <View style={styles.favoritesFlatlistView}>
            <FlatList
              contentContainerStyle={styles.contentContainerStyle}
              showsHorizontalScrollIndicator={false}
              data={route?.params?.interest}
              horizontal
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <View
                  style={{
                    margin: 10,
                  }}>
                  <ImageBackground
                    style={{width: 120, height: 120}}
                    resizeMode="contain"
                    imageStyle={{borderRadius: 5}}
                    source={
                      item == 'Tech'
                        ? require('../../Assets/Images/Tech.png')
                        : item == 'Food'
                        ? require('../../Assets/Images/Food.png')
                        : item == 'Animal'
                        ? require('../../Assets/Images/Animal.png')
                        : item == 'Art & Design'
                        ? require('../../Assets/Images/Art.png')
                        : item == 'Book'
                        ? require('../../Assets/Images/Book.png')
                        : item == 'Movie'
                        ? require('../../Assets/Images/Movies.png')
                        : item == 'Nature'
                        ? require('../../Assets/Images/Nature.png')
                        : item == 'Poetry'
                        ? require('../../Assets/Images/Poetry.png')
                        : null
                    }>
                    <View style={styles.flatTextStyle}>
                      <Text style={styles.flatText}>{item}</Text>
                    </View>
                  </ImageBackground>
                </View>
              )}
            />
          </View>
          <View style={{height: 240}} />
        </ScrollView>
      </View>
    </View>
  );
};
export default ProfileScreen;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: hp('103%'),
    backgroundColor: 'white',
  },
  touchableOpacity: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'white',
    width: wp('30%'),
    height: hp('4%'),
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
  },
  touchableOpacityText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2'),
    textAlign: 'center',
  },
  userProfilePic: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 400,
  },
  heartContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLike: {
    zIndex: 1,
    fontSize: 20,
    position: 'absolute',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  userInfoSection: {
    backgroundColor: '#EA2C2E',
    height: 500,
    bottom: 0,
    justifyContent: 'flex-end',
    marginTop: 400,
    // borderRadius: 15,
    flexDirection: 'column',
    borderTopRightRadius: 20,
  },
  ageAndNameView: {
    justifyContent: 'space-between',
    padding: 20,
    flexDirection: 'row',
  },
  noProfessions: {
    height: 2,
    backgroundColor: 'white',
    width: 14,
    marginLeft: 5,
    marginRight: 5,
  },
  professionView: {
    justifyContent: 'flex-start',
    paddingLeft: 20,
    flexDirection: 'column',
  },
  professionInnerView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '90%',
  },
  kilometerView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  buttonsView: {
    justifyContent: 'flex-start',
    padding: 20,
    flexDirection: 'row',
    alignContent: 'space-around',
  },
  FavoriteTextView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  contentContainerStyle: {
    alignSelf: 'flex-start',
    margin: 5,
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  flatTextStyle: {
    justifyContent: 'flex-end',
    height: 120,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  flatText: {
    textAlign: 'left',
    display: 'flex',
    textAlignVertical: 'bottom',
    padding: 5,
    color: 'white',

    fontFamily: 'Poppins-Bold',
    fontSize: hp('2%'),
  },
});
