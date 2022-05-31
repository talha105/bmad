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
  Dimensions,
  UIManager,
  Animated,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import comments from './../../../model/Comments';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Avatar from '../../Components/Avatar';
import AppText from '../../Components/AppText';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItems';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {FlatListSlider} from 'react-native-flatlist-slider';
import Comment from './Comments';
import LottieView from 'lottie-react-native';
import {imageUrl} from '../../Config/Apis.json';
import {connect} from 'react-redux';
import Preview from './Preview';
import * as actions from '../../Store/Actions/index';
import {showMessage} from 'react-native-flash-message';
const {width, height} = Dimensions.get('window');

const Img = [
  {image: require('./../../Assets/Images/post1.png')},
  {image: require('./../../Assets/Images/place2.png')},
  {image: require('./../../Assets/Images/place3.png')},
];

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const MainPost = ({
  getAllCommentsOfPost,
  userReducer,
  commentOnPost,
  postsReducer,
  navigation,
  route,
}) => {
  const [commentText, setCommentText] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const postId = route?.params?.item?.post_id;
  const [isCommenting, setIsCommenting] = useState(false);
  const userId = userReducer?.data?.user_id;
  const [postComments, setPostComments] = useState([]);
  const isIOS = Platform.OS === 'ios';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      getAllCommentsOfPost(postId).then(() => {
        setPostComments(postsReducer?.postComments);
      });
      setRefreshing(false);
    });
  }, []);

  const _onPressComment = async () => {
    if (commentText.length > 0) {
      const apiData = {
        user_id: userId,
        post_id: postId,
        comment: commentText,
      };
      setIsCommenting(true);
      await commentOnPost(apiData, onSuccess);
    } else {
      showMessage({
        message: 'Please enter comment.',
        danger: 'error',
      });
    }
  };

  const onSuccess = () => {
    setIsCommenting(false);
    setCommentText('');
    getAllCommentsOfPost(postId).then(() => {
      setPostComments(postsReducer?.postComments);
    });
  };

  useEffect(() => {
    getAllCommentsOfPost(postId).then(() => {
      setPostComments(postsReducer?.postComments);
    });
  }, []);

  useEffect(() => {
    setPostComments(postsReducer?.postComments);
  }, [postsReducer?.postComments]);
  return (
    <View
      style={{
        // height: hp('100%'),
        backgroundColor: '#F7F3F2',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        // width: '100%',
        flex: 1,
        alignItems: 'center',
      }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={{}}>
            <View
              style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  width: width * 0.9,

                  marginVertical: height * 0.01,
                }}>
                <Avatar
                  size="medium"
                  // source={`${imageUrl}/${route.params.profileImg}`}
                  source={
                    route?.params?.profileImg
                      ? {
                          uri: `${imageUrl}/${route?.params?.profileImg}`,
                        }
                      : require('../../Assets/Images/maroon-dp2.jpeg')
                  }
                />
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 4,
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    left: 5,
                    width: '94%',
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                    }}>
                    <AppText
                      nol={1}
                      textAlign="left"
                      family="Poppins-SemiBold"
                      size={hp('1.9%')}
                      color="black"
                      Label={route.params.name}
                    />
                    <AppText
                      nol={1}
                      textAlign="left"
                      family="Poppins-SemiBold"
                      size={hp('1.5%')}
                      color="black"
                      Label={moment(route.params.uploadTime).fromNow()}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginVertical: height * 0.015,
                  width: width * 0.9,
                }}>
                <AppText
                  nol={12}
                  textAlign="left"
                  family="Poppins-Regular"
                  size={hp('1.9%')}
                  color="black"
                  Label={route.params.description}
                />
              </View>
            </View>

            <View style={styles.commentBoxContainer}>
              <Avatar
                size="small"
                source={
                  route?.params?.profileImg
                    ? {
                        uri: `${imageUrl}/${route?.params?.profileImg}`,
                      }
                    : require('../../Assets/Images/maroon-dp2.jpeg')
                }
              />
              <TouchableWithoutFeedback>
                <TextInput
                  placeholder="Add a comment"
                  numberOfLines={5}
                  placeholderTextColor="grey"
                  multiline={true}
                  onChangeText={e => {
                    setCommentText(e);
                  }}
                  textAlignVertical="top"
                  value={commentText}
                  style={styles.textInputStyles}
                />
              </TouchableWithoutFeedback>
            </View>
            {isCommenting ? (
              // <LottieView
              //   style={{
              //     width: width * 0.2,
              //     height: height * 0.1,
              //     marginLeft: width * 0.38,
              //   }}
              //   source={require('../../Assets/Lottie/red-loader.json')}
              //   autoPlay
              //   loop
              // />

              <View style={[styles.commentBtn, (isCommenting && isIOS && {width:width *0.35}) ]}>
                <AppText
                  nol={1}
                  family="Poppins-SemiBold"
                  size={hp('1.7%')}
                  color="white"
                  Label={'Commenting...'}
                />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.commentBtn}
                onPress={_onPressComment}>
                <AppText
                  nol={1}
                  family="Poppins-SemiBold"
                  size={hp('1.7%')}
                  color="white"
                  Label={'Comment'}
                />
              </TouchableOpacity>
            )}
          </View>
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: height * 0.14}}
        data={postComments}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <Comment
            item={item}
              img={item?.user?.user_image}
              name={item?.user?.user_name}
              time={moment(item?.created_at).fromNow()}
              message={item?.comment}
            />
          );
        }}
      />
    </View>
  );
};

const mapStateToProps = ({userReducer, postsReducer}) => {
  return {userReducer, postsReducer};
};

export default connect(mapStateToProps, actions)(MainPost);

const styles = StyleSheet.create({
  commentBoxContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    borderRadius: 10,
    zIndex: 4,
    padding: 10,
    elevation: 10,
    borderColor: 'gray',
    // borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    alignSelf: 'center',
    justifyContent: 'center',
    //  height:100
    marginBottom: height * 0.01,
  },
  textInputStyles: {
    marginLeft: width * 0.03,
    width: '85%',
    borderRadius: 6,
    top: -3,
    color: 'grey',
    fontSize: hp('1.9%'),
  },
  commentBtn: {
    borderRadius: width * 0.03,
    padding: 10,
    justifyContent: 'center',
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#B01125',
    alignSelf: 'flex-end',
    // marginRight: width * 0.01,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
});
