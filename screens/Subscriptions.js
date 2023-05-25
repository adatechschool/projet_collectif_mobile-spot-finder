import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import Constants from "expo-constants";

import BackButton from "../components/BackButton";

export default function Subscriptions({ route }) {
  const { followersNames, followingsNames } = route.params;

  const statusBarHeight = Constants.statusBarHeight;

  const [followersOrFollowings, setFollowersOrFollowings] = useState(null);

  return (
    <>
      <View style={[styles.container, { marginTop: statusBarHeight }]}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Subscriptions</Text>
        </View>
        <View style={styles.backButtonView}>
          <BackButton />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFollowersOrFollowings(true);
            }}
          >
            <Text style={styles.buttonText}>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFollowersOrFollowings(false);
            }}
          >
            <Text style={styles.buttonText}>Followings</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subscribersList}>
          {followersOrFollowings ? (
            <View style={styles.follow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Followers</Text>
              </View>
              <View style={styles.subscribersNames}>
                {followersNames.map((name) => (
                  <View style={styles.subscribers} key={name[0].id}>
                    <Text
                      style={styles.subscribersNamesText}
                    >{`${name[0].first_name} ${name[0].last_name}`}</Text>
                    <Text styles={styles.subscribed}>Subscribed</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.follow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Followings</Text>
              </View>
              <View style={styles.subscribersNames}>
                {followingsNames.map((name) => (
                  <View style={styles.subscribers} key={name[0].id}>
                    <Text
                      style={styles.subscribersNamesText}
                    >{`${name[0].first_name} ${name[0].last_name}`}</Text>
                    <Text styles={styles.subscribed}>Subscribed</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#425F57",
    justifyContent: "center",
  },
  banner: {
    backgroundColor: "#2e3e39",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    color: "#FFFAF0",
  },
  backButtonView: {
    left: 10,
    position: "absolute",
    top: 0,
    flexDirection: "row",
    padding: 10,
    zIndex: 1,
    color: "#CFFF8D",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 140,
  },
  button: {
    borderRadius: 10,
    padding: 25,
    width: "50%",
    alignItems: "center",
    backgroundColor: "#2e3e39",
  },
  buttonText: {
    color: "#CFFF8D",
  },
  subscribersList: {
    backgroundColor: "#FFFAF0",
    flex: 2,
    marginTop: -20,

    borderRadius: 10,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e3e39",
    padding: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    color: "#CFFF8D",
  },
  subscribersNames: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#CFFF8D",
  },
  subscribers: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  subscribersNamesText: {
    color: "#425F57",
    fontSize: 18,
  },
  subscribed: {
    color: "blue",
  },
});
