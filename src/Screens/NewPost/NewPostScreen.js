import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Dimensions,
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
import {
  ImagePicker,
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import ImagePickerMultiple from 'react-native-image-crop-picker';
import AppText from '../../Components/AppText';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Ionicons';
import TagInput from 'react-native-tags-input';
import * as actions from '../../Store/Actions';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');

const NewPostScreen = ({
  navigation,
  userReducer,
  getFeedData,
  getNotifications,
  postAction,
}) => {
  const isIOS = Platform.OS === 'ios';

  useEffect(() => {
    CheckPermission();
  }, []);

  const CheckPermission = () => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(response => {
        // console.log(response)
      });
    }
  };

  const [filePath, setFilePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, onChangeCaption] = useState('');
  const [tags, onChangeArrays] = useState({
    tag: '',
    tagsArray: [],
  });

  const launchCamera = () => {
    const options = {
      selectionLimit: 6,
      mediaType: 'photo',
      includeBase64: true,
    };
    // console.log(ImagePicker.launchImageLibrary)
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      var ArraySingleImage = [];
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response) {
        console.log('User tapped custom button: ', response.customButton);
        // SelectMultipleImage();

        var ImageArray = [];
        for (var i = 0; i < response.assets.length; i++) {
          let showImage = {
            uri: 'data:image/jpeg;base64,' + response.assets[i].data,
          };
          // console.log(showImage);
          ImageArray.push(showImage);
        }
        setFilePath(ImageArray);
      } else {
        console.log(response.assets[0].uri);
        // uri: 'data:image/jpeg;base64,' + this.state.resourcePath.data,
        const source = {
          uri: `data:${response.assets[0].type};base64,${response.assets[0].uri}`,
        };
        // {"assets":
        // [{"fileName": "rn_image_picker_lib_temp_d4e88f8f-0037-45e7-8169-1218ee0551a2.jpg",
        // "fileSize": 284924,
        // "height": 900,
        // "type": "image/jpeg",
        // "uri": "file:///data/user/0/com.bmad/cache/rn_image_picker_lib_temp_d4e88f8f-0037-45e7-8169-1218ee0551a2.jpg",
        // "width": 1200}]}
        // `data:${userImage.type};base64,${userImage.base64}`
        // `data:${response.assets[0].type};base64,${response.assets[0].base64}`
        console.log(source);
        ArraySingleImage.push(source);
        setFilePath(ArraySingleImage);
      }
    });
  };

  const SelectMultipleImage = () => {
    ImagePickerMultiple.openPicker({
      multiple: true,
      width: 300,
      height: 400,
      selectionLimit: 3,
      mediaType: 'photo',
      // cropping: true,
      includeBase64: true,
    })

      .then(response => {
        var ImageArray = [];
        for (var i = 0; i < response.length; i++) {
          let showImage = {
            uri: 'data:image/jpeg;base64,' + response[i].data,
            path: response[i].path,
            type: response[i].mime,
          };
          ImageArray.push(showImage);
        }
        setFilePath(ImageArray);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const updateTagState = tag => {
    onChangeArrays(tag);
  };

  const newPost = async () => {
    if (caption && filePath) {
      setLoading(true);
      await postAction(
        // tags,
        caption,
        filePath,
        userReducer?.data?.user_id,
        navigation,
        clearAllStates,
        _onPostFailed,
      );
    }
    // getNotifications(7)
  };

  const clearAllStates = () => {
    setLoading(false);
    getFeedData(userReducer?.data?.user_id);
    setFilePath(null);
    onChangeCaption('');
    onChangeArrays({
      tag: '',
      tagsArray: [],
    });
    navigation.navigate('HOME');
  };

  const _onPostFailed = () => {
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesSection}>
        <View style={styles.addPicView}>
          <AppText
            nol={1}
            textAlign="left"
            family="Poppins-Regular"
            size={hp('3.5%')}
            color="black"
            Label={'Add Pictures'}
          />
        </View>
        <View
          style={{
            // margin: 10,
            height: '100%',
          }}>
          <ScrollView
            bouncesZoom
            scrollToOverflowEnabled
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            scrollEnabled
            style={{
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={SelectMultipleImage}
              // onPress={launchCamera}

              style={{
                backgroundColor: 'white',
                borderRadius: 3,
                // elevation: 9,
                zIndex: 199,
                // flex: 1,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                width: 180,
                justifyContent: 'center',
                alignContent: 'center',
                marginLeft: 20,
                marginTop: 10,
                marginRight: 20,
                height: 200,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  flexDirection: 'row',
                  paddingLeft: 42,
                  paddingRight: 42,
                }}>
                <Icon name="camera" size={28} color="#B01125" />
                <Icon1
                  name="plus"
                  size={12}
                  style={{
                    top: -10,
                  }}
                  color="#B01125"
                />
              </View>
            </TouchableOpacity>
            {filePath != null
              ? filePath.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        alignContent: 'center',
                        padding: 12,
                        height: 200,
                        width: 200,
                      }}>
                      <Image
                        resizeMode="stretch"
                        key={index}
                        source={item}
                        style={{
                          width: 180,
                          height: 200,
                          marginHorizontal: 3,
                          // top: 8,
                          backgroundColor: 'white',
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  );
                })
              : null}
          </ScrollView>
        </View>
      </View>

      <View style={styles.postDescribeContainer}>
        <ScrollView scrollEnabled showsVerticalScrollIndicator={false}>
          <View
            style={{
              padding: 20,
            }}>
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-SemiBold"
              size={hp('2%')}
              color="white"
              Label={'Write a short description about your post:'}
            />
            <TextInput
              placeholder="Your text here..."
              value={caption}
              placeholderTextColor="white"
              keyboardType="default"
              onChange={event => onChangeCaption(event.nativeEvent.text)}
              onSubmitEditing={event => onChangeCaption(event.nativeEvent.text)}
              multiline={true}
              maxLength={40}
              textAlignVertical="top"
              style={styles.textFieldStyle}
            />
            {/* <View style={{marginTop: 25}}>
              <TagInput
                updateState={updateTagState}
                tags={tags}
                placeholder="Tags"
                labelStyle={{color: '#B01125'}}
                leftElement={
                  <Icon2 name={'add-circle-outline'} size={20} color="grey" />
                }
                leftElementContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                containerStyle={{
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
                inputContainerStyle={styles.tagInputContainerStyle}
                inputStyle={{color: 'black', fontSize: hp('1.5%')}}
                // onFocus={() => this.setState({tagsColor: '#fff', tagsText: mainColor})}
                // onBlur={() => this.setState({tagsColor: mainColor, tagsText: '#fff'})}
                autoCorrect={false}
                tagStyle={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
                tagTextStyle={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  fontSize: hp('1.5%'),
                }}
                keysForTag={', '}
              />
            </View> */}
            {!loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <TouchableOpacity
                  onPress={newPost}
                  style={styles.touchableOpacity}>
                  <AppText
                    nol={1}
                    textAlign="left"
                    family="Poppins-SemiBold"
                    size={hp('2%')}
                    color="black"
                    Label={'Post'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <LottieView
                style={{
                  position: 'absolute',
                  top: isIOS ? height * 0.035 : height * 0.05,
                  left:isIOS ? width * 0.1: width * 0.15,
                  // backgroundColor:'white',
                  width: width * 0.4,
                  height: height * 0.3,
                }}
                source={require('../../Assets/Lottie/white-loader.json')}
                autoPlay
                loop
              />
            )}
            <View style={{height: 100}}></View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

function mapStateToProps({userReducer}) {
  return {userReducer};
}

export default connect(mapStateToProps, actions)(NewPostScreen);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
  addPicView: {
    width: '100%',
    left: width * 0.03,
    height: 60,
    // backgroundColor:'red',
    justifyContent: 'flex-end',
    marginTop: height * 0.08,
  },
  imagesSection: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  touchableOpacity: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'white',
    width: width * 0.4,
    height: hp('6%'),
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
  },
  touchableOpacityText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2'),
    textAlign: 'center',
  },
  postDescribeContainer: {
    backgroundColor: '#B01125',
    borderTopRightRadius: 20,
    width: '100%',
    height: height * 0.46,
    bottom: 0,
    position: 'absolute',
  },
  textFieldStyle: {
    width: width * 0.9,
    backgroundColor: '#D19F9F',
    borderRadius: 6,
    top: 10,
    padding: width * 0.02,
    color: 'white',
    height: height * 0.095,
    fontSize: width * 0.04,
  },
  tagInputContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.04,
    width: '25%',
  },
});
