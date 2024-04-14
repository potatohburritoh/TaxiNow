import { Stack } from 'expo-router';
import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

export default function Info() {
  const otherAppsData = [
    {
      image: require('../../assets/images/AboutTab/facebook.png'),
      label: 'Facebook',
      sublabel: '',
      url: 'https://www.facebook.com',
    },
    {
      image: require('../../assets/images/AboutTab/Instagram_icon.png'),
      label: 'Instagram',
      sublabel: '',
      url: 'https://www.instagram.com',
    },
    {
      image: require('../../assets/images/AboutTab/X.png'),
      label: 'Twitter',
      sublabel: '',
      url: 'https://twitter.com',
    },
  ];

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const handlePicPress = (url: string) => {
    // check if url is valid
    if (url) {
      // open the url in browser
      Linking.openURL(url)
        .then(() => console.log('URL opened successfully'))
        .catch((err) => console.error('Failed to open URL:', err));
    }
  };

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
      //flex: 1,
      //height: windowHeight*0.15,
      flexDirection: 'column',
      backgroundColor: 'gold',
      justifyContent: 'center',
      paddingBottom: 15,
      borderRadius: 20,
    },
    container2: {
      flexDirection: 'column',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingBottom: 20,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 20,
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

    container3: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 20,
      borderRadius: 0,
      overflow: 'hidden',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 0,
    },

    container4: {
      flex: 1,
      backgroundColor: '#C4A484',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 5,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 20,
    },

    container5: {
      flexDirection: 'column',
      //flex: 1,
      backgroundColor: 'gold',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: 10,
      marginHorizontal: 10,
      paddingTop: 10,
    },

    container6: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 15,
    },
    container7: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 0,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 5,
    },
    sectionHeader: {
      fontSize: 18,
      color: 'black',
      //fontFamily: 'Arial',
      textAlign: 'center',
      fontWeight: 'bold',
      alignSelf: 'center',
      marginLeft: 0,
      marginBottom: 10,
    },
    otherAppsItem: {
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
    otherAppsImage: {
      width: windowWidth / 4 - 0,
      height: windowWidth / 4 - 0,
      marginHorizontal: 0,
      resizeMode: 'cover',
      borderRadius: 20,
      //borderWidth: 1,
      //borderColor: 'white',
      backgroundColor: 'white',
    },
    iconContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      paddingBottom: 10,
    },
    otherAppsContainer: {
      width: windowWidth - 30,
      height: windowHeight * 0.15,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 0,
      marginLeft: 10,
      borderWidth: 0,
      //borderColor: 'red',
    },
    guideLabel: {
      // just the label only
      fontSize: 13,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      paddingLeft: 5,
      flexWrap: 'wrap',
      alignSelf: 'flex-start',
      textAlign: 'center',
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
    socialmediaContainer: {
      // the container containing all the logos and all the labels
      width: 40,
      height: 0.15,
      flexDirection: 'row',
      paddingHorizontal: 0,
      marginLeft: 0,
      borderWidth: 5,
      borderColor: 'black',
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
    /*
    dropdownButton: {
      width: '80%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 10,
      padding: 10,
    },
    */
    socialMediaName: {
      // just the label only
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 5, // Add some margin between the image and the text
      flexWrap: 'wrap',
      textAlign: 'center',
      //borderWidth: 1,
      //borderColor: 'green',
    },
    socialMediaImage: {
      // just the taxi company pic only
      width: 0.22,
      marginHorizontal: 0,
      height: '80%',
      resizeMode: 'contain',
      borderRadius: 10,
      backgroundColor: 'white',
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
    },
    socialMediaItem: {
      // one set including 1 pic and 1 label
      alignItems: 'center',
      marginRight: 15, // Add some margin between each taxi company item
      width: 0.22,
      height: '80%',
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Info',
        }}
      />
      <SafeAreaView style={styles.screenBackground}>
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
            </View>
          </View>

          <View style={styles.container6}>
            <Text style={styles.sectionHeader}> About the App </Text>
          </View>

          <View style={styles.container7}>
            <Text style={{ alignSelf: 'center', textAlign: 'center' }}>
              {' '}
              This application has been built with an aim to provide a
              convenient solution to cab hailing.{' '}
            </Text>
          </View>

          <View style={styles.container2}>
            <Text style={styles.sectionHeader}> Features </Text>

            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                borderWidth: 0,
              }}
            >
              - displays taxis/cabs nearby {'\n'}- contact taxi companies {'\n'}
              - book cabs through other apps {'\n'}- useful guides
            </Text>
          </View>

          <View style={styles.container3}>
            <Text
              style={{
                justifyContent: 'center',
                textAlign: 'center',
                borderWidth: 0,
              }}
            >
              To learn more about our application, updates and offers, please
              visit our social media pages on {'\n'} Facebook, Instagram and
              Twitter.{' '}
            </Text>
          </View>

          <View style={styles.container5}>
            <Text style={styles.sectionHeader}>Follow Us on</Text>

            <View style={styles.otherAppsContainer}>
              {otherAppsData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePicPress(item.url)}
                >
                  <View style={styles.otherAppsItem}>
                    <Image
                      key={index}
                      source={item.image}
                      style={styles.otherAppsImage}
                    />
                    <Text style={styles.guideLabel}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
