import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

//import components
import TagIcon from "../components/TagIcon";

//import packages
import Constants from "expo-constants";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function NewAddress({
  route,
  navigation: { goBack },
  toggleModal,
  tag,
  session,
  profile,
  updateAddresses,
}) {
  const [tagArray, setTagArray] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const { data, details } = route.params;

  const statusBarHeight = Constants.statusBarHeight;

  const apiGoogle = Constants.manifest.extra.googleApiKey;

  const navigation = useNavigation();

  const handleRegister = async () => {
    const dataRegister = {
      name: data.structured_formatting.main_text,
      postal_address: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      phone: details.international_phone_number,
      website: details.website,
      rating: details.rating,
      pictures: details.photos.map((photo) => {
        return photo.photo_reference;
      }),
      tested: isEnabled,
    };

    try {
      const { data: newAddress, error } = await supabase
        .from("addresses")
        .insert(dataRegister)
        .select();
      if (error) {
        console.error(error);
        return;
      }

      console.log("Address successfully registered:", newAddress);

      const addressId = newAddress[0].id;
      const profileId = profile[0].id;

      const dataFavorite = {
        profiles_id: profileId,
        addresses_id: addressId,
        tags: tagArray,
      };

      const { data: newFavorite, error: favoriteError } = await supabase
        .from("favorites")
        .insert(dataFavorite)
        .select();
      if (favoriteError) {
        console.error(favoriteError);
        return;
      }

      console.log("Favorite successfully registered:", newFavorite);

      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTagPress = (tag) => {
    const newTagArray = [...tagArray];
    if (tagArray.includes(tag)) {
      setTagArray(tagArray.filter((t) => t !== tag));
    } else {
      newTagArray.push(tag);
      setTagArray(newTagArray);
    }
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={20} color="#FFD700" />);
    }
    if (halfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={20} color="#FFD700" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty_${i}`}
          name="star-outline"
          size={20}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAF0" }}>
      <ScrollView style={{ paddingBottom: 50 }}>
        <View style={[styles.container, { marginTop: statusBarHeight }]}>
          <TouchableOpacity
            style={styles.backHeader}
            onPress={() => {
              toggleModal();
              goBack();
            }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#425F57" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>New Place</Text>
          <View style={styles.emptyHeader}></View>
        </View>
        <View style={styles.globalContainer}>
          <View style={styles.addressContainer}>
            <View style={styles.iconPlace}>
              <Ionicons name="globe-outline" size={45} color="#425F57" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                {data.structured_formatting.main_text}
              </Text>
              <Text style={styles.textAddress}>
                {details.formatted_address}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.tagContainer}>
              {tagArray.length > 0
                ? tagArray.map((tag) => {
                    return (
                      <View
                        key={tag.id}
                        style={{ paddingRight: 10, paddingTop: 10 }}
                      >
                        <TagIcon
                          label={tag.name}
                          onPress={() => handleTagPress(tag)}
                          backgroundColor={tag.color}
                          style={{ marginRight: 0, marginTop: 0 }}
                        />
                      </View>
                    );
                  })
                : "Choisissez au moins un tag..."}
            </Text>
            <View style={styles.sep}></View>
            <View style={styles.tagIconsContainer}>
              {tag.map((tag) => {
                return (
                  <TagIcon
                    key={tag.id}
                    backgroundColor={tag.color}
                    label={tag.name}
                    onPress={() => handleTagPress(tag)}
                    selected={tagArray.some((el) => el.name === tag.name)}
                  />
                );
              })}
            </View>
          </View>
          <View style={styles.sep}></View>
          <View style={styles.infosContainer}>
            <Text
              style={{ fontWeight: "bold", color: "#749F82", fontSize: 16 }}
            >
              Phone
            </Text>
            <Text style={{ marginLeft: 30, fontSize: 16 }}>
              {details.international_phone_number}
            </Text>
          </View>
          <View style={styles.sep}></View>
          <View style={styles.infosContainer}>
            <Text
              style={{ fontWeight: "bold", color: "#749F82", fontSize: 16 }}
            >
              Website
            </Text>
            <Text style={{ marginLeft: 30, fontSize: 16 }}>
              {details.website ? details.website : "No website"}
            </Text>
          </View>
          <View style={styles.sep}></View>
          <View style={styles.infosContainer}>
            <Text
              style={{ fontWeight: "bold", color: "#749F82", fontSize: 16 }}
            >
              Rating
            </Text>
            <Text style={{ marginLeft: 30, fontSize: 16 }}>
              {renderStars(details.rating)}
            </Text>
          </View>
          <View style={styles.sep}></View>
          <View style={styles.picturesContainer}>
            <Text
              style={{ fontWeight: "bold", color: "#749F82", fontSize: 16 }}
            >
              Pictures
            </Text>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.picturesContent}
            >
              {details.photos.map((photo) => {
                return (
                  <Image
                    key={photo.photo_reference}
                    source={{
                      uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiGoogle}`,
                    }}
                    style={{ width: "100%", height: 300 }}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch
            trackColor={{ false: "#425F57", true: "#CFFF8D" }}
            thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#425F57"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={{ marginLeft: 10 }}>
            {isEnabled ? "😍 Already tested" : "🤔 Try it"}
          </Text>
        </View>

        <TouchableOpacity style={styles.footerButton} onPress={handleRegister}>
          <Text>Add spot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: { margin: 20, flexGrow: 1, paddingBottom: 50 },
  container: {
    backgroundColor: "#749F82",
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backHeader: { flex: 1 },
  textHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  emptyHeader: {
    flex: 1,
  },
  iconPlace: {
    backgroundColor: "#749F82",
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: { flexDirection: "row" },
  textContainer: { marginLeft: 10, width: "80%" },
  textTitle: { fontSize: 18, fontWeight: "bold" },
  textAddress: { fontSize: 16 },
  tagContainer: {
    marginTop: 30,
    color: "gray",
    height: 80,
  },
  tagIconsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagIcon: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  sep: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#d7d5d5",
  },
  infosContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  picturesContainer: { marginTop: 20 },
  picturesContent: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    height: 400,
  },
  footerContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#749F82",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 2,
    borderTopColor: "#749F82",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  footerButton: {
    width: "40%",
    height: 40,
    backgroundColor: "#CFFF8D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
