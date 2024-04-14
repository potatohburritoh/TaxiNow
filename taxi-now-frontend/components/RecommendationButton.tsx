import { server } from '@/constants/ServerAddress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { View } from 'react-native';
import { LatLng } from 'react-native-maps';
import * as Progress from 'react-native-progress';

export function GetRecommendationButton({
  currentLocation,
  setLocations,
  checkErr,
}: {
  currentLocation: LatLng;
  setLocations: React.Dispatch<React.SetStateAction<LatLng[]>>;
  checkErr: (err: AxiosError) => void;
}) {
  const [loading, setLoading] = useState<number>(0);

  const onPress = () => {
    setLoading((prev) => prev + 1);
    axios
      .get(
        server +
          `recommendations?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&numOfRandomCoordinates=10000&maxNumOfResults=5`
      )
      .then((res) => {
        console.log('Recieved ' + JSON.stringify(res.data, null, 1));
        // TODO: Remove the transform
        const locations = (res.data as number[][]).map((coord) => {
          return { latitude: coord[0], longitude: coord[1] };
        });
        console.log(locations);
        setLocations(locations);
        setLoading((prev) => prev - 1);
      })
      .catch((e: AxiosError) => {
        console.log(e.response);
        checkErr(e);
        setLoading((prev) => prev - 1);
      });
  };

  return (
    <View>
      <MaterialCommunityIcons.Button
        testID='recommendation-button'
        name='magic-staff'
        onPress={onPress}
        backgroundColor={'gold'}
        color={'black'}
        borderRadius={20}
      >
        Recommend
      </MaterialCommunityIcons.Button>
      {loading != 0 ? (
        <Progress.Bar
          style={{
            marginTop: 5,
            width: '100%',
            backgroundColor: 'gold',
            borderColor: 'black',
          }}
          indeterminate={true}
          color= "black"
        />
      ) : null}
    </View>
  );
}
