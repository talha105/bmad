import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import AppText from '../Components/AppText';
import LottieView from 'lottie-react-native';
import {themeRed} from '../Assets/Colors/Colors';
import TextFieldCard from '../Components/TextFieldCard';

const {width, height} = Dimensions.get('window');

const BuyDrinksModal = ({
  setIsModalVisible,

  drinks,
  setDrinks,
  isModalVisible,
  setIsStripeModalVisible,
}) => {
  return (
    <Modal isVisible={isModalVisible}>
      <View style={styles.container}>
        <AppText
          nol={2}
          textAlign="center"
          family="Poppins-SemiBold"
          size={height * 0.023}
          color="white"
          Label={'How many drinks you want to buy?'}
        />
        {/* <TextFieldCard
          placeholder="No. of Drinks"
          value={drinks}
          onchange={setDrinks}
          keyboardType="numeric"
          secureTextEntry={false}
          placeholderTextColor="black"
          customStyle={{
            backgroundColor: 'white',
            width: width * 0.6,
            marginVertical: height * 0.02,
            fontFamily: 'Poppins-Bold',
            fontSize: width * 0.045,
          }}
        /> */}
        <TextInput
          keyboardType={'numeric'}
          placeholder={'No. of Drinks'}
          placeholderTextColor={'grey'}
          style={{
            backgroundColor: 'white',
            width: width * 0.35,
            paddingHorizontal: width * 0.03,
            paddingBottom:height * 0.007,
            marginVertical: height * 0.02,
            fontFamily: 'Poppins-Medium',
            borderRadius: width * 0.008,
            fontSize: width * 0.045,
          }}
          onChangeText={e => {
            if (Number(e) <= 5) {
              setDrinks(e);
            }
          }}
          value={drinks}
        />
        <AppText
          nol={2}
          textAlign="center"
          family="Poppins-Medium"
          size={height * 0.02}
          color="white"
          Label={'Maximum drinks: 05'}
        />
        <View style={{flexDirection:'row',}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (Number(drinks) > 0) {
                setIsModalVisible(false);
                setIsStripeModalVisible(true);
              }
            }}
            style={{
              marginTop: height * 0.03,
              backgroundColor: 'white',
              width: width * 0.38,
              paddingVertical: height * 0.015,
              borderRadius: width * 0.1,
            }}>
            <AppText
              nol={2}
              textAlign="center"
              family="Poppins-Bold"
              size={height * 0.02}
              color={themeRed}
              Label={'Proceed'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDrinks("")
              setIsModalVisible(false)
            }}
            style={{
              marginTop: height * 0.03,
              backgroundColor: 'white',
              width: width * 0.38,
              paddingVertical: height * 0.015,
              borderRadius: width * 0.1,
              marginLeft:10
            }}>
            <AppText
              nol={2}
              textAlign="center"
              family="Poppins-Bold"
              size={height * 0.02}
              color={themeRed}
              Label={'Cancel'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeRed,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.06,
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
});
export default BuyDrinksModal;
