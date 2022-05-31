import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Avatar from '../../Components/Avatar';
import * as actions from '../../Store/Actions/index';
import AppText from '../../Components/AppText';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItems';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {FlatListSlider} from 'react-native-flatlist-slider';
import Preview from './Preview';
import {imageUrl} from '../../Config/Apis.json';
import moment from 'moment';
import {connect} from 'react-redux';
import {useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
//  heart heart-o FontAwesome
// const Img = [
//   {image: require('./../../Assets/Images/post1.png')},
//   {image: require('./../../Assets/Images/place2.png')},
//   {image: require('./../../Assets/Images/place3.png')},
// ];
const PostList = ({
  Name,
  Description,
  ProfileImg,
  UploadTime,
  TotalLike,
  Comment,
  Img,
  item,
  Navigation,
  likePost,
  userReducer,
  _onPressHeart,
}) => {
  const IMAGES = Img?.map(ele => `${imageUrl}/${ele}`);

  const route = useRoute();
  // console.log(ProfileImg)
  const routeName = route?.name;
  return (
    <View
      style={{
        // height: height*0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: width * 0.008,
        // padding: 4,
        paddingVertical: height * 0.02,
        width: '95%',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
      }}>
      <View style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
        <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
          <Avatar
            size="medium"
            source={
              ProfileImg
                ? {
                    uri: `${imageUrl}/${ProfileImg}`,
                  }
                : require('../../Assets/Images/maroon-dp2.jpeg')
            }
          />
          <View
            style={{
              flexDirection: 'row',
              padding: 4,
              justifyContent: 'space-between',
              alignItems: 'center',
              left: 5,
              width: '80%',
            }}>
            <View
              style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-SemiBold"
                size={hp('1.9%')}
                color="black"
                Label={Name}
              />
              <AppText
                nol={1}
                textAlign="left"
                family="Poppins-Regular"
                size={hp('1.5%')}
                color="black"
                Label={moment(UploadTime).fromNow()}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{paddingRight: 5}}>
                  <TouchableOpacity onPress={() => _onPressHeart(item)}>
                    {item?.is_like === 1 ? (
                      <Icon name="heart" size={18} color="#B01125" />
                    ) : (
                      <Icon name="heart-o" size={18} color="#B01125" />
                    )}
                  </TouchableOpacity>
                </View>
                <AppText
                  nol={1}
                  textAlign="left"
                  family="Poppins-Regular"
                  size={hp('1.5%')}
                  color="black"
                  Label={TotalLike}
                />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row', left: 5}}
                activeOpacity={0.7}
                onPress={() => {
                  if (routeName === 'post') {
                    return;
                  }
                  Navigation.navigate('mainpost', {
                    name: Name,
                    description: Description,
                    profileImg: ProfileImg,
                    uploadTime: UploadTime,
                    totalLike: TotalLike,
                    comment: Comment,
                    img: Img,
                    item: item,
                  });
                }}>
                <View style={{paddingRight: 5}}>
                  <Icon1 name="message-outline" size={18} color="#B01125" />
                </View>
                <AppText
                  nol={1}
                  textAlign="left"
                  family="Poppins-Regular"
                  size={hp('1.5%')}
                  color="black"
                  Label={Comment}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (routeName === 'post') {
              return;
            }
            Navigation.navigate('mainpost', {
              name: Name,
              description: Description,
              profileImg: ProfileImg,
              uploadTime: UploadTime,
              totalLike: TotalLike,
              comment: Comment,
              img: Img,
              item: item,
            });
          }}>
          <View
            style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <AppText
              nol={12}
              textAlign="left"
              family="Poppins-Regular"
              size={hp('1.9%')}
              color="black"
              Label={
                Description?.length > 100
                  ? `${Description?.substring(0, 100)}...`
                  : Description
              }
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          top: 10,
          width: '100%',
          alignItems: 'center',
          alignSelf: 'center',
          height: 250,
          marginBottom: 10,
        }}>
        <FlatListSlider
          data={IMAGES}
          width={275}
          autoscroll={false}
          component={<Preview />}
          // indicatorActiveWidth={30}
          loop={false}
          contentContainerStyle={{paddingHorizontal: 0}}
          animation={true}
        />
        <View style={{marginTop: 20}} />
        <View
          style={{width: '95%', height: 0.4, backgroundColor: 'grey', top: -3}}
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({userReducer}) => {
  return {userReducer};
};

export default connect(mapStateToProps, actions)(PostList);
