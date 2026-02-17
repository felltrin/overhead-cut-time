import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { useAuthContext } from "@/hooks/use-auth-context";

import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";

const GET_IRIS = graphql(`
  query HelloWorld {
    irisCollection {
      edges {
        node {
          Id
          SepalWidthCm
          PetalLengthCm
        }
      }
    }
  }
`);

export default function HomeScreen() {
  const { profile } = useAuthContext();
  const { data, fetchMore }: any = useQuery(GET_IRIS);

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
      {data?.irisCollection?.edges.map(({ node }: any) => (
        <>
          <ThemedText type="subtitle">SepalWidthCm</ThemedText>
          <ThemedText>{node.SepalWidthCm}</ThemedText>
        </>
      ))}
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
