import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  TextComponent,
  Linking,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const carouselRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselData = [
    {
      image: require('../../assets/images/advertisement1.png'),
      url: 'https://drive.google.com/file/d/1tvDiIXW9s1ISB9Ex6qabItg7E45vUV8c/view?usp=sharing',
    },
    {
      image: require('../../assets/images/advertisement2.png'),
      url: 'https://drive.google.com/file/d/1OFEhKr_Vi1_P9sPmIzvGRjxlTP71n0fN/view?usp=sharing',
    },
    {
      image: require('../../assets/images/advertisement3.png'),
      url: 'https://drive.google.com/file/d/1_tiBIEjW_4IR9pCPDWfvPQ8lKpBbJ_lK/view?usp=sharing',
    },
    // Add more carousel images here
  ];

  const taxiCompanyData = [
    {
      image: require('../../assets/images/TaxiCompanyLogos/DialACab.png'),
      label: 'Dial-A-Cab',
      value: 'Dial-A-Cab: 6342 5222',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/ComfortDelGro.png'),
      label: 'Comfort Taxi',
      value: 'Comfort Taxi: 6552 1111',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/CityCab.png'),
      label: 'CityCab',
      value: 'CityCab: 6552 1111',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/SMRTTaxis.png'),
      label: 'SMRT Taxis',
      value: 'SMRT Taxis: 6555 8888',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/TransCab.png'),
      label: 'Trans Cab',
      value: 'Trans Cab: 6555 3333',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/StridesPremier.png'),
      label: 'STRIDES Premier',
      value: 'STRIDES Premier Taxis: 6555 8888',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/PrimeTaxi.png'),
      label: 'Prime Taxi',
      value: 'Prime Taxi: 6778 0808',
    },
    {
      image: require('../../assets/images/TaxiCompanyLogos/YellowTopTaxi.png'),
      label: 'Yellow-Top Taxi',
      value: 'Yellow-Top Taxi: 6293 5545',
    },
  ];

  const guideData = [
    {
      image: require('../../assets/images/Guides/HowToGuide.png'),
      label: 'How-To Guide',
      sublabel: 'How to Take a Taxi in Singapore',
      url: 'https://singaporetravelhandbook.com/how-to-take-taxi-in-singapore/',
    },
    {
      image: require('../../assets/images/Guides/FareGuide.png'),
      label: 'Fares & Payment Guide',
      sublabel: 'LTA Fare Guide',
      url: 'https://www.lta.gov.sg/content/ltagov/en/getting_around/taxis_private_hire_cars/taxi_fares_payment_methods.html',
    },
    {
      image: require('../../assets/images/Guides/TaxiFleetDistribution.png'),
      label: 'Taxi Distribution',
      sublabel: 'Breakdown of taxi fleet in Singapore',
      url: 'https://www.statista.com/statistics/1008217/singapore-breakdown-of-taxi-fleet-by-taxi-operator/',
    },
    {
      image: require('../../assets/images/Guides/P2PGuide.png'),
      label: 'P2P Services',
      sublabel: 'Point-to-Point Transport Guide',
      url: 'https://www.ptc.gov.sg/fare-regulation/taxi-PHC/P2P-Transport-Services',
    },
    {
      image: require('../../assets/images/Guides/WikiGuide.png'),
      label: 'Taxis of SG',
      sublabel: 'Wikipedia: Taxis in Singapore',
      url: 'https://en.wikipedia.org/wiki/Taxis_of_Singapore',
    },
  ];

  const otherAppsData = [
    {
      image: require('../../assets/images/OtherApps/grablogo.png'),
      label: 'Grab',
      sublabel: null,
      url_ios: 'itms-apps://itunes.apple.com/app/647268330',
      url_android: 'market://details?id=com.grabtaxi.passenger',
    },
    {
      image: require('../../assets/images/OtherApps/gojeklogo.png'),
      label: 'Gojek',
      sublabel: null,
      url_ios: 'itms-apps://itunes.apple.com/app/944875099',
      url_android: 'market://details?id=com.gojek.app',
    },
    {
      image: require('../../assets/images/OtherApps/tadalogo.png'),
      label: 'TADA',
      sublabel: null,
      url_ios: 'itms-apps://itunes.apple.com/app/1412329684',
      url_android: 'market://details?id=com.tada.global',
    },
    {
      image: require('../../assets/images/OtherApps/cdgziglogo.png'),
      label: 'CDG Zig',
      sublabel: null,
      url_ios: 'itms-apps://itunes.apple.com/app/954951647',
      url_android: 'market://details?id=com.cdgtaxi.consumerapp',
    },
    {
      image: require('../../assets/images/OtherApps/rydelogo.png'),
      label: 'RYDE',
      sublabel: null,
      url_ios: 'itms-apps://itunes.apple.com/app/979806982',
      url_android: 'market://details?id=com.ryde.android.passenger',
    },
  ];

  const styles = StyleSheet.create({
    screenBackground: {
      flex: 1,
      //backgroundColor: '#F6F4F3',
      backgroundColor: 'white',
    },
    redIcon: {
      flex: 1,
      height: 20,
      backgroundColor: 'red',
    },
    yellowIcon: {
      flex: 1,
      height: 20,
      backgroundColor: 'orange',
    },
    greenIcon: {
      flex: 1,
      height: 20,
      backgroundColor: 'limegreen',
    },
    container1: {
      // logo section
      //flex: 1,
      //height: windowHeight*0.15,
      flexDirection: 'column',
      backgroundColor: 'gold',
      justifyContent: 'center',
      paddingBottom: 15,
      borderRadius: 20,
    },
    container2: {
      // Call your preferred taxi company now
      // height: windowHeight * 0.15,
      //flex: 1,
      flexDirection: 'column',
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 0,
      overflow: 'hidden',
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 20,
    },
    container3: {
      // advertisements
      //flex: 1,
      flexDirection: 'column',
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 10,
      borderRadius: 0,
      overflow: 'hidden',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 0,
    },
    container4: {
      flexDirection: 'column',
      //flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 0,
      overflow: 'hidden',
      marginBottom: 10,
      marginHorizontal: 10,
      paddingTop: 10,
    },
    container5: {
      flexDirection: 'column',
      //flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 0,
      overflow: 'hidden',
      marginBottom: 10,
      marginHorizontal: 10,
      paddingTop: 10,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    image: {
      width: '60%',
      height: '60%',
      aspectRatio: 9,
      backgroundColor: 'transparent',
      resizeMode: 'contain',
      marginBottom: 5,
    },

    carouselContainer: {
      width: windowWidth,
      height: windowHeight * 0.2,
      flexDirection: 'row',
    },
    carouselImage: {
      width: windowWidth - 60,
      marginHorizontal: 30,
      height: '100%',
      resizeMode: 'stretch',
      borderRadius: 20,
    },

    taxiCompanyContainer: {
      // the container containing all the logos and all the labels
      width: windowWidth - 40,
      height: windowHeight * 0.15,
      flexDirection: 'row',
      paddingHorizontal: 0,
      marginLeft: 0,
      //borderWidth: 5,
      //borderColor: 'black',
    },
    taxiCompanyImage: {
      // just the taxi company pic only
      width: windowWidth * 0.22,
      marginHorizontal: 0,
      height: '80%',
      resizeMode: 'contain',
      borderRadius: 10,
    },
    taxiCompanyItem: {
      // one set including 1 pic and 1 label
      alignItems: 'center',
      marginRight: 15, // Add some margin between each taxi company item
      width: windowWidth * 0.22,
      height: '80%',
    },
    taxiCompanyName: {
      // just the label only
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      flexWrap: 'wrap',
      textAlign: 'center',
      //borderWidth: 1,
      //borderColor: 'green',
    },

    sectionHeader: {
      fontSize: 18,
      color: 'black',
      //fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginLeft: 10,
      marginBottom: 10,
    },

    subheader: {
      fontSize: 16,
      color: 'black',
      //fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'bold',
      //alignSelf: 'flex-start',
      marginLeft: 0,
      marginBottom: 0,
      marginTop: 5,
    },

    sublabel: {
      // small grey words below each label
      fontSize: 11,
      color: 'grey',
      marginTop: 3, // Add some margin between the label and sublabel
      marginLeft: 5,
      marginRight: 10,
      flexWrap: 'wrap',
      alignSelf: 'flex-start',
      //marginBottom: 10,
    },

    guideContainer: {
      width: windowWidth - 30,
      //height: windowHeight * 0.15,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingHorizontal: 0,
      marginLeft: 10,
      //borderWidth: 1,
      //borderColor: 'red',
    },

    guideItem: {
      // one set including 1 pic and 1 label and 1 sublabel
      alignItems: 'flex-start',
      marginRight: 5, // Add some margin between each item
      marginBottom: 0,
      width: windowWidth / 3 - 16,
      height: windowWidth / 3 + 35,
      flexDirection: 'row',
      flexWrap: 'wrap',
      //borderWidth: 5,
      //borderColor: 'lightgreen',
    },

    guideLabel: {
      // just the label only
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      paddingLeft: 5,
      flexWrap: 'wrap',
      alignSelf: 'flex-start',
    },

    guideImage: {
      width: windowWidth / 3 - 25,
      height: windowWidth / 3 - 25,
      marginHorizontal: 0,
      resizeMode: 'cover',
      borderRadius: 15,
    },

    otherAppsContainer: {
      width: windowWidth - 30,
      //height: windowHeight * 0.15,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingHorizontal: 0,
      marginLeft: 10,
      //borderWidth: 1,
      //borderColor: 'red',
    },

    otherAppsItem: {
      // one set including 1 pic and 1 label and 1 sublabel
      alignSelf: 'center',
      justifyContent: 'center',
      marginRight: 0, // Add some margin between each item
      marginBottom: 0,
      width: windowWidth / 4 - 16,
      height: windowWidth / 4 + 6,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: 5,
    },

    otherAppsImage: {
      width: windowWidth / 4 - 25,
      height: windowWidth / 4 - 25,
      marginHorizontal: 0,
      resizeMode: 'cover',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'black',
    },

    appName: {
      // just the label only
      fontSize: 13,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      paddingLeft: 0,
      flexWrap: 'wrap',
      alignSelf: 'flex-start',
      alignContent: 'center',
      //borderWidth:1,
    },
  });

  const carouselContainerWidth = carouselData.length * (windowWidth - 60) + 60;

  const renderTaxiClickItem = ({
    item,
  }: {
    item: { image: string; label: string; value: string };
  }) => (
    <TouchableOpacity onPress={() => taxiCompanySelect(item.value)}>
      <Text style={styles.taxiCompanyName}>{item.label}</Text>
    </TouchableOpacity>
  );

  const taxiCompanySelect = async (value: string) => {
    const phoneNumber = value.split(': ')[1];
    const url = `tel: ${phoneNumber}`;

    console.log(url);

    try {
      const supported = await Linking.canOpenURL(url);
      console.log('Phone-Call Redirect Supported:', supported);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(
          `Unable to open the phone app with the number: ${phoneNumber}`
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handlePicPress = (url: string) => {
    // check if url is valid
    if (url) {
      // open the url in browser
      Linking.openURL(url)
        .then(() => console.log('URL opened successfully'))
        .catch((err) => console.error('Failed to open URL:', err));
    }
  };

  // Function to handle opening URLs for other ride-hailing apps
  const handleAppPress = (url_ios: string, url_android: string) => {
    // Check the platform
    if (Platform.OS === 'ios' && url_ios) {
      // Open the iOS URL
      Linking.openURL(url_ios)
        .then(() => console.log('iOS App opened successfully'))
        .catch((err) => console.error('Failed to open iOS App:', err));
    } else if (Platform.OS === 'android' && url_android) {
      // Open the Android URL
      Linking.openURL(url_android)
        .then(() => console.log('Android App opened successfully'))
        .catch((err) => console.error('Failed to open Android App:', err));
    } else {
      console.log('URLs are not provided for the current platform.');
    }
  };

  const scrollToNextIndex = () => {
    if (carouselRef.current) {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      carouselRef.current.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  // Automatically scroll to the next image every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(scrollToNextIndex, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={true}
      style={styles.screenBackground}
    >
      <View style={styles.container1}>
        <View style={styles.iconContainer}>
          <View style={styles.redIcon}></View>
          <View style={styles.yellowIcon}></View>
          <View style={styles.greenIcon}></View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            resizeMode='contain'
            style={styles.image}
            source={require('../../assets/images/TaxiNow logo.png')}
          />
          <Text> REAL-TIME TRAFFIC CONDITIONS </Text>
          <Text style={styles.subheader}>Welcome to TaxiNow</Text>
        </View>
      </View>

      <View style={styles.container2}>
        <Text style={styles.sectionHeader}>
          Call Your Preferred Taxi Company Now
        </Text>
        <ScrollView
          //pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.taxiCompanyContainer}
        >
          {taxiCompanyData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => taxiCompanySelect(item.value)}
            >
              <View style={styles.taxiCompanyItem}>
                <Image
                  key={index}
                  source={item.image}
                  style={styles.taxiCompanyImage}
                />
                <Text style={styles.taxiCompanyName}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.container3}>
        <Text style={styles.sectionHeader}>Advertisements</Text>

        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
          onMomentumScrollEnd={(event) => {
            const nextIndex = Math.floor(
              event.nativeEvent.contentOffset.x / windowWidth
            );
            setCurrentIndex(nextIndex);
          }}
        >
          {carouselData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePicPress(item.url)}
            >
              <Image
                key={index}
                source={item.image}
                style={styles.carouselImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.container4}>
        <Text style={styles.sectionHeader}>Useful Guides For You</Text>
        <View style={styles.guideContainer}>
          {guideData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePicPress(item.url)}
            >
              <View style={styles.guideItem}>
                <Image
                  key={index}
                  source={item.image}
                  style={styles.guideImage}
                />
                <Text style={styles.guideLabel}>{item.label}</Text>
                <Text style={styles.sublabel}>{item.sublabel}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.container5}>
        <Text style={styles.sectionHeader}>
          Other Ride-Hailing Apps in Singapore
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {otherAppsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAppPress(item.url_ios, item.url_android)}
            >
              <View style={styles.otherAppsItem}>
                <Image
                  key={index}
                  source={item.image}
                  style={styles.otherAppsImage}
                />
                <Text style={styles.appName}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
