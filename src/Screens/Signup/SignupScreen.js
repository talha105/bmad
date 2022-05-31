import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import AlertModal from './../../Components/AlertModal';
import Logo from './../../Components/Logo';
import TextInputFeild from './../../Components/TextFeild';
import IconImage from './../../Components/Icons';
import Geolocation from '@react-native-community/geolocation';
import Underline from './../../Components/Underline';
import Heading from './../../Components/Heading';
import TouchableOpacityBtn from './../../Components/TouchableOpacity';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PhoneInput from 'react-native-phone-number-input';
import TextSample from './../../Components/Text';
import {showMessage, hideMessage} from 'react-native-flash-message';
import OTPTextView from 'react-native-otp-textinput';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import CustomRadio from './../../Components/CustomRadio'
import DropDownPicker from 'react-native-dropdown-picker';
import RNCheckboxCard from 'react-native-checkbox-card';
import {isPortrait, isLandscape} from './../../Platform';
import * as actions from '../../Store/Actions';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {trueFunc} from 'boolbase';
import {color} from 'react-native-elements/dist/helpers';
const SignupScreen = ({
  navigation,
  SignUpStepOne,
  Otp,
  userOtp,
  userCoordsReducer,coords
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState('');
  const [otp, setOtp] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef(null);
  const [error, onChangeError] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [phoneNumber, onChangePhone] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [stepOne, onChangestepOne] = React.useState(false);
  const [stepTwo, onChangestepTwo] = React.useState(false);
  const [validation, setValidation] = useState(false);
  const [checkedMale, onChangeCheckMale] = React.useState(false);
  const [checkedFemale, onChangeCheckFemale] = React.useState(false);
  const [checkedLGBTQ, onChangeCheckLGBTQ] = React.useState(false);
  const [checkedMaleText, onChangeCheckMaleText] = React.useState('');
  const [checkedFemaleText, onChangeCheckFemaleText] = React.useState('');
  const [checkedLGBTQText, onChangeCheckLGBTQText] = React.useState('');
  const [genderImage, onChangeGenderImage] = React.useState(
    require('./../../Assets/Images/gender1.png'),
  );

  const LAT = userCoordsReducer?.lat;
  const LONG = userCoordsReducer?.long;
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [items, setItems] = useState([
    {
      label: '    Male',
      value: 'male',
      icon: () => <Icon name="male" size={30} color="white" />,
    },
    {
      label: '    Female',
      value: 'female',
      icon: () => <Icon name="female" size={30} color="white" />,
    },
  ]);

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
  useEffect(() => {
    getOneTimeLocation();
  }, []);
  async function signInWithPhoneNumber(phoneNumber) {}
  // useEffect(()=>{

  //     try{
  //       console.log(userOtp)
  //     }catch(error){
  //       console.log(error)
  //     }

  //   },[userOtp])

  const onSubmit = () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    // const mobileNumber = phoneInput.current.state.code + value
    // onChangePhone(mobileNumber)
    // Otp(null, mobileNumber,fadeChange)
    // console.log(phoneInput.current.state.code)
    if (password?.length === 0 || confirmPassword.length === 0) {
      setValidation(true);
      onChangeError('Incomplete Data');
      return;
    }
    if (emailRegex.test(email)) {
      if (usernameRegex.test(username)) {
        if (value.length > 5) {
          const mobileNumber = phoneInput.current.state.code + value;
          onChangePhone(mobileNumber);
          if (password === confirmPassword) {
            // Otp(null, mobileNumber, fadeChange);
            fadeChange();
          } else {
            onChangeError('Password not match');
            setValidation(true);
          }
        } else {
          onChangeError('Invalid Phone');
          setValidation(true);
        }
      } else {
        setValidation(true);
        onChangeError('Invalid Username');
      }
    } else {
      setValidation(true);
      onChangeError('Invalid Email Address');
    }
    // fadeChange()
  };

  const onSubmit2 = () => {
    // Otp(otp, phoneNumber, fadeChange);
    // this down line will be commented and above will be uncommented
    fadeChange();
  };

  const fadeChange = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    if (stepOne == false) {
      onChangestepOne(true);
    } else if (stepTwo == false) {
      onChangestepTwo(true);
    }
  };

  const showModal = () => {
    if (gender === null) {
      showMessage({
        message: 'Please Select Your Gender!',
        type: 'danger',
      });
      return;
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={styles.backgroundImage}
        source={require('./../../Assets/Images/Bg1.png')}>
        {stepOne == false ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            style={styles.scrollView}>
            <View style={{flexDirection: 'column', height: hp('90%')}}>
              <Logo />
              <Heading Label="Sign Up" />

              <View style={styles.textElement}>
                <View style={styles.textField}>
                  <Feather name="user" color="white" size={20} />
                  {/* <IconImage
                    source={require('./../../Assets/Images/user.png')}
                  /> */}
                  <TextInputFeild
                    placeholder="Username"
                    value={username}
                    onchange={setUsername}
                    keyboardType="default"
                    secureTextEntry={false}
                  />
                </View>
                <Underline />
              </View>
              <View style={styles.textElement}>
                <View style={styles.textField}>
                  <Feather name="mail" color="white" size={20} />
                  {/* <IconImage source={require('./../../Assets/Images/user.png')} /> */}
                  <TextInputFeild
                    placeholder="Email"
                    value={email}
                    onchange={onChangeEmail}
                    keyboardType="email-address"
                    secureTextEntry={false}
                  />
                </View>
                <Underline />
              </View>
              {/* <View style={{ flexDirection: "column", justifyContent: 'center', margin: 15 }}>
                                    <View style={styles.textField}>
                                        <IconImage source={require('./../../Assets/Images/email.png')} />
                                        <TextInputFeild
                                            placeholder="Email"
                                            value={email}
                                            onchange={onChangeEmail}
                                            keyboardType='email-address'
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    <Underline />
                                </View> */}
              <View style={styles.textElement}>
                <View style={styles.textField}>
                  {/* <IconImage source={require('./../../Assets/Images/phone.png')} /> */}
                  <Feather name="phone" color="white" size={20} />
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="PK"
                    // layout="first"
                    onChangeText={text => {
                      setValue(text);
                    }}
                    onChangeFormattedText={text => {
                      setFormattedValue(text);
                    }}
                    placeholder=" "
                    containerStyle={{
                      backgroundColor: 'rgba(52, 52, 52, 0.1)',
                      height: hp('6%'),
                    }}
                    textContainerStyle={{
                      backgroundColor: 'rgba(52, 52, 52, 0.1)',
                    }}
                    codeTextStyle={{
                      color: 'white',
                      top: 10,
                      height: hp('5%'),
                      left: -20,
                    }}
                    textInputStyle={{
                      color: 'white',
                      textAlignVertical: 'bottom',
                      height: 45,
                    }}
                    flagButtonStyle={{color: 'white'}}
                    countryPickerButtonStyle={{color: 'white'}}
                    withShadow
                    withDarkTheme
                    disableArrowIcon="false"
                  />
                </View>

                <Underline />
              </View>

              <View style={styles.textElement}>
                <View style={styles.textField}>
                  <Feather name="lock" color="white" size={20} />
                  {/* <IconImage source={require('./../../Assets/Images/lock.png')} /> */}
                  <TextInputFeild
                    placeholder="Password"
                    value={password}
                    onchange={onChangePassword}
                    keyboardType="default"
                    secureTextEntry={true}
                  />
                </View>
                <Underline />
              </View>
              <View style={styles.textElement}>
                <View style={styles.textField}>
                  <Feather name="lock" color="white" size={20} />
                  {/* <IconImage source={require('./../../Assets/Images/lock.png')} /> */}
                  <TextInputFeild
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onchange={onChangeConfirmPassword}
                    keyboardType="default"
                    secureTextEntry={true}
                  />
                </View>
                <Underline />
              </View>
            </View>

            <View
              style={{
                height: hp('20%'),
                alignItems: 'center',
                flexDirection: 'column',
                alignContent: 'space-between',
              }}>
              <TouchableOpacityBtn onPress={onSubmit} title="Sign Up" />
              <View style={{top: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp('1.8%'),
                    }}>
                    Already a Member?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('login')}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-Regular',
                        fontSize: hp('1.8%'),
                        textDecorationLine: 'underline',
                      }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          stepTwo == false &&
          stepOne == true && (
            // (
            //   <Animated.View style={{opacity: fadeAnim}}>
            //     <ScrollView
            //       showsVerticalScrollIndicator={false}
            //       style={styles.scrollView}>
            //       <View style={{flexDirection: 'column', height: hp('90%')}}>
            //         <Logo />

            //         <Heading Label="Verification" />

            //         <TextSample Label="Verify Your Phone Number with OTP" />

            //         <OTPTextView
            //           inputCount={4}
            //           handleTextChange={text => setOtp(text)}
            //           containerStyle={styles.textInputContainer}
            //           textInputStyle={[
            //             styles.roundedTextInput,
            //             {borderRadius: 100},
            //           ]}
            //           tintColor="#FF3D46"
            //           offTintColor="#FF3D46"
            //         />

            //         <View
            //           style={{
            //             height: hp('20%'),
            //             alignItems: 'center',
            //             flexDirection: 'column',
            //             alignContent: 'space-between',
            //             marginTop: 30,
            //           }}>
            //           <TouchableOpacityBtn
            //             onPress={() => onSubmit2()}
            //             title="Continue"
            //           />
            //         </View>
            //       </View>
            //     </ScrollView>
            //   </Animated.View>
            // )

            // :

            //----- GENDER SELECTION -----
            <Animated.View style={{opacity: fadeAnim}}>
              <View style={{flexDirection: 'column', height: hp('110%')}}>
                <Logo />

                {!modalVisible ? (
                  <Heading Label="I Am a" />
                ) : (
                  <Heading Label="Interested In" />
                )}
                {!modalVisible ? (
                  <TextSample Label="Kindly Select Your Gender" />
                ) : null}

                {!modalVisible ? (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                      }}>
                      <DropDownPicker
                        labelProps={{
                          numberOfLines: 2,
                        }}
                        min={0}
                        max={2}
                        open={open}
                        value={gender}
                        items={items}
                        setOpen={setOpen}
                        setValue={setGender}
                        setItems={setItems}
                        maxHeight={200}
                        containerStyle={{
                          width: wp('80%'),
                        }}
                        arrowColor="#ffffff"
                        labelStyle={{
                          fontSize: 15,
                          textAlign: 'left',
                          color: '#ffffff',
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        }}
                        placeholder="Select Your Gender"
                        placeholderStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                          textAlign: 'left',
                          color: 'white',
                        }}
                        textStyle={{color: 'white'}}
                        dropDownContainerStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                          borderColor: 'rgba(0, 0, 0, 0.0)',
                          top: 60,
                        }}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                          borderColor: 'rgba(0, 0, 0, 0.0)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        itemStyle={{
                          top: 10,
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        }}
                        dropDownStyle={{
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                          borderColor: 'rgba(0, 0, 0, 0.0)',
                          width: '80%',
                        }}
                      />
                    </View>
                    <Underline />
                    <View
                      style={{
                        height: hp('20%'),
                        alignItems: 'center',
                        flexDirection: 'column',
                        alignContent: 'space-between',
                        marginTop: 100,
                      }}>
                      <TouchableOpacityBtn
                        onPress={showModal}
                        title="Continue"
                      />
                    </View>
                  </View>
                ) : null}
                {/*                         
                        <View style={{ height:hp('20%'), alignItems:'center' ,flexDirection: 'column', alignContent:'space-between', marginTop: 100}}>
                    
                            <TouchableOpacityBtn  
                                onPress={showModal}
                                title="Continue"
                            />
                         </View> */}
              </View>
            </Animated.View>
          )
        )}
        {/* </KeyboardAvoidingView> */}

        {/* User Interested In Modal  */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: wp('100%'),
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp('30%'),
                  }}>
                  <IconImage
                    source={require('./../../Assets/Images/male.png')}
                  />
                  <View style={{marginLeft: 12}}></View>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp('2%'),
                      textAlign: 'center',
                    }}>
                    {' '}
                    Male{' '}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 15,
                    marginRight: 15,
                    width: wp('50%'),
                    alignContent: 'flex-end',
                  }}>
                  <RNCheckboxCard
                    circleSize={30}
                    isChecked={checkedMale}
                    checkedTextColor="#ffffff"
                    width={50}
                    checkImageSource={require('./../../Assets/Images/Check.png')}
                    circleBorderColor="#EFEFEF"
                    circleBackgroundColor="#B01125"
                    onPress={() => {
                      if (checkedMale) {
                        onChangeCheckMale(false);
                        onChangeCheckMaleText('');
                      } else {
                        onChangeCheckMale(true);
                        onChangeCheckMaleText('Male');
                      }
                    }}
                    rightIconComponent={<View></View>}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: wp('100%'),
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp('30%'),
                  }}>
                  <IconImage
                    source={require('./../../Assets/Images/female.png')}
                  />
                  <View style={{marginLeft: 12}}></View>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp('2%'),
                      textAlign: 'center',
                    }}>
                    {' '}
                    Female{' '}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 15,
                    marginRight: 15,
                    width: wp('50%'),
                    alignContent: 'flex-end',
                  }}>
                  <RNCheckboxCard
                    circleSize={30}
                    isChecked={checkedFemale}
                    checkedTextColor="#ffffff"
                    width={50}
                    checkImageSource={require('./../../Assets/Images/Check.png')}
                    circleBorderColor="#EFEFEF"
                    circleBackgroundColor="#B01125"
                    onPress={() => {
                      if (checkedFemale) {
                        onChangeCheckFemale(false);
                        onChangeCheckFemaleText('');
                      } else {
                        onChangeCheckFemale(true);
                        onChangeCheckFemaleText('Female');
                      }
                    }}
                    rightIconComponent={<View></View>}
                  />
                </View>
              </View>
              {/* btw men women  */}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: wp('100%'),
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp('30%'),
                  }}>
                  <IconImage
                    source={require('./../../Assets/Images/lgbt.png')}
                  />
                  <View style={{marginLeft: 12}}></View>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp('2%'),
                      textAlign: 'center',
                    }}>
                    {' '}
                    LGBTQ+{' '}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 15,
                    marginRight: 15,
                    width: wp('50%'),
                    alignContent: 'flex-end',
                  }}>
                  <RNCheckboxCard
                    circleSize={30}
                    isChecked={checkedLGBTQ}
                    checkedTextColor="#ffffff"
                    width={50}
                    checkImageSource={require('./../../Assets/Images/Check.png')}
                    circleBorderColor="#EFEFEF"
                    circleBackgroundColor="#B01125"
                    onPress={() => {
                      if (checkedLGBTQ) {
                        onChangeCheckLGBTQ(false);
                        onChangeCheckLGBTQText('');
                      } else {
                        onChangeCheckLGBTQ(true);
                        onChangeCheckLGBTQText('Female');
                      }
                    }}
                    rightIconComponent={<View></View>}
                  />
                </View>
              </View>
              <TouchableOpacityBtn
                onPress={() => {
                  // console.log(checkedMaleText, checkedFemaleText);
                  if (
                    checkedFemaleText === '' &&
                    checkedMaleText === '' &&
                    checkedLGBTQText === ''
                  ) {
                    showMessage({
                      message: 'Please select at least one option',
                      type: 'danger',
                    });
                    return;
                  }
                  const obj = [
                    checkedMaleText,
                    checkedFemaleText,
                    checkedLGBTQText,
                  ];
                  SignUpStepOne(
                    username,
                    email,
                    phoneNumber,
                    password,
                    obj,
                    gender,
                    otp,
                    navigation,
                    LAT,
                    LONG,
                  );
                  setModalVisible(!modalVisible);
                  //  navigation.navigate('YourInterests')
                }}
                title="Continue"
              />
            </View>
          </View>
        </Modal>
        <AlertModal
          modalVisible={validation}
          closeModal={() => {
            setValidation(false);
          }}
          message={error}
        />
      </ImageBackground>
    </View>
  );
};

// const mapStatetoProps = ({userOtp}) =>
// {
//       return {userOtp}
// }

const mapStateToProps = ({userCoordsReducer}) => {
  return {userCoordsReducer};
};
export default connect(mapStateToProps, actions)(SignupScreen);

var styles = StyleSheet.create({
  textElement: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 60,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: hp('103%'),
  },
  scrollView: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 0,
    color: 'white',
    width: wp('80%'),
    justifyContent: 'center',
    borderColor: 'white',
    fontFamily: 'Poppins-Regular',
    fontWeight: '200',
    fontSize: hp('2%'),
  },
  textField: {
    width: wp('95%'),
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  textInputContainer: {
    marginBottom: 20,
    color: 'white',
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
    backgroundColor: '#FF3D46',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
    alignSelf: 'center',
  },
  modalView: {
    width: wp('100%'),
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  touchableOpacity: {
    backgroundColor: '#D2212A',
    borderWidth: 2,
    borderColor: '#D2212A',
    width: wp('60%'),
    height: hp('6%'),
    justifyContent: 'center',
    borderRadius: 25,
  },
  touchableOpacityText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2'),
    textAlign: 'center',
  },
});
