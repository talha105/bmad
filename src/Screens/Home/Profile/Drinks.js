import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AppText from '../../../Components/AppText';
import Notification from 'react-native-vector-icons/Ionicons';
import StripeModal from '../../../Components/StripeModal';
import {themeRed} from '../../../Assets/Colors/Colors';
import {connect} from 'react-redux';
import * as actions from '../../../Store/Actions/index';
import BuyDrinksModal from '../../../Components/BuyDrinksModal';
import {PUB_KEY_STRIPE} from '../../../Config/Apis.json';
import {StripeProvider} from '@stripe/stripe-react-native';
const {width, height} = Dimensions.get('window');
import {useRoute} from '@react-navigation/native';

const Drinks = ({navigation, userReducer, buyMoreDrinks}) => {
  const [isStripeModalVisible, setIsStripeModalVisible] = useState(false);
  const [stripeGeneratedKey, setStripeGeneratedKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBuyDrinksModal, setShowBuyDrinksModal] = useState(false);
  const [drinks, setDrinks] = useState('');

  const route = useRoute();
  console.log(route.name);

  const _onPressBuyDrinks = async () => {
    const apiData = {
      user_id: userReducer?.data?.user_id,
      coins: Number(drinks),
      amount: Number(drinks),
      token: stripeGeneratedKey,
    };
    console.log(apiData);
    setIsLoading(true);
    await buyMoreDrinks(apiData, _closeStripeModal);
  };

  React.useLayoutEffect(() => {
    const routeName = route.name;
    if (routeName === 'Drinks') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
  }, [navigation, route]);
  // useEffect(() => [

  // ],[userReducer?.data?.coins])
  // Close Stripe Modal
  const _closeStripeModal = () => {
    setIsLoading(false);
    setIsStripeModalVisible(false);
  };

  return (
    <StripeProvider publishableKey={PUB_KEY_STRIPE}>
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        {/* <View style={styles.container}> */}
        {/* Images Container  */}
        {/* <View style={styles.imagesContainer}>
            <Image
              resizeMode="contain"
              source={require('../../../Assets/Images/bmad-logo.png')}
              style={styles.bmadLogo}
            />
            <Image
              resizeMode="contain"
              source={require('../../../Assets/Images/bmad.png')}
              style={styles.bmadTextLogo}
            />
          </View> */}

        <View style={styles.availableDrinksView}>
          {/* <Notification
              name="fast-food-outline"
              style={{}}
              size={size}
              color={color}
            /> */}
          <AppText
            nol={2}
            textAlign="center"
            family="Poppins-SemiBold"
            size={height * 0.028}
            color="black"
            Label={`Available Drinks: ${userReducer?.data?.coins}`}
          />
        </View>

        <TouchableOpacity
          style={styles.buyView}
          onPress={() => {
            setShowBuyDrinksModal(true);
          }}>
          <Image
            // resizeMode="contain"
            blurRadius={4}
            source={require('../../../Assets/Images/buy-mor.png')}
            style={styles.buyMoreImage}
          />

          <Text
            style={{
              fontFamily: 'Poppins-BoldItalic',
              color: 'white',
              position: 'absolute',
              fontSize: width * 0.06,
              top: height * 0.07,
              alignSelf: 'center',
            }}>
            Buy More Drinks
          </Text>
        </TouchableOpacity>
        {/* </View> */}

        {isStripeModalVisible && (
          <StripeModal
            setId={setStripeGeneratedKey}
            onPress={_onPressBuyDrinks}
            isLoading={isLoading}
            isModalVisible={isStripeModalVisible}
            setIsModalVisible={setIsStripeModalVisible}
          />
        )}

        {showBuyDrinksModal && (
          <BuyDrinksModal
            drinks={drinks}
            setDrinks={setDrinks}
            isModalVisible={showBuyDrinksModal}
            setIsModalVisible={setShowBuyDrinksModal}
            setIsStripeModalVisible={setIsStripeModalVisible}
          />
        )}
      </SafeAreaView>
    </StripeProvider>
  );
};

const mapStateToProps = ({userReducer}) => {
  return {
    userReducer,
  };
};
export default connect(mapStateToProps, actions)(Drinks);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bmadLogo: {
    width: width * 0.3,
    height: height * 0.08,
  },
  imagesContainer: {
    justifyContent: 'center',
    marginTop: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.02,
    flexDirection: 'row',
  },
  bmadTextLogo: {
    width: width * 0.38,
    height: height * 0.1,
  },
  availableDrinksView: {
    marginTop: height * 0.02,
    borderRadius: width * 0.03,
    width: width * 0.8,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: themeRed,
  },
  buyView: {
    // backgroundColor: themeRed,
    width: width * 0.8,
    alignSelf: 'center',
    borderRadius: width * 0.03,
    marginVertical: height * 0.02,
    // paddingVertical: height * 0.04,
  },
  buyMoreImage: {
    width: width * 0.8,
    height: height * 0.17,
    borderRadius: width * 0.05,
  },
});
