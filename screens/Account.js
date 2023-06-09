import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  TouchableHighlight,
  Text,
  TouchableOpacity,
} from "react-native";

import InputStyle from "../components/InputStyle";

import { useNavigation } from "@react-navigation/native";

export default function Account({ session, subscriptions }) {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [followersNames, setFollowersNames] = useState("");
  const [followingsNames, setFollowingsNames] = useState("");
  //   const [avatarUrl, setAvatarUrl] = useState("");

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the newSession!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name`)
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        // setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ firstName, lastName }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the newSession!");

      const updates = {
        id: session.user.id,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const userId = session.user.id;

  // Counting number of followers and followings

  function countFollowers(id, subscriptions) {
    return subscriptions
      .map((subscription) => (subscription.followed_user_id === id ? 1 : 0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  function countFollowings(id, subscriptions) {
    return subscriptions
      .map((subscription) => (subscription.following_user_id === id ? 1 : 0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  // Get followers Names

  const getFollowersId = (id, subscriptions) => {
    return subscriptions
      .filter((subscription) => subscription.followed_user_id === id)
      .map((subscription) => subscription.following_user_id);
  };

  const followersId = getFollowersId(userId, subscriptions);

  useEffect(() => {
    const fetchFollowersNames = async () => {
      try {
        const result = await Promise.all(
          followersId.map(async (followerId) => {
            const { data, error } = await supabase
              .from("profiles")
              .select("first_name, last_name, id")
              .eq("id", followerId);

            if (error) {
              throw new Error(error.message);
            }

            return data;
          })
        );

        setFollowersNames(result);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchFollowersNames();
  }, []);

  // console.log("followersNames :", followersNames);

  // Get Followings Names
  const getFollowingsId = (id, subscriptions) => {
    return subscriptions
      .filter((subscription) => subscription.following_user_id === id)
      .map((subscription) => subscription.followed_user_id);
  };

  const followingsId = getFollowingsId(userId, subscriptions);

  useEffect(() => {
    const fetchFollowingsNames = async () => {
      try {
        const result = await Promise.all(
          followingsId.map(async (followingId) => {
            const { data, error } = await supabase
              .from("profiles")
              .select("first_name, last_name, id")
              .eq("id", followingId);

            if (error) {
              throw new Error(error.message);
            }

            return data;
          })
        );

        setFollowingsNames(result);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchFollowingsNames();
  }, []);

  // console.log("followingsNames :", followingsNames);

  const navigation = useNavigation();

  const navigateToSubscriptions = () => {
    navigation.navigate("Subscriptions", {
      followersNames: followersNames,
      followingsNames: followingsNames,
    });
  };

  return (
    <>
      <View style={styles.accountContainer}>
        <View style={styles.subscriptionsContainer}>
          <View style={styles.followersContainer}>
            <TouchableOpacity onPress={() => navigateToSubscriptions()}>
              <Text style={styles.followersText}>Followers</Text>
              <Text style={styles.followersCount}>
                {countFollowers(userId, subscriptions)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.followingsContainer}>
            <TouchableOpacity onPress={() => navigateToSubscriptions()}>
              <Text style={styles.followingsText}>Followings</Text>
              <Text style={styles.followingsCount}>
                {countFollowings(userId, subscriptions)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <InputStyle
          label="Email"
          value={session?.user?.email}
          disabled={true}
        />

        <InputStyle
          value={firstName}
          setter={setFirstName}
          placeholder="First Name"
        />

        <InputStyle
          value={lastName}
          setter={setLastName}
          placeholder="Last Name"
        />

        <TouchableHighlight
          style={styles.update}
          underlayColor="#425F57"
          disabled={loading}
          onPress={() => updateProfile({ firstName, lastName })}
        >
          <Text style={styles.buttonUpdate}>
            {loading ? "Loading ..." : "Update"}
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.signOut}
          underlayColor="#425F57"
          onPress={handleSignOut}
        >
          <Text style={styles.buttonSignOut}>Sign Out</Text>
        </TouchableHighlight>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },

  mt20: {
    marginTop: 20,
  },
  accountContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#425F57",
  },
  subscriptionsContainer: {
    flexDirection: "row",
    margin: 10,
  },
  followersContainer: {
    alignItems: "center",
    margin: 2.5,
    padding: 15,
    width: "40%",
    borderRadius: 10,
    backgroundColor: "#2e3e39",
  },
  followersText: {
    color: "white",
    margin: 8,
  },
  followersCount: {
    color: "white",
    fontWeight: "bold",
    margin: 8,
  },
  followingsContainer: {
    alignItems: "center",
    margin: 2.5,
    padding: 15,
    width: "40%",
    borderRadius: 10,
    backgroundColor: "#2e3e39",
  },
  followingsText: {
    color: "white",
    margin: 8,
  },
  followingsCount: {
    color: "white",
    fontWeight: "bold",
    margin: 8,
  },
  buttonUpdate: {
    color: "#425F57",
    fontWeight: "bold",
    fontSize: 20,
  },
  update: {
    backgroundColor: "#CFFF8D",
    marginBottom: 20,
    width: "80%",
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signOut: {
    backgroundColor: "#749F82",
    marginTop: 30,
    marginBottom: 20,
    width: "80%",
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSignOut: {
    color: "#425F57",
    fontWeight: "bold",
    fontSize: 20,
  },
});
