import { Image } from "expo-image";
import { StyleSheet, FlatList, Text } from "react-native";
import { useState, useEffect } from "react";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

export default function HomeScreen() {
  const { profile } = useAuthContext();
  //   const [users, setUsers] = useState([]);
  const { loading, error, data }: any = useQuery(GET_LOCATIONS);

  //   useEffect(() => {
  //     getUsers();
  //   }, []);

  //   async function getUsers() {
  //     const { data }: any = await supabase.from("test").select();
  //     setUsers(data);
  //   }

  if (loading) return <Text>Loading...</Text>;

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Username</ThemedText>
        <ThemedText>{profile?.username}</ThemedText>
        <ThemedText type="subtitle">Full name</ThemedText>
        <ThemedText>{profile?.full_name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Name</ThemedText>
        <ThemedText>{data.locations[0].name}</ThemedText>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>{data.locations[0].description}</ThemedText>
      </ThemedView>
      {/* <FlatList
        data={users}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      /> */}
      <SignOutButton />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
