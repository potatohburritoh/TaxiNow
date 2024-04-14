import { getBackgroundPermissionsAsync } from 'expo-location';
import React, { useState } from 'react';
import { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Button,
  FlatList,
  TouchableOpacity,
  TextComponent,
  Linking,
  AppRegistry,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const otherAppsData = [
  {
    image: require('../../assets/images/ContactTab/mail.png'),
    label: 'Email Us',
    sublabel: 'support@taxinow.com',
    url: 'mailto:support@taxinow.com?subject=Support Needed',
  },
  {
    image: require('../../assets/images/ContactTab/call.png'),
    label: 'Call Us',
    sublabel: '12345678',
    url: 'tel:12345678',
  },
  {
    image: require('../../assets/images/ContactTab/whatsapp.png'),
    label: 'WhatsApp',
    sublabel: '',
    url: 'https://wa.me/12345678?text=Hi%20is%20this%20customer%20care%20for%taxi-now?',
  },
];

const contactInfo = [
  { title: 'Website', content: 'taxinow.com' },
  { title: 'Email', content: 'support@taxinow.com' },
  { title: 'Phone', content: '1234-5678' },
  { title: 'Social', content: '@taxinowtaxinow' },
];

// export default ContactForm;

export default function ContactScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [items_emergency, setItems] = useState([
    { label: 'Ambulance', value: 'Ambulance: 6234 1289' },
    { label: 'Police', value: 'Police: 6532 1291' },
  ]);

  const handlePicPress = (url: string) => {
    // check if url is valid
    if (url) {
      // open the url in browser
      Linking.openURL(url)
        .then(() => console.log('URL opened successfully'))
        .catch((err) => console.error('Failed to open URL:', err));
    }
  };
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const styles = StyleSheet.create({
    screenBackground: {
      flex: 1,
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
      flex: 1,
      height: windowHeight * 0.12,
      flexDirection: 'column',
      backgroundColor: 'gold',
      justifyContent: 'center',
      paddingBottom: 5,
      borderRadius: 20,
    },
    container2: {
      //reach out to us for queries
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'gold',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      paddingBottom: 20,
      //borderRadius: 30,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 30,
    },
    container3: {
      // Customer Support container
      flex: 1,
      backgroundColor: 'gold',
      justifyContent: 'flex-start',
      //alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 0,
      paddingTop: 20,
      paddingHorizontal: 30,
    },

    container4: {
      flex: 3,
      backgroundColor: 'gold',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 20,
      paddingTop: 0,
      //borderWidth:1,
    },

    container5: {
      flex: 2,
      height: 250,
      width: 250,
      // marginTop: 20,
      flexDirection: 'column',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      paddingBottom: 0,
      borderRadius: 40,
    },

    iconContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      paddingBottom: 10,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      paddingBottom: 15,
      paddingTop: 15,
      //borderWidth: 1,
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
    otherAppsItem: {
      // one set including 1 pic and 1 label and 1 sublabel
      alignItems: 'flex-start',
      marginRight: 5, // Add some margin between each item
      marginBottom: 0,
      //width: (windowWidth / 3) - 16,
      //height: (windowWidth / 3) + 35,
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderWidth: 5,
      //borderColor: 'lightgreen',
    },
    otherAppsImage: {
      width: windowWidth / 6.5 - 0,
      height: windowWidth / 6.5 - 0,
      marginHorizontal: 0,
      resizeMode: 'contain',
      borderRadius: 100,
      backgroundColor: 'white',
      //borderWidth: 1,
      borderColor: 'black',
      //alignContent: 'center',
      //alignSelf: 'center',
      //alignItems: 'center',
    },
    guideLabel: {
      // just the label only
      fontSize: 13,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      paddingLeft: 5,
      flexWrap: 'wrap',
      alignSelf: 'flex-start',
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
    otherAppsContainer: {
      width: windowWidth - 30,
      //height: windowHeight * 0.15,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      //marginLeft: 10,
    },
    image: {
      width: '80%',
      height: '80%',
      backgroundColor: 'transparent',
      resizeMode: 'contain',
    },
    dropdownButton: {
      width: '80%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 10,
      padding: 10,
    },
    modalOverlay: {
      flexDirection: 'column',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#FFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      flexDirection: 'row',
      padding: 20,
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
    },

    subheader: {
      fontSize: 16,
      color: 'black',
      //fontFamily: 'Arial',
      textAlign: 'left',
      fontWeight: 'bold',
      //alignSelf: 'flex-start',
      marginLeft: 0,
      marginBottom: 5,
      marginTop: 0,
    },

    rowContainer: {
      flexDirection: 'row',
      //justifyContent: 'space-between', // To align title and content at opposite ends
      marginVertical: 5, // Add some vertical spacing between rows
      //borderWidth: 1,
      //borderColor: 'purple',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      width: windowWidth / 3 - 40,
      //borderWidth: 1,
      //borderColor: 'green',
    },
    content: {
      fontSize: 17,
      paddingLeft: 10,
    },

    bottomContainer: {
      //borderWidth: 1,
      flex: 1,
      height: windowHeight / 2 - 80,
      //verticalAlign: 'bottom',
      // position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity onPress={() => handleSelect(item.value)}>
      <Text style={styles.item}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleSelect = async (value: string) => {
    const phoneNumber_emergency = value.split(': ')[1];
    const url1 = `tel:${phoneNumber_emergency}`;

    try {
      const supported = await Linking.canOpenURL(url1);
      console.log('Phone-Call Redirect Supported:', supported); // Added this line

      if (supported) {
        await Linking.openURL(url1);
      } else {
        console.log(
          `Unable to open the phone app with the number: ${phoneNumber_emergency}`
        ); // unable to open social media app
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    setSelectedValue(value);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
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
            <Text style={styles.subheader}>Contact Us</Text>
          </View>
        </View>

        <View style={styles.container5}>
          <Image
            resizeMode='contain'
            style={styles.image}
            source={require('../../assets/images/ContactTab/custsupp.png')}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.container2}>
          <View style={styles.otherAppsContainer}>
            {otherAppsData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePicPress(item.url)}
              >
                <Image
                  key={index}
                  source={item.image}
                  style={styles.otherAppsImage}
                />
                {/*<Text style={styles.guideLabel}>{item.label}</Text>*/}
                {/*<Text style={styles.sublabel}>{item.sublabel}</Text>*/}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ height: 3, backgroundColor: 'darkgrey' }} />
        <View style={styles.container3}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            Customer Support
          </Text>
        </View>

        <View style={styles.container4}>
          <View
            style={{
              width: windowWidth,
              flexDirection: 'column',
              //borderWidth: 1,
              paddingHorizontal: 30,
            }}
          >
            {contactInfo.map((item) => (
              <View key={item.title} style={styles.rowContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
