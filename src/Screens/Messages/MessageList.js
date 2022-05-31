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
  Dimensions,
} from 'react-native';
import {Badge} from 'react-native-elements';
import AppText from '../../Components/AppText';
import moment from 'moment';
import {imageUrl} from '../../Config/Apis.json';
import Avatar from './../../Components/Avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

export const MessageList = ({
  item,
  Image,
  Name,
  Message,
  Navigation,
  Time,
  onPress,
  OnlineStatus,
}) => {
  // console.log(JSON.stringify(item, null, 2), '--');
  console.log(`${imageUrl}/${Image}`);
  return (
    <View
      style={{
        // height: hp('10%'),
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: width * 0.025,
        borderRadius: 7,
        marginVertical: height * 0.005,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.025,
        alignItems: 'center',
        backgroundColor: 'white',
        alignContent: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <TouchableOpacity
        onPress={() =>
          // Navigation.navigate('chats', {item: item})
          onPress(item)
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
            <View
              style={{
                padding: 0,
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Avatar
                size="large"
                source={
                  Image !== undefined && Image !== null && Image !== ''
                    ? {uri: `${imageUrl}/${Image}`}
                    : require('../../Assets/Images/maroon-dp2.jpeg')
                }
              />
              {/* <Badge 
                    badgeStyle={{height:15,width: 15, borderRadius:50, borderColor: 'white', borderWidth: 1, position: 'absolute'}}
                    status={OnlineStatus ? 'success': 'warning'}
                    containerStyle={{ position: 'absolute', top: 0, right: 12 }}
                    /> */}
            </View>
            <View
              style={{
                justifyContent: 'space-around',
                flexDirection: 'column',
                left: 15,
              }}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-Bold"
                size={hp('1.9%')}
                color="#757575"
                Label={Name === 'Sbdhdh' ? 'Daniyal Ahmed Khan' : Name}
              />
              <View style={{width: wp('60%')}}>
                <AppText
                  nol={2}
                  textAlign="left"
                  family="Poppins-SemiBold"
                  size={hp('1.7%')}
                  color="#757575"
                  Label={item?.messageId?.message}
                />
              </View>
            </View>
          </View>

          <View style={{alignSelf: 'flex-start'}}>
            <AppText
              nol={1}
              textAlign="left"
              family="Poppins-Regular"
              size={hp('1.5%')}
              color="#757575"
              Label={moment(item?.messageId?.createdAt).format('hh:mm A')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Styles = StyleSheet.create({
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 150,
    width: 150,
  },
});
export default MessageList;
