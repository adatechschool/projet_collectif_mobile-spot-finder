import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Dimensions,
} from "react-native";

//import packages
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

// import components
import ModalAddAddress from "../components/ModalAddAddress";
import List from "./List";
import SwitchMapToList from "../components/SwithMapToList";
import UserGeolocation from "../components/UserGeolocation";

const { width, height } = Dimensions.get("window");

export default function Home({
  profile,
  addresses,
  toggleModal,
  isModalVisible,
  toggleMapVisibility,
  isMapVisible,
  handleAddressPress,
  selectedAddress,
  setSelectedAddress,
}) {
  const [mapRegion, setMapRegion] = useState(null);
  const [coords, setCoords] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedAddress) {
      const { latitude, longitude } = selectedAddress.addresses;
      console.log("selectedAddress", selectedAddress);
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedAddress]);

  const centerMapOnUser = () => {
    if (mapRef.current && coords) {
      const region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {profile && (
          <>
            <SwitchMapToList
              isEnabled={isMapVisible}
              toggleSwitch={toggleMapVisibility}
            />
            <Text style={styles.headerContainer}>
              Welcome, {`${profile[0].first_name} ${profile[0].last_name} `}!
            </Text>

            {/* console.log("'sdfsdfvds", addresses[0].addresses.latitude); */}

            {isMapVisible ? (
              <>
                <UserGeolocation coords={coords} setCoords={setCoords} />
                <MapView ref={mapRef} style={styles.map} region={mapRegion}>
                  {addresses &&
                    addresses.map((marker) => {
                      return (
                        <Marker
                          key={marker.addresses.id}
                          coordinate={{
                            latitude: marker.addresses.latitude,
                            longitude: marker.addresses.longitude,
                          }}
                          // title={marker.title}
                          // description={marker.description}
                          // image={require("../assets/images/marker.png")}
                        >
                          <TouchableHighlight
                            onPress={() => handleAddressPress(marker)}
                          >
                            <Ionicons
                              name="location"
                              size={30}
                              color="#425F57"
                            />
                          </TouchableHighlight>
                        </Marker>
                      );
                    })}
                  {coords && (
                    <Marker
                      coordinate={{
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                      }}
                    >
                      <Ionicons
                        name="navigate-circle-outline"
                        size={30}
                        color="#425F57"
                      />
                    </Marker>
                  )}
                </MapView>
              </>
            ) : (
              <List
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                toggleMapVisibility={toggleMapVisibility}
                handleAddressPress={handleAddressPress}
              />
            )}

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
            <TouchableHighlight
              style={styles.centerButton}
              underlayColor="#42855B"
              onPress={centerMapOnUser}
            >
              <Ionicons name="locate" size={24} color="#fff" />
            </TouchableHighlight>
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
    backgroundColor: "#425F57",
    color: "#FFFAF0",
    textAlign: "center",
    fontWeight: "bold",
  },
  centerButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#42855B",
    justifyContent: "center",
    alignItems: "center",
  },
});
