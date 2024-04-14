import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { defaultLocation } from '@/constants/DefaultLocation';
import { locationUpdateFrequency } from '@/constants/Frequency';
import { server } from '@/constants/ServerAddress';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BackToHomeButton } from '@/components/BackToHomeButton';
import { GetRecommendationButton } from '@/components/RecommendationButton';
import { SearchBar } from '@/components/SearchBar';

const useReadableName: () => [string, (latlng: LatLng) => void] = () => {
  const [name, useName] = useState('');
  const setWithLatLng = (latlng: LatLng) => {
    axios
      .get(
        server +
          `maps/coordstosn?lat=${latlng.latitude}&long=${latlng.longitude}`
      )
      .then((res) => useName(res.data))
      .catch((e: AxiosError) => console.log(e.message));
  };

  return [name, setWithLatLng];
};

const useLocation: () => [LatLng, (sn: string) => void, () => void, () => void] = () => {
  const [manualLocation, setManualLocation] = useState<LatLng | null>(null);
  const [gpsLocation, setGPSLocation] = useState<LatLng>(defaultLocation);

  const setWithSN = (sn: string) => {
    axios
      .get(server + `maps/sntocoords?streetName=${sn}`)
      .then((res) => {
        setManualLocation({ latitude: res.data[0], longitude: res.data[1] });
      })
      .catch((e: AxiosError) => console.log(e.message));
  };

  const setWithGPS = () => {
    Location.getCurrentPositionAsync()
      .then((r) => setGPSLocation(r.coords))
      .catch((e) => {
        console.error(e);
      });
  };

  const resetManual = () => {
    setManualLocation(null);
  };

  return [manualLocation ?? gpsLocation, setWithSN, setWithGPS, resetManual];
};

export default function TaxiFinderScreen() {
  const mapRef = useRef<MapView>(null);

  const [geoServiceAvailable, setGeoServiceAvailable] = useState(false); // Status of geoservice availability

  const [canContactServer, setCanContactServer] = useState<boolean>(true); // Status of disconnected from server

  const checkErr = (e: AxiosError) => {
    if (!e.response && e.request) {
      setCanContactServer(false);
    } else {
      setCanContactServer(true);
    }
  };

  const [recommendedLocations, setRecommendedLocations] = useState<LatLng[]>(
    []
  );
  // Recommendated locations if available.

  const [taxiLocations, setTaxiLocations] = useState<LatLng[]>([]); // All nearby taxis

  const [name, queryName] = useReadableName();
  const [location, setLocatinWithSN, setLocationWithGPS, resetManual] = useLocation();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((status) => {
      if (status.granted) {
        setGeoServiceAvailable(true);
        setLocationWithGPS();
      }
    });
  }, []); // Get permission for location services.

  useEffect(() => {
    const interval = setInterval(() => {
      if (geoServiceAvailable) {
        setLocationWithGPS();
      }
    }, locationUpdateFrequency);

    return () => clearInterval(interval);
  }, []); // Set a timer for updating location.

  useEffect(() => {
    axios
      .get(
        `${server}taxi?latitude=${location.latitude}&longitude=${location.longitude}`
      )
      .then((res) => {
        // setTaxiLocations(res.data);

        if (res.data) {
          setTaxiLocations(res.data);
        }

        setCanContactServer(true);
      })
      .catch((e: AxiosError) => {
        console.log(e.request);
        checkErr(e);
      });
  }, [location]); // reset taxi location every time current location is updated.

  useEffect(() => {
    queryName(location);
  }, [location]);

  const moveToCurrentLocation = () => {
    mapRef?.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    moveToCurrentLocation();
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        provider='google'
        initialRegion={{
          latitude: 1.3483,
          longitude: 103.6831,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsTraffic={true}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
      >
        {taxiLocations.map((coord, index) => (
          <Marker key={index} coordinate={coord} pinColor='wheat' tracksViewChanges={false}>
            <MaterialCommunityIcons name='taxi' size={25} color={'black'}/>
          </Marker>
        ))}

        <Marker
          pinColor='indigo'
          // draggable={!geoServiceAvailable}
          coordinate={location}
          // onDragEnd={(e) => setGPSLocation(e.nativeEvent.coordinate)}
        >
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons //pin
              name="person-pin-circle"
              size={45}
              color="#EA4335"
            />
              <View
              style={{ //backgroundcircle
                position: 'absolute',
                marginTop: 6,
                backgroundColor: 'EA4335',
                borderRadius: 12.5, // Set borderRadius to half of the icon size (25/2 = 12.5)
                padding: 1, // Add some padding to create space between the icon and the circular background
              }}
            >
              <MaterialIcons name="person" size={20} color="white"/> 
            </View>
          </View>
        </Marker>

        {recommendedLocations.map((loc, i) => (
          <Marker key={i} coordinate={loc} />
        ))}
      </MapView>

      <SearchBar gpsName={name} queryLocation={setLocatinWithSN} reset={resetManual} />

      {!canContactServer ? (
        <Text style={styles.floatingText}>
          Failed to connect to server. Please try again later.
        </Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <BackToHomeButton moveMap={moveToCurrentLocation} />
        <GetRecommendationButton
          currentLocation={location}
          setLocations={setRecommendedLocations}
          checkErr={checkErr}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 15,
  },
  button: {
    // backgroundColor: colors.surface,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 50,
    paddingVertical: 10,
  },
  floatingText: {
    position: 'absolute',
    bottom: '20%',
    alignContent: 'center',
    color: 'red',
  },
});
