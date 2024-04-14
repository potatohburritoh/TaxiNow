import { server } from "@/constants/ServerAddress";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { TouchableOpacity, StyleSheet } from "react-native";
import { LatLng } from "react-native-maps";

export function BackToHomeButton({ moveMap }: { moveMap: () => void }) {
    return (
      <TouchableOpacity style={styles.button}>
        <MaterialIcons.Button
          testID="home-button"
          name='location-searching'
          onPress={moveMap}
          backgroundColor={'gold'}
          color={'black'}
          borderRadius={20}
        >Home</MaterialIcons.Button>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    button: {
        // backgroundColor: colors.surface,
        elevation: 3,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        borderRadius: 50,
        paddingVertical: 10,
      },
  });