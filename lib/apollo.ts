import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";
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
  uri: process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URI ?? "",
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
  link: authLink.concat(httpLink),
  cache,
});

export default client;
