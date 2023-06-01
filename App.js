// // import { StatusBar } from "expo-status-bar";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Buffer } from "buffer";
import { useNavigation } from "@react-navigation/native";

global.Buffer = Buffer;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import Ionicons from "react-native-vector-icons/Ionicons";

//import screens
import Welcome from "./screens/Welcome";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Account from "./screens/Account";
import Home from "./screens/Home";
import Discover from "./screens/Discover";
import NewAddress from "./screens/NewAddress";
import List from "./screens/List";
import AddressDetails from "./screens/AddressDetails";
import Subscriptions from "./screens/Subscriptions";

function Map({ session, profile, addresses, tag, setAddresses }) {
  const Stack = createNativeStackNavigator();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  const handleAddressPress = (address) => {
    setSelectedAddress(address);
    navigation.navigate("AddressDetails", {
      address: address,
      selectedAddress: selectedAddress,
    });
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home">
        {(props) => (
          <Home
            {...props}
            session={session}
            profile={profile}
            addresses={addresses}
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
            isMapVisible={isMapVisible}
            toggleMapVisibility={toggleMapVisibility}
            handleAddressPress={handleAddressPress}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="NewAddress">
        {(props) => (
          <NewAddress
            {...props}
            tag={tag}
            session={session}
            profile={profile}
            addresses={addresses}
            setAddresses={setAddresses}
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="List">
        {(props) => (
          <List
            {...props}
            session={session}
            profile={profile}
            addresses={addresses}
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
            handleAddressPress={handleAddressPress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddressDetails">
        {(props) => (
          <AddressDetails
            {...props}
            session={session}
            profile={profile}
            addresses={addresses}
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
            toggleMapVisibility={toggleMapVisibility}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [subscriptions, setSubscriptions] = useState("");
  const [tag, setTag] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await supabase.auth.getSession();
      setSession(currentSession);
    };

    fetchSession();

    const handleAuthStateChange = (event, session) => {
      setSession(session);
    };

    supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      if (
        supabase.auth &&
        typeof supabase.auth.offAuthStateChange === "function"
      ) {
        supabase.auth.offAuthStateChange(handleAuthStateChange);
      }
    };
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (session && session.user && session.user.id) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session?.user?.id);
          if (error) {
            throw new Error(error.message);
          }
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };
    if (session) {
      fetchProfileData();
    }
  }, [session]);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        if (session && session.user && session.user.id) {
          let { data, error } = await supabase
            .from("favorites")
            .select(`tags, addresses (*)`)
            .eq(
              "profiles_id",
              currentUserId ? currentUserId : session?.user?.id
            );

          if (error) {
            throw new Error(error.message);
          }
          setAddresses(data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };
    if (session) {
      fetchAddressData();
    }
  }, [session, currentUserId]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        let { data, error } = await supabase.from("subscription").select("*");

        if (error) {
          throw new Error(error.message);
        }
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        let { data, error } = await supabase.from("tags").select("*");
        if (error) {
          throw new Error(error.message);
        }
        setTag(data);
      } catch (error) {
        console.error("Error fetching tag data:", error.message);
      }
    };
    fetchTagData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#425F57",
          },
          headerTintColor: "white",
          headerTitleStyle: "bold",
          headerStatusBarHeight: 0,
          headerShown: false,
        }}
      >
        {session === null ? (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignUp">
              {(props) => <SignUp {...props} session={session} />}
            </Stack.Screen>
            <Stack.Screen name="SignIn">
              {(props) => <SignIn {...props} session={session} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" component={Account} />
          </>
        ) : (
          <Stack.Screen name="MainApp">
            {(props) => (
              <Tab.Navigator
                initialRouteName="Map"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Map") {
                      iconName = focused ? "map" : "map-outline";
                    } else if (route.name === "Discover") {
                      iconName = focused ? "search" : "search-outline";
                    } else if (route.name === "Profile") {
                      iconName = focused ? "person" : "person-outline";
                    }

                    return (
                      <Ionicons name={iconName} size={size} color={color} />
                    );
                  },
                  tabBarStyle: {
                    backgroundColor: "#425F57",
                    paddingTop: 10,
                  },
                  tabBarActiveTintColor: "#CFFF8D",
                  tabBarInactiveTintColor: "gray",
                  headerShown: false,
                })}
              >
                <Tab.Screen name="Discover" component={Discover} />

                <Tab.Screen name="Map">
                  {(props) => (
                    <Map
                      {...props}
                      session={session}
                      profile={profile}
                      addresses={addresses}
                      tag={tag}
                      setTag={setTag}
                    />
                  )}
                </Tab.Screen>

                <Tab.Screen name="Profile">
                  {(props) => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen name="Account">
                        {(props) => (
                          <Account
                            {...props}
                            session={session}
                            subscriptions={subscriptions}
                          />
                        )}
                      </Stack.Screen>
                      <Stack.Screen name="Subscriptions">
                        {(props) => (
                          <Subscriptions
                            {...props}
                            setCurrentUserId={setCurrentUserId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}