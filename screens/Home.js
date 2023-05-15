import { useState } from "react";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

// import components
import ModalAddAddress from "../components/ModalAddAddress";

export default function Home({ profile, addresses }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <View style={styles.container}>
        {profile && (
          <>
            <Text style={styles.headerContainer}>
              Welcome, {`${profile[0].first_name} ${profile[0].last_name} `}!
            </Text>

            <MapView style={styles.map}>
              {addresses &&
                addresses.map((marker) => {
                  return (
                    <Marker
                      key={marker.id}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      // title={marker.title}
                      // description={marker.description}
                      // image={require("../assets/images/marker.png")}
                    >
                      <Ionicons name="location" size={30} color="#425F57" />
                    </Marker>
                  );
                })}
            </MapView>
            <View style={styles.addAddressContainer}>
              <TouchableHighlight
                style={styles.addAddressButton}
                underlayColor="#42855B"
                onPress={toggleModal}
              >
                <Text style={styles.addAddressText}>+</Text>
              </TouchableHighlight>
              <ModalAddAddress
                isModalVisible={isModalVisible}
                toggleModal={toggleModal}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#425F57",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addAddressButton: {
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CFFF8D",
  },
  addAddressContainer: {
    position: "absolute",
    zIndex: 3,
    top: "87%",
    left: "42.5%",
  },
  addAddressText: {
    fontSize: 50,
    color: "#425F57",
    marginTop: -5,
    marginLeft: 2,
  },
  headerContainer: {
    marginTop: 50,
    padding: 10,
    backgroundColor: "#FFFFFF",
    color: "#425F57",
    textAlign: "center",
    fontWeight: "bold",
  },
});
