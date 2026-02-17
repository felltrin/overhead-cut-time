import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { SplashScreenController } from "@/components/splash-screen-controller";

import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { relayStylePagination } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { supabase } from "@/lib/supabase";

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ("nodeId" in responseObject) {
      return `${responseObject.nodeId}`;
    }

    return defaultDataIdFromObject(responseObject);
  },
  possibleTypes: { Node: ["Todos"] },
  typePolicies: {
    Query: {
      fields: {
        todosCollection: relayStylePagination(),
        node: {
          read(_, { args, toReference }) {
            const ref = toReference({
              nodeId: args?.nodeId,
            });

            return ref;
          },
        },
      },
    },
  },
});

const httpLink = new HttpLink({
  uri: "http://localhost:8081/graphql/v1",
});

const authLink = setContext(async (_, { header }) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token;

  return {
    headers: {
      ...header,
      Authorization: token ? `Bearer ${token}` : "",
      apiKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  };
});

const client = new ApolloClient({
  //   link: new HttpLink({ uri: "https://flyby-router-demo.herokuapp.com/" }),
  link: authLink.concat(httpLink),
  cache,
});

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
