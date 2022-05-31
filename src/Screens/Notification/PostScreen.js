import {
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,Platform
} from 'react-native';
import React, {useState, useEffect} from 'react';
import PostList from '../Home/PostList';
import Comment from '../Home/Comments';
import * as actions from '../../Store/Actions/index';
import {connect} from 'react-redux';
import Avatar from '../../Components/Avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../../Components/AppText';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const PostScreen = ({
  getPostById,
  postsReducer,
  userReducer,
  route,
  navigation,
  likePostFromScreen,
  getAllCommentsOfPost,
  commentOnPost,
}) => {
  const userId = userReducer?.data?.user_id;
  const notificationData = route?.params?.notificationData;
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isIOS = Platform.OS === 'ios';
  const [refreshing, setRefreshing] = useState(false);
  const postId = notificationData?.post?.post_id;
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [postComments, setPostComments] = useState([]);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const getPostData = async () => {
    setIsLoading(true);
    await getPostById(postId, userId);
    await getAllCommentsOfPost(postId).then(() => {
      setPostComments(postsReducer?.postComments);
    });
    setIsLoading(false);
  };

  const _onPressHeart = () => {
    const apiData = {
      post_id: postId,
      user_id: userId,
    };
    likePostFromScreen(apiData);
  };

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
    const apiData = {
      user_id: userId,
      post_id: postId,
      comment: commentText,
    };
    setIsCommenting(true);
    await commentOnPost(apiData, onSuccess);
  };

  const onSuccess = () => {
    setIsCommenting(false);
    setCommentText('');
    getAllCommentsOfPost(postId).then(() => {
      setPostComments(postsReducer?.postComments);
    });
  };

  useEffect(() => {
    if (postId !== null && postId !== undefined) {
      getPostData();
    }
  }, [postId]);

  useEffect(() => {
    if (postsReducer?.post !== null && postsReducer?.post !== undefined) {
      setPostData(postsReducer?.post);
    }
  }, [postsReducer?.post]);

  useEffect(() => {
    setPostComments(postsReducer?.postComments);
  }, [postsReducer?.postComments]);
  return (
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled={true}>
        <PostList
          item={postData}
          Img={postData?.post_url}
          Name={postData?.user_id?.user_name}
          Description={postData?.post_desc}
          ProfileImg={postData?.user_id?.user_coverImage}
          UploadTime={postData?.post_created_at}
          TotalLike={postData?.count_likes}
          Comment={postData?.count_comments}
          Navigation={navigation}
          _onPressHeart={_onPressHeart}
        />

        <>
          <View style={styles.commentBoxContainer}>
            <Avatar
              size="small"
              source={
                userReducer?.data?.user_coverImage
                  ? {
                      uri: `${imageUrl}/${userReducer?.data?.user_coverImage}`,
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
            <View style={[styles.commentBtn, (isCommenting && isIOS && {width:width *0.35})]}>
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
        </>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          //   ListHeaderComponent={() => (
          //     <>
          //       <View style={styles.commentBoxContainer}>
          //         <Avatar
          //           size="small"
          //           source={
          //             userReducer?.data?.user_coverImage
          //               ? {
          //                   uri: `${imageUrl}/${userReducer?.data?.user_coverImage}`,
          //                 }
          //               : require('../../Assets/Images/maroon-dp2.jpeg')
          //           }
          //         />
          //         <TouchableWithoutFeedback>
          //         <TextInput
          //           placeholder="Add a comment"
          //           numberOfLines={5}
          //           placeholderTextColor="grey"
          //           multiline={true}
          //           onChangeText={e => {
          //             setCommentText(e);
          //           }}
          //           textAlignVertical="top"
          //           value={commentText}
          //           style={styles.textInputStyles}
          //         />
          //         </TouchableWithoutFeedback>
          //       </View>
          //       {isCommenting ? (
          //         <LottieView
          //           style={{
          //             width: width * 0.2,
          //             height: height * 0.1,
          //             marginLeft: width * 0.39,
          //           }}
          //           source={require('../../Assets/Lottie/red-loader.json')}
          //           autoPlay
          //           loop
          //         />
          //       ) : (
          //         <TouchableOpacity
          //           activeOpacity={0.7}
          //           style={styles.commentBtn}
          //           onPress={_onPressComment}>
          //           <AppText
          //             nol={1}
          //             family="Poppins-SemiBold"
          //             size={hp('1.7%')}
          //             color="white"
          //             Label={'Comment'}
          //           />
          //         </TouchableOpacity>
          //       )}
          //     </>
          //   )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: height * 0.14}}
          data={postComments}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            return (
              <Comment
                img={item?.user_image}
                name={item?.user_name}
                time={moment(item?.created_at).fromNow()}
                message={item?.comment}
              />
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = ({postsReducer, userReducer}) => {
  return {postsReducer, userReducer};
};

export default connect(mapStateToProps, actions)(PostScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3F2',
  },
  commentBoxContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    borderRadius: 10,
    zIndex: 4,
    padding: 10,
    elevation: 10,
    marginTop: height * 0.02,
    borderColor: 'silver',
    // borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    alignSelf: 'center',
    justifyContent: 'center',
    //  height:100
  },
  commentBtn: {
    borderRadius: width * 0.03,
    padding: 10,
    justifyContent: 'center',
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#B01125',
    alignSelf: 'flex-end',
    marginRight: width * 0.04,
    marginTop: height * 0.02,
    marginBottom: 10,
  },
  textInputStyles: {
    marginLeft: width * 0.03,
    width: '85%',
    borderRadius: 6,
    top: -3,
    color: 'grey',
    fontSize: hp('1.9%'),
  },
});
