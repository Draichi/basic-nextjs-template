import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = () => {
  const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState: any = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // for SSR
  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (initialState: any) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);

  return store;
};
