import { MaterialIcons } from '@expo/vector-icons';
import { Ref, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

interface SearchBarProps {
  gpsName: string;
  queryLocation: (sn: string) => void;
  reset: () => void;
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyB2e5hx0nMX-fp6ZKGQDK_T29xDBXVlfuk';

export const SearchBar = ({
  gpsName,
  queryLocation: queryName,
  reset,
}: SearchBarProps) => {
  const searchInputRef = useRef<GooglePlacesAutocompleteRef>(null);
  return (
    <View style={styles.searchBar} testID='search-bar'>
      <GooglePlacesAutocomplete
        placeholder=''
        onPress={(data, details = null) => {
          queryName(data.description);
          console.log(data, details);
        }}
        textInputProps={{
          onBlur: (e) => {
            const addr = searchInputRef.current?.getAddressText();
            if (addr) {
              queryName(addr);
            } else {
              reset();
            }
          },
        }}
        styles={{}}
        renderRow={(data, index) => {
          // console.log(data);
          return (
            <View style={{ flexWrap: 'wrap', flex: 1, width: 80 }}>
              {/* This width fixes text wrapping problem, { ^^^ } don't remove this! */}
              <Text
                key={index * 2}
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.text}
              >
                {data.structured_formatting.main_text}
              </Text>
              <Text
                key={index * 2 + 1}
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.smallText}
              >
                {data.structured_formatting.secondary_text}
              </Text>
            </View>
          );
        }}
        minLength={2}
        debounce={300}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log('no results')}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          components: 'country:sg',
        }}
        ref={searchInputRef}
        enablePoweredByContainer={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    // margin: 16,
    top: '2%',
    left: '10%',
    width: '80%',
    height: 'auto',
    position: 'absolute',
  },
  text: {
    width: '100%',
  },
  smallText: {
    width: '100%',
    color: 'grey',
  },
});
